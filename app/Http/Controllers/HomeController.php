<?php

//8383962 8383830 328287 Infomed y Etecsa

namespace App\Http\Controllers;

use App\Doctor;
use App\Http\Requests;
use App\User;
use Illuminate\Http\Request;

class HomeController extends Controller
{

    public function indexAction()
    {
        return view('app/index');
    }

    public function testAction(Request $request){

        \Mail::queue('emails/register_success', [], function($message){
            $message->setTo('asolenzal@localhost');
            $message->setSubject('Prueba de correo');
        });

    }

    public function activateAction(Request $request, $token){

        $user = User::findByToken($token);
        
        if (!$user){
            abort(404);
        } else {

            try{

                if ($user->needs_password){

                    return view('app/activate_password', ['token' => $token]);

                } else {

                    \DB::beginTransaction();

                    $user->activation_token = '';

                    $user->active = true;

                    $user->save();

                    \Mail::queue('emails/account_activated', ['user' => $user], function($message){
                        $message->setTo('asolenzal@localhost');
                        $message->setSubject('Laria - Cuenta activada satisfactoriamente');
                    });

                    \DB::commit();

                    if ($user->user_type == 1){

                        $doctor = Doctor::where('user_id', $user->id)->first();

                        if ($doctor->approved == true){

                            \Session::flash('success', 'Su cuenta ha sido activada satisfactoriamente. Puede hacer inicio de sesión');

                        } else {

                            \Session::flash('success', 'Su cuenta ha sido activada satisfactoriamente. Se le notificará cuando el supervisor haya aprobado su solicitud y podrá hacer inicio de sesión');

                        }

                    } else {
                        \Session::flash('success', 'Su cuenta ha sido activada satisfactoriamente. Puede hacer inicio de sesión');
                    }


                    return redirect(route('homepage'));
                }

            } catch (\Exception $e){

                \Log::error($e->getMessage());

                \DB::rollback();

                \Session::flash('error', 'Lo sentimos, el token de activación es inválido');

                return redirect(route('homepage'));

            }

        }
    }

    public function postActivateAction(Requests\ActivateWithPasswordFormRequest $request, $token){

        try{

            $user = User::findByToken($token);

            $user->password = \Hash::make($request->input('password'));

            $user->save();

            \Session::flash('success', 'Su cuenta ha sido activada satisfactoriamente');

            return redirect(route('homepage'));

        } catch (\Exception $e){

            \Log::error($e->getMessage());

            \Session::flash('success', 'Ha ocurrido un error al activar su cuenta. Inténtelo nuevamente por favor');

            return redirect()->back();

        }

    }

}
