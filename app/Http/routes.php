<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::group(['middleware' => []], function(){

    Route::get('/', [
        'as' => 'homepage',
        'uses' => 'HomeController@indexAction'
    ]);
    
    Route::get('/activate/{token}', [
        'as' => 'activate_account_action',
        'uses' => 'HomeController@activateAction'
    ]);
    
    Route::post('/activate/{token}', [
        'as' => 'post_activate_account_action',
        'uses' => 'HomeController@postActivateAction'
    ]);

});

Route::post('/api/authenticate', [
    'as' => 'post_authenticate',
    'uses' => 'AuthenticateController@authenticate'
]);

Route::post('/api/recover-password', [
    'as' => 'post_recover_password',
    'uses' => 'Auth\AuthController@postResetPasswordEmailAction'
]);

Route::get('/recover-password/{token}', [
    'as' => 'get_recover_password',
    'uses' => 'Auth\AuthController@getPasswordResetAction'
]);

Route::post('/recover-password/{token}', [
    'as' => 'post_do_recover_password',
    'uses' => 'Auth\AuthController@postPasswordResetAction'
]);

Route::get('/api/logout', [
    'as' => 'api_logout',
    'uses' => 'AuthenticateController@logoutAction'
]);

Route::get('/api/specialties', [
    'as' => 'api_specialties',
    'uses' => 'SpecsController@allAction'
]);

Route::group(['middleware' => ['jwt.auth', 'jwt.refresh'], 'prefix' => '/api'], function(){

    Route::get('/logged-user', [
        'as' => 'api_logged_user_data',
        'uses' => 'UserController@loggedUserAction'
    ]);

    Route::post('/change-password', [
        'as' => 'api_change_password',
        'uses' => 'UserController@changePasswordAction'
    ]);

    Route::post('/profile-picture', [
        'as' => 'api_profile-picture',
        'uses' => 'UserController@profilePictureAction'
    ]);

    Route::get('/appointments', [
        'as' => 'api_appointments',
        'uses' => 'DoctorController@appointmentsAction'
    ]);

    Route::get('/appointments-done', [
        'as' => 'api_appointments',
        'uses' => 'DoctorController@doneAppointmentsAction'
    ]);

    Route::post('/appointment', [
        'as' => 'api_post_appointment',
        'uses' => 'AppointmentController@postAppointmentAction'
    ]);
    
    Route::get('/appointment-details/{id}', [
        'as' => 'api_appointment_details',
        'uses' => 'AppointmentController@appointmentDetailsAction'
    ]);

    Route::post('/appointment-details/', [
        'as' => 'api_post_appointment_details',
        'uses' => 'AppointmentController@postAppointmentDetailsAction'
    ]);

    Route::post('/appointment/resources', [
        'as' => 'api_post_appointment_resources',
        'uses' => 'AppointmentController@appointmentResourcesAction'
    ]);

    Route::post('/appointment/save/ekg', [
        'as' => 'api_post_appointment_save_ekg',
        'uses' => 'AppointmentController@saveEkgReadingsAction'
    ]);

    Route::post('/appointment-request', [
        'as' => 'api_post_appointment_request',
        'uses' => 'AppointmentController@postAppointmenRequestAction'
    ]);

    Route::get('/appointment/{id}', [
        'as' => 'api_get_appointment',
        'uses' => 'AppointmentController@getAppointmentAction'
    ]);

    Route::post('/appointment/delete', [
        'as' => 'api_delete_appointment',
        'uses' => 'AppointmentController@deleteAppointmentAction'
    ]);

    Route::get('/appointments/pending', [
        'as' => 'api_pending_appointments',
        'uses' => 'AppointmentController@pendingRequestsAction'
    ]);

    Route::post('/appointment/approve', [
        'as' => 'api_delete_appointment',
        'uses' => 'AppointmentController@approveAppointmentAction'
    ]);

    Route::post('/appointments/search', [
        'as' => 'api_appointments_search',
        'uses' => 'AppointmentController@searchAction'
    ]);
    
    Route::post('/appointment/previous', [
        'as' => 'api_appointment_previous',
        'uses' => 'AppointmentController@previousAction'
    ]);

    Route::post('/patients', [
        'as' => 'api_all_patients',
        'uses' => 'PatientsController@allAction'
    ]);

    Route::get('/patient/{id?}', [
        'as' => 'api_get_patient',
        'uses' => 'PatientsController@getPatientAction'
    ]);

    Route::get('/logged-patient', [
        'as' => 'api_get_logged_patient',
        'uses' => 'PatientsController@getLoggedPatientAction'
    ]);

    Route::post('/patient/{id?}', [
        'as' => 'api_post_patient',
        'uses' => 'PatientsController@handlePostPatientAction'
    ])->where('id', '\d+');

    Route::post('/delete-patient', [
        'as' => 'api_post_delete_patient',
        'uses' => 'PatientsController@removePatientAction'
    ]);

    Route::post('/patient/move', [
        'as' => 'api_patient_move',
        'uses' => 'PatientsController@movePatientAction'
    ]);

    Route::get('/doctors', [
        'as' => 'api_all_doctors',
        'uses' => 'DoctorController@allDoctorsAction'
    ]);

    Route::get('/doctors/extended', [
        'as' => 'api_all_doctors_extended',
        'uses' => 'DoctorController@allDoctorsExtendedAction'
    ]);

    Route::get('/doctors/pending', [
        'as' => 'api_all_doctors_extended',
        'uses' => 'DoctorController@allDoctorsPendingAction'
    ]);

    Route::post('/certify', [
        'as' => 'api_certify_doctor',
        'uses' => 'DoctorController@certifyDoctorAction'
    ]);

    Route::get('/doctor/{id}', [
        'as' => 'api_doctor_profile_for_supervisor',
        'uses' => 'DoctorController@doctorProfileForSupervisorAction'
    ])->where('id', '\d+');

    Route::post('/doctor-delete', [
        'as' => 'api_delete_doctor',
        'uses' => 'DoctorController@deleteDoctorAction'
    ]);
    
    Route::post('/supervisor-profile', [
        'as' => 'api_supervisor_profile',
        'uses' => 'UserController@supervisorProfileAction'
    ]);
    
    Route::post('/pending-doctor-delete', [
        'as' => 'api_delete_pending_doctor',
        'uses' => 'DoctorController@deletePendingDoctorAction'
    ]);
    
    Route::post('/doctor/update', [
        'as' => 'post_doctor_update',
        'uses' => 'DoctorController@postDoctorUpdate'
    ]);

    Route::get('/doctor/specialties', [
        'as' => 'get_doctor_specialties',
        'uses' => 'DoctorController@getDoctorSpecialties'
    ]);

    Route::post('/doctor/specialties', [
        'as' => 'post_doctor_specialties',
        'uses' => 'DoctorController@postDoctorSpecialties'
    ]);

    Route::get('/medications', [
        'as' => 'api_all_medications',
        'uses' => 'MedicationController@allAction'
    ]);

    Route::post('/appointment-medication', [
        'as' => 'api_link_medication_to_appointment',
        'uses' => 'MedicationController@linkToAppointmentAction'
    ]);

    Route::post('/appointment-medication/remove', [
        'as' => 'api_link_medication_to_appointment',
        'uses' => 'MedicationController@removeMedicationFromAppointment'
    ]);
    
    Route::get('/user-medications', [
        'as' => 'logged_user_medications',
        'uses' => 'MedicationController@loggedUserMedicationsAction'
    ]);

    Route::post('/complete-medication', [
        'as' => 'api_complete_user_medication',
        'uses' => 'MedicationController@completeCycleAction'
    ]);
    
    Route::post('/sensors-by-date', [
        'as' => 'api_get_sensor_data',
        'uses' => 'PatientsController@getSensorDataByDate'
    ]);

});


Route::post('/register-doctor', [
    'as' => 'post_register_doctor',
    'uses' => 'DoctorController@register'
]);

//Route::get('test', [
//    'as' => 'test-action',
//    'uses' => 'HomeController@testAction'
//]);


Route::auth();


