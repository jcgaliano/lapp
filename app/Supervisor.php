<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Supervisor extends Model
{

    protected $table = 'supervisor';

    public $timestamps = null;

    protected $hidden = [
        'id',
        'user_id'
    ];

}
