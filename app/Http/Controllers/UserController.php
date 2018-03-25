<?php 
namespace App\Http\Controllers;
use App\User;
use Illuminate\Http\Request;
use App\Http\Requests;
use JWTAuth;
use Response;
use App\Repository\Transformers\UserTransformer;
use \Illuminate\Http\Response as Res;
use Validator;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\users_verification;
use Nexmo;
use Httpful;

class UserController extends ApiController
{
    /**
     * @var \App\Repository\Transformers\UserTransformer
     * */
    protected $userTransformer;

    public function __construct(userTransformer $userTransformer)
    {
        $this->userTransformer = $userTransformer;
    }

    /**
     * @description: Api user authenticate method
     * @author: Adelekan David Aderemi
     * @param: email, password
     * @return: Json String response
     */
    public function authenticate(Request $request)
    {
        $rules = array (
            'email' => 'required|email',
            'password' => 'required',
        );
        $validator = Validator::make($request->all(), $rules);
        if ($validator-> fails()){
            return $this->respondValidationError('Fields Validation Failed.', $validator->errors());
        }
        else{
            $user = User::where('email', $request['email'])->first();
            if($user){
                $api_token = $user->api_token;
                if ($api_token == NULL){
                    return $this->_login($request['email'], $request['password']);
                }
                try{
                    $user = JWTAuth::toUser($api_token);
                    return $this->respond([
                        'status' => 'success',
                        'status_code' => $this->getStatusCode(),
                        'message' => 'Already logged in',
                        'user' => $this->userTransformer->transform($user)
                    ]);
                }catch(JWTException $e){
                    $user->api_token = NULL;
                    $user->save();
                    return $this->respondInternalError("Login Unsuccessful. An error occurred while performing an action!");
                }
            }
            else{
                return $this->respondWithError("Invalid Email or Password");
            }
        }
    }

    private function _login($email, $password)
    {
        $credentials = ['email' => $email, 'password' => $password];

        if ( ! $token = JWTAuth::attempt($credentials)) {
            return $this->respondWithError("User does not exist!");
        }
        $user = JWTAuth::toUser($token);
        $user->api_token = $token;
        $user->save();
        return $this->respond([
            'status' => 'success',
            'status_code' => $this->getStatusCode(),
            'message' => 'Login successful!',
            'data' => $this->userTransformer->transform($user)
        ]);
    }

    /**
     * @description: Api user register method
     * @author: Adelekan David Aderemi
     * @param: lastname, firstname, username, email, password
     * @return: Json String response
     */
    public function register(Request $request)
    {
        $rules = array (
            'name' => 'required|max:255',
            'email' => 'required|email|max:255|unique:users',
            'phone' => 'required|unique:users',
            'password' => 'required|min:6|confirmed',
            'password_confirmation' => 'required|min:3'
        );
        $validator = Validator::make($request->all(), $rules);
        if ($validator-> fails()){
            return $this->respondValidationError('Fields Validation Failed.', $validator->errors());
        }
        else{
            $user = User::create([
                'name' => $request['name'],
                'email' => $request['email'],
                'phone' => $request['phone'],
                'password' => \Hash::make($request['password']),
            ]);

            $response = Httpful\Request::get("https://api.nexmo.com/verify/json?api_key=9ea9ec62&api_secret=hqkupJC7HAcQQ0sw&number=" . $request['phone'] . "&brand=MyApp")
                ->send();

            
            $verify = users_verification::create([
                'userid' => $user->id,
                'requestid' => $response->body->request_id
                ]);
            $credentials = ['email' => $request['email'], 'password' => $request['password']];
            $token = JWTAuth::attempt($credentials);
            $user = JWTAuth::toUser($token);
            $user->api_token = $token;
            $user->save();
            return $this->respond([
                        'status' => 'success',
                        'status_code' => $this->getStatusCode(),
                        'message' => 'verification pending!',
                        'request_id' => $response->body->request_id,
                        'api_token' => $token
                    ]);        
        }
    }

    /**
     * @description: Api user logout method
     * @author: Adelekan David Aderemi
     * @param: null
     * @return: Json String response
     */
    public function logout($api_token)
    {
        try{
            $user = JWTAuth::toUser($api_token);
            $user->api_token = NULL;
            $user->save();
            JWTAuth::setToken($api_token)->invalidate();
            $this->setStatusCode(Res::HTTP_OK);
            return $this->respond([
                'status' => 'success',
                'status_code' => $this->getStatusCode(),
                'message' => 'Logout successful!',
            ]);

        }catch(JWTException $e){
            return $this->respondInternalError("An error occurred while performing an action!");
        }
    }


    public function verifyNumber(Request $request){
        try {
            $user = JWTAuth::toUser($request['api_token']);
            $req = users_verification::where('userid', $user->id)->first();
            
            $response = \Httpful\Request::get("https://api.nexmo.com/verify/check/json?api_key=9ea9ec62&api_secret=hqkupJC7HAcQQ0sw&code=" . $request['code'] . "&request_id=" . $req->requestid)
                ->send();
                if($response->body->status == 0){
                    users_verification::where('userid', $user->id)->delete();
                    $user->verified = 1;
                    $user->save();
                    return $this->respond([
                        'status' => 'success',
                        'status_code' => $this->getStatusCode(),
                        'message' => 'verification successful!'
                    ]);
                }
                else{
                    return $this->respondWithError($response->body->error_text);
                }
            
        } catch (JWTException $e) {
            return $this->respondInternalError("An error occurred while performing an action!");
        }
    }
    
}