<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{

    protected $table = 'laria_doctor';

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

}
