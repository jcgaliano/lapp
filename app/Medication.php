<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Medication extends Model
{
    protected $table = 'medications';

    public static function allMeds(){
        return self::all()->toArray();
    }
}
