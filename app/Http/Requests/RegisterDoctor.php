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
            'email' => 'required|email|unique:users,email',
            'name' => 'required',
            'password' => 'required',
            'password_confirm' => 'required|same:password',
            'lastname' => 'required',
            'spec_1' => 'required',
            'pl' => 'required|unique:doctor,professional_license',
            'dni' => 'required|unique:doctor,cedula'
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
            'pl.unique' => 'Ya existe una cuenta con esta licencia profesional en nuestro sistema',
            'dni.required' => 'Este campo es obligatorio',
            'dni.unique' => 'Ya existe una cuenta con el DNI especificado en nuestro sistema',
            'password.required' => 'Este campo es obligatorio',
            'password_confirm.required' => 'Este campo es obligatorio',
            'password_confirm.same' => 'Las contraseñas deben coincidir',
        ];
    }
}
