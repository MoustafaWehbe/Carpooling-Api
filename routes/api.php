<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::group(['middleware' => 'cors', 'prefix' => '/v1'], function () {
    Route::post('/login', 'UserController@authenticate');
    Route::post('/register', 'UserController@register');
    Route::post('/logout/{api_token}', 'UserController@logout');
    Route::post('/verify/phone', 'UserController@verifyNumber');
    Route::post('/user/profile', 'UserController@getProfile');
});
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
