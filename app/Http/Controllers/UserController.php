<?php

namespace App\Http\Controllers;

use App\Doctor;
use App\Supervisor;
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

        if ($request->files->has('file') && $request->files->get('file')){

            try{

                $file = $request->file('file');

                $upload_path = app_path().'/../public/uploads/users_pictures/';

                $user = \Auth::getUser();

                $old_profile_picture = $user->profile_picture;

                $filename = md5($user->email.time()).'.'.$file->getClientOriginalExtension();

                $user->profile_picture = $filename;

                $user->save();

                $file->move($upload_path, $filename);

                if ($old_profile_picture){
                    unlink($upload_path.$old_profile_picture);
                }

                return response()->json(['status' => 'success', 'file' => '/uploads/users_pictures/'.$filename.'?'.time()]);

            } catch (\Exception $e){

                throw $e;

                \Log::error($e->getMessage());

                return response()->json(['status' => 'fail', 'message' => 'Ha ocurrido un error al subir la imagen']);

            }

        } else {
            return response()->json(['status' => 'fail', 'message' => 'Debe seleccionar un fichero']);
        }

    }

    public function changePasswordAction(Requests\PasswordChangeRequest $request){

        $password = $request->input('password');

        $user = \Auth::getUser();

        $user->password = \Hash::make($password);

        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'La contraseña ha sido cambiada satisfactoriamente'
        ]);

    }

    public function supervisorProfileAction(Request $request){

        $user = \Auth::user();

        $super = Supervisor::where('user_id', $user->id)->first();

        try{

            $data = $request->input('data');

            \DB::beginTransaction();

            $user->email = $data['email'];
            $user->name = $data['name'];
            $user->lastname = $data['lastname'];
            $user->cell = $data['cell'];
            $user->gender = $data['gender'];
            $user->birthday = $data['birthday'];

            $user->save();

            $super->curp = $data['cedula'];
            $super->speciality = $data['specialty'];

            $super->save();

//            dd($doctor);

            \DB::commit();

            return response()->json(['status' => 'success', 'message' => 'El perfil ha sido actualizado satisfactoriamente']);

        } catch (\Exception $e){

            throw $e;

            \DB::rollback();

            \Log::error($e->getMessage());

            return response()->json(['status' => 'fail', 'message' => 'Ha ocurrido un error al actualizar el perfil']);

        }
    }
}
