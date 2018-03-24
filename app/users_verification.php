<?php

namespace App;

use Illuminate\Database\Eloquent\Model;


class users_verification extends Model
{
 	protected $table = "users_verification";
 	protected $primaraykey = "id";
 	protected $fillable = ['userid', 'requestid'];
    
}
