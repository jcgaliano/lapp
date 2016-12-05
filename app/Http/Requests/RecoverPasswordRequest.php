<?php

namespace App\Http\Requests;

use App\Http\Requests\Request;

class RecoverPasswordRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'password' => 'required',
            'password_confirm' => 'required|same:password'
        ];
    }

    public function messages()
    {
        return [
            'password.required' => 'Este campo es obligatorio',
            'password_confirm.required' => 'Este campo es obligatorio',
            'password_confirm.same' => 'Las contraseñas deben coincidir'
        ];
    }


}
