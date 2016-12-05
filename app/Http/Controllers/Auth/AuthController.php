<?php

namespace App\Http\Controllers\Auth;

use App\Http\Requests\RecoverPasswordRequest;
use App\Specialty;
use App\User;
use Illuminate\Http\Request;
use Validator;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\ThrottlesLogins;
use Illuminate\Foundation\Auth\AuthenticatesAndRegistersUsers;

class AuthController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Registration & Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users, as well as the
    | authentication of existing users. By default, this controller uses
    | a simple trait to add these behaviors. Why don't you explore it?
    |
    */

    use AuthenticatesAndRegistersUsers, ThrottlesLogins;

    /**
     * Where to redirect users after login / registration.
     *
     * @var string
     */
    protected $redirectTo = '/';

    /**
     * Create a new authentication controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware($this->guestMiddleware(), ['except' => 'logout']);
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => 'required|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|min:6|confirmed',
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return User
     */
    protected function create(array $data)
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);
    }

    public function showRegistrationForm()
    {
        $specs = Specialty::all();

        return view('auth/register', ['specs' => $specs]);
    }

    public function postResetPasswordEmailAction(Request $request){

        $user = User::findByEmail($request->input('email'));

        if ($user){

            $user->recover_password_token = md5($request->input('email').\Hash::make(time()));

            $user->save();

            \Mail::queue('emails/recover_password', ['user' => $user], function($message){
                $message->setTo('asolenzal@localhost');
                $message->setSubject('Laria - Recuperar contraseña');
            });

            return response()->json([
                'status' => 'success',
                'message' => 'Su solicitud ha sido satisfactoria. Le hemos enviado un email con instrucciones para recuperar la contraseña'
            ]);

        } else {
            return response()->json([
                'status' => 'fail',
                'message' => 'Lo sentimos no existe ningún usuario con esa dirección de correo en nuestra Base de Datos'
            ]);
        }

    }

    public function getPasswordResetAction(Request $request, $token){

        $user = User::where('recover_password_token', $token)->first();

        if ($user){

            return view('auth/recover_password');

        } else {

            $error = 'Clave de recuperación de contraseña inválida';

            return view('auth/recover_password', ['user_error' => $error]);
        }
    }

    public function postPasswordResetAction(RecoverPasswordRequest $request, $token){

        $user = User::where('recover_password_token', $token)->first();

        if ($user){

            $user->password = \Hash::make($request->input('password'));

            $user->save();

            \Session::flash('success', 'La contraseña ha sido restablecida satisfactoriamente');

            return redirect(route('homepage'));

        } else {
            return redirect()->back();
        }

    }

}
