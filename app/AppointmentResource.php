<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AppointmentResource extends Model
{

    protected $table = 'appointment_resource';

    public static function removeFromPatient($patient_id){

        $rq = self::query()
            ->join('appointments', 'appointments.id', '=', 'appointment_resource.appointment_id')
            ->where('appointments.patient_id', '=', $patient_id)
            ->get();

        dd($rq);


    }

}
