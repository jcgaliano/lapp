<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{

    protected $table = 'doctor';

    public $timestamps = null;

    public function specialty(){
        return $this->hasOne('App\Specialty', 'id', 'specialty');
    }

    public function second_specialty(){
        return $this->hasOne('App\Specialty', 'id', 'second_specialty');
    }

    public function user(){
        return $this->hasOne('App\User', 'id', 'user_id');
    }

    public function getSpecialties(){
        $specialties = \DB::table('doctor_speciality')
            ->where('id', $this->speciality)
            ->orWhere('id', $this->second_speciality)
            ->orderBy('speciality', 'ASC')
            ->get();

        $results = [];

        foreach($specialties as $spec){
            $results[] = [
                'id' => $spec->id,
                'name' => $spec->speciality
            ];
        }

        return $results;
    }

}
