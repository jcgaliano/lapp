<?php

namespace App\Http\Requests;

use App\Http\Requests\Request;

class LinkMedToAppointmentRequest extends Request
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
            'appointment_id' => 'required',
            'medication_id' => 'required',
            'medication_dose' => 'required',
            'medication_iterations' => 'required'
        ];
    }

}
