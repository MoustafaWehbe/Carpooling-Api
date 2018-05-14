<?php

namespace App;

use Illuminate\Database\Eloquent\Model;


class Ride_offer extends Model
{
 	protected $table = "ride_offer";
 	protected $primaryKey = "id";
 	protected $fillable = ['user_id', 'from', 'to', 'type', 'ride_date', 'is_accomplished', 'is_active', 'ride_requests', 'passengers'];
    
}
