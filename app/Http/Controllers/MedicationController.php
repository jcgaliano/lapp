<?php

namespace App\Http\Controllers;

use App\Appointment;
use App\AppointmentMedication;
use App\Medication;
use App\Patient;
use Illuminate\Http\Request;

use App\Http\Requests;

class MedicationController extends Controller
{

    public function allAction(Request $request){

        $meds = Medication::allMeds();

        return response()->json($meds);

    }

    public function linkToAppointmentAction(Requests\LinkMedToAppointmentRequest $request){

        $appointment = Appointment::find($request->input('appointment_id'));

        if ($appointment){

            $existent = AppointmentMedication::where('appointment_id', $request->input('appointment_id'))
                ->where('medication_id', $request->input('medication_id'))->first();

            if ($request->input('action') == 'add'){

                if ($existent){
                    return response()->json([
                        'status' => 'fail',
                        'message' => 'Este medicamento ya ha sido agregado previamente a esta cita'
                    ]);
                }

                $appointment_medication = new AppointmentMedication();

            } else {

                $appointment_medication = $existent;

            }

            $appointment_medication->appointment_id = $request->input('appointment_id');
            $appointment_medication->medication_id = $request->input('medication_id');
            $appointment_medication->dose = $request->input('medication_dose');
            $appointment_medication->iterations = $request->input('medication_iterations');
            $appointment_medication->notes = $request->input('medication_notes');

            $appointment_medication->save();

            $res_obj = AppointmentMedication::with('medication')->where('medication_id', $appointment_medication->medication_id)
                ->where('appointment_id', $appointment_medication->appointment_id)
                ->first()
                ->toArray();

            return response()->json([
                'status' => 'success',
                'message' => 'El medicamento ha sido añadido',
                'data' => $res_obj
            ]);

        } else {
            return response()->json([
                'status' => 'fail',
                'message' => 'Lo sentimos, la cita que refiere no puede ser encontrada'
            ]);
        }
    }

    public function removeMedicationFromAppointment(Requests\RemoveAppointmentMedicationRequest $request){

        $am = AppointmentMedication::where('appointment_id', $request->input('appointment_id'))
            ->where('medication_id', $request->input('medication_id'))
            ->first();

        if (!$am){

            return response()->json([
                'status' => 'fail',
                'message' => 'Lo sentimos, no podemos encontrar el medicamento dentro de la cita que refiere.'
            ]);

        } else {

            $am->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'El medicamento ha sido eliminado'
            ]);

        }
    }

    public function loggedUserMedicationsAction(Request $request){

        $user = \Auth::user();

        $patient = Patient::where('user_id', $user->id)->first();

        if ($patient){

            $medications = AppointmentMedication::getAssignedToPatient($patient->id);

            return response()->json([
                'status' => 'success',
                'data' => $medications
            ]);

        } else {
            return [
                'status' => 'fail',
                'message' => 'Su usuario no es un paciente del sistema'
            ];
        }

    }

    public function completeCycleAction(Request $request){

        $medication = AppointmentMedication::find($request->input('id'));

        if ($medication){

            $patient = Patient::where('user_id', \Auth::user()->id)->first();

            if (!$patient){
                return response()->json([
                    'status' => 'fail',
                    'message' => 'Sesión inválida'
                ]);
            }

            //check if the user is the owner of the medication
            $appointment = Appointment::find($medication->appointment_id);

            if ($appointment){

                if ($appointment->patient_id == $patient->id){

                    $medication->done = true;

                    $medication->save();

                    return response()->json([
                        'status' => 'success'
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
                    'message' => 'El medicamento pertenece a una cita inválida'
                ]);
            }

        }

        return response()->json([
            'status' => 'fail',
            'message' => 'Medicación inválida'
        ]);
    }
    
}
