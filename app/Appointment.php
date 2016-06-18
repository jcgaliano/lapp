<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    protected $table = 'laria_appointments';

    public function doctor(){
        return $this->hasOne('App\Doctor', 'id', 'doctor_id');
    }

    public function patient(){
        return $this->hasOne('App\Patient', 'id', 'patient_id');
    }

    public static function getAppointmentsByUser($user, $filter_criteria = null, $filter_assisted = null){

        switch($user->user_type){
            case 1:

                $doctor = Doctor::where('user_id', $user->id)->first();

                $appointments = self::query()
                    ->select(
                        \DB::raw('laria_appointments.id , laria_appointments.date, laria_appointments.assisted, 
                                  p.curp, u.id as patient_id, u.name as name, u.lastname as lastname, u.email as email, u.cell as cell,
                                  u.profile_picture as patient_photo, u.birthday, u.sex, p.seguro_medico')
                    )
                    ->join('laria_doctor as d', 'laria_appointments.doctor_id', '=', 'd.id')
                    ->join('laria_patient as p', 'laria_appointments.patient_id', '=', 'p.id')
                    ->join('laria_users as u', 'p.user_id', '=', 'u.id')
                    ->where('laria_appointments.doctor_id', $doctor->id);

                if (in_array($filter_assisted, ['0', '1', '-1'])){

                    if ($filter_assisted == -1){
                        $appointments = $appointments->whereNull('laria_appointments.assisted');
                    } else {
                        $appointments = $appointments->where('laria_appointments.assisted', '=', $filter_assisted);
                    }

                }

                if ($filter_criteria){

                    $appointments = $appointments->whereRaw('CONCAT(u.name, u.lastname) LIKE "%'.$filter_criteria.'%"');
                }

                $appointments = $appointments->orderBy('laria_appointments.date', 'DESC')->get();

                $result = [];

                foreach($appointments as $appointment){

                    $result[] = [
                        'appointment_id' => $appointment->id,
                        'date' => $appointment->date,
                        'assisted' => $appointment->assisted,
                        'patient_curp' => $appointment->curp,
                        'patient_id' => $appointment->patient_id,
                        'patient_name' => $appointment->name,
                        'patient_lastname' => $appointment->lastname,
                        'patient_email' => $appointment->email,
                        'patient_cell' => $appointment->cell,
                        'patient_photo' => $appointment->profile_picture,
                        'patient_birthday' => $appointment->birthday,
                        'patient_sex' => $appointment->sex,
                        'patient_seguro_medico' => $appointment->seguro_medico,
                        'user_type' => 'patient'
                    ];
                }

                return $result;

                break;
            case 2:

                $patient = Patient::where('user_id', $user_id)->first();

                return self::where('patient_id', $patient->id)->get();

                break;

        }

    }

    public static function upsert($id, $date, $doctor, $patient, $approved = true){

        if ($id !== null){
            $appointment = self::find($id);
        } else {
            $appointment = new self();
        }

        $appointment->date = $date;
        $appointment->doctor_id = $doctor->id;
        $appointment->patient_id = $patient->id;
        $appointment->assisted = false;
        $appointment->approved = $approved;

        $appointment->save();


        return $appointment;

    }

    public static function getPendingByDoctor($id){

        $appointments = self::with('patient', 'patient.user')
            ->where('doctor_id', $id)
            ->where('approved', false)
            ->orderBy('date', 'desc')
            ->get();

        $res = array();
        
        foreach($appointments as $ap){
            $res[] = [
                'appointment_id' => $ap->id,
                'patient_name' => $ap->patient->user->name.' '.$ap->patient->user->lastname,
                'patient_curp' => $ap->patient->curp,
                'date' => $ap->date,
            ];
        }

        return $res;
    }

    public static function getPendingByPatient($id){

        $appointments = self::with('patient', 'patient.user')
            ->where('doctor_id', $id)
            ->orderBy('date', 'desc')
            ->get();

        $res = array();

        foreach($appointments as $ap){
            $res[] = [
                'appointment_id' => $ap->id,
                'patient_name' => $ap->patient->user->name.' '.$ap->patient->user->lastname,
                'patient_curp' => $ap->patient->curp,
                'date' => $ap->date,
            ];
        }

        return $res;

    }


}
