<?php

namespace App;

use Illuminate\Database\Eloquent\Model;


class Ride_request extends Model
{
 	protected $table = "ride_request";
 	protected $primaryKey = "id";
 	protected $fillable = ['user_id', 'from', 'to', 'longlat', 'type', 'ride_date', 'is_accomplished', 'is_active', 'ride_offer'];
    
}
