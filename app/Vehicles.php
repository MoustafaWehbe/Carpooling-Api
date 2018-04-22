<?php

namespace App;

use Illuminate\Database\Eloquent\Model;


class Vehicles extends Model
{
 	protected $table = "vehicles";
 	protected $primaraykey = "id";
 	protected $fillable = ['user_id', 'type', 'model'];
    
}
