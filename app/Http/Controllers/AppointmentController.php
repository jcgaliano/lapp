<?php

namespace App\Http\Controllers;

use App\Appointment;
use App\Doctor;
use App\Patient;
use Illuminate\Auth\Access\Response;
use Illuminate\Http\Request;

use App\Http\Requests;

class AppointmentController extends Controller
{
    public function searchAction(Request $request){

        $user = \Auth::getUser();

        $appointments = Appointment::getAppointmentsByUser($user, $request->input('criteria'), $request->input('assisted'));

        return response()->json(['status' => 'success', 'appointments' => $appointments]);

    }

    public function postAppointmentAction(Requests\AppointmentFormRequest $request){

        $user = \Auth::getUser();

        $doctor = Doctor::with('user')->where('user_id', $user->id)->first();

        $patient = Patient::with('user')->find($request->input('patient'));

        if ($patient){

            $appointment = Appointment::upsert($request->input('id'), $request->input('date'), $doctor, $patient);

            //send mail to the patient notifying of the appointment upsert
            \Mail::queue('emails/appointment_upsert_success', ['doctor' => $doctor, 'patient' => $patient, 'appointment' => $appointment], function($message){
                $message->setTo('asolenzal@localhost');
                $message->setSubject('Laria - Cita programada');
            });

            if ($appointment){

                return response()->json(['status' => 'success', 'message' => 'Operación realizada con éxito']);

            } else {
                return response()->json(['status' => 'fail', 'message' => 'Ha ocurrido un error al realizar la operación']);
            }

        } else {
            return response()->json(['status' => 'fail', 'message' => 'Paciente inválido']);
        }

    }

    public function getAppointmentAction(Request $request, $id){

        $appointment = Appointment::find($id);

        if ($appointment){

            $res = $appointment->toArray();

            $time_parts = explode(' ', $res['date']);

            $res['datetime'] = [
                'date' => $time_parts[0],
                'time' => explode(':', $time_parts[1])
            ];

            return response()->json(['status' => 'success', 'appointment' => $res]);

        } else {
            return response()->json(['status' => 'fail', 'message' => 'Cita inválida']);
        }
    }

    public function deleteAppointmentAction(Request $request){

        try{

            Appointment::find($request->input('id'))->delete();

            return response()->json(['status' => 'success', 'message' => 'La cita ha sido eliminada con éxito']);

        } catch (\Exception $e){

            \Log::error('Eliminando cita: '.$e->getMessage());

            return response()->json(['status' => 'fail', 'message' => 'Ha ocurrido un error al eliminar la cita']);

        }

    }

    public function pendingRequestsAction(Request $request){

        $user = \Auth::getUser();

        switch($user->user_type){
            case 1:
                //get all appointment requests addressed to the doctor

                $doctor = Doctor::where('user_id', $user->id)->first();

                if ($doctor){

                    $appointments = Appointment::getPendingByDoctor($doctor->id);

                    return response()->json(['status' => 'success', 'data' => $appointments]);

                } else {
                    return response()->json(['status' => 'fail', 'message' => 'Doctor inválido']);
                }

                break;
            case 2:
                //get all appointment request created by the patient

                break;
        }

    }
    
    public function approveAppointmentAction(Requests\AppointmentApprovalRequest $request){

        $appointment = Appointment::find($request->input('id'));

        if ($appointment){

            $appointment->approved = true;
            $appointment->save();

            $user = \Auth::getUser();

            $doctor = Doctor::with('user')->where('user_id', $user->id)->first();

            $patient = Patient::with('user')->where('id', $appointment->patient_id)->first();

            //send the email
            \Mail::queue('emails/appointment_approval_success', ['doctor' => $doctor, 'patient' => $patient, 'appointment' => $appointment], function($message){
                $message->setTo('asolenzal@localhost');
                $message->setSubject('Laria - Cita programada');
            });

            return response()->json(['status' => 'success', 'message' => 'La cita ha sido aprobada satisfactoriamente. El paciente ha sido notificado']);

        } else {
            return response()->json(['status' => 'fail', 'message' => 'Cita no encontrada']);
        }
    }

    public function postAppointmenRequestAction(Requests\AddAppointmentReqRequest $request){

        $user = \Auth::getUser();

        $patient = Patient::with('user')->find($user->id);

        $doctor = Doctor::with('user')->where('user_id', $request->input('doctor_id'))->first();

        if ($doctor){

            $appointment = Appointment::upsert($request->input('id'), $request->input('date'), $doctor, $patient, false);

            //send mail to the patient notifying of the appointment upsert
//            \Mail::queue('emails/appointment_upsert_success', ['doctor' => $doctor, 'patient' => $patient, 'appointment' => $appointment], function($message){
//                $message->setTo('asolenzal@localhost');
//                $message->setSubject('Laria - Cita programada');
//            });

            if ($appointment){

                return response()->json(['status' => 'success', 'message' => 'Operación realizada con éxito']);

            } else {
                return response()->json(['status' => 'fail', 'message' => 'Ha ocurrido un error al realizar la operación']);
            }

        } else {
            return response()->json(['status' => 'fail', 'message' => 'Paciente inválido']);
        }

    }
}
