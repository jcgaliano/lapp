<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AppointmentMedication extends Model
{
    protected $table = 'medications_appointments';

    public function medication(){
        return $this->hasOne('App\Medication', 'id', 'medication_id');
    }

    public function appointment(){
        return $this->hasOne('App\Appointment', 'id', 'appointment_id');
    }

    public static function getAssignedToPatient($patient_id){

        $results = self::query()
//            ->select('medications.medication')
            ->join('medications', 'medications.id', '=', 'medications_appointments.medication_id')
            ->join('appointments', 'appointments.id', '=', 'medications_appointments.appointment_id')
            ->where('appointments.patient_id', $patient_id)
            ->orderBy('medications_appointments.created_at', 'DESC')
            ->get([
                'medications_appointments.id',
                'medications.medication',
                'medications_appointments.dose',
                'medications_appointments.iterations',
                'medications_appointments.notes',
                'medications_appointments.created_at',
                'medications_appointments.done'
            ])->toArray();

        return $results;
    }
}
