<?php

namespace App;

use Illuminate\Database\Eloquent\Model;


class Driver_track extends Model
{
 	protected $table = "driver_track";
 	protected $primaryKey = "user_id";
 	protected $fillable = ['user_id', 'long', 'lat'];
    
}
