<?php
namespace App\Repository\Transformers;

class UserTransformer extends Transformer{
    public function transform($user){
        return [
            'fullname' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'api_token' => $user->api_token,
        ];
    }
}