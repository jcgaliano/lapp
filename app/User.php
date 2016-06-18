<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{

    protected $table = 'laria_users';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token', 'updated_at', 'token', 'refresh_token'
    ];

    public static function findByEmail($email){

        return self::where('email', $email)->first();

    }

    public function toPublicArray($options = 0)
    {
//        $this holds the user
        $result = $this->toArray();

        $result['profile_picture'] = $result['profile_picture'] ? '/uploads/users_pictures/'.$result['profile_picture'] : '/images/default-profile.png';

        switch($this->user_type){
            case '1':
                //doctor
                $result['user_type'] = 'doctor';

                $profile = Doctor::where('user_id', $this->id)->first()->toArray();

                $result = array_merge($result, $profile);

                break;
            case '2':
                //patient
                $result['user_type'] = 'patient';

                $profile = Patient::where('user_id', $this->id)->first()->toArray();

                $result = array_merge($result, $profile);

                break;
            case '3':
                //supervisor
                $result['user_type'] = 'supervisor';

                $profile = Supervisor::where('user_id', $this->id)->first()->toArray();

                $result = array_merge($result, $profile);

                break;
        }

        return $result;
    }

}
