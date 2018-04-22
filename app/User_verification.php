<?php

namespace App;

use Illuminate\Database\Eloquent\Model;


class User_verification extends Model
{
 	protected $table = "User_verification";
 	protected $primaraykey = "userid";
 	protected $fillable = ['userid', 'requestid'];
    
}
