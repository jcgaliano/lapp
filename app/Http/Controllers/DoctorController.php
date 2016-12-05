<?php

namespace App\Http\Controllers;

use App\Appointment;
use App\Doctor;
use App\Patient;
use App\User;
use Illuminate\Http\Request;

use App\Http\Requests;

class DoctorController extends Controller
{
    public function register(Requests\RegisterDoctor $request){

        try{

            \DB::beginTransaction();

            $user = new User();

            $user->email = $request->input('email');
            $user->name = $request->input('name');
            $user->lastname = $request->input('lastname');
            $user->profile_picture = null;
            $user->password = bcrypt($request->input('password'));
            $user->user_type = 1;
            $user->active = 0;
            $user->activation_token = md5($user->name.$user->email.time());

            $user->save();

            $doctor = new Doctor();
            $doctor->professional_license = $request->input('pl');
            $doctor->cedula = $request->input('dni');
            $doctor->speciality = $request->input('spec_1');
            $doctor->second_speciality = $request->input('spec_2');
            $doctor->user_id = $user->id;
            $doctor->approved = false;

            $doctor->save();

            \Mail::queue('emails/doctor_registered', ['doctor' => $doctor, 'user' => $user], function($message){
                $message->setTo('asolenzal@localhost');
                $message->setSubject('Laria - Bienvenido a nuestro sistema');
            });

            \DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Su cuenta ha sido creada satisfactoriamente. Le hemos enviado en email de activación a su buzón para que continue con el proceso de registro'
            ]);

        } catch (\Exception $e){

            \DB::rollback();

            return response()->json([
                'status' => 'fail',
                'message' => 'Se ha producido un error al registrar la cuenta. Nuestros administradores han sido notificados'
            ]);

        }
    }

    public function appointmentsAction(Request $request){

        $user = \Auth::getUser();

        $appointments = Appointment::getAppointmentsByUser($user);

        return response()->json(['status' => 'success', 'appointments' => $appointments]);

    }

    public function doneAppointmentsAction(Request $request){

        $user = \Auth::getUser();

        $appointments = Appointment::getAppointmentsByUser($user, null, 1);

        return response()->json(['status' => 'success', 'appointments' => $appointments]);

    }



    public function allDoctorsAction(Request $request){

        $doctors = Doctor::with('user')->whereHas('user', function($query){
            $query->where('deleted', '<>', 1);
        })->get();

        $res = [];

        foreach($doctors as $doc){
            if (isset($doc->user)){
                $res[] = [
                    'id' => $doc->id,
                    'full_name' => $doc->user->name .' '. $doc->user->lastname
                ];
            }
        }

        return response()->json(['status' => 'success', 'data' => $res]);

    }

    public function allDoctorsExtendedAction(Request $request){

        $doctors = \DB::table('doctor')
            ->join('users', 'doctor.user_id', '=', 'users.id')
            ->join('doctor_speciality as ms', 'doctor.speciality', '=', 'ms.id')
            ->leftJoin('doctor_speciality as ss', 'doctor.second_speciality', '=', 'ss.id')
            ->where('users.deleted', '<>', true)
            ->where('doctor.approved', true)
            ->get([
                'doctor.id',
                'users.name',
                'users.lastname',
                'ms.speciality as main_speciality',
                'ss.speciality as second_speciality',
                'doctor.professional_license',
                'doctor.cedula',
                'users.profile_picture'
            ]);

        $res = json_decode(json_encode($doctors), true);

        return response()->json(['status' => 'success', 'data' => $res]);

    }

    public function allDoctorsPendingAction(Request $request){

        $doctors = \DB::table('doctor')
            ->join('users', 'doctor.user_id', '=', 'users.id')
            ->join('doctor_speciality as ms', 'doctor.speciality', '=', 'ms.id')
            ->leftJoin('doctor_speciality as ss', 'doctor.second_speciality', '=', 'ss.id')
            ->where('users.deleted', '<>', true)
            ->where('doctor.approved', '<>', true)
            ->get([
                'doctor.id',
                'users.name',
                'users.lastname',
                'ms.speciality as main_speciality',
                'ss.speciality as second_speciality',
                'doctor.professional_license',
                'doctor.cedula',
                'users.profile_picture'
            ]);

        $res = json_decode(json_encode($doctors), true);

        return response()->json(['status' => 'success', 'data' => $res]);

    }

    public function postDoctorUpdate(Request $request){

        $user = \Auth::user();

        $doctor = Doctor::where('user_id', $user->id)->first();

        try{

            $data = $request->input('doctor_data');

            \DB::beginTransaction();

            $user->email = $data['email'];
            $user->name = $data['name'];
            $user->lastname = $data['lastname'];
            $user->cell = $data['cell'];
            $user->gender = $data['gender'];
            $user->birthday = $data['birthday'];

            $user->save();

            $doctor->professional_license = $data['professional_license'];
            $doctor->cedula = $data['cedula'];
            $doctor->speciality = $data['speciality'];
            $doctor->second_speciality = $data['second_speciality'];
            $doctor->number = $data['number'];
            $doctor->colony = $data['colony'];
            $doctor->city = $data['city'];
            $doctor->postal_code = $data['postal_code'];
            $doctor->street = $data['street'];

            $doctor->save();

//            dd($doctor);

            \DB::commit();

            return response()->json(['status' => 'success', 'message' => 'El perfil ha sido actualizado satisfactoriamente']);

        } catch (\Exception $e){

            \DB::rollback();

            \Log::error($e->getMessage());

            return response()->json(['status' => 'fail', 'message' => 'Ha ocurrido un error al actualizar el perfil']);

        }

    }

    public function getDoctorSpecialties(Request $request){

        try{

            $user = \Auth::user();

            $doctor = Doctor::where('user_id', $user->id)->first();

            $specialties = $doctor->getSpecialties();

            return response()
                ->json([
                    'status' => 'success',
                    'data' => $specialties
                ]);

        } catch (\Exception $e){
            throw $e;

            return response()
                ->json([
                    'status' => 'fail',
                    'message' => 'Lo sentimos no hemos podido obtener sus especialidades'
                ]);

        }
    }

    public function postDoctorSpecialties(Request $request){

        try{

            $doctor = Doctor::find($request->input('doctor_id'));

            $specialties = $doctor->getSpecialties();

            return response()
                ->json([
                    'status' => 'success',
                    'data' => $specialties
                ]);

        } catch(\Exception $e){

            throw $e;

            return response()
                ->json([
                    'status' => 'fail',
                    'message' => 'Lo sentimos no hemos podido obtener sus especialidades'
                ]);
        }

    }

    public function doctorProfileForSupervisorAction(Request $request, $id){

        $doctor = Doctor::find($id);

        if ($doctor){

            $user = User::find($doctor->user_id);

            return response()->json([
                'status' => 'success',
                'data' => $user->toPublicArray()
            ]);

        } else {
            return response()->json([
                'status' => 'fail',
                'message' => 'Perfil no encontrado'
            ]);
        }

    }

    public function deleteDoctorAction(Request $request){

        $doctor = Doctor::find($request->input('id'));

        if ($doctor){

            $user = User::find($doctor->user_id);

            $user->deleted = true;

            $user->save();

            return response()->json([
                'status' => 'success',
                'message' => 'El doctor ha sido eliminado satisfactoriamente'
            ]);

        } else {
            return response()->json([
                'status' => 'fail',
                'message' => 'Perfil no encontrado'
            ]);
        }

    }

    public function certifyDoctorAction(Request $request){

        $doctor = Doctor::with('user')->find($request->input('id'));

        try{

            if (!$doctor){
                return response()->json([
                    'status' => 'fail',
                    'message' => 'Solicitud no encontrada'
                ]);
            }

            $doctor->approved = $request->input('status') == 1 ? true : false;

            $doctor->save();

            \Mail::queue('emails/doctor_certified', ['doctor' => $doctor, 'user' => $doctor->user, 'status' => $doctor->approved == true ? 'aceptada' : 'denegada'], function($message){
                $message->setTo('asolenzal@localhost');
                $message->setSubject('Laria - Notificación de la cuenta');
            });

            //notify the doctor via email

            return response()->json([
                'status' => 'success',
            ]);

        } catch (\Exception $e){
            return response()->json([
                'status' => 'fail',
                'message' => 'Ha ocurrido un error al certificar el doctor'
            ]);
        }

    }

    public function deletePendingDoctorAction(Request $request){

        $doctor = Doctor::find($request->input('id'));

        if ($doctor){

            $user = User::find($doctor->user_id);

            $user->deleted = true;

            $user->delete();

            $doctor->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'El doctor ha sido eliminado satisfactoriamente'
            ]);

        } else {
            return response()->json([
                'status' => 'fail',
                'message' => 'Perfil no encontrado'
            ]);
        }

    }

}
