<?php

namespace App;

use Illuminate\Database\Eloquent\Model;


class Available_requests extends Model
{
 	protected $table = "available_requests";
 	protected $primaryKey = "id";
 	protected $fillable = ['request_id'];
    
}
