<?php

namespace App\Http\Controllers;

use App\Appointment;
use App\AppointmentResource;
use App\Doctor;
use App\DoctorPatient;
use App\Patient;
use App\User;
use Illuminate\Http\Request;

use App\Http\Requests;

class PatientsController extends Controller
{

    public function allAction(Request $request){

        $user_id = \Auth::getUser()->id;

        $patients = Patient::allPatients($user_id, $request->input('term', null));

//        $result = [];
//
//        foreach($patients as $p){
//            if (isset($p->patient)){
//                $result[] = $p->patient->toPublicArray();
//            }
//        }

        return response()->json(['status' => 'success', 'data' => $patients]);

    }

    public function getPatientAction(Request $request, $id = null){

        if ($id){

            $patient = Patient::with('user')->find($id);

            return response()->json(['status' => 'success', 'patient' => $patient->toPublicArray()]);

        } else {
            return response()->json(['status' => 'success', 'patient' => null]);
        }

    }

    public function handlePostPatientAction(Request $request, $id = null){

        $patient_data = $request->input('patient');

        $user = \Auth::getUser();

        $doctor = Doctor::where('user_id', $user->id)->first();

        $action = '';

        if (isset($patient_data['id']) && $patient_data['id']){

            $patient = Patient::find($patient_data['id']);

            $action = 'edit';

            if (!$patient){
                $patient = new Patient();
                $action = 'create';
            }

        } else {
            $patient = new Patient();
            $action = 'create';
        }

        if ($action == 'create'){

            //try to look if the patient exists to warn the doctor that is creating this
            $existent = Patient::findByIdentifierFields($patient_data['doc_type'], $patient_data['id_doc'], $patient_data['email']);

            if ($existent){

                $object_type = get_class($existent);

                if ($object_type == 'App\Patient'){
                    //a patient with the identifier fields exists

                    $doctors = [];

                    $is_current_doctor_patient = false;

                    foreach($existent->doctors as $current_doctor){
                        $doctors = [
                            'id' => $current_doctor->id,
                            'name' => $current_doctor->user->name.' '.$current_doctor->user->lastname
                        ];
                        
                        if ($current_doctor->id == $doctor->id){
                            $is_current_doctor_patient = true;
                        }
                        
                    }

                    if ($is_current_doctor_patient){

                        return response()->json(Patient::existsAndBelongsToTheLoggedDoctorResponse($existent));

                    } else {

                        return response()->json(Patient::existsAndBelongsToOtherDoctorResponse($existent, $doctors));
                    }


                } elseif ($object_type == 'App\User'){
                    //a user with the same email exists
                    //check if it is doctor or patient

                    $patient = Patient::with('user', 'doctors', 'doctors.user')->where('user_id', $existent->id)->first();

                    if ($patient){

                        if (count($patient->doctors) == 0){
                            return response()->json(Patient::existsAndHavesNoDoctorResponse($patient));
                        }

                        $doctors = [];

                        $is_current_doctor_patient = false;

                        foreach($patient->doctors as $current_doctor){
                            $doctors = [
                                'id' => $current_doctor->id,
                                'name' => $current_doctor->user->name.' '.$current_doctor->user->lastname
                            ];

                            if ($current_doctor->id == $doctor->id){
                                $is_current_doctor_patient = true;
                            }

                        }

                        if ($is_current_doctor_patient){

                            return response()->json(Patient::existsAndBelongsToTheLoggedDoctorResponse($patient));

                        } else {

                            return response()->json(Patient::existsAndBelongsToOtherDoctorResponse($patient, $doctors));
                        }

                    } else {

                        $doctor = Doctor::where('user_id', $existent->id)->first();

                        if ($doctor){

                            return response()->json([
                                'status' => 'fail',
                                'message' => 'Ya existe una cuenta registrada con ese email, pertenece a un doctor dentro de nuestro sistema'
                            ]);

                        } else {
                            return response()->json([
                                'status' => 'fail',
                                'message' => 'Ya existe un usuario con ese email en nuestra base de datos. Esta cuenta no es ni un paciente ni un doctor.'
                            ]);
                        }

                    }
                }
            }

            $user = new User();

        } else {
            $user = $patient->user;
        }

        try{
            \DB::beginTransaction();

            $user->name = $patient_data['name'];
            $user->lastname = $patient_data['lastname'];

            $old_email = $user->email;

            $user->email = $patient_data['email'];
            $user->cell = $patient_data['cell'];
            $user->birthday = $patient_data['birthday'];
            $user->gender = $patient_data['gender'];

            $user->user_type = 2;
            $user->validated = false;

            if ($action == 'create'){
                $user->password = \Hash::make($patient_data['name'].$patient_data['email'].time());
                $user->active = false;
                $user->activation_token = md5($patient_data['name'].$patient_data['email'].time());
                $user->needs_password = true;
            }

            $user->save();

            $patient->user_id = $user->id;

            $patient->doc_type = $patient_data['doc_type'];
            $patient->id_doc = $patient_data['id_doc'];

            $patient->device_id = $patient_data['device_id'];

            $patient->street = $patient_data['street'];
            $patient->number = $patient_data['number'];
            $patient->colony = $patient_data['colony'];
            $patient->city = $patient_data['city'];
            $patient->postal_code = $patient_data['postal_code'];
            $patient->medical_insurance = $patient_data['medical_insurance'];
            $patient->marital_status = $patient_data['marital_status'];
            $patient->religion = $patient_data['religion'];
            $patient->origin = $patient_data['origin'];

            $patient->min_temp = $patient_data['min_temp'];
            $patient->max_temp = $patient_data['max_temp'];

            $patient->min_crate = $patient_data['min_crate'];
            $patient->max_crate = $patient_data['max_crate'];

            $patient->save();
            
            if ($action == 'create'){
                //send email notification to the user

                $patient_doctor = new DoctorPatient();
                $patient_doctor->doctor_id = $doctor->id;
                $patient_doctor->patient_id = $patient->id;
                $patient_doctor->added_by_user = $user->id;

                $patient_doctor->save();

                \Mail::queue('emails/patient_registered', ['doctor' => $doctor, 'patient' => $patient, 'user' => $user], function($message){
                    $message->setTo('asolenzal@localhost');
                    $message->setSubject('Laria - Bienvenido a nuestro sistema');
                });


            }

            \DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => $action == 'create' ? 'El paciente ha sido creado satisfactoriamente. Este ha sido notificado por email.' : 'Los datos han sido actualizados satisfactoriamente'
            ]);

        } catch (\Exception $e){

            \DB::rollback();

            throw $e;

            return response()->json([
                'status' => 'success',
                'message' => 'Ha ocurrido un error al procesar los datos. Vuelva a intentarlo'
            ]);
        }

    }

    public function movePatientAction(Request $request){

        $user = \Auth::getUser();

        $patient_id = $request->input('patient_id');

        $patient = Patient::with('user')->find($patient_id);

        if ($patient){

            $doctor = Doctor::with('user')->where('user_id', $user->id)->first();

            $dp = DoctorPatient::where('patient_id', $patient_id)
                ->where('doctor_id', $doctor->id)
                ->first();

            if (!$dp){

                try{

                    \DB::beginTransaction();

                    $dp = new DoctorPatient();
                    $dp->patient_id = $patient_id;
                    $dp->doctor_id = $doctor->id;
                    $dp->added_by_user = $user->id;

                    $dp->save();

                    \DB::commit();

                    \Mail::queue('emails/patient_added_to_doctor', ['doctor' => $doctor, 'patient' => $patient, 'user' => $user], function($message){
                        $message->setTo('asolenzal@localhost');
                        $message->setSubject('Laria - Notificación del sistema');
                    });

                } catch(\Exception $e){

                    \DB::rollback();

                    throw $e;
                }

            }

            return response()->json(['status' => 'success', 'message' => 'El paciente ha sido agregado a sus pacientes satisfactoriamente']);

        } else {

            return response()->json(['status' => 'fail', 'message' => 'Debe seleccionar un paciente para realizar la operación']);

        }


    }

    public function getLoggedPatientAction(Request $request){

        $user = \Auth::user();

        $patient = Patient::with('user')->where('user_id', $user->id)->first();

        if ($patient){

            return response()->json([
                'status' => 'success',
                'data' => $patient->toPublicArray()
            ]);

        } else {
            return [
                'status' => 'fail',
                'message' => 'Su usuario no es un paciente del sistema'
            ];
        }
    }

    public function getSensorDataByDate(Request $request){

        $start_date = $request->input('start_date', null);
        $end_date = $request->input('end_date', null);
        $sensor_name = $request->input('sensor_name');

        $user = \Auth::user();

        $patient = Patient::with('user')->where('user_id', $user->id)->first();

        $resources = Appointment::getSensorDataByDate($patient->id, $sensor_name, $start_date, $end_date);

        if (count($resources) > 0){
            
            return response()->json([
                'status' => 'success',
                'data' => $resources
            ]);
            
        } else {
                        
            return response()->json([
                'status' => 'fail',
                'message' => 'No se encuentran lecturas de sensores en el período especificado'
            ]);
            
        }
    }

    public function removePatientAction(Request $request){

        $patient = Patient::find($request->input('id'));

        if ($patient){

            $user = User::find($patient->user_id);

            //unlink the doctor and the patient

            $doctor = Doctor::where('user_id', \Auth::user()->id)->first();

            if ($doctor){

                DoctorPatient::query()->where('patient_id', $patient->id)->where('doctor_id', $doctor->id)->delete();

                return response()->json([
                    'status' => 'success',
                    'message' => 'Paciente eliminado satisfactoriamente'
                ]);

            } else {
                return response()->json([
                    'status' => 'fail',
                    'message' => 'Acceso denegado'
                ]);
            }

        } else {
            return response()->json([
                'status' => 'fail',
                'message' => 'No se encuentra el perfil del usuario'
            ]);
        }
    }
}
