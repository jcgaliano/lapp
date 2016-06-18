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

});

Route::post('/api/authenticate', [
    'as' => 'post_authenticate',
    'uses' => 'AuthenticateController@authenticate'
]);

Route::group(['middleware' => ['jwt.auth', 'jwt.refresh'], 'prefix' => '/api'], function(){

    Route::get('/logged-user', [
        'as' => 'api_logged_user_data',
        'uses' => 'UserController@loggedUserAction'
    ]);

    Route::post('/profile-picture', [
        'as' => 'api_profile-picture',
        'uses' => 'UserController@profilePictureAction'
    ]);

    Route::get('/appointments', [
        'as' => 'api_appointments',
        'uses' => 'DoctorController@appointmentsAction'
    ]);

    Route::post('/appointment', [
        'as' => 'api_post_appointment',
        'uses' => 'AppointmentController@postAppointmentAction'
    ]);
    
    Route::post('/appointment/request', [
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
        'as' => 'api_delete_appointment',
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

    Route::get('/patients', [
        'as' => 'api_all_patients',
        'uses' => 'PatientsController@allAction'
    ]);

    Route::get('/doctors', [
        'as' => 'api_all_doctors',
        'uses' => 'DoctorController@allDoctorsAction'
    ]);

});


Route::post('/register-doctor', [
    'as' => 'post_register_doctor',
    'uses' => 'DoctorController@register'
]);

Route::get('test', [
    'as' => 'test-action',
    'uses' => 'HomeController@testAction'
]);


Route::auth();


