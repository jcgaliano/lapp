<?php

namespace App\Http\Requests;

use App\Http\Requests\Request;

class RegisterDoctor extends Request
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
            'email' => 'required|email|unique:laria_users,email',
            'name' => 'required',
            'password' => 'required',
            'password_confirm' => 'required|same:password',
            'lastname' => 'required',
            'spec_1' => 'required',
            'pl' => 'required',
            'dni' => 'required'
        ];
    }

    public function messages()
    {
        return [
            'email.required' => 'Este campo es obligatorio',
            'email.email' => 'Debe escribir un email válido',
            'email.unique' => 'Ya existe una cuenta registrada con esa dirección',
            'name.required' => 'Este campo es obligatorio',
            'lastname.required' => 'Este campo es obligatorio',
            'spec_1.required' => 'Este campo es obligatorio',
            'pl.required' => 'Este campo es obligatorio',
            'dni.required' => 'Este campo es obligatorio',
            'password.required' => 'Este campo es obligatorio',
            'password_confirm.required' => 'Este campo es obligatorio',
            'password_confirm.same' => 'Las contraseñas deben coincidir',
        ];
    }
}
