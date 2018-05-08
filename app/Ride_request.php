<?php

namespace App;

use Illuminate\Database\Eloquent\Model;


class Ride_request extends Model
{
 	protected $table = "ride_request";
 	protected $primaryKey = "id";
 	protected $fillable = ['user_id', 'from', 'to', 'type', 'ride_date'];
    
}
