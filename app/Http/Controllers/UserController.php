<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Http\UploadedFile;

class UserController extends Controller
{
    public function loggedUserAction(Request $request){

        $user = \Auth::getUser();

        if ($user){
            return response()->json(['status' => 'success', 'data' => $user->toPublicArray()]);
        } else {
            return response()->json(['error' => 'No se puede obtener los datos del usuario']);
        }

    }

    public function profilePictureAction(Request $request){

        if ($request->files->has('archivo') && $request->files->get('archivo')){

            try{

                $file = $request->file('archivo');

                $upload_path = app_path().'/../public/uploads/users_pictures/';

                $user = \Auth::getUser();

                $filename = md5($user->email).'.'.$file->getClientOriginalExtension();

                $user->profile_picture = $filename;

                $user->save();

                $file->move($upload_path, $filename);

                return response()->json(['status' => 'success', 'file' => '/public/uploads/users_pictures/'.$filename.'?'.time()]);

            } catch (\Exception $e){

                throw $e;

                \Log::error($e->getMessage());

                return response()->json(['status' => 'fail', 'message' => 'Ha ocurrido un error al subir la imagen']);

            }

        } else {
            return response()->json(['status' => 'fail', 'message' => 'Debe seleccionar un fichero']);
        }

    }
}
