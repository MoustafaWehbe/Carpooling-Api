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
use App\Driver_track;
use Httpful;
use Illuminate\Support\Facades\Log;





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
            if (!$request['api_token']){
            	return $this->respondWithError("api_token missing");
            }
            Log::info($request['api_token'], array("SESSIONEXPIRED"));
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
        if ($request['path']) {
	        Log::info($request, array("RIDEOFFER-PATHINFO"));
        	if (!$request['id']) {
        		return $this->respondValidationError('ride id is missing');
        	}
        	Ride_offer::where('id', $request['id'])->update(['path' => json_encode($request['path'])]);
			return $this->respond([
                'status' => 'success',
                'status_code' => $this->getStatusCode(),
                'message' => "path added to ride",
                'id' => $request['id']
            ]);        
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
            if (!$request['api_token']){
            	return $this->respondWithError("api_token missing");
            }
            Log::info($request['api_token'], array("SESSIONEXPIRED"));
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
        $f = json_decode($request['f'], true);
        $t = json_decode($request['t'], true);
        // var_dump($f);
        // return;
        $bestRide = $f && $t ? $this->getBestRideOffer($f, $t): [];
        if($bestRide != []){
            $driver = User::select('id', 'first_name', 'last_name', 'phone')->where('id', $bestRide['user_id'])->first();
            $profile = User_profile::select('image', 'gender')->where('user_id', $bestRide['user_id'])->first();
            $driver['image'] = $profile['image'];
            $driver['gender'] = $profile['gender'];
            $vehicle = Vehicles::select('type', 'model')->where('user_id', $bestRide['user_id'])->first();
            return $this->respond([
                'status' => 'success',
                'status_code' => $this->getStatusCode(),
                'message' => "New ride request created",
                'id' => $ride->id,
                'best_ride' => [
                    'ride' => $bestRide,
                    'driver' => $driver,
                    'vehicle' => $vehicle
                ]
            ]);
        }
        return $this->respond([
            'status' => 'success',
            'status_code' => $this->getStatusCode(),
            'message' => "New ride request created",
            'id' => $ride->id
        ]);
    }

    public function getAllRideOffers(Request $request) {
		try{
            $user = JWTAuth::toUser($request['api_token']);
        }
        catch (JWTException $e){
            if (!$request['api_token']){
            	return $this->respondWithError("api_token missing");
            }
            Log::info($request['api_token'], array("SESSIONEXPIRED"));
            return $this->respondWithError("Session Expired");
        }

		$rides = Ride_offer::select('id', 'user_id', 'from', 'to', 'ride_date', 'path')->where('is_accomplished',0)->get();
		foreach ($rides as &$ride) {
			$ride['path'] = json_decode($ride['path'], true);
		}
		return $this->respond([
            'status' => 'success',
            'status_code' => $this->getStatusCode(),
            'rides' => $rides
        ]);
	}				

	public function getMyRides(Request $request) {
		try{
            $user = JWTAuth::toUser($request['api_token']);
        }
        catch (JWTException $e){
            if (!$request['api_token']){
            	return $this->respondWithError("api_token missing");
            }
            Log::info($request['api_token'], array("SESSIONEXPIRED"));
            return $this->respondWithError("Session Expired");
        }

        $ride_offers_unac = Ride_offer::select('id', 'from', 'to', 'ride_date', 'path')->where('is_accomplished',0)->where('user_id', $user->id)->get();
        $ride_requests_unac = Ride_request::select('id', 'from', 'to', 'ride_date')->where('is_accomplished',0)->where('user_id', $user->id)->get();
        $ride_offers_ac = Ride_offer::select('id', 'from', 'to', 'ride_date', 'path')->where('is_accomplished',1)->where('user_id', $user->id)->get();
        $ride_requests_ac = Ride_request::select('id', 'from', 'to', 'ride_date')->where('is_accomplished',1)->where('user_id', $user->id)->get();
        foreach ($ride_offers_unac as &$ride) {
			$ride['path'] = json_decode($ride['path'], true);
		}
		foreach ($ride_offers_ac as &$ride) {
			$ride['path'] = json_decode($ride['path'], true);
		}
        return $this->respond([
            'status' => 'success',
            'status_code' => $this->getStatusCode(),
            'rides' => [
            	'accomplished' => [
            		'offers' => $ride_offers_ac,
            		'requests' => $ride_requests_ac,
            	],
            	'unaccomplished' => [
					'offers' => $ride_offers_unac,
            		'requests' => $ride_requests_unac,
            	]
            ]
        ]);
        // return $this->respond([
        //     'status' => 'success',
        //     'status_code' => $this->getStatusCode(),
        //     'rides' => [
        //     	'offers' => $ride_offers_unac,
        //     	'requests' => $ride_requests_unac,
        //     ]
        // ]);
	}

    public function track(Request $request) {
        try{
            $user = JWTAuth::toUser($request['api_token']);
        }
        catch (JWTException $e){
            if (!$request['api_token']){
                return $this->respondWithError("api_token missing");
            }
            Log::info($request['api_token'], array("SESSIONEXPIRED"));
            return $this->respondWithError("Session Expired");
        }
        if (isset($request['driver_id'])) {
            $location = Driver_track::where('user_id', $request['driver_id'])->first();
            return $this->respond([
                'status' => 'success',
                'status_code' => $this->getStatusCode(),
                'long' => $location['long'],
                'lat' => $location['lat']
            ]);
        }
        else {
            $rules = array (
                'long' => 'required|numeric',
                'lat' => 'required|numeric',
            );
            $validator = Validator::make($request->all(), $rules);
            if ($validator-> fails()){
                return $this->respondValidationError('Fields Validation Failed.', $validator->errors());
            }
            $location = Driver_track::updateOrCreate(
                ['user_id' => $user->id], [
                    'long' => $request['long'],
                    'lat' => $request['lat']
                ]
            );
            return $this->respondOk();
        }
    }

    public function getBestRideOffer($f, $t){

        $rides = Ride_offer::select('id', 'user_id', 'from', 'to', 'ride_date', 'path')->where('is_accomplished',0)->get();
        $bestRide = [];
        foreach ($rides as $ride) {
            if ($ride['path']) {
                $ride['path'] = json_decode($ride['path'], true);
                foreach ($ride['path'] as $path) {
                   if(( -0.0015< ($path['latitude']-$f[0]) && ($path['latitude']-$f[0])< 0.0015 ) && (-0.0015<($f[1]-$path['longitude']) &&  ($f[1]-$path['longitude']) < 0.0015)){
                      $bestRide['user_id'] = $ride['user_id'];
                    } 
                    else if(( -0.0015< ($path['latitude']-$t[0]) && ($path['latitude']-$t[0])< 0.0015 ) && (-0.0015<($t[1]-$path['longitude']) &&  ($t[1]-$path['longitude']) < 0.0015)){
                      $bestRide['ride_id'] = $ride['id'];
                    } 
                }
            }
            if(isset($bestRide['user_id']) && isset($bestRide['ride_id'])){
                $bestRide = $ride;
                break;
            }
            else { 
                $bestRide=[];
            }
        }
        return $bestRide;
    }
}
