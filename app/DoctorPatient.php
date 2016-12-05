<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DoctorPatient extends Model
{
    protected $table = 'doctor_patient';

    public function patient(){
        return $this->belongsTo('App\Patient', 'patient_id', 'id');
    }

    public function doctor(){
        return $this->belongsTo('App\Doctor', 'doctor_id', 'id');
    }
}
