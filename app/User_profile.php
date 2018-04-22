<?php

namespace App;

use Illuminate\Database\Eloquent\Model;


class User_profile extends Model
{
 	protected $table = "user_profile";
 	protected $primaraykey = "id";
 	protected $fillable = ['user_id', 'image', 'points', 'gender', 'driving_license'];
    
}
