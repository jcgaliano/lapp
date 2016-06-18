<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\Cookie;

class AuthenticateController extends Controller
{
    public function authenticate(Request $request){

        try{

            $credentials = $request->only(['email', 'password']);

            if (!$token = \JWTAuth::attempt($credentials)){

                return response()->json(['status' => 'error', 'message' => 'invalid_credentials'], 401);

            }

        } catch (\Exception $e){

            return response()->json(['status' => 'error', 'message' => 'could_not_create_token'], 401);

        }

        $user = User::findByEmail($request->input('email'));

        $user->token = $token;

        $user->save();

        return response()->json(compact('token'));

    }
}
