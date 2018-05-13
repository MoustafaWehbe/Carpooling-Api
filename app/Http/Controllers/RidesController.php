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
use App\Available_offers;
use App\Available_requests;
use Httpful;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;





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
            if(is_string($request['path'])) $request['path'] = json_decode($request['path'], true);
            Ride_offer::where('id', $request['id'])->update(['path' => json_encode($request['path'])]);
            $bestRides = $this->getBestRideRequests($request['id'], $request['path']);
            
			return $this->respond([
                'status' => 'success',
                'status_code' => $this->getStatusCode(),
                'message' => "path added to ride",
                'id' => $request['id'],
                'matched_requests' => [
                    'count' => count($bestRides),
                    'ids' => $bestRides
                ]
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
        $active = Ride_offer::where("user_id", $user->id)
                            ->where('is_active', 1)
                            ->get();
        foreach ($active as $ride) {
            Available_offers::where('offer_id', $ride['id'])->delete();
            Available_requests::where('offer_id', $ride['id'])->delete();
            $ride->is_active = 0;
            $ride->save();
        }

        $ride = Ride_offer::create([
        	'user_id' => $user->id,
        	'from' => $request['from'],
        	'to' => $request['to'],
        	'ride_date' => $request['ride_date'],
            'is_active' => 1
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

        $f = $request['f'];
        $t = $request['t'];
        $longLat = ['from' => $f, 'to' => $t];
        $active = Ride_request::where("user_id", $user->id)
                            ->where('is_active', 1)
                            ->get();
        foreach ($active as $ride) {
            Available_offers::where('request_id', $ride['id'])->delete();
            Available_requests::where('request_id', $ride['id'])->delete();
            $ride->is_active = 0;
            $ride->save();
        }

        $ride = Ride_request::create([
            'user_id' => $user->id,
            'from' => $request['from'],
            'to' => $request['to'],
            'ride_date' => $request['ride_date'],
            'longlat' => json_encode($longLat),
            'is_active' => 1
        ]);
        
        $bestRide = $f && $t ? $this->getBestRideOffers($ride->id, $f, $t): [];
       
        return $this->respond([
            'status' => 'success',
            'status_code' => $this->getStatusCode(),
            'message' => "New ride request created",
            'id' => $ride->id,
            'available_offers' => count($bestRide)
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

    public function getActiveRides(Request $request) {
        try{
            $user = JWTAuth::toUser($request['api_token']);
        }
        catch (JWTException $e){
            if (!$request['api_token']){
                Log::info($request, array("NOAPITOKEN"));
                return $this->respondWithError("Api_token missing");
            }
            Log::info($request['api_token'], array("SESSIONEXPIRED"));
            return $this->respondWithError("Session Expired");
        }

        $rideRequest = Ride_request::select('id', 'user_id', 'from', 'to', 'ride_date', 'ride_offer')
                                ->where([
                                ["is_active", "=", 1],
                                ["is_accomplished", "=", 0],
                                ["user_id", "=", $user->id]
                            ])
                            ->first();
        if ($rideRequest->ride_offer === null) {
            $availableOffers = Available_offers::where('request_id', $rideRequest['id'])->get();
            $rideRequest['available_offers'] = [];
            foreach ($availableOffers as $offer) {
                $info = $this->getRideInfo($offer['offer_id']);
                $rideRequest['available_offers'] = array_merge($rideRequest['available_offers'], [$info]);
            }
        }
        else{
            $rideRequest['accepted_offer'] = $this->getRideInfo($rideRequest->ride_offer);
        }
        

        $offer = Ride_offer::select('id', 'user_id', 'from', 'to', 'ride_date', 'ride_requests')
                            ->where([
                                ["is_active", "=", 1],
                                ["is_accomplished", "=", 0],
                                ["user_id", "=", $user->id]
                            ])
                            ->first();
        
        $count = Available_requests::where('offer_id', $offer['id'])->count();
        $offer['passengers_notified'] = $count;
        $offer->ride_requests = $offer->ride_requests ? explode(',', $offer->ride_requests) : [];
        $offer['accepted_requests'] = [];
        foreach ($offer->ride_requests as $request_id) {
            $info = $this->getRideInfo($request_id, 1);
            $offer['accepted_requests'] = array_merge($rideRequest['available_offers'], [$info]);
        }
        
        return $this->respond([
            'status' => 'success',
            'status_code' => $this->getStatusCode(),
            'ride_request' => $rideRequest,
            'ride_offer' => $offer
        ]);

    }

    public function acceptRide(Request $request) {
        try{
            $user = JWTAuth::toUser($request['api_token']);
        }
        catch (JWTException $e){
            if (!$request['api_token']){
                Log::info($request, array("NOAPITOKEN"));
                return $this->respondWithError("Api_token missing");
            }
            Log::info($request['api_token'], array("SESSIONEXPIRED"));
            return $this->respondWithError("Session Expired");
        }
        if (!$request['request_id']) {
            return $this->respondValidationError("request id is missing!");
        }
        if (!$request['offer_id']) {
            return $this->respondValidationError("offer id is missing!");
        }
        Available_offers::where([
                            ['request_id', '=', $request['request_id']],
                            ['offer_id', '<>', $request['offer_id']]
                        ])
                        ->delete();
        $offer = Ride_offer::select('is_active', 'ride_requests')
                            ->where('id', $request['offer_id'])
                            ->first();
        $offer->ride_requests = $offer->ride_requests ? explode(',', $offer->ride_requests) : [];
        $offer->ride_requests[] = $request['request_id'];
        $offer->ride_requests = implode(',', $offer->ride_requests);
        $offer->save();
        Ride_request::where('id', $request['request_id'])
                        ->update(['ride_offer' => $request['offer_id']]);
        Available_requests::where('request_id', $request['request_id'])->delete();
        return $this->getActiveRides($request);
    }

    public function getBestRideOffers($id, $f, $t){

        $rides = Ride_offer::select('id', 'user_id', 'from', 'to', 'ride_date', 'path', 'ride_requests')->where('is_accomplished',0)->where('is_active', 1)->whereNotNull('path')->get();
        Log::info($rides, array('RIDEOFFERSTOMATCH'));
        $bestRide = [];
        $offers = [];
        foreach ($rides as $ride) {
            $rideRequests = $ride['ride_requests'];
            if ($ride['path'] && (!$rideRequests || count(explode(',', $rideRequests)) < 3)) {
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
                $rideRequests = explode(',', $rideRequests);
                $rideRequests[] = $id;
                // Ride_offer::where('id', $ride['id'])->update(['ride_requests' => implode(',', $rideRequests)]);
                $bestRide = [];
                $offers[] = $ride['id'];
                Available_offers::create([
                    'request_id' => $id,
                    'offer_id' => $ride['id']
                ]);
            }
            else { 
                $bestRide=[];
            }
        }
        // if ($bestRide != []) {
        //     Ride_request::where('id', $id)->update(['ride_offer', $bestRide['id']]);
        // }
        return $offers;
    }

    public function getBestRideRequests($id, $offerpath){

        $rides = Ride_request::select('id', 'user_id', 'from', 'to', 'ride_date', 'longlat')->where('is_accomplished',0)->where('is_active', 1)->where('ride_offer', null)->get();
        Log::info($rides, array('RIDEREQUESTSTOMATCH'));
        $bestRide = [];
        $bestRequests = [];
        foreach ($rides as $ride) {
            if ($offerpath) {
                $ride['longlat'] = json_decode($ride['longlat'], true);
                $f = $ride['longlat']['from'];
                $t = $ride['longlat']['to'];
                foreach ($offerpath as $path) {
                   if(( -0.0015< ($path['latitude']-$f[0]) && ($path['latitude']-$f[0])< 0.0015 ) && (-0.0015<($f[1]-$path['longitude']) &&  ($f[1]-$path['longitude']) < 0.0015)){
                      $bestRide['user_id'] = $ride['user_id'];
                    } 
                    else if(( -0.0015< ($path['latitude']-$t[0]) && ($path['latitude']-$t[0])< 0.0015 ) && (-0.0015<($t[1]-$path['longitude']) &&  ($t[1]-$path['longitude']) < 0.0015)){
                      $bestRide['ride_id'] = $ride['id'];
                    } 
                }
            }
            if(isset($bestRide['user_id']) && isset($bestRide['ride_id'])){
                $bestRequests[] = $ride['id'];
                // Ride_request::where('id', $ride['id'])->update(['ride_offer', $id]);
                Available_requests::create([
                    'offer_id' => $id,
                    'request_id' => $ride['id']
                ]);
                Available_offers::create([
                    'request_id' => $ride['id'],
                    'offer_id' => $id
                ]);
                $bestRide = [];
            }
            else { 
                $bestRide=[];
            }
        }
        // if ($bestRequests != []) {
        //     Ride_offer::where('id', $id)->update(['ride_requests' => implode(',', $bestRequests)]);
        // }
        return $bestRequests;
    }

    public function getRideInfo($id, $is_request = 0) {
        $info = [];
        $info['ride'] = $is_request == 0 
                        ? Ride_offer::select('id', 'user_id', 'from', 'to', 'ride_date')
                                    ->where('id', $id)
                                    ->first()
                        : Ride_request::select('id', 'user_id', 'from', 'to', 'ride_date')
                                    ->where('id', $id)
                                    ->first();
        $info['driver'] = User::select('id', 'first_name', 'last_name', 'phone')->where('id', $info['ride']['user_id'])->first();
        $profile = User_profile::select('image', 'gender')->where('user_id', $info['ride']['user_id'])->first();
        $info['driver']['image'] = $profile['image'];
        $info['driver']['gender'] = $profile['gender'];
        $info['vehicle'] = Vehicles::select('type', 'model')->where('user_id', $info['ride']['user_id'])->first();
        return $info;
    }
}
