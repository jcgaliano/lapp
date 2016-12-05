<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{

    protected $table = 'patient';

    public $timestamps = null;

    protected $hidden = [
        'user_id'
    ];

    public function user(){
        return $this->hasOne('App\User', 'id', 'user_id');
    }

    public function doctors(){
        return $this->belongsToMany('App\Doctor');
    }

    public function getByUserId($user_id){
        return self::where('user_id', $user_id)->first();
    }

    public static function allPatients($user_id, $term = null){

        $doctor = Doctor::where('user_id', $user_id)->first();

        if ($doctor){

//            $patients = DoctorPatient::with('patient', 'patient.user')->where('doctor_id', $doctor->id)->get();

            $patients = \DB::table('doctor_patient')
                ->join('patient', 'patient.id', '=', 'doctor_patient.patient_id')
                ->join('users', 'patient.user_id', '=', 'users.id')
                ->where('doctor_patient.doctor_id', $doctor->id);

            if ($term && is_array($term)){

                $patients = $patients->where(function($query) use($term, &$patients){

                    if (isset($term['name']) && $term['name']){

                        $patients = $patients->where(function($query) use ($term){
                            return $query->where('users.name', 'LIKE', '%'.$term['name'].'%')
                                ->orWhere('users.lastname', 'LIKE', '%'.$term['name'].'%');
                        });

                    }

                    if (isset($term['medical_insurance']) && $term['medical_insurance']){
                        $patients = $patients->where('patient.medical_insurance', 'LIKE', '%'.$term['medical_insurance'].'%');
                    }

                    if (isset($term['cell']) && $term['cell']){
                        $patients = $patients->where('users.cell', 'LIKE', '%'.$term['cell'].'%');
                    }

                });

            }

            $patients = $patients->get([
                'patient.id',
                'users.name',
                'users.lastname',
                'patient.medical_insurance',
                'users.cell',
                'users.gender',
                'users.birthday',
                'users.profile_picture',
                'patient.doc_type',
                'patient.id_doc'
            ]);

            $patients = json_decode(json_encode($patients), true);

            $results = [];

            foreach($patients as $patient){
                $patient['name'] = $patient['name'].' '.$patient['lastname'];

                $results[] = $patient;

            }
            
            return $results;

        } else {
            return null;
        }
    }

    public static function findByIdentifierFields($documentation_type, $documentation, $email){

        $existent = User::with('patient', 'patient.doctors')->where('email', $email)->first();

        if (!$existent){
            $existent = self::with('user', 'doctors', 'doctors.user')->where('doc_type', $documentation_type)
                ->where('id_doc', $documentation)
                ->first();
        }

        return $existent;
    }

    public function toPublicArray(){
        $data = parent::toArray();

        if (isset($data['user'])){

            $data['email'] = $data['user']['email'];
            $data['name'] = $data['user']['name'];
            $data['lastname'] = $data['user']['lastname'];
            $data['cell'] = $data['user']['cell'];
            $data['birthday'] = $data['user']['birthday'];
            $data['gender'] = $data['user']['gender'];
            $data['user_type'] = 'patient';

            if (!$data['user']['profile_picture']){
                $data['profile_picture'] = '/images/default-profile.png';
            } else {
                $data['profile_picture'] = '/uploads/users_pictures/'.$data['user']['profile_picture'];
            }

            unset($data['user']);
        }

        return $data;
    }

    public static function existsAndBelongsToOtherDoctorResponse($patient, $doctors){
        return [
            'status' => 'need_move',
            'message' => 'El paciente que desea crear ya está creado y es atendido por otros doctores. ¿Desea agregar este paciente a los pacientes atendidos por usted?',
            'patient_id' => $patient->id,
            'existent_data' => [
                'full_name' => $patient->user->name.' '.$patient->user->lastname,
                'email' => $patient->user->email,
                'doctors' => $doctors,
            ]
        ];

    }

    public static function existsAndBelongsToTheLoggedDoctorResponse($patient){
        return [
            'status' => 'exists',
            'message' => 'El paciente que desea crear ya está en su listado de pacientes',
            'patient_id' => $patient->id,
            'patient_data' => [
                'full_name' => $patient->user->name.' '.$patient->user->lastname,
                'email' => $patient->user->email,
            ]
        ];
    }

    public static function existsAndHavesNoDoctorResponse($patient){
        return [
            'status' => 'need_move',
            'message' => 'El paciente que desea crear ya existe y no es atendido por ningún doctor. ¿Desea incluirlo a sus pacientes?',
            'patient_id' => $patient->id,
            'patient_data' => [
                'full_name' => $patient->user->name.' '.$patient->user->lastname,
                'email' => $patient->user->email,
            ]
        ];
    }

}
