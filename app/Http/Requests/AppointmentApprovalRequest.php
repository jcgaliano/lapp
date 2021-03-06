<?php

namespace App\Http\Requests;

use App\Http\Requests\Request;

class AppointmentApprovalRequest extends Request
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
            'id' => 'required|numeric'
        ];
    }

    public function messages()
    {
        return [
            'id.required' => 'Este campo es obligatorio',
            'id.numeric' => 'Cita inválida'
        ];
    }


}
