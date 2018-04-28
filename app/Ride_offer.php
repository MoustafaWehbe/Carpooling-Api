<?php

namespace App;

use Illuminate\Database\Eloquent\Model;


class Ride_offer extends Model
{
 	protected $table = "ride_offer";
 	protected $primaraykey = "id";
 	protected $fillable = ['user_id', 'from', 'to', 'type', 'ride_date'];
    
}
