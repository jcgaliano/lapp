<?php

namespace App\Http\Requests;

use App\Http\Requests\Request;

class AddAppointmentReqRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $user = \Auth::getUser();

        return $user->user_type == 2 || $user->user_type == 1;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'date' => 'required',
            'doctor' => 'required',
        ];
    }

    public function messages(){
        return [
            'date.required' => 'Debe especificar la fecha para la solicitud de cita',
            'doctor.required' => 'Debe seleccionar el doctor para la solicitu de cita'
        ];
    }
}
