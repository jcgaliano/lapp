<?php

//8383962 8383830 328287 Infomed y Etecsa

namespace App\Http\Controllers;

use App\Http\Requests;
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

}
