<?php

namespace App\Http\Requests;

use App\Http\Requests\Request;

class AppointmentFormRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $user = \Auth::getUser();

        return $user->user_type == 1;
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
            'patient' => 'required|numeric'
        ];
    }

    public function messages()
    {
        return [
            'date.required' => 'Este campo es obligatorio',
            'patient.required' => 'Este campo es obligatorio',
            'patient.numeric' => 'Este valor es inválido',
        ];
    }
}
