<?php

namespace App;

use Illuminate\Database\Eloquent\Model;


class Vehicles extends Model
{
 	protected $table = "vehicles";
 	protected $primaryKey = "id";
 	protected $fillable = ['user_id', 'type', 'model'];
    
}
