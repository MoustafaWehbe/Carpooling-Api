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
use App\User_verification;
use App\User_profile;
use App\Vehicles;
use App\Ride_offer;
use App\Ride_request;
use Httpful;




class RidesController extends ApiController
{
    /**
     * @var \App\Repository\Transformers\UserTransformer
     * */
    protected $userTransformer;

    public function __construct(userTransformer $userTransformer)
    {
        $this->userTransformer = $userTransformer;
    }


    public function offerRide(Request $request) {
    	try{
            $user = JWTAuth::toUser($request['api_token']);
        }
        catch (JWTException $e){
            return $this->respondWithError("Session Expired");
        }
        $profile = User_profile::where('user_id', $user->id)->first();
        if (!$profile->driving_license) {
        	return $this->respondWithError("You need to submit your driving license before offering a ride");
        }
        $vehicle = Vehicles::where('user_id', $user->id)->first();
        if (!$vehicle || !$vehicle->type) {
        	return $this->respondWithError("you need to enter your vehicle's info before offering a ride");
        }
        $rules = array (
            'from' => 'required|string',
            'to' => 'required|string',
            'ride_date' => 'required|date'
        );
        $validator = Validator::make($request->all(), $rules);
        if ($validator-> fails()){
            return $this->respondValidationError('Fields Validation Failed.', $validator->errors());
        }

        $ride = Ride_offer::create([
        	'user_id' => $user->id,
        	'from' => $request['from'],
        	'to' => $request['to'],
        	'ride_date' => $request['ride_date'],
        ]);
        return $this->respond([
                        'status' => 'success',
                        'status_code' => $this->getStatusCode(),
                        'message' => "New ride offer created",
                        'id' => $ride->id
                    ]);
    }	


    public function requestRide(Request $request) {
    	try{
            $user = JWTAuth::toUser($request['api_token']);
        }
        catch (JWTException $e){
            return $this->respondWithError("Session Expired");
        }
        $rules = array (
            'from' => 'required|string',
            'to' => 'required|string',
            'ride_date' => 'required|date'
        );
        $validator = Validator::make($request->all(), $rules);
        if ($validator-> fails()){
            return $this->respondValidationError('Fields Validation Failed.', $validator->errors());
        }

        $ride = Ride_request::create([
        	'user_id' => $user->id,
        	'from' => $request['from'],
        	'to' => $request['to'],
        	'ride_date' => $request['ride_date'],
        ]);
        return $this->respond([
                        'status' => 'success',
                        'status_code' => $this->getStatusCode(),
                        'message' => "New ride request created",
                        'id' => $ride->id
                    ]);
    }				

}
