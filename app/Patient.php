<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{

    protected $table = 'laria_patient';

    public $timestamps = null;

    protected $hidden = [
        'user_id'
    ];

    public function user(){
        return $this->hasOne('App\User', 'id', 'user_id');
    }

    public static function allPatients(){

        $patients = self::with('user')->get();

        return $patients;

    }
}
