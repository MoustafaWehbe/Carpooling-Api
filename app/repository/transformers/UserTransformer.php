<?php
namespace App\Repository\Transformers;

class UserTransformer extends Transformer{
    public function transform($user){
        return [
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'email' => $user->email,
            'phone' => $user->phone,
            'api_token' => $user->api_token,
        ];
    }
}