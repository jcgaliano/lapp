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

            $user->save();

            $doctor = new Doctor();
            $doctor->professional_license = $request->input('pl');
            $doctor->cedula = $request->input('dni');
            $doctor->speciality = $request->input('spec_1');
            $doctor->second_speciality = $request->input('spec_2');
            $doctor->user_id = $user->id;

            $doctor->save();

            \DB::commit();

            \Session::flash('success', 'Su cuenta ha sido registrada satisfactoriamente. Proceda a iniciar sesión.');

            return redirect('/login');

        } catch (\Exception $e){

            \DB::rollback();

            \Session::flash('error', 'Se ha producido un error al registrar la cuenta. Nuestros administradores han sido notificados');

            return redirect('/login');
        }
    }

    public function appointmentsAction(Request $request){

        $user = \Auth::getUser();

        $appointments = Appointment::getAppointmentsByUser($user);

        return response()->json(['status' => 'success', 'appointments' => $appointments]);

    }

    public function allDoctorsAction(Request $request){

        $doctors = Doctor::with('user')->get();

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
}
