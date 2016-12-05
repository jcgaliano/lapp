<?php

namespace App\Http\Controllers;

use App\Doctor;
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



            if (!\Auth::attempt($credentials)){
                return response()->json(['status' => 'error', 'message' => 'invalid_credentials'], 401);
            }

            $user = User::findByEmail($credentials['email']);

            if ($user->deleted){
                return response()->json([
                    'status' => 'error',
                    'message' => 'Su cuenta ha sido eliminada de nuestro sistema. Contacte al supervisor.'
                ]);
            }

            if (!$user->active){
                return response()->json([
                    'status' => 'error',
                    'message' => 'Su cuenta no ha sido activada aún. Actívela usando el email de verificación que le enviamos al momento de su registro'
                ]);
            }

            if ($user->user_type == 1){
                $doctor = Doctor::where('user_id', $user->id)->first();

                if (!$doctor || !$doctor->approved){
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Su cuenta no ha sido activada. Contacte al supervisor.'
                    ]);
                }
            }

            if (!$token = \JWTAuth::fromUser($user)){

                return response()->json(['status' => 'error', 'message' => 'invalid_credentials'], 401);

            }

        } catch (\Exception $e){

            throw $e;

            return response()->json(['status' => 'error', 'message' => 'could_not_create_token'], 401);

        }

        $user = User::findByEmail($request->input('email'));

        $user->token = $token;

        $user->save();

        return response()->json(compact('token'));

    }

    public function logoutAction(){

        \Auth::logout();

        return response()->json([
            'status' => 'success'
        ]);
    }
}
