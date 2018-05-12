<?php

namespace App;

use Illuminate\Database\Eloquent\Model;


class Available_offers extends Model
{
 	protected $table = "available_offers";
 	protected $primaryKey = "id";
 	protected $fillable = ['offer_id', 'request_id'];
    
}
