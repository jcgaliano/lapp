<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    protected $table = 'appointments';

    public function doctor(){
        return $this->hasOne('App\Doctor', 'id', 'doctor_id');
    }

    public function patient(){
        return $this->hasOne('App\Patient', 'id', 'patient_id');
    }

    public function medications(){
        return $this->hasMany('App\AppointmentMedication');
    }

    public function area(){
        return $this->hasOne('App\Specialty', 'id', 'area_id');
    }
    
    public static function getAppointmentsByUser($user, $filter_criteria = null, $filter_assisted = null){

        switch($user->user_type){
            case 1:

                $doctor = Doctor::where('user_id', $user->id)->first();

                $appointments = self::query()
                    ->select(
                        \DB::raw('laria_appointments.id , laria_appointments.date, laria_appointments.assisted, 
                                  laria_patient.doc_type, laria_patient.id_doc, laria_users.id as patient_id, laria_users.name as name, laria_users.lastname as lastname, laria_users.email as email, laria_users.cell as cell,
                                  laria_users.profile_picture as patient_photo, laria_users.birthday, laria_users.gender, laria_patient.medical_insurance')
                    )
                    ->join('doctor', 'appointments.doctor_id', '=', 'doctor.id')
                    ->join('patient', 'appointments.patient_id', '=', 'patient.id')
                    ->join('users', 'patient.user_id', '=', 'users.id')
                    ->where('appointments.doctor_id', $doctor->id);

                if (in_array($filter_assisted, ['0', '1', '-1'])){

                    if ($filter_assisted == -1){
                        $appointments = $appointments->whereNull('appointments.assisted');
                    } else {
                        $appointments = $appointments->where('appointments.assisted', '=', $filter_assisted);
                    }

                }

                if ($filter_criteria){

                    $appointments = $appointments->whereRaw('CONCAT(laria_users.name, laria_users.lastname) LIKE "%'.$filter_criteria.'%"');
                }

                $appointments = $appointments->orderBy('appointments.date', 'DESC')->get();

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
                        'patient_gender' => $appointment->gender,
                        'patient_medical_insurance' => $appointment->medical_insurance,
                        'user_type' => 'patient'
                    ];
                }

                return $result;

                break;
            case 2:

                $patient = Patient::where('user_id', $user->id)->first();

                $appointments = self::query()
                    ->select(
                        \DB::raw('laria_appointments.id , laria_appointments.date, laria_appointments.assisted, laria_users.name, laria_users.lastname, laria_doctor_speciality.speciality')
                    )
                    ->join('doctor', 'appointments.doctor_id', '=', 'doctor.id')
                    ->join('users', 'doctor.user_id', '=', 'users.id')
                    ->leftJoin('doctor_speciality', 'appointments.area_id', '=', 'doctor_speciality.id')
                    ->where('appointments.patient_id', $patient->id)
                    ->where('appointments.approved', true)
                    ->orderBy('appointments.date', 'DESC');

                if (in_array($filter_assisted, ['0', '1', '-1'])){

                    if ($filter_assisted == -1){
                        $appointments = $appointments->whereNull('appointments.assisted');
                    } else {
                        $appointments = $appointments->where('appointments.assisted', '=', $filter_assisted);
                    }

                }

                $appointments = $appointments->get();

                return $appointments;

                break;

        }

    }

    public static function upsert($id, $date, $doctor, $patient, $area_id, $approved = true){

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
        $appointment->area_id = $area_id;

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

        $appointments = self::with('patient', 'patient.user', 'doctor', 'doctor.user', 'area')
            ->where('patient_id', $id)
            ->where('approved', '<>', true)
            ->orderBy('date', 'desc')
            ->get();

        $res = array();

        foreach($appointments as $ap){
            $res[] = [
                'appointment_id' => $ap->id,
                'patient_name' => $ap->patient->user->name.' '.$ap->patient->user->lastname,
                'patient_curp' => $ap->patient->curp,
                'date' => $ap->date,
                'doctor' => $ap->doctor->user->name.' '.$ap->doctor->user->lastname,
                'area' => $ap->area ? $ap->area->speciality : ''
            ];
        }

        return $res;

    }

    public static function getDetailsForId($id){

        $appointment = self::with('patient', 'patient.user', 'doctor', 'doctor.user', 'medications', 'medications.medication')->where('id', $id)->first();

        return $appointment->toArray();

    }

    public static function getPatientPrevious($appointment_id){

        $appointment = self::find($appointment_id);

        sleep(2);

        $siblings = \DB::table('appointments')
            ->where('patient_id', $appointment->patient_id)
            ->where('appointments.id', '<>', $appointment_id)
            ->where('appointments.date', '<', $appointment->date)
            ->where('appointments.approved', '=', 1)
            ->where('appointments.assisted', '=', 1)
            ->join('doctor', 'appointments.doctor_id', '=', 'doctor.id')
            ->join('users', 'doctor.user_id', '=', 'users.id')
            ->leftJoin('doctor_speciality', 'appointments.area_id', '=', 'doctor_speciality.id')
            ->get([
                'appointments.id',
                'users.name',
                'users.lastname',
                'doctor_speciality.speciality',
                'appointments.date'
            ]);

        $results = [];

        foreach($siblings as $sib){
            $results[] = [
                'id' => $sib->id,
                'name' => $sib->name,
                'lastname' => $sib->lastname,
                'area' => $sib->speciality,
                'date' => $sib->date
            ];
        }

        return $results;
    }

    public static function getSensorDataByDate($patient_id, $sensor_name, $start_date, $end_date){

        $results = self::query()
            ->join('appointment_resource', 'appointments.id', '=', 'appointment_resource.appointment_id')
            ->where('appointments.patient_id', $patient_id)
            ->where('appointment_resource.resource_type', 'sensors')
            ->orderBy('appointment_resource.created_at', 'DESC');

        if ($start_date){
            $results = $results->where('appointment_resource.created_at', '>=', $start_date);
        }

        if ($end_date){
            $results = $results->where('appointment_resource.created_at', '<=', $end_date);
        }

        $results = $results->get([
            'appointment_resource.resource',
            'appointment_resource.created_at'
        ]);


        $sensor_data = [
            'values' => [],
            'labels' => []
        ];

        foreach ($results as $res){

            $values = json_decode($res['resource'], true);

            if (isset($values[$sensor_name])){
                $sensor_data['values'][] = $values[$sensor_name];
                $sensor_data['labels'][] = $res->created_at->format('Y/m/d H:i:s');
            }

        }

        return $sensor_data;

    }

}
