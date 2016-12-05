<?php

namespace App\Http\Controllers;

use App\Appointment;
use App\AppointmentResource;
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

            $appointment = Appointment::upsert($request->input('id'), $request->input('date'), $doctor, $patient, $request->input('area_id'));

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
                $patient = Patient::where('user_id', $user->id)->first();

                if ($patient){

                    $appointments = Appointment::getPendingByPatient($patient->id);

                    return response()->json([
                        'status' => 'success',
                        'data' => $appointments
                    ]);

                } else {
                    return response()->json([
                        'status' => 'fail',
                        'message' => 'Paciente inválido'
                    ]);
                }

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

        $patient = Patient::with('user')->where('user_id', $user->id)->first();

        $doctor = Doctor::with('user')->where('id', $request->input('doctor'))->first();

        if ($doctor){

            $appointment = Appointment::upsert($request->input('id'), $request->input('date'), $doctor, $patient, $request->input('area_id'),false);

            //send mail to the patient notifying of the appointment upsert
//            \Mail::queue('emails/appointment_request_upsert_success_patient', ['doctor' => $doctor, 'patient' => $patient, 'appointment' => $appointment], function($message){
//                $message->setTo('asolenzal@localhost');
//                $message->setSubject('Laria - Cita solicitada');
//            });
//
//            \Mail::queue('emails/appointment_request_upsert_success_doctor', ['doctor' => $doctor, 'patient' => $patient, 'appointment' => $appointment], function($message){
//                $message->setTo('asolenzal@localhost');
//                $message->setSubject('Laria - Cita solicitada');
//            });

            if ($appointment){

                return response()->json(['status' => 'success', 'message' => 'Operación realizada con éxito']);

            } else {
                return response()->json(['status' => 'fail', 'message' => 'Ha ocurrido un error al realizar la operación']);
            }

        } else {
            return response()->json(['status' => 'fail', 'message' => 'Doctor inválido']);
        }

    }

    public function testAction(){
        die ('aca');
    }

    public function appointmentDetailsAction(Request $request, $id){

        $details = Appointment::getDetailsForId($id);

        return response()->json(['status' => 'success', 'data' => $details]);

    }

    public function postAppointmentDetailsAction(Requests\AppointmentDetailsRequest $request){

        $appointment = Appointment::find($request->input('appointment_id'));

        if ($appointment){

            $appointment->indications = $request->input('indications');
            $appointment->assisted = true;

            $appointment->save();

            //if readings then save appointment readings

            //clean null values inside readings
            $readings = array_filter($request->input('readings'), function($v){
                return $v !== null;
            });

            if (is_array($readings) && count($readings) > 0){

                $resource = new AppointmentResource();

                $resource->appointment_id = $appointment->id;
                $resource->resource_type = 'sensors';
                $resource->resource = json_encode($readings);

                $resource->save();

            }

            return response()->json([
                'status' => 'success',
                'message' => 'La cita ha sido actualizada satisfactoriamente'
            ]);

        } else {
            return response()->json([
                'status' => 'fail',
                'message' => 'Lo sentimos, la cita que refiere no puede ser encontrada'
            ]);
        }
    }

    public function saveEkgReadingsAction(Request $request){



        $appointment = Appointment::find($request->input('appointment_id'));

        $doctor = Doctor::where('user_id', \Auth::user()->id)->first();

        if ($appointment->doctor_id == $doctor->id){

            if (count($request->input('ekg_data')) > 0){

                $resource = new AppointmentResource();

                $resource->resource_type = 'ekg';
                $resource->resource = json_encode($request->input('ekg_data'));
                $resource->appointment_id = $appointment->id;

                $resource->save();

                return response()->json([
                    'status' => 'success',
                    'message' => 'Los datos han sido guardados satisfactoriamente'
                ]);

            } else {
                return response()->json([
                    'status' => 'fail',
                    'message' => 'No es posible guardar un electrocardiograma vacío. Inténtelo nuevamente'
                ]);
            }

        } else {

            return response()->json([
                'status' => 'fail',
                'message' => 'Acceso denegado. Usted no puede agregar recursos a esta cita.'
            ]);

        }
    }

    public function previousAction(Request $request){

        $appointment_id = $request->input('appointment_id');

        $appointments = Appointment::getPatientPrevious($appointment_id);

        return response()->json([
            'status' => 'success',
            'data' => $appointments
        ]);

    }

    public function appointmentResourcesAction(Request $request){

        $appointment = Appointment::find($request->input('appointment_id'));

        if ($appointment){

            //TODO: check if the appointment belongs to the patient or to the doctor


            $resources = AppointmentResource::where('appointment_id', $appointment->id)
                ->orderBy('created_at', 'DESC')
                ->get();

            $results = [];

            foreach($resources as $res){
                $results[] = [
                    'raw_type' => $res->resource_type,
                    'type' => $res->resource_type == 'ekg' ? 'Electrocardiograma' : 'Lecturas de sensores',
                    'value' => json_decode($res->resource),
                    'date' => $res->created_at->format('d-m-Y H:i:s')
                ];
            }

            return response()->json([
                'status' => 'success',
                'data' => $results
            ]);

        } else {
            return response()->json([
                'status' => 'fail',
                'message' => 'La cita no existe'
            ]);
        }
    }
}
