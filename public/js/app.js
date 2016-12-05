angular.module('Platease', [
    'ui.bootstrap',
    'ui.router',
    'ngCookies',
    'chart.js',
    'angularMoment',
    'textAngular',
    'angular-loading-bar',
    'truncate',
    'ng-bs3-datepicker',
    'angular-jwt',
    'satellizer',
    'angular-storage',
    'ngFileUpload',
    'btford.socket-io'
]);

angular.module('Platease').constant('angularMomentConfig', {
    preprocess: 'utc', // optional
    timezone: 'UTC' // optional
})
    .constant('BASE_URL', '/')
    .constant('ROLES', {
        supervisor: 'supervisor',
        patient: 'patient',
        doctor: 'doctor'
    })
    .config(['$httpProvider', 'jwtInterceptorProvider', '$authProvider', '$locationProvider', function ($httpProvider, jwtInterceptorProvider, $authProvider, $locationProvider) {

        $authProvider.baseUrl = '/';
        $authProvider.loginUrl = 'api/authenticate';

        // jwtInterceptorProvider.authHeader = 'Authorization';
        //
        // jwtInterceptorProvider.tokenGetter = function(store){
        //     return 'Bearer ' + store.get('satellizer_token');
        // };
        //
        // $httpProvider.interceptors.push('jwtInterceptor');

        // $locationProvider.html5Mode(true);
    }]);

'use strict';

/**
 * Route configuration for the RDash module.
 */
angular.module('Platease').config(['$stateProvider', '$urlRouterProvider', '$httpProvider', 'ROLES',
    function($stateProvider, $urlRouterProvider, $httpProvider, ROLES) {

        $httpProvider.defaults.useXDomain  = false;

        // For unmatched routes

        $urlRouterProvider.otherwise('/appointments');

        $stateProvider
            .state('login', {
                templateUrl: '/templates/login_template.html',
            })
            .state('login.form', {
                url: '/login',
                templateUrl: '/templates/login.html',
                controller: 'LoginController'
            })
            .state('login.register', {
                url: '/register',
                templateUrl: '/templates/register.html',
                controller: 'RegisterController',
                resolve: {
                    specialties: ['Specialty', function(Specialty){
                        return Specialty.getAll();
                    }]
                }
            })
            .state('login.recover', {
                url: '/recover-password',
                templateUrl: '/templates/recover.html',
                controller: 'RecoverController'
            })
            .state('logout', {
                url: '/logout',
                controller: 'LogoutController'
            })
            .state('index', {
                templateUrl: '/templates/index_template.html',
                controller: 'GlobalController',
                resolve: {
                    user: ['UserData', function(UserData){
                        return UserData.getData();
                    }],
                    specialties: ['Specialty', function(Specialty){
                        return Specialty.getAll();
                    }]
                },
                data: {
                    authorizedRoles: [ROLES.admin, ROLES.patient, ROLES.doctor]
                }
            })
            .state('index.appointments', {
                url: '/appointments',
                controller: 'AppointmentsController',
                templateUrl: '/templates/appointments.html',
                resolve: {
                    user_appointments: ['Appointments', function(Appointments){
                        return Appointments.getAllAppoiments();
                    }]
                }
            })
            .state('index.appointments_add', {
                url: '/appointments/new',
                controller: 'NewAppointmentController',
                templateUrl: '/templates/newAppointment.html',
                resolve: {
                    patients: ['Patients', function(Patients){
                        return Patients.getAllPatients();
                    }],
                    appointment: function(){
                        return null;
                    },
                    specialties: ['Doctor', function(Doctor){
                        return Doctor.getDoctorSpecialties();
                    }]
                }
            })
            .state('index.appointment_details', {
                url: '/appointment-details/:id',
                controller: 'appointmentDetailsController',
                templateUrl: '/templates/appointments_user.html',
                resolve: {
                    appointment: ['Appointments', '$stateParams', function(Appointments, $stateParams){
                        return Appointments.getAppointmentDetails($stateParams.id);
                    }],
                    medications: ['Medications', function(Medications){
                        return Medications.getAllMedications();
                    }]
                }
            })
            .state('index.appointments_edit', {
                url: '/appointments/edit/:id',
                controller: 'NewAppointmentController',
                templateUrl: '/templates/newAppointment.html',
                resolve: {
                    patients: ['Patients', function(Patients){
                        return Patients.getAllPatients();
                    }],
                    appointment: ['Appointments', '$stateParams', function(Appointments, $stateParams){
                        return Appointments.getById($stateParams.id);
                    }],
                    specialties: ['Doctor', function(Doctor){
                        return Doctor.getDoctorSpecialties();
                    }]
                }
            })
            .state('index.appointment_requests', {
                url: '/appointment-requests',
                controller: 'UnapprovedAppointmentsController',
                templateUrl: '/templates/solicitarappointments.html',
                resolve: {
                    apmt_requests: ['Appointments', function(Appointments){
                        return Appointments.getPendingRequests();
                    }]
                }
            })
            .state('index.appointment_requests_add', {
                url: '/appointment-requests/add',
                controller: 'NewAppointmentRequestController',
                templateUrl: '/templates/newAppointmentRequest.html',
                resolve: {
                    doctors: ['Doctor', function(Doctor){
                        return Doctor.getAllDoctors();
                    }],
                }
            })
            .state('index.doctor_profile', {
                url: '/doctor-profile',
                controller: 'update_DoctorController',
                templateUrl: '/templates/update_profile.html',
                resolve: {
                    specialties: ['Specialty', function(Specialty){
                        return Specialty.getAll();
                    }]
                }
            })
            .state('index.patients', {
                url: '/patients',
                controller: 'PatientsController',
                templateUrl: '/templates/patients.html'
            })
            .state('index.patients_add', {
                url: '/patients/edit/:id',
                controller: 'AddPatientController',
                templateUrl: '/templates/patient.html',
                resolve: {
                    patient: ['Patients', '$stateParams', function(Patients, $stateParams){

                        if (undefined !== $stateParams.id && $stateParams.id){
                            return Patients.getById($stateParams.id);
                        } else {
                            return null;
                        }

                    }]
                }
            })
            .state('index.patient_profile', {
                url: '/patient-profile',
                controller: 'PatientProfileController',
                templateUrl: '/templates/patient_profile.html',
                resolve: {
                    patient: ['Patients', function(Patients){
                        return Patients.getLoggedPatient();
                    }]
                }
            })
            .state('index.patient_medications', {
                url: '/patient-medications',
                controller: 'PatientMedicationsController',
                templateUrl: '/templates/patient_medications.html',
                resolve: {
                    meds: ['Medications', function(Medications){
                        return Medications.getCurrentForUser();
                    }]
                }
            })
            .state('index.supervisor_profile', {
                url: '/supervisor-profile',
                controller: 'SupervisorProfileController',
                templateUrl: '/templates/update_profile_supervisor.html',
            })
            .state('index.monitoring', {
                url: '/monitoring',
                controller: 'sensorsController',
                templateUrl: '/templates/sensors.html'
            })
            .state('index.patient_appointment_details', {
                url: '/done-appointments',
                controller: 'AppointmentSummaryController',
                templateUrl: '/templates/appointment_details.html',
                resolve: {
                    user_appointments: ['Appointments', function(Appointments){
                        return Appointments.getDoneAppoiments();
                    }]
                }
            })
            .state('index.patient_appointment_summary', {
                url: '/appointments-summary/:id',
                controller: 'PreviousAppointmentController',
                templateUrl: '/templates/previous_appointment.html',
                resolve: {
                    appointment: ['Appointments', '$stateParams', function(Appointments, $stateParams){
                        return Appointments.getAppointmentDetails($stateParams.id);
                    }]
                }
            })
            .state('index.patient_appointment_summary_with_referer', {
                url: '/appointments-summary/:id/:appointmentId',
                controller: 'PreviousAppointmentController',
                templateUrl: '/templates/previous_appointment.html',
                resolve: {
                    appointment: ['Appointments', '$stateParams', function(Appointments, $stateParams){
                        return Appointments.getAppointmentDetails($stateParams.id);
                    }]
                }
            })
            .state('index.super_doctors', {
                url: '/doctors',
                templateUrl: '/templates/doctors_new.html',
                controller: 'DoctorsController',
                resolve: {
                    doctors: ['Doctor', function(Doctor){
                        return Doctor.getAllDoctorsExtended();
                    }]
                }
            })
            .state('index.super_pending_doctors', {
                url: '/doctors-pending',
                templateUrl: '/templates/doctors_pending.html',
                controller: 'PendingDoctorsController',
                resolve: {
                    pending_doctors: ['Doctor', function(Doctor){
                        return Doctor.getAllPendingDoctors();
                    }]
                }
            })
            .state('index.super_doctor_profile', {
                url: '/doctor/:id',
                templateUrl: '/templates/doctor_profile.html',
                controller: 'SupervisorDoctorProfileController',
                resolve: {
                    doctor: ['Doctor', '$stateParams', function(Doctor, $stateParams){
                        return Doctor.getDoctorProfile($stateParams.id);
                    }],
                    specialties: ['Specialty', function(Specialty){
                        return Specialty.getAll();
                    }]
                }
            })
            .state('index.super_pending_doctor_profile', {
                url: '/pending-doctor/:id',
                templateUrl: '/templates/doctor_small.html',
                controller: 'SupervisorSmallDoctorProfileController',
                resolve: {
                    doctor: ['Doctor', '$stateParams', function(Doctor, $stateParams){
                        return Doctor.getDoctorProfile($stateParams.id);
                    }],
                    specialties: ['Specialty', function(Specialty){
                        return Specialty.getAll();
                    }]
                }
            })
        ;
    }
]).run(['$state', '$rootScope', '$http', '$timeout', '$cookies','$cookieStore', '$location', '$auth',
    function($state, $rootScope, $http, $timeout, $cookies, $cookieStore, $location, $auth){

    $rootScope.$on('$stateChangeStart', function(evt, to){
        if (undefined !== to.data && undefined !== to.data.authorizedRoles && to.data.authorizedRoles.length > 0){
            if (!$auth.isAuthenticated()){
                evt.preventDefault();
                $state.go('login.form');
            }
        }
    });
}]);
angular.module('Platease')
    .controller('GlobalController', ['$scope', 'user', '$timeout','UserData', 'specialties', '$state', '$modal', function($scope, user, $timeout, UserData, specialties, $state, $modal){

        $scope.user = user;

        var updateSpecialty = function(){

            for(var i in specialties){
                if ($scope.user.speciality && specialties[i].id == $scope.user.speciality){
                    $scope.specialty_text = specialties[i].speciality;
                }

                if ($scope.user.second_speciality && specialties[i].id == $scope.user.second_speciality){
                    $scope.second_specialty_text = specialties[i].speciality;
                }
            }

        };

        if (user.user_type == 'doctor' || user.user_type == 'supervisor'){
            updateSpecialty();
        }

        $scope.navigationActiveClass = function(state){

            if ((typeof state) == 'string'){
                return state == $state.current.name ? ' active ' : '';
            }

            if ((typeof state) == 'object'){
                return state.indexOf($state.current.name) != -1  ? ' active ' : '';
            }

        };

        // main events
        $scope.$on('profile_updated', function(){
            $timeout(function(){
                $scope.$apply(function(){
                    $scope.user = UserData.getData();

                    if ($scope.user.user_type == 'doctor' || user.user_type == 'supervisor'){
                        updateSpecialty();
                    }

                });
            }, 0);
        });

        $scope.triggerPasswordChange = function(){
            $modal.open({
                animation: true,
                templateUrl: '/templates/changePasswordModal.html',
                controller: 'changePasswordController',
                backdrop: true,
                size: 'md',
                keyboard: false,
            }).result.then(function () {

            }, function () {

            });
        };

    }])
    .controller('changePasswordController', ['$scope', '$modalInstance', 'UserData',function($scope, $modalInstance, UserData){
        $scope.credentials = {
            new_password: '',
            new_password_conf: ''
        };

        $scope.changePassword = function(){

            $("#password-form").
            validate({
                rules: {
                    password: {
                        required: true,
                        minlength: 5
                    },
                    password_conf: {
                        required: true,
                        minlength: 5,
                        equalTo: '#password'
                    }
                }
            });

            if ($('#password-form').valid()){

                UserData.changePassword($scope.credentials.new_password, $scope.credentials.new_password_conf)
                    .then(function(res){
                        if (res.status == 'success'){
                            toastr.success(res.message);
                            $modalInstance.close();
                        }
                    }, function(){
                        toastr.error('Ha ocurrido un error al cambiar la contraseña');
                    });
            }

        };

    }]);
angular.module('Platease')
    .controller('LoginController', ['$auth', '$state', '$scope', '$rootScope', 'store', 'UserData' ,function($auth, $state, $scope, $rootScope, store, UserData){

        $scope.credentials = {
            email: '',
            password: ''
        };

        if (angular.element(document.getElementById('error_message')).length > 0){
            $scope.auth_message = angular.element(document.getElementById('error_message'))[0].value;
        }

        if (angular.element(document.getElementById('success_message')).length > 0){
            $scope.success_message = angular.element(document.getElementById('success_message'))[0].value;
        }

        $scope.tryLogin = function(){
            $auth.login($scope.credentials)
                .then(function(res){
                    if (undefined !== res.data.token && res.data.token ){

                        var ud = UserData.getData();

                        if (undefined !== ud.then){

                            ud.then(function(userData){

                                switch(userData.user_type){
                                    case 'patient':
                                    case 'doctor':
                                        $state.go('index.appointments');
                                        break;
                                    case 'supervisor':
                                        $state.go('index.super_doctors');
                                        break;
                                }

                            });

                        } else {
                            
                            switch(ud.user_type){
                                case 'patient':
                                case 'doctor':
                                    $state.go('index.appointments');
                                    break;
                                case 'supervisor':
                                    $state.go('index.super_doctors');
                                    break;
                            }

                        }

                    } else {

                        if (undefined !== res.data.message){
                            $scope.auth_message = res.data.message;
                        } else {
                            $scope.auth_message = 'Las credenciales utilizadas son inválidas';
                        }

                    }
                }, function(err){

                    switch(err.status){
                        case 401:
                            $scope.auth_message = 'Las credenciales utilizadas son inválidas';
                            break;
                        case 500:
                            $scope.auth_message = 'Ha ocurrido un error al realizar el inicio de sesión';
                            break;
                    }
                });
        };
    }])
    .controller('RegisterController', ['$scope', 'specialties', 'UserData', 'dialog', '$state', function($scope, specialties, UserData, dialog, $state){

        $scope.specialties = specialties;

        $scope.registerUser = function(){

            $('#register-form').validate({
                rules: {
                    email: {
                        required: true,
                        email: true
                    },
                    password: {
                        required: true
                    },
                    password_confirm: {
                        required: true,
                        equalTo: '#password'
                    },
                    name: 'required',
                    lastname: 'required',
                    spec_1: 'required',
                    pl: 'required',
                    dni: 'required'
                }
            });

            if ($('#register-form').valid()){

                UserData.registerUser($scope.user)
                    .then(function(res){
                        if (res.status == 'success'){
                            dialog.alert('Aviso', res.message).then(function(){
                                $state.go('login.form');
                            });
                        } else {
                            dialog.alert('Aviso', res.message).then(function(){

                            });
                        }
                    }, function(data){
                        if (data instanceof Object){

                            var messages = [];

                            for (var key in data){
                                if (data[key]){
                                    messages.push('<li>' + data[key]);
                                }
                            }

                            if (messages.length > 0){

                                dialog.alert('Aviso', 'Ha ocurrido un error al procesar el registro. Revise los siguientes datos: <br><ul class="modal-error-list">' + messages.join('</li>') + '</ul>');

                            } else {
                                dialog.alert('Aviso', 'Ha ocurrido un error al procesar el registro. Inténtelo nuevamente');
                            }


                        } else {
                            dialog.alert('Aviso', 'Ha ocurrido un error al procesar el registro. Inténtelo nuevamente');
                        }
                    });

            }

        };

    }])
    .controller('RecoverController', ['$scope', 'UserData', function($scope, UserData){

        $scope.email = '';

        $scope.doRecoverPassword = function(){

            $('#recover-form').validate({
                rules: {
                    email: {
                        required: true,
                        email: true
                    }
                }
            });

            if ($('#recover-form').valid()){

                UserData.recoverPassword($scope.email)
                    .then(function(res){
                         if (res.status == 'success'){
                             $scope.showSuccess = true;
                             $scope.successMessage = res.message;
                         } else {
                             $scope.showError = true;
                             $scope.errorMessage = res.message;
                         }
                    }, function(){
                        $scope.showError = true;
                        $scope.errorMessage = 'Ha ocurrido un error al restablecer la contraseña. Inténtelo nuevamente';
                    });

            }

        };

    }])
    .controller('LogoutController', ['$auth', '$state', 'UserData', function($auth, $state, UserData){

        UserData.logout().then(function(){

            UserData.clearData();

            $auth.logout();

            $state.go('login.form');
        });

    }]);

angular.module('Platease')
    .controller('MainController', ['$rootScope','$scope', '$state', 'UserData', 'Doctor_Especiality', '$timeout', 'SensorData', function($rootScope, $scope, $state, UserData, Doctor_Especiality, $timeout, SensorData){
        $scope.state_name = $state.current.name;

        $rootScope.$on('$locationChangeSuccess', function(e){
            $scope.state_name = $state.current.name;
        });

        $scope.navigationActiveClass = function(stateName){
            return stateName == $state.current.name ? ' active ' : '';
        };

        UserData.then(function(data){
            var date = Date.now();
            $scope.user_data = data[0];
            $scope.user_data.profile_picture = $scope.user_data.profile_picture+"?="+date;

            if($scope.user_data.user_type == 'doctor'){
                Doctor_Especiality.getADoctorEspeciality($scope.user_data.speciality).then(function(doctor_speciality){
                    $scope.doctor_speciality = doctor_speciality;
                }, function(){});
                Doctor_Especiality.getADoctorEspeciality($scope.user_data.second_speciality).then(function(doctor_speciality){
                    $scope.doctor_second_speciality = doctor_speciality;
                }, function(){});
            }
            if($scope.user_data.user_type == 'supervisor'){
               $state.go('doctors');
            }
        }, function(){

        });


        $scope.actual_date  = new Date();



        //$scope.getsensorsdata = function(){
        //    $timeout(function(){
        //        SensorData.getSensorData().then(function(sensors){
        //            console.log(sensors);
        //            toastr.success('ok');
        //        }, function(){
        //            toastr.error('Error al contactar con los sensores');
        //        });
        //        $scope.getsensorsdata();
        //    }, 5000);
        //};
        //$scope.getsensorsdata();


    }]);
angular
    .module('Platease')
    .controller('AppointmentsController', ['$scope', 'Appointments', '$q', 'Patients', '$http', '$modal', '$stateParams', 'user_appointments', 'dialog', function ($scope, Appointments, $q, Patients, $http, $modal, $stateParams, user_appointments, dialog) {

        $scope.cantRecordsByPages = 10;

        $scope.assited = false;

        $scope.appointments = user_appointments;

        toastr.options.closeButton = true;

        $scope.setAssisted = function(assisted){
            $scope.assisted = assisted;
            $scope.toSearch()
        };

        $scope.termFilter = function(criteria){
            $scope.criterial = criteria;
            $scope.toSearch();
        };

        $scope.toSearch = function(){

            Appointments.searchAppoiments($scope.criterial, $scope.assisted).then(function(data){

                $scope.appointments = data;

            }, function(){
                toastr.error("Error al Relizar la Operación");
            });
        };

        $scope.removeAppointment = function(appointment, index){
            dialog.confirm('Confirmación', '¿Desea eliminar la cita y todos los datos asociados a esta?')
                .then(function(res){
                    if (res == true){
                        Appointments.removeAppointment(appointment.appointment_id)
                            .then(function(res){
                                $scope.appointments.splice(index,1);
                                toastr.success(res.message);
                            }, function(res){
                                if (undefined !== res.message){
                                    toastr.error(res.message);
                                } else {
                                    toastr.error('Ha ocurrido un error al eliminar la cita');
                                }
                            });

                    }
                });
        };

    }])
    .controller('NewAppointmentController', ['$scope', 'patients', 'Appointments', '$state', 'appointment', 'specialties',function($scope, patients, Appointments, $state, appointment, specialties){

        $scope.patients = patients;

        $scope.specialties = specialties;

        if (appointment != null){
            $scope.appointment = appointment;

            $scope.date = appointment.datetime.date;

            var datetemp = new Date();

            datetemp.setHours(appointment.datetime.time[0]);
            datetemp.setMinutes(appointment.datetime.time[1]);
            $scope.time = datetemp;

        } else {

            $scope.date = new Date();

            $scope.time = new Date();
            $scope.date = $scope.time.getFullYear()+"-" + ($scope.time.getMonth() < 10 ? '0' + $scope.time.getMonth() : $scope.time.getMonth())+"-"+$scope.time.getDate();

        }

        $scope.hstep = 1;
        $scope.mstep = 1;

        $scope.options = {
            hstep: [1, 2, 3],
            mstep: [1, 5, 10, 15, 25, 30]
        };

        $scope.ismeridian = true;
        $scope.toggleMode = function() {
            $scope.ismeridian = ! $scope.ismeridian;
        };

        $scope.update = function() {
            var d = new Date();
            d.setHours( 14 );
            d.setMinutes( 0 );
            $scope.time = d;
        };

        $scope.handleInsert =function(){

            $("#appointment_form").
            validate({
                rules: {
                    patient: {
                        required: true
                    },
                    date: {
                        required: true
                    },
                    area_id: {
                        required: true
                    }
                }
            });
            if ($('#appointment_form').valid()){
                $scope.upsertAppointment();
            }
        };

        $scope.upsertAppointment = function () {

            $scope.datetime = $scope.date + " " + $scope.time.getHours() + ":" + $scope.time.getMinutes();

            Appointments.upsertAppointment(undefined !== appointment && appointment ? appointment.id : null, $scope.datetime, $scope.appointment.patient_id, $scope.appointment.area_id)
                .then(function(res){
                    toastr.success(res.message);
                    $state.go('index.appointments');
                }, function(res){
                    toastr.error(res.message);
                });
        };
    }])
    .controller('AppointmentSummaryController', ['$scope', 'user_appointments', function($scope, user_appointments){

        $scope.appointments = user_appointments;

    }])
    .controller('PreviousAppointmentController', ['$scope', 'appointment', '$stateParams', 'Appointments', 'dialog', '$modal', '$state', function($scope, appointment, $stateParams, Appointments, dialog, $modal, $state){

        if ($stateParams.appointmentId){
            $scope.previousAppointmentId = $stateParams.appointmentId;
        }

        $scope.appointment = appointment;

        $scope.loadingResources = true;

        Appointments.getResources($stateParams.id)
            .then(function(res){
                $scope.loadingResources = false;

                $scope.resources = res;

            }, function(){
                $scope.loadingResources = false;
                dialog.alert('Error', 'Ha ocurrido un error al obtener los recursos asociados a la cita');
            });

        $scope.showResource = function(resource){

            switch(resource.raw_type){
                case 'ekg':

                    if (resource.value && resource.value.length > 0){

                        $scope.ekg_data = {
                            value: resource.value
                        };

                        $modal.open({
                            animation: true,
                            templateUrl: '/templates/modal/ekgModalWithoutSave.html',
                            size: 'lg',
                            scope : $scope
                        });
                        
                    } else {
                        dialog.alert('Error', 'La vista del electrocardiograma no puede ser cargada debido a que este no contiene datos.');
                    }

                    break;
                case 'sensors':

                        $scope.hideSaveEkg = true;

                        $scope.sensors = resource.value;

                        $modal.open({
                            animation: true,
                            templateUrl: '/templates/modal/sensorsModal.html',
                            size: 'md',
                            scope: $scope
                        });

                    break;
            }

        };


    }]);
angular
    .module('Platease')
    .controller('appointmentDetailsController', ['$scope', 'appointment', 'SocketFactory', '$state', '$modal', 'medications', 'Appointments', 'dialog', function($scope, appointment, sf, $state, $modal, medications, Appointments, dialog){
        
        $scope.appointment = appointment;
        $scope.actual_date = new Date();

        $scope.device_id = appointment.patient.device_id;
        
        $scope.device_status = false;

        $scope.toggle_device = function(){
            $scope.device_status = !$scope.device_status;

            sf.emit($scope.device_status == true ? 'turnOnDevice' : 'turnOffDevice', {deviceId: $scope.device_id});
        };

        var host_down_message = 'Ha sido imposible conectar con el servidor de tiempo real. Reintentando...';

        sf = sf.init();

        sf.on('connect_error', function(){
            $scope.device_status_message = host_down_message;
        });

        sf.on('connect_timeout', function(){
            $scope.device_status_message = host_down_message;
        });

        sf.on('reconnect_error', function(){
            $scope.device_status_message = host_down_message;
        });

        sf.on('reconnect_failed', function(){
            $scope.device_status_message = host_down_message;
        });

        $scope.stopReceivingData = function(){

            sf.emit('stopReceivingData', {
                deviceId: $scope.device_id
            });

            sf.removeAllListeners();

        };

        $scope.loadingPreviousAppointments = true;

        Appointments.getPrevious(appointment.id)
            .then(function(res){
                $scope.loadingPreviousAppointments = false;
                $scope.previous_appointments = res.data;
            }, function(){
                $scope.loadingPreviousAppointments = false;
            });



        //init the socket connection listening for events
        sf.emit('connectDevice', {deviceId: $scope.device_id});

        sf.on('connectedDevice', function(data){
            $scope.bindDataEvents();
        });

        $scope.sensors = {};

        $scope.bindDataEvents = function(){

            sf.emit('readyForData', {
                dataType: {
                    sensor_data: true,
                    ekg_data: true
                }
            });

            sf.on('deviceData', function(data){

                if ((undefined !== data.sensors && data.sensors) || (undefined !== data.ekg_data && data.ekg_data)){

                    $scope.device_status_message = 'El dispositivo está transmitiendo correctamente';

                    if (undefined !== data.sensors && data.sensors){
                        //sensor data

                        for (var i in data.sensors){
                            $scope.sensors[data.sensors[i].name] = data.sensors[i].value;
                        }

                    }

                    if (undefined !== data.ekg_data && data.ekg_data){
                        for (var i in data.ekg_data){
                            $scope.ekg_data = data.ekg_data[i]
                        }
                    }

                } else {
                    $scope.device_status_message = 'Ha ocurrido un error en la transmisión con el dispositivo';
                }

            });
        };

        $scope.editMedication = function(med){

            if (undefined !== med){
                $scope.selected_med = med;
            }

            $modal.open({
                animation: true,
                templateUrl: '/templates/modal/newmedication.html',
                controller: 'MedicationFormController',
                size: 'md',
                scope : $scope,
                resolve: {
                    medications: function(){
                        return medications;
                    },
                    selected_medication: function(){
                        if (med == undefined){
                            return null;
                        } else {
                            return med;
                        }
                    }
                }
            }).result.then(function(medication){

                Appointments.linkMedicationToAppointment(undefined == med ? 'add' : 'edit', appointment.id, medication)
                    .then(function(res){
                        if (res.status == 'success'){
                            toastr.success(res.message)
                            if (med == undefined){

                                if (undefined !== $scope.appointment.medications){
                                    $scope.appointment.medications.push(res.data);
                                } else {
                                    $scope.appointment.medications = [];
                                    $scope.appointment.medications.push(res.data);
                                }

                            } else {
                                $scope.selected_med.dose = medication.dose;
                                $scope.selected_med.iterations = medication.iterations;
                                $scope.selected_med.notes = medication.notes;
                            }

                        } else {
                            toastr.error(res.message);
                        }
                    }, function(){
                        toastr.error('Ha ocurrido un error al agregar el medicamento');
                    });

            }, function(){});
        };

        $scope.removeMedication = function(med){

            dialog.confirm('Alerta', 'Estás a punto de eliminar este medicamento. ¿Deseas continuar?')
                .then(function(res){
                    if (res == true){
                        Appointments.removeMedication(med.medication_id, med.appointment_id)
                            .then(function(res){
                                if (res.status == 'success'){

                                    var pos = $scope.appointment.medications.indexOf(med);

                                    if (pos > -1){
                                        $scope.appointment.medications.splice(pos, 1);
                                    }

                                    toastr.success('El medicamento ha sido eliminado');

                                } else {
                                    toastr.error(res.message);
                                }
                            }, function(){
                                dialog.alert('Aviso', 'Ha ocurrido un error al eliminar el medicamento. Inténtelo nuevamente.')
                            });
                    }
                });

        };

        $scope.saveAppointment = function(){

            if ($scope.appointment.indications && $scope.appointment.indications.trim().length > 0){

                var readings = {
                    heart_rate: null,
                    temperature: null,
                    weight: null,
                    glucose_level: null,
                    height: null
                };

                if (undefined != $scope.sensors && $scope.sensors){

                    readings.heart_rate = $scope.sensors.heart_rate ? $scope.sensors.heart_rate : null;
                    readings.temperature = $scope.sensors.temperature ? $scope.sensors.temperature : null;
                    readings.weight = $scope.sensors.weight ? $scope.sensors.weight : null;
                    readings.glucose_level = $scope.sensors.glucose_level ? $scope.sensors.glucose_level : null;
                    readings.height = $scope.sensors.height ? $scope.sensors.height : null;

                }

                Appointments.saveIndications($scope.appointment.id, $scope.appointment.indications, readings)
                    .then(function(res){
                        if (res.status == 'success'){

                            $scope.stopReceivingData();

                            $state.go('index.appointments');

                        } else {
                            toastr.error(res.message);
                        }
                    }, function(){
                        toastr.error('Ha ocurrido un error al guardar la cita');
                    });

            } else {
                dialog.alert('Aviso', 'Para aceptar la consulta como realizada, debe llenar el campo de indicaciones.', function(){});
            }

        };

        $scope.gotoAppointments = function(){

            if ($scope.appointment.indications && $scope.appointment.indications.trim().length > 0){

                dialog.confirm('Aviso', 'Hay cambios sin guardar en esta consulta. ¿Desea abandonar la página?')
                    .then(function(res){
                        if (res == true){

                            $scope.stopReceivingData();

                            $state.go('index.appointments');

                        }
                    });

            } else {

                $scope.stopReceivingData();

                $state.go('index.appointments');

            }

        };

        $scope.seeEkg = function(){

            $modal.open({
                animation: true,
                templateUrl: '/templates/modal/ekgModal.html',
                size: 'lg',
                scope : $scope
            }).result.then(function(readings){
                if (readings !== false){
                    Appointments.saveEkgReadings($scope.appointment.id, readings)
                        .then(function(res){
                            if (res.status == 'success'){
                                toastr.success('El electrocardiograma ha sido guardado satisfactoriamente');
                            } else {
                                toastr.error(res.message);
                            }
                        }, function(){
                            dialog.alert('Alerta','Ha ocurrido un error al guardar el electrocardiograma');
                        });
                }
            });

        };

    }])
    .controller('MedicationFormController', ['$scope', 'medications', '$modalInstance', 'selected_medication', function($scope, medications, $modalInstance, selected_medication){

        $scope.medications = medications;

        $scope.selected_medication = selected_medication;

        if (selected_medication){
            $scope.newmedications = {
                medication_id: selected_medication.medication_id,
                dose: selected_medication.dose,
                iterations: selected_medication.iterations,
                notes: selected_medication.notes
            }
        }

        $scope.saveMedication = function(){

            $('#newmedication_form').validate({
                rules: {
                    medications: 'required',
                    dose: 'required',
                    iterations: 'required',
                }
            })

            if ($('#newmedication_form').valid()){

                $modalInstance.close($scope.newmedications);

            }
        }
    }]);
angular
    .module('Platease')
    .controller('medicationsController', ['$scope', 'Medication_Appointment', 'Medications', function($scope, Medication_Appointment, Medications){

        $scope.medicationseemore = false;

        $scope.seemore = function(medication_id, appointment_id){
            $scope.medicationseemore = true;

            Medication_Appointment.getAMedicationAppointmentByid(medication_id, appointment_id).then(function(medication_appointment){
                $scope.medication_appointment = medication_appointment;
            }, function(){
                toastr.success('Error al Traer la Medicación');
            });
        };

        $scope.cancelseemore = function(){
            $scope.medicationseemore = false;
        };
        Medication_Appointment.getAllMedicationsAppointmentByPatient().then(function(medications){
         $scope.medications = medications;
        }, function(){

        })
    }])
    .controller('PatientMedicationsController', ['$scope', 'meds', 'Medications', '$modal', function($scope, meds, Medications, $modal){

        $scope.medications = meds;

        $scope.medicationDone = function(medication){
            if (!medication.done){
                Medications.completeCycle(medication.id)
                    .then(function(res){
                        if (res.status == 'success'){

                            medication.done = true;

                            toastr.success('El ciclo de medicación ha sido completado satisfactoriamente');

                        } else {

                            bootbox.alert(res.message);

                        }
                    }, function(){
                        bootbox.alert('Ha ocurrido un error al intentar completar el ciclo de medicación');
                    });
            }
        };

        $scope.medicationDetails = function(medication){
            $modal.open({
                animation: true,
                template: angular.element(document.getElementById('medication-modal-template')).html(),
                controller: 'MedicationDetailsController',
                size: 'md',
                scope : $scope,
                resolve: {
                    medication: function(){
                        return medication;
                    },
                }
            });
        };
        
    }])
    .controller('MedicationDetailsController', ['$scope', 'medication', function($scope, medication){
        $scope.medication = medication;
    }]);



angular
    .module('Platease')
    .controller('sensorsController', ['$scope','$timeout', 'SensorData', 'amMoment', 'dialog', function($scope, $timeout, SensorData, amMoment, dialog){

        console.log(amMoment);

        $scope.loadingChart = false;

        $scope.loadingChartMessage = 'Cargando gráfica...';

        $scope.selectSensor = function(sensorName, displayName){

            $scope.sensorName = sensorName;

            $scope.displayName = displayName;

            // $scope.values = [];
            //
            // $scope.labels = [];

        };

        $scope.showChart = function(){

            if (!$scope.sensorName){
                dialog.alert('Aviso', 'Debe seleccionar el parámetro que desea monitorear');
                return;
            }

            var start_date = $scope.start_date ? moment($scope.start_date) : null;

            var end_date = $scope.end_date ? moment($scope.end_date) : null;


            if (start_date && end_date){
                //check date precedence
                if (!end_date.isAfter(start_date) && !end_date.isSame(start_date, 'day')){
                    dialog.alert('Error', 'La fecha final no puede ser anterior a la fecha inicial');
                    return;
                }
            }

            $scope.loadingChart = true;

            $scope.series = $scope.displayName;

            SensorData.getSensorData($scope.sensorName, $scope.start_date, $scope.end_date)
                .then(function(data){

                    if (data.values.length == 0){
                        $scope.values = [];
                        $scope.labels  = [];

                        dialog.alert('Aviso', 'Lo sentimos no hay datos registrados para el período seleccionado');

                        $scope.loadingChart = false;

                        return;
                    }

                    $scope.labels = data.labels;

                    var values = [];

                    values.push(data.values);

                    $scope.values = values;

                    $scope.loadingChart = false;

                }, function(){
                    $scope.loadingChartMessage = 'Ha ocurrido un error al cargar la gráfica';
                });

        };

    }]);


angular
    .module('Platease')
    .controller('AddPatientController', ['$scope', 'patient', 'Patients', '$state', function($scope, patient, Patients, $state){

        $scope.patient = patient ? angular.copy(patient) : { profile_picture: '/images/default-profile.png' };

        $scope.upload = function (file) {

            if (file){
                $scope.uploading = true;

                Upload.upload({
                    url: '/api/profile-picture',
                    data: {
                        file: file
                    }
                }).then(
                    function(res){
                        $scope.uploading = false;
                        if (res.data.status == 'success'){
                            $scope.patient.profile_picture = res.data.file;
                        } else {
                            alert('Ha ocurrido un error al subir la imagen');
                        }
                    },
                    function(reason){
                        $scope.uploading = false;
                    }
                );
            }
        };

        $scope.updatePatient = function(patient){

            $("#update_patient").
            validate({
                rules: {
                    email: {
                        required: true,
                        email: true
                    },
                    name: {
                        required: true,
                    },
                    lastname: {
                        required: true,
                    },
                    documentation_type: {
                        required : true
                    },
                    documentation: {
                        required : true
                    },
                    cell: {
                        required: true,
                        number: true,
                        minlength: 7
                    },
                    date: {
                        required: true
                    },
                    gender: {
                        required: true
                    },
                    city: {
                        required: true
                    },
                    street:{
                        required : true
                    },
                    origin:{
                        required : true
                    },
                    postal_code: {
                        number: true,
                        minlength: 5,
                        maxlength: 5
                    },
                    min_temp: {
                        number: true
                    },
                    max_temp: {
                        number: true
                    },
                    min_crate: {
                        number: true
                    },
                    max_crate: {
                        number: true
                    }
                }
            });
            if ($('#update_patient').valid()){

                Patients.upsertPatient($scope.patient).then(function(res){

                    if (res.status == 'success'){
                        toastr.success('Los datos han sido guardados satisfactoriamente')
                        return;
                    }
                    
                    if (res.status == 'exists'){
                        bootbox.alert(res.message);
                    }

                    if (res.status == 'need_move'){
                        bootbox.confirm(res.message, function(confirmRes){
                            if (confirmRes == true){
                                Patients.movePatient(res.patient_id)
                                    .then(function(res){
                                        if (res.status == 'success'){
                                            toastr.success(res.message);

                                            $state.go('index.patients');

                                        } else {
                                            toastr.error(res.message);
                                        }
                                    }, function(){

                                    });
                            }
                        });
                    }

                    if (res.status == 'fail'){
                        bootbox.alert(res.message);
                    }

                }, function(reason){
                    console.log('failed', arguments);
                });

            }

        };


    }])
    .controller('PatientsController', ['$scope', 'Patients', '$modal', function($scope, Patients, $modal){

        $scope.loading = true;

        $scope.actual_date = new Date();

        var fetchPatients = function(criteria){
            Patients.getPatientsByUser(criteria).
                then(function(patients){
                    $scope.patients = patients;
            }, function(){
                toastr.error('Ha ocurrido un error al obtener los pacientes');
            });
        };

        fetchPatients();

        $scope.termFilter = function(criteria){

            fetchPatients(criteria);

        };

        $scope.removePatient = function(patient, index){

            $scope.patient = patient;

            $modal.open({
                templateUrl: '/templates/modal/deletepatient.html',
                animation: true,
                size: 'md',
                scope : $scope
            }).result.then(function(res){
                if (res){
                    Patients.deletePatient(patient.id).then(function(res){

                        if (res.status == 'success'){

                            toastr.success(res.message);

                            $scope.patients.splice(index, 1);

                        } else {
                            toastr.error(res.message);
                        }

                    }, function(){
                        toastr.error('Ha ocurrido un error al eliminar el paciente, inténtelo nuevamente');
                    });
                }
            });

        };

    }])
    .controller('PatientProfileController', ['$scope', 'patient', 'Patients', '$state', 'Upload', 'UserData', function($scope, patient, Patients, $state, Upload, UserData){

        $scope.patient = patient ? angular.copy(patient) : { profile_picture: '/images/default-profile.png' };

        $scope.statuses = [
            {id: 1, value: 'Ninguno', name: 'Ninguno'},
            {id: 2, value: 'Soltero', name: 'Soltero'},
            {id: 3, value: 'Casado', name: 'Casado'},
            {id: 4, value: 'Viudo', name: 'Viudo'},
            {id: 5, value: 'Union Libre', name: 'Unión Libre'}
        ];

        $scope.selectedMaritalStatus = function(status){
            console.log(status);
            for(var i in $scope.statuses){
                if ($scope.statuses[i].value == status){
                    console.log($scope.statuses[i].id)
                    return $scope.statuses[i].id;
                }
            }
        };

        $scope.upload = function (file) {

            if (file){
                $scope.uploading = true;

                Upload.upload({
                    url: '/api/profile-picture',
                    data: {
                        file: file
                    }
                }).then(
                    function(res){
                        $scope.uploading = false;
                        if (res.data.status == 'success'){
                            $scope.patient.profile_picture = res.data.file;
                            UserData.setData(angular.copy($scope.patient));
                            $scope.$emit('profile_updated', {});
                        } else {
                            bootbox.alert('Ha ocurrido un error al subir la imagen');
                        }
                    },
                    function(reason){
                        $scope.uploading = false;
                    }
                );
            }
        };

        $scope.updatePatient = function(patient){

            $("#update_patient").
            validate({
                rules: {
                    email: {
                        required: true,
                        email: true
                    },
                    name: {
                        required: true,
                    },
                    lastname: {
                        required: true,
                    },
                    documentation_type: {
                        required : true
                    },
                    documentation: {
                        required : true
                    },
                    cell: {
                        required: true,
                        number: true,
                        minlength: 7
                    },
                    date: {
                        required: true
                    },
                    gender: {
                        required: true
                    },
                    city: {
                        required: true
                    },
                    street:{
                        required : true
                    },
                    origin:{
                        required : true
                    },
                    postal_code: {
                        number: true,
                        minlength: 5,
                        maxlength: 5
                    },
                    min_temp: {
                        number: true
                    },
                    max_temp: {
                        number: true
                    },
                    min_crate: {
                        number: true
                    },
                    max_crate: {
                        number: true
                    }
                }
            });
            if ($('#update_patient').valid()){

                Patients.upsertPatient($scope.patient).then(function(res){

                    switch (res.status) {
                        case 'success':
                            UserData.setData(angular.copy($scope.patient));
                            $scope.$emit('profile_updated', {});
                            toastr.success('Los datos han sido guardados satisfactoriamente')
                            return;
                            break;
                        case 'fail':
                            bootbox.alert(res.message);
                            break;
                        default:
                            bootbox.alert('En nuestra base de datos ya existe un paciente con estos datos. Por favor, revíselos antes de guardar los cambios.')
                            break;
                    }

                }, function(reason){
                    console.log('failed', arguments);
                });

            }

        };

    }])
    .controller('MonitoringController', ['$scope', function($scope){

    }]);
angular
    .module('Platease')
    .controller('appoiment_userController', ['$scope','$rootScope', 'Appointments', 'Patients', '$stateParams', '$modal', 'Medication_Appointment', 'Medications', '$state', '$timeout', function($scope, $rootScope, Appointments, Patients, $stateParams, $modal, Medication_Appointment, Medications, $state, $timeout){

        $scope.updateShow = false;

        $scope.showEdit = function(){
            $scope.updateShow = true;
            $scope.loadpatienttoedit($stateParams.user_id);
        };

        $scope.cancelEdit = function(){
            $scope.updateShow = false;
        };

        var picture = null;
        $scope.profile_picture = 'public/uploads/users_pictures/default.jpg';
        var archivos = document.getElementById('picture');
        archivos.addEventListener('change', upload, false);

        function upload(e) {
            var archivos = e.target.files;
            var archivo = archivos[0];


            var datos = new FormData();
            datos.append('archivo', archivo);

            var solicitud = new XMLHttpRequest();
            var xmlupload = solicitud.upload;
            xmlupload.addEventListener('loadstart', begin, false);

            if (archivo.type == 'image/png' || archivo.type == 'image/jpeg') {
                if (archivo.size <= 2048000) {
                    xmlupload.addEventListener('load', finish, false);
                    solicitud.open("POST", '/index.php/uploadprofilepicture', true);
                    solicitud.send(datos);
                    picture = archivo;
                } else {
                    toastr.error("Imagenes de Menos de 2 MB");
                }
            } else {
                toastr.error("Solo Imagenes PNG o JPG");
            }
        }

        function begin() {
            $timeout(function () {
                $scope.$apply(function () {
                    $scope.patient.profile_picture = '/public/images/loading.gif';
                });
            }, 0);
        }

        function finish() {
            toastr.success("Se Vinculó Imagen al Usuario");
            $scope.imagen = picture;
            $timeout(function () {
                $scope.$apply(function () {
                    $scope.patient.profile_picture = '/public/uploads/users_pictures/' + picture.name;
                });
            }, 0);
        }

      Patients.selectSinglePatientById($stateParams.user_id).then(function(patient){

        $scope.patient = patient;

        }, function(){
          toastr.error("Error al Obtener la Operación");
      });

        Appointments.oneAppoiment($stateParams.appointment_id).then(function(appointment){

            $scope.appointment = {
                'appointment_id': appointment.id,
                'date': appointment.date,
                'patient_id': appointment.patient_id,
                'assisted': appointment.assisted,
                'indications' : appointment.indications,
                'doctor_id': appointment.doctor_id
            };

        }, function(){
            toastr.error("Error al Relizar la Operación");
        });

        Medication_Appointment.getAllMedicationsAppointmentByAppointment($stateParams.appointment_id).then(function(medications_appointment){
            $scope.medications_appointment = medications_appointment;
        }, function(){
            toastr.error("Error al realizar la Operación");
        });

        $scope.doAppointment = function(){
            
            Appointments.doAppointment($scope.appointment).then(function(){

            }, function(){
                toastr.error("Error al Relizar la Cita");
            });
        };


        $scope.newmedication = function(){
            $scope.newmedications = "";
            Medications.getAllMedications().then(function(medications){

                $scope.medications = medications;

            }, function(){
                toastr.error("Error al Traer Lista de Medicamentos");
            });
            $modal.open({
                animation: true,
                templateUrl: '/public/templates/modal/newmedication.html',
                controller: 'appoiment_userController',
                size: 'md',
                scope : $scope
            }).result.then(function (newmedications) {
                    var appointment_medications = {
                        'medication' : newmedications.medication_id,
                        'dose' : newmedications.dose,
                        'iterations' : newmedications.iterations,
                        'date' : null,
                        'appointment' : $stateParams.appointment_id,
                        'notes' : newmedications.notes
                    };
                    Medications.newMedication(appointment_medications).then(function(newmedication){
                        $scope.medications_appointment.push(newmedication);
                        toastr.success('Se Insert&oacute; Satifactoriamente');
                    }, function(){
                        toastr.error("Error al Insertar la Medicaci&oacute;n");
                    });
                }, function () {
                    toastr.info("Operación Cancelada");
                });
        };

        $scope.deleteMedication = function(index, appoiments_id, medications_id){
            Medication_Appointment.getAMedication(appoiments_id, medications_id).then(function(medication){
                $scope.medication = medication;
            }, function(){
                toastr.error("Error al Traer la Medicaci&oacute;n");
            });
            $modal.open({
                animation: true,
                templateUrl: '/public/templates/modal/deletemedication.html',
                controller: 'appoiment_userController',
                size: 'md',
                scope : $scope
            }).result.then(function () {
                    Medication_Appointment.deleteAMedication(appoiments_id, medications_id).then(function(medication){
                        $scope.medications_appointment.splice(index, 1);
                    }, function(){
                        toastr.error("Error al Eliminar Medicaci&oacute;n");
                    });
                }, function () {
                    toastr.info("Operación Cancelada");
                });
        };

        $scope.loadMedication = function(index, appoiments_id, medications_id){

            Medications.getAllMedications().then(function(medications){
                $scope.medications = medications;
            }, function(){
                toastr.error("Error al Traer Lista de Medicamentos");
            });

            Medication_Appointment.getAMedication(appoiments_id, medications_id).then(function(onemedication){
                $scope.newmedications = onemedication;
            }, function(){
                toastr.error("Error al Traer la Medicaci&oacute;n");
            });
            console.log($scope);
            $modal.open({
                animation: true,
                templateUrl: '/public/templates/modal/newmedication.html',
                controller: 'appoiment_userController',
                size: 'md',
                scope : $scope
            }).result.then(function (newmedications) {
                    Medication_Appointment.updateMedication(medications_id, newmedications).then(function(medication){
                        Medication_Appointment.getAllMedicationsAppointmentByAppointment($stateParams.appointment_id).then(function(medications_appointment){
                            $scope.medications_appointment = medications_appointment;
                        }, function(){
                            toastr.error("Error al Relizar la Operaci&oacute;n");
                        });
                    }, function(){
                        toastr.error("Error al Traer la Medicaci&oacute;n");
                    });

                }, function () {
                    toastr.info("Operación Cancelada");
                });
        };

        $scope.deletepatient = function (patient_id) {
            Patients.deletePatient(patient_id).then(function () {
                $state.go('appointments');
                toastr.success('Usuario Eliminado Satisfactoriamente');
                $scope.patient = " ";
                picture = null;
            }, function () {
                toastr.error("Error al Relizar la Operación");
            });
        };

        $scope.confirmdelete = function (patient_id) {

            $modal.open({
                animation: true,
                templateUrl: '/public/templates/modal/deletepatient.html',
                controller: 'appoiment_userController',
                size: 'md',
                scope : $scope
            }).result.then(function () {
                    $scope.deletepatient(patient_id);
                }, function () {

                });
        };


        $scope.loadpatienttoedit = function (patient_id) {

            Patients.selectSinglePatientById(patient_id).then(function (patient) {
                var date = Date.now();
                $scope.profile_picture = patient.profile_picture + "?t=" + date;
                var documentationvalue = "";
                if(patient.curp == ''){
                    documentationvalue = patient.passaport;
                }
                if(patient.passaport == ''){
                    documentationvalue = patient.curp;
                }

                $scope.patient = {
                    'documentationalue' : documentationvalue,
                    'patient_id': patient.id,
                    'lugar_origen' : patient.lugar_origen,
                    'email': patient.email,
                    'name': patient.name,
                    'lastname': patient.lastname,
                    'curp': patient.curp,
                    'passaport' : patient.passaport,
                    'idDisp': patient.idDisp,
                    'cell': patient.cell,
                    'seguro_medico': patient.seguro_medico,
                    'sex': patient.sex,
                    'city': patient.city,
                    'colony': patient.colony,
                    'street': patient.street,
                    'postal_code': patient.postal_code,
                    'number': patient.number,
                    'birthday': patient.birthday,
                    'profile_picture': patient.profile_picture + "?t=" + date,
                    'religion': patient.religion,
                    'estado_civil': patient.estado_civil
                };
            }, function () {
                toastr.error("Error al Relizar la Operación");
            });
        };

        $scope.updatePatient = function (patient_id) {

            if (picture == null) {
                $scope.imagen = {'name': " ", 'type': " "}
            }
            Patients.updatePatient(patient_id, $scope.patient, $scope.imagen).then(function (updatedpatient) {
                $scope.updateShow = false;
                Patients.selectSinglePatientById($stateParams.user_id).then(function(patient){
                    $scope.patient = patient;
                    $timeout(function () {
                        $scope.$apply(function () {
                            $scope.profile_picture = patient.profile_picture;
                        });
                    }, 0);
                }, function(){
                    toastr.error("Error al Obtener la Operación");
                });
                toastr.success('Operación Realizada Satisfactoriamente');

                $scope.patient = "";
                picture = null;
            }, function () {
                toastr.error("Error al Relizar la Operación");
            });
        };

    }]);
angular
    .module('Platease')
    .controller('religionController', ['$scope','$rootScope', 'Patients', '$stateParams', function($scope, $rootScope, Patients, $stateParams){


      Religion.getAllReligions().then(function(religions){

        //$scope.patient = patient;

        }, function(){
            alert('Ha ocurrido un error al obtener las citas médicas');
           });

    }]);
angular
    .module('Platease')
    .controller('DoctorsController', ['$scope', 'Doctor', 'Patients', 'doctors', '$modal', function ($scope, Doctor, Patients, doctors, $modal) {

        $scope.doctors = doctors;

        $scope.removeDoctor = function(doctor, index){

            $scope.doctor = doctor;

            $modal.open({
                templateUrl: '/templates/modal/deletedoctor.html',
                animation: true,
                size: 'md',
                scope : $scope
            }).result.then(function(res){
                if (res){
                    Doctor.deleteDoctor(doctor.id).then(function(res){

                        if (res.status == 'success'){

                            toastr.success(res.message);

                            $scope.doctors.splice(index, 1);

                        } else {
                            toastr.error(res.message);
                        }

                    }, function(){
                        toastr.error('Ha ocurrido un error al eliminar el doctor, inténtelo nuevamente');
                    });
                }
            });
        };

    }])
    .controller('SupervisorDoctorProfileController', ['$scope', 'doctor', 'specialties', function($scope, doctor, specialties){

        $scope.doctor = doctor;
        $scope.specialties = specialties;

        //get the main specialty
        for (var i in specialties){
            if (specialties[i].id == doctor.speciality){
                $scope.main_specialty = specialties[i].speciality;
            }
        }

        for (var i in specialties){
            if (specialties[i].id == doctor.second_speciality){
                $scope.second_specialty = specialties[i].speciality;
            }
        }

    }])
    .controller('SupervisorSmallDoctorProfileController', ['$scope', 'doctor', 'specialties', 'Doctor', '$state', function($scope, doctor, specialties, Doctor, $state){

        $scope.doctor = doctor;
        $scope.specialties = specialties;

        //get the main specialty
        for (var i in specialties){
            if (specialties[i].id == doctor.speciality){
                $scope.main_specialty = specialties[i].speciality;
            }
        }

        for (var i in specialties){
            if (specialties[i].id == doctor.second_speciality){
                $scope.second_specialty = specialties[i].speciality;
            }
        }

        $scope.certifyDoctor = function(doc, status){
            Doctor.certify(doctor.id, status)
                .then(function(res){
                    if (res.status == 'success'){
                        if (status == true){
                            toastr.success('El doctor ha sido certificado satisfactoriamente');
                        } else {
                            toastr.info('La solicitud ha sido denegada satisfactoriamente');
                        }
                    } else {
                        toastr.error(res.message);
                    }
                }, function(){
                    toastr.error('Ha ocurrido un error al certificar el doctor');
                })
        };

    }])
    .controller('PendingDoctorsController', ['$scope', 'pending_doctors', 'Doctor', 'dialog', function($scope, pending_doctors, Doctor, dialog){

        $scope.pending_doctors = pending_doctors;

        $scope.removeDoctorRequest = function(doctor, index){
            dialog.confirm('Aviso', '¿Está seguro de que desea eliminar la solicitud del doctor?').then(function(res){
                if (res == true){
                    Doctor.deletePendingDoctor(doctor.id)
                        .then(function(res){
                            if (res.status == 'success'){
                                $scope.pending_doctors.splice(index, 1);
                                toastr.success('La solicitud ha sido eliminada satisfactoriamente');
                            } else {
                                toastr.error(res.message);
                            }
                        }, function(){
                            toastr.error('Ha ocurrido un error al eliminar la solicitud');
                        });
                }
            }, function(){

            });
        };

    }]);
angular
    .module('Platease')
    .controller('unaproveddoctorsController', ['$scope', 'Doctor', '$q', 'Patients', '$http', '$modal', function ($scope, Doctor, $q, Patients, $http, $modal) {

        toastr.options.closeButton = true;
        $scope.doctorShow = false;


        Doctor.getAllDoctorsUnapproved().then(function(doctors){
            $scope.doctors = doctors;
        }, function(){
            toastr.error('Error al traer lista de Doctor');
        });

        $scope.deleteDoctor = function(doctor_id){
            Doctor.deleteDoctor(doctor_id).then(function(){
                Doctor.getAllDoctorsUnapproved().then(function(doctors){
                    $scope.doctors = doctors;
                }, function(){
                    toastr.error('Error al Traer Lista de Doctores');
                });
                toastr.success('Operación Realizada Satisfactoriamente');
            }, function(){
                toastr.error('Error al Eliminar el Doctor');
            });
        };

        $scope.confirmdelete = function(doctor_id){

            Doctor.getADoctorByIdpassed(doctor_id).then(function(doctor){
                $scope.doctor = doctor;
            }, function(){
                toastr.error('Error al traer al Doctor');
            });
            $modal.open({
                animation: true,
                templateUrl: '/public/templates/modal/deleteunapproveddoctor.html',
                controller: 'unaproveddoctorsController',
                size: 'md',
                scope : $scope
            }).result.then(function () {
                    $scope.deleteDoctor(doctor_id);
                }, function () {
                    toastr.info('Cancelada Satisfactoriamente');
                });
        };

        $scope.seemore = function(doctor_id){

            $scope.doctorShow = true;

            Doctor.getADoctorByIdpassed(doctor_id).then(function(doctor){
                $scope.doctor = doctor;
            }, function(){
                toastr.error('Error al traer Doctor');
            });



        }

        $scope.certifyDoctor = function(doctor_id){
            Doctor.certifyDoctor(doctor_id).then(function(){
                $scope.doctorShow = false;
                toastr.success('Operación Realizada Satisfactoriamente');
                Doctor.getAllDoctorsUnapproved().then(function(doctors){
                    $scope.doctors = doctors;
                }, function(){
                    toastr.error('Error al traer lista de Doctor');
                });
            }, function(){
                toastr.error('Error al certificar el Doctor');
            });
        }


    }]);
angular
    .module('Platease')
    .controller('update_PatientController', ['$scope', '$http', 'Patients', '$q', '$modal', '$timeout', '$state',  function ($scope, $http, Patients, $q, $modal, $timeout, $state) {

        var picture = null;
        $scope.insertShow = false;
        var archivos = document.getElementById('picture');
        archivos.addEventListener('change', upload, false);

        function upload(e) {
            var archivos = e.target.files;
            var archivo = archivos[0];


            var datos = new FormData();
            datos.append('archivo', archivo);

            var solicitud = new XMLHttpRequest();
            var xmlupload = solicitud.upload;
            xmlupload.addEventListener('loadstart', begin, false);

            if (archivo.type == 'image/png' || archivo.type == 'image/jpeg') {
                if (archivo.size <= 2048000) {
                    xmlupload.addEventListener('load', finish, false);
                    solicitud.open("POST", '/index.php/uploadprofilepicture', true);
                    solicitud.send(datos);
                    picture = archivo;
                } else {
                    toastr.error("Imagenes de Menos de 2 MB");
                }
            } else {
                toastr.error("Solo Imagenes PNG o JPG");
            }
        }

        function begin() {
            $timeout(function () {
                $scope.$apply(function () {
                    $scope.patient.profile_picture = 'public/images/loading.gif';
                });
            }, 0);
        }

        function finish() {
            toastr.success("Se Vinculó Imagen al Usuario");
            $scope.imagen = picture;
            $timeout(function () {
                $scope.$apply(function () {
                    $scope.patient.profile_picture = 'public/uploads/users_pictures/' + picture.name;
                });
            }, 0);
        }

        Patients.selectSinglePatient().then(function(patien){
            $scope.patient = patien;
        }, function(){

        });

        $scope.updatePatient = function(patient){
            $("#patient_profile_form").
                validate({
                    rules: {
                        cell: {
                            required: true,
                            number: true,
                            minlength: 7
                        },
                        password:{
                            minlength: 5
                        },
                        repassword:{
                            minlength: 5,
                            equalTo : password
                        },
                        date: {
                            required: true
                        },
                        sex : {
                            required: true
                        },
                        city: {
                            required: true
                        },
                        colony: {
                            required: true
                        },
                        street:{
                            required : true
                        },
                        number:{
                            required: true,
                            number: true
                        },
                        postal_code: {
                            required: true,
                            number: true,
                            minlength: 5,
                            maxlength: 5
                        },
                        religion:{
                            required:true
                        },
                        estado_civil:{
                            required:true
                        },
                        seguro_medico:{
                            required:true
                        },
                        lugar_origen:{
                            required:true
                        }
                    }
                });
            if ($('#patient_profile_form').valid()){
                var imagen_profile;
                if($scope.imagen == null){
                    imagen_profile = {
                        'name' : null,
                        'type' : null
                    };
                }else{
                    imagen_profile = $scope.imagen;
                }
                Patients.updatePatientProfile(patient, imagen_profile).then(function(patient){
                        window.location = "/index.php";
                }, function(){

                });
            }
        }


    }]);
angular
    .module('Platease')
    .controller('update_DoctorController', ['$auth', '$scope', 'user', 'Upload', 'UserData', 'specialties', 'Doctor', '$timeout', function ($auth, $scope, user, Upload, UserData, specialties, Doctor, $timeout) {

        $scope.doctor = angular.copy(user);
        $scope.specialties = specialties;

        $scope.upload = function (file) {

            if (file){
                $scope.uploading = true;

                Upload.upload({
                    url: '/api/profile-picture',
                    data: {
                        file: file
                    }
                }).then(
                    function(res){
                        $scope.uploading = false;
                        if (res.data.status == 'success'){
                            $scope.doctor.profile_picture = res.data.file;
                            UserData.setData(angular.copy($scope.doctor));
                            $scope.$emit('profile_updated', {});
                        } else {
                            alert('Ha ocurrido un error al subir la imagen');
                        }
                    },
                    function(reason){
                        $scope.uploading = false;
                    }
                );
            }
        };

        $scope.updateDoctor = function(doctor){

            $("#update_doctor").
                validate({
                    rules: {
                        email: {
                            required: true,
                            email: true
                        },
                        name: {
                            required: true,
                        },
                        lastname: {
                            required: true,
                        },
                        specialty: {
                            required : true
                        },
                        professional_license: {
                            required: true,
                            number: true,
                        },
                        dni: {
                            required: true
                        },
                        cedula: {
                            required: true
                        },
                        cell: {
                            required: true,
                            number: true,
                            minlength: 7
                        },
                        date: {
                            required: true
                        },
                        sex : {
                          required: true
                        },
                        city: {
                            required: true
                        },
                        colony: {
                            required: true
                        },
                        street:{
                            required : true
                        },
                        number:{
                            required: true,
                            number: true
                        },
                        postal_code: {
                            required: true,
                            number: true,
                            minlength: 5,
                            maxlength: 5
                        }
                    }
                });
            if ($('#update_doctor').valid()){

                Doctor.updateDoctor($scope.doctor).then(function(res){
                    if (res.status == 'success'){
                        UserData.setData(angular.copy($scope.doctor));
                        $scope.$emit('profile_updated', {});
                        toastr.success('El perfil ha sido actualizado satisfactoriamente');
                    } else {
                        toastr.error('Ha ocurrido un error al actualizar el perfil');
                    }

                }, function(){
                    toastr.error('Ha ocurrido un error al actualizar el perfil');
                });

            }

        };
    }]);
angular
    .module('Platease')
    .controller('SupervisorProfileController', ['$auth', '$scope', 'user', 'Upload', 'UserData', 'Supervisor', function ($auth, $scope, user, Upload, UserData, Supervisor) {

        $scope.supervisor = angular.copy(user);

        $scope.upload = function (file) {

            if (file){
                $scope.uploading = true;

                Upload.upload({
                    url: '/api/profile-picture',
                    data: {
                        file: file
                    }
                }).then(
                    function(res){
                        $scope.uploading = false;
                        if (res.data.status == 'success'){
                            $scope.supervisor.profile_picture = res.data.file;
                            UserData.setData(angular.copy($scope.supervisor));
                            $scope.$emit('profile_updated', {});
                        } else {
                            alert('Ha ocurrido un error al subir la imagen');
                        }
                    },
                    function(reason){
                        $scope.uploading = false;
                    }
                );
            }
        };

        $scope.updateProfile = function(doctor){

            $("#update_doctor").
            validate({
                rules: {
                    email: {
                        required: true,
                        email: true
                    },
                    name: {
                        required: true,
                    },
                    lastname: {
                        required: true,
                    },
                    specialty: {
                        required : true
                    },
                    dni: {
                        required: true
                    },
                    cell: {
                        number: true,
                        minlength: 7
                    },
                }
            });
            if ($('#update_doctor').valid()){

                Supervisor.updateProfile($scope.supervisor).then(function(res){
                    if (res.status == 'success'){
                        UserData.setData(angular.copy($scope.supervisor));
                        $scope.$emit('profile_updated', {});
                        toastr.success('El perfil ha sido actualizado satisfactoriamente');
                    } else {
                        toastr.error('Ha ocurrido un error al actualizar el perfil');
                    }

                }, function(){
                    toastr.error('Ha ocurrido un error al actualizar el perfil');
                });

            }

        };
    }]);
angular
    .module('Platease')
    .controller('UnapprovedAppointmentsController', ['$scope', 'Appointments', 'dialog', 'apmt_requests', function ($scope, Appointments, dialog, apmt_requests) {

        toastr.options.closeButton = true;

        $scope.appointments = apmt_requests;

        $scope.removeAppointment = function(appointment, index){
                dialog.confirm('Confirmación', '¿Desea eliminar la solicitud de cita y todos los datos asociados a esta?')
                    .then(function(res){
                            if (res == true){
                                    Appointments.removeAppointment(appointment.appointment_id)
                                        .then(function(res){
                                                $scope.appointments.splice(index,1);
                                                toastr.success(res.message);
                                        }, function(res){
                                                if (undefined !== res.message){
                                                        toastr.error(res.message);
                                                } else {
                                                        toastr.error('Ha ocurrido un error al eliminar la solicitud');
                                                }
                                        });

                            }
                });
        };

        $scope.approveAppointment = function(appointment, index){
                dialog.confirm('Confirmación', '¿Desea aprobar la solicitud de cita? Si lo hace el paciente será notificado por email y la cita será agregada a su agenda')
                    .then(function(res){
                            if (res == true){
                                    Appointments.approveAppointment(appointment.appointment_id)
                                        .then(function(res){
                                                $scope.appointments.splice(index,1);
                                                toastr.success(res.message);
                                        }, function(res){
                                                if (undefined !== res.message){
                                                        toastr.error(res.message);
                                                } else {
                                                        toastr.error('Ha ocurrido un error al eliminar la solicitud');
                                                }
                                        });

                            }
                    });
        };

        //$scope.date = new Date();
        // $scope.time = new Date();
        // $scope.hstep = 1;
        // $scope.mstep = 5;
        //
        // $scope.options = {
        //     hstep: [1, 2, 3],
        //     mstep: [1, 5, 10, 15, 25, 30]
        // };
        //
        // $scope.ismeridian = true;
        // $scope.toggleMode = function() {
        //     $scope.ismeridian = ! $scope.ismeridian;
        // };
        //
        // $scope.update = function() {
        //     var d = new Date();
        //     d.setHours( 14 );
        //     d.setMinutes( 0 );
        //     $scope.time = d;
        // };
        //
        //
        //

        // $scope.insertShow = false;

        // Appointments.getAllUnapprovedAppoiments().then(function (appoiments) {
        //     $scope.appoiments = appoiments;
        // }, function () {
        //     toastr.error("Error al Relizar la Operación");
        // });
        //

        // $scope.showInsert = function () {
        //     $scope.insertShow = true;
        //     $scope.insertShowButton = true;
        //     $scope.time = new Date();
        //     Doctor.getAllDoctors().then(function (doctors) {
        //         $scope.doctors = doctors;
        //
        //     }, function () {
        //         toastr.error("Error al Obtener Datos de los Doctores");
        //     });
        // };

        // $scope.calcelInsertAppoiment = function () {
        //     $scope.insertShow = false;
        //     $scope.insertShowButton = false;
        //     $scope.updateShowButton = false;
        //     $scope.appointment.patient_id = "";
        // };

        // $scope.handleInsert =function(){
        //
        //     $("#solicitar_appointment_form").
        //         validate({
        //             rules: {
        //                 doctor: {
        //                     required: true
        //                 },
        //                 date: {
        //                     required: true
        //                 }
        //             }
        //         });
        //     if ($('#solicitar_appointment_form').valid()){
        //         $scope.inserAppoiment();
        //     }
        // };

        // $scope.inserAppoiment = function () {
        //     $scope.datetime = $scope.date+" "+$scope.time.getHours()+":"+$scope.time.getMinutes();
        //     $http({
        //         method: 'post', data: {
        //             'date': $scope.datetime,
        //             'doctor': $scope.appointment.doctor_id
        //         },
        //         url: "/index.php/insertaunapprovedppointment"
        //     }).success(function (data) {
        //         Appointments.getAllUnapprovedAppoiments().then(function (appoiments) {
        //             $scope.appoiments = appoiments;
        //         }, function () {
        //             toastr.error("Error al Relizar la Operación");
        //         });
        //         toastr.success('Se Cre&oacute; la Sita Satisfactoriamente.');
        //     });
        //
        //     $scope.calcelInsertAppoiment();
        // };

        // $scope.removeunapprovedAppoiment = function (appoiment_id, index) {
        //
        //     Appointments.deleteAppoiment(appoiment_id).then(function (data) {
        //         $scope.appoiments.splice(index,1);
        //         toastr.success('Sita Eliminada Satisfactoriamente');
        //     }, function () {
        //         toastr.error("Error al Eliminar la Solicitud de Cita");
        //     });
        // };

        // $scope.approveAppointment = function(appoiment_id, index){
        //
        //     Appointments.approveAppointment(appoiment_id).then(function(appointment){
        //         $scope.appoiments.splice(index, 1);
        //         toastr.success('Sita Aprobada Satisfactoriamente');
        //     }, function(){
        //         toastr.error("Error al al Aprobar la Cita");
        //     });
        //
        // };

        // $scope.confirApproveAppointment = function(appoiment, index){
        //     $scope.appointment = appoiment;
        //     console.log($scope);
        //     $modal.open({
        //         animation: true,
        //         templateUrl: '/public/templates/modal/approveapp.html',
        //         controller: 'unapprovedAppointmentsController',
        //         size: 'md',
        //         scope : $scope
        //     }).result.then(function () {
        //             $scope.approveAppointment(appoiment.appoiment_id, index);
        //         }, function () {
        //             toastr.info("Operación Cancelada");
        //         });
        //
        // };

        // $scope.confirmdeleteunapprovedAppointment = function (appoiment_id, index) {
        //
        //     Appointments.oneAppoiment(appoiment_id).then(function(appointment){
        //         $scope.appointment = appointment;
        //     }, function(){
        //         toastr.error("Error al Relizar la Operación");
        //     });
        //
        //     $modal.open({
        //         animation: true,
        //         templateUrl: '/public/templates/modal/deleteunapprovedapp.html',
        //         controller: 'unapprovedAppointmentsController',
        //         size: 'md',
        //         scope : $scope
        //     }).result.then(function () {
        //             $scope.removeunapprovedAppoiment(appoiment_id, index);
        //         }, function () {
        //             toastr.info("Operación Cancelada");
        //         });
        // };


}])
    .controller('NewAppointmentRequestController', ['$scope', 'doctors', 'Appointments', '$state', 'Doctor', 'dialog', function($scope, doctors, Appointments, $state, Doctor, dialog){

        $scope.doctors = doctors;

        $scope.date = new Date();

        $scope.time = new Date();
        $scope.date = $scope.time.getFullYear()+"-" + ($scope.time.getMonth() < 10 ? '0' + $scope.time.getMonth() : $scope.time.getMonth())+"-"+$scope.time.getDate();

        $scope.hstep = 1;
        $scope.mstep = 1;

        $scope.options = {
                hstep: [1, 2, 3],
                mstep: [1, 5, 10, 15, 25, 30]
        };

        $scope.ismeridian = true;
        $scope.toggleMode = function() {
                $scope.ismeridian = ! $scope.ismeridian;
        };

        $scope.update = function() {
                var d = new Date();
                d.setHours( 14 );
                d.setMinutes( 0 );
                $scope.time = d;
        };

        $scope.handleInsert =function(){

                $("#appointment_form").
                    validate({
                        rules: {
                            doctor: {
                                required: true
                            },
                            date: {
                                required: true
                            }
                        }
                    });
                if ($('#appointment_form').valid()){
                        $scope.upsertAppointmentRequest();
                }
        };

        $scope.upsertAppointmentRequest = function () {

                $scope.datetime = $scope.date + " " + $scope.time.getHours() + ":" + $scope.time.getMinutes();

                Appointments.upsertAppointmentRequest(undefined !== $scope.appointment && $scope.appointment ? $scope.appointment.id : null, $scope.datetime, $scope.appointment.doctor_id, $scope.appointment.area_id)
                    .then(function(res){
                            toastr.success(res.message);
                            $state.go('index.appointment_requests');
                    }, function(res){
                            toastr.error(res.message);
                    });
        };

        $scope.selectDoctor = function(){
            $scope.loading_doctor_specs = true;
            Doctor.getSpecialtiesById($scope.appointment.doctor_id)
                .then(function(res){
                    $scope.loading_doctor_specs = false;
                    if (res.data.length > 0){
                        $scope.specialties = res.data;
                    } else {
                        dialog.alert('Aviso', 'El doctor no ha especificado sus especialidades aún. La cita será creada pero sin área específica.');
                    }
                }, function(){
                    $scope.loading_doctor_specs = false;
                    dialog.alert('Aviso', 'Ha ocurrido un error al obtener las especialidades del doctor.');
                });
        };
}]);

angular
    .module('Platease')
    .controller('DoctorProfileController', ['$scope', 'user', function($scope, user){

        $scope.user = user;

    }]);


angular.module('Platease')

    .factory('UserData', ['$http', '$timeout', '$q', function($http, $timeout, $q){

        var data = null;

        return {
            getData: function(){

                if (data){
                    return data;
                }

                var d = $q.defer();
                $http.get('/api/logged-user')
                    .success(function(res){
                        if (res.status == 'success'){
                            data = res.data;
                            d.resolve(res.data);
                        } else {
                            d.reject();
                        }
                    })
                    .error(function(status){
                        d.reject(status);
                    });
                return d.promise;
            },
            setData: function(profile_data){
                data = profile_data;
            },
            clearData: function(){

                console.log('clearing data');

                data = null;
            },
            changePassword: function(password, password_confirm){
                var d = $q.defer();

                $http.post('/api/change-password', {password: password, password_confirm: password_confirm})
                    .success(function(res){
                        d.resolve(res);
                    })
                    .error(function(){
                        d.reject(arguments);
                    });

                return d.promise;
            },
            logout: function(){

                var d = $q.defer();

                $http.get('/api/logout')
                    .success(function(res){
                        d.resolve(res);
                    })
                    .error(function(){
                        d.reject(arguments);
                    });

                return d.promise;

            },
            recoverPassword: function(email){

                var d = $q.defer();

                $http.post('/api/recover-password', {email: email})
                    .success(function(res){
                        d.resolve(res);
                    })
                    .error(function(){
                        d.reject(arguments);
                    });

                return d.promise;

            },
            registerUser: function(userData){

                var d = $q.defer();

                $http.post('/register-doctor', {
                    email: userData.email,
                    password: userData.email,
                    password_confirm: userData.email,
                    name: userData.name,
                    lastname: userData.lastname,
                    spec_1: userData.speciality,
                    spec_2: userData.second_speciality,
                    pl: userData.pl,
                    dni: userData.dni,
                })
                    .success(function(res){
                        d.resolve(res);
                    })
                    .error(function(data,status,headers, config){
                        d.reject(data);
                    });

                return d.promise;

            }
        };
    }]);

angular.module('Platease')
    .factory('Supervisor', ['$http', '$timeout', '$q', function($http, $timeout, $q){
      return {
          updateProfile : function(supervisor)
          {
              var d = $q.defer();

              $http.post('/api/supervisor-profile', {data: supervisor})
                  .success(function(res){
                      d.resolve(res);
                  })
                  .error(function(){
                      d.reject(arguments);
                  });

              return d.promise;
          }
      };
    }]);

angular.module('Platease')
    .factory('SensorData', ['$http', '$timeout', '$q', function($http, $timeout, $q){
        return {
            getSensorData : function(sensorName, startDate, endDate)
            {
                var d = $q.defer();
                $http.post('/api/sensors-by-date', {sensor_name: sensorName, start_date: startDate, end_date: endDate})
                    .success(function(res){
                        d.resolve(res.data);
                    })
                    .error(function(status){
                        d.reject(status);
                    });

                return d.promise;
            }
        };
    }]);


angular.module('Platease')
    .factory('Medications', ['$http', '$timeout', '$q', function($http, $timeout, $q){
       return {
           getAllMedications : function()
           {
               var d = $q.defer();

               $http.get('/api/medications')
                   .success(function(res){
                       d.resolve(res);
                   })
                   .error(function(status){
                       d.reject(status);
                   });

               return d.promise;
           },
           getCurrentForUser: function(){
               var d = $q.defer();

               $http.get('/api/user-medications')
                   .success(function(res){
                       d.resolve(res.data);
                   })
                   .error(function(status){
                       d.reject(status);
                   });

               return d.promise;
           },
           completeCycle: function(medicationId){
               var d = $q.defer();

               $http.post('/api/complete-medication', {id: medicationId})
                   .success(function(res){
                       d.resolve(res);
                   })
                   .error(function(){
                       d.reject(arguments);
                   });

               return d.promise;
           },
           getAMedicationById : function(medication_id)
           {
               var d = $q.defer();
               $http.get('/index.php/getmedicationbyid/'+medication_id)
                   .success(function(res){
                       d.resolve(res);
                   })
                   .error(function(status){
                       d.reject(status);
                   });

               return d.promise;
           },
           newMedication : function(appointment_medications)
           {
               var d = $q.defer();
               $http({method:'post', data:{
                  'newMedications' : appointment_medications

               },
                   url: "/index.php/newmedication"}).success(function (newmedication) {
                   d.resolve(newmedication);
               }).error(function(){
                   d.reject('error');
               });

               return d.promise;
           }

       };
    }]);

angular.module('Platease')
    .factory('Doctor', ['$http', '$timeout', '$q', function($http, $timeout, $q){
        return {
            deleteDoctor : function(doctor_id)
            {
                var d = $q.defer();
                $http.post('/api/doctor-delete', {id: doctor_id})
                    .success(function(res){
                        d.resolve(res);
                    })
                    .error(function(status){
                        d.reject(status);
                    });

                return d.promise;
            },
            deletePendingDoctor : function(doctor_id)
            {
                var d = $q.defer();
                $http.post('/api/pending-doctor-delete', {id: doctor_id})
                    .success(function(res){
                        d.resolve(res);
                    })
                    .error(function(status){
                        d.reject(status);
                    });

                return d.promise;
            },
            getADoctorByIdpassed : function(doctor_id)
            {
                var d = $q.defer();
                $http.get('/index.php/getdoctorbyidpassed/'+doctor_id)
                    .success(function(res){
                        d.resolve(res);
                    })
                    .error(function(status){
                        d.reject(status);
                    });

                return d.promise;
            },
            getADoctorById : function()
            {
                var d = $q.defer();
                $http.get('/index.php/getdoctorbyid')
                    .success(function(res){
                        d.resolve(res);
                    })
                    .error(function(status){
                        d.reject(status);
                    });

                return d.promise;
            },
            getAllDoctors : function()
            {
                var d = $q.defer();
                $http.get('/api/doctors')
                    .success(function(res){
                        d.resolve(res.data);
                    })
                    .error(function(status){
                        d.reject(status);
                    });

                return d.promise;
            },
            getAllDoctorsExtended : function()
            {
                var d = $q.defer();
                $http.get('/api/doctors/extended')
                    .success(function(res){
                        d.resolve(res.data);
                    })
                    .error(function(status){
                        d.reject(status);
                    });

                return d.promise;
            },
            getAllPendingDoctors: function()
            {
                var d = $q.defer();
                $http.get('/api/doctors/pending')
                    .success(function(res){
                        d.resolve(res.data);
                    })
                    .error(function(status){
                        d.reject(status);
                    });

                return d.promise;
            },
            getDoctorProfile: function(id){

                var d = $q.defer();

                $http.get('/api/doctor/'+id)
                    .success(function(res){
                        d.resolve(res.data);
                    })
                    .error(function(status){
                        d.reject(status);
                    });

                return d.promise;

            },
            getAllDoctorsUnapproved : function()
            {
                var d = $q.defer();
                $http.get('/index.php/doctorsunapproved')
                    .success(function(res){
                        d.resolve(res);
                    })
                    .error(function(status){
                        d.reject(status);
                    });

                return d.promise;
            },
            updateDoctor : function(doctor)
            {
                var d = $q.defer();

                $http.post('/api/doctor/update', {doctor_data: doctor})
                    .success(function(res){
                        d.resolve(res);
                    })
                    .error(function(){
                        d.reject(arguments);
                    });

                return d.promise;
            },
            certify: function(doctor_id, status)
            {
                var d = $q.defer();

                $http.post('/api/certify', {id: doctor_id, status: status})
                    .success(function(res){
                        d.resolve(res);
                    })
                    .error(function(){
                        d.reject(arguments);
                    });

                return d.promise;
            },
            getDoctorSpecialties: function(){
                var d = $q.defer();

                $http.get('/api/doctor/specialties')
                    .success(function(res){
                        if (res.status == 'success'){
                            d.resolve(res.data);
                        } else {
                            d.reject(res);
                        }
                    })
                    .error(function(){
                        d.reject(arguments);
                    });

                return d.promise;
            },
            getSpecialtiesById: function(doctor_id){
                var d = $q.defer();

                $http.post('/api/doctor/specialties', { doctor_id: doctor_id })
                    .success(function(res){
                        if (res.status == 'success'){
                            d.resolve(res);
                        } else {
                            d.reject(res);
                        }
                    })
                    .error(function(){
                        d.reject(arguments);
                    });

                return d.promise;
            }

        };
    }]);

angular.module('Platease')
    .factory('Specialty', ['$http', '$timeout', '$q', function($http, $timeout, $q){
        return {
            getAll: function()
            {
                var d = $q.defer();
                $http.get('/api/specialties')
                    .success(function(res){
                        d.resolve(res.specs);
                    })
                    .error(function(status){
                        d.reject(status);
                    });

                return d.promise;
            },
            getADoctorEspeciality : function(speciality_id)
            {
                var d = $q.defer();
                $http.get('/index.php/getadoctorbespeciality/'+speciality_id)
                    .success(function(res){
                        d.resolve(res);
                    })
                    .error(function(status){
                        d.reject(status);
                    });

                return d.promise;
            }
        };
    }]);

angular.module('Platease')
    .factory('Medication_Appointment', ['$http', '$timeout', '$q', function($http, $timeout, $q){
        return {
            getAllMedicationsAppointmentByAppointment : function(appointment_id)
            {
                var d = $q.defer();
                $http.get('/index.php/medications_appointment/'+appointment_id)
                    .success(function(res){
                        d.resolve(res);
                    })
                    .error(function(status){
                        d.reject(status);
                    });

                return d.promise;
            },
            getAllMedicationsAppointmentByPatient : function()
            {
                var d = $q.defer();
                $http.get('/index.php/medicationsbypatient/')
                    .success(function(res){
                        d.resolve(res);
                    })
                    .error(function(status){
                        d.reject(status);
                    });

                return d.promise;
            },
            getAMedication : function(appoiments_id, medications_id)
            {
                var d = $q.defer();
                $http.get('/index.php/getamedication/'+appoiments_id+'/'+medications_id)
                    .success(function(res){
                        d.resolve(res);
                    })
                    .error(function(status){
                        d.reject(status);
                    });
                return d.promise;
            },
            getAMedicationAppointmentByid : function(medication_id, appointment_id)
            {
                var d = $q.defer();
                $http.get('/index.php/getamedicationappointmentbyid/'+medication_id+'/'+appointment_id)
                    .success(function(res){
                        d.resolve(res);
                    })
                    .error(function(status){
                        d.reject(status);
                    });
                return d.promise;
            },
            deleteAMedication : function(appoiments_id, medications_id)
            {
                var d = $q.defer();
                $http.delete('/index.php/deleteamedication/'+appoiments_id+'/'+medications_id)
                    .success(function(res){
                        d.resolve(res);
                    })
                    .error(function(status){
                        d.reject(status);
                    });

                return d.promise;
            },
            updateMedication : function(medications_id, medication)
            {
                var d = $q.defer();
                $http({method:'put', data:{
                    'medications' : medication,
                    'id_medication' : medications_id
                },
                    url: "/index.php/updatemedication"}).success(function (medication) {
                    d.resolve(medication);
                }).error(function(){
                    d.reject('error');
                });

                return d.promise;
            }
        };
    }]);


angular.module('Platease')
    .factory('AppoimentDetails', ['$http', '$timeout', '$q', function($http, $timeout, $q){
        return{
            getAllIndicationsByPatient : function(){
                var d = $q.defer();
                $http.get('/index.php/appointment_details')
                    .success(function(res){
                        d.resolve(res);
                    })
                    .error(function(status){
                        d.reject(status);
                    });

                return d.promise;
            },
            getAIndicationsByPatient : function(appointment_id){
                var d = $q.defer();
                $http.get('/index.php/appointment_detailbyidappointment/'+appointment_id)
                    .success(function(res){
                        d.resolve(res);
                    })
                    .error(function(status){
                        d.reject(status);
                    });

                return d.promise;
            }
    };
    }]);


angular.module('Platease')
    .factory('Appointments', ['$http', '$timeout', '$q', function($http, $timeout, $q){
        return {
                getAllAppoiments : function()
                {
                    var d = $q.defer();
                    $http.get('/api/appointments')
                        .success(function(res){
                            if (res.status == 'success'){
                                d.resolve(res.appointments);
                            } else {
                                d.reject(res);
                            }
                        })
                        .error(function(status){
                            d.reject(status);
                        });

                    return d.promise;
                },
                getDoneAppoiments : function()
                {
                    var d = $q.defer();
                    $http.get('/api/appointments-done')
                        .success(function(res){
                            if (res.status == 'success'){
                                d.resolve(res.appointments);
                            } else {
                                d.reject(res);
                            }
                        })
                        .error(function(status){
                            d.reject(status);
                        });

                    return d.promise;
                },
                getPendingRequests: function()
                {
                    var d = $q.defer();
                    $http.get('/api/appointments/pending')
                        .success(function(res){
                            if (res.status == 'success'){
                                d.resolve(res.data);
                            } else {
                                d.reject(res);
                            }
                        })
                        .error(function(status){
                            d.reject(status);
                        });
                    return d.promise;
                },
                getAllAppoimentsByAssited : function(assisted, criterial)
                {
                    var d = $q.defer();
                    $http.post('/api/appointments/search', { criteria: criterial, assisted: assisted})
                        .success(function(res){
                            if (res.status == 'success'){
                                d.resolve(res.appointments);
                            } else {
                                d.reject(res);
                            }
                        })
                        .error(function(status){
                            d.reject(status);
                        });

                    return d.promise;
                },
                upsertAppointment: function(appointment_id, date, patient_id, area_id){
                    var d = $q.defer();

                    $http.post('/api/appointment', {date: date, patient: patient_id, id: appointment_id, area_id: area_id})
                        .success(function(res){
                            if (res.status == 'success'){
                                d.resolve(res);
                            } else {
                                d.reject(res);
                            }
                        })
                        .error(function(status){
                            d.reject(status);
                        });

                    return d.promise;
                },
                upsertAppointmentRequest: function(appointment_id, date, doctor_id, area_id){
                    var d = $q.defer();

                    $http.post('/api/appointment-request', {date: date, doctor: doctor_id, id: appointment_id, area_id: area_id})
                        .success(function(res){
                            if (res.status == 'success'){
                                d.resolve(res);
                            } else {
                                d.reject(res);
                            }
                        })
                        .error(function(status){
                            d.reject(status);
                        });

                    return d.promise;
                },
                removeAppointment: function(appoiment_id)
                {
                    var d = $q.defer();

                    $http.post('/api/appointment/delete', {id: appoiment_id})
                        .success(function(res){
                            if (res.status == 'success'){
                                d.resolve(res);
                            } else {
                                d.reject(res);
                            }
                        })
                        .error(function(){
                            d.reject(arguments);
                        });

                    return d.promise;
                },
                getById: function(appointment_id)
                {
                    var d = $q.defer();

                    $http.get('/api/appointment/' + appointment_id)
                        .success(function(res){
                            if (res.status == 'success'){
                                d.resolve(res.appointment);
                            } else {
                                d.reject(res);
                            }
                        })
                        .error(function(){
                            d.reject(arguments);
                        });
                    return d.promise;
                },
                searchAppoiments: function(criteria, assisted){
                    var d = $q.defer();
                    $http({method:'post', data:{ 'criteria': criteria, 'assisted': assisted },
                        url: "/api/appointments/search"})
                        .success(function (data) {
                            if (data.status == 'success'){
                                d.resolve(data.appointments);
                            } else {
                                d.reject(data);
                            }
                        })
                        .error(function(){
                            d.reject('error');
                        });
                    return d.promise;
                },
                approveAppointment: function(appointment_id){
                    var d = $q.defer();

                    $http.post('/api/appointment/approve', {id: appointment_id})
                        .success(function(res){
                            if (res.status == 'success'){
                                d.resolve(res);
                            } else {
                                d.reject(res);
                            }
                        })
                        .error(function(){
                            d.reject(arguments);
                        });

                    return d.promise;
                },
                getAppointmentDetails: function(id){

                    var d = $q.defer();

                    $http.get('/api/appointment-details/' + id)
                        .success(function(res){
                            if (res.status == 'success'){
                                d.resolve(res.data);
                            } else {
                                d.reject(res);
                            }
                        })
                        .error(function(){
                            d.reject(arguments);
                        });

                    return d.promise;
                },
                linkMedicationToAppointment: function(action, appointment_id, medication){
                    var d = $q.defer();

                    $http.post('/api/appointment-medication', {
                        action: action,
                        appointment_id: appointment_id,
                        medication_id: medication.medication_id,
                        medication_dose: medication.dose,
                        medication_iterations: medication.iterations,
                        medication_notes: medication.notes
                    }).success(function(res){
                        d.resolve(res);
                    }).error(function(){
                        d.reject()
                    });

                    return d.promise;
                },
                removeMedication: function(medication_id, appointment_id){
                    var d = $q.defer();

                    $http.post('/api/appointment-medication/remove', {
                        medication_id: medication_id,
                        appointment_id: appointment_id
                    }).success(function(res){
                        d.resolve(res);
                    }).error(function(){
                        d.reject(arguments);
                    });

                    return d.promise;
                },
                saveIndications: function(appointment_id, indications, readings){
                    var d = $q.defer();

                    $http.post('/api/appointment-details', {
                        appointment_id: appointment_id,
                        indications: indications,
                        readings: readings
                    }).success(function(res){
                        d.resolve(res);
                    }).error(function(){
                        d.reject(arguments);
                    });

                    return d.promise;
                },
                saveEkgReadings: function(appointmentId, ekgData){
                    var d = $q.defer();

                    $http.post('/api/appointment/save/ekg', {
                        appointment_id: appointmentId,
                        ekg_data: ekgData
                    }).success(function(res){
                        d.resolve(res);
                    }).error(function(){
                        d.reject(arguments);
                    });

                    return d.promise;
                },
                getPrevious: function(appointment_id){

                    var d = $q.defer();

                    $http.post('/api/appointment/previous', {
                        appointment_id: appointment_id
                    })
                        .success(function(res){
                            d.resolve(res);
                        })
                        .error(function(){
                            d.reject(arguments);
                        });

                    return d.promise;

                },
                getResources: function(appointmentId){

                    var d = $q.defer();

                    $http.post('/api/appointment/resources', {
                            appointment_id: appointmentId
                        })
                        .success(function(res){
                            d.resolve(res.data);
                        })
                        .error(function(){
                            d.reject(arguments);
                        });

                    return d.promise;

                }
            };
    }]);

angular.module('Platease')
    .factory('Patients', ['$http', '$timeout', '$q', function($http, $timeout, $q){
        return{

            getById: function(id){
                var d = $q.defer();

                $http.get('/api/patient/'+ id)
                    .success(function(res){
                        if (res.status == 'success'){
                            d.resolve(res.patient);
                        } else {
                            d.reject(res);
                        }
                    })
                    .error(function(){
                        d.reject(arguments);
                    });

                return d.promise;
            },
            movePatient: function(patient_id){
                var d = $q.defer();

                $http.post('/api/patient/move', {patient_id: patient_id})
                    .success(function(res){
                        d.resolve(res);
                    })
                    .error(function(){
                        d.reject(arguments);
                    });

                return d.promise;
            },
            upsertPatient: function(patient){

                var d = $q.defer();

                var url = null;

                if (patient.id !== undefined && patient.id){
                    url = '/api/patient/' + patient.id;
                } else {
                    url = '/api/patient';
                }

                $http.post(url, {patient: patient})
                    .success(function(res){
                        d.resolve(res);
                    })
                    .error(function(){
                        d.reject(arguments);
                    });

                return d.promise;
            },
            getPatientsByUser: function(criteria){
                var d = $q.defer();

                $http.post('/api/patients', {term: criteria})
                    .success(function(res){
                        if (res.status == 'success'){
                            d.resolve(res.data);
                        } else {
                            d.reject(res);
                        }
                    })
                    .error(function(){
                        d.reject(arguments);
                    });

                return d.promise;
            },
            getAllPatients :  function(){
                var d = $q.defer();
                $http.post('/api/patients').success(function (patients) {
                    if (patients.status == 'success'){
                        d.resolve(patients.data);
                    } else {
                        d.reject(patients);
                    }

                }).error(function(){
                    d.reject('error');
                    // ED DMS SSP CABAIGUAN 110194 WAN 201.220.202.144/30 LAN 10.16.10.216/29
                });
                return d.promise;
            },
            getLoggedPatient: function(){
                var d = $q.defer();

                $http.get('/api/logged-patient').success(function(res){
                    if (res.status == 'success'){
                        d.resolve(res.data);
                    } else {
                        d.reject(res);
                    }
                }).error(function(){
                    d.reject(arguments);
                });

                return d.promise;
            },
            searchPatient: function(criterial){
                var d = $q.defer();
                $http({method:'post', data:{
                    'criterial': criterial },
                    url: "/index.php/searchpatients"}).success(function (data) {
                    d.resolve(data);
                }).error(function(){
                    d.reject('error');
                });
                return d.promise;
            },
            selectSinglePatientById: function(id){
                var d = $q.defer();
                $http.get('/index.php/getpatientbyid/'+id).success(function (patient) {
                    d.resolve(patient);
                }).error(function(){
                    d.reject('error');
                });
                return d.promise;
            },
            selectSinglePatient: function(){
                var d = $q.defer();
                $http.get('/index.php/getpatient/').success(function (patient) {
                    d.resolve(patient);
                }).error(function(){
                    d.reject('error');
                });
                return d.promise;
            },
            deletePatient: function(patient_id){

                var d = $q.defer();

                $http.post('/api/delete-patient', {id: patient_id})
                    .success(function (res) {
                        d.resolve(res);
                    }).error(function(){
                        d.reject('error');
                    });
                    return d.promise;

            },
            updatePatient: function(patient_id, patient, imagen){
                var d = $q.defer();
                $http({method:'put', data:{
                    'documentationalue': patient.documentationalue,
                    'lugar_origen' : patient.lugar_origen,
                    'patient_id' : patient.patient_id,
                    'email': patient.email,
                    'name': patient.name,
                    'lastname': patient.lastname,
                    'curp': patient.curp,
                    'passaport' : patient.passaport,
                    'idDisp': patient.idDisp,
                    'cell': patient.cell,
                    'seguro_medico': patient.seguro_medico,
                    'sex': patient.sex,
                    'city': patient.city,
                    'colony': patient.colony,
                    'street': patient.street,
                    'postal_code': patient.postal_code,
                    'number': patient.number,
                    'birthday': patient.birthday,
                    'religion' : patient.religion,
                    'estado_civil' : patient.estado_civil,
                    'imagen_name' : imagen.name,
                    'imagen_type' : imagen.type
                },
                    url: '/index.php/updatepatient/'+patient_id}).success(function (updatedpatient) {
                    d.resolve(updatedpatient);
                }).error(function(){
                    d.reject('error');
                });
                return d.promise;
            },
            insertPatient: function(patient, profile_picture){
                var d = $q.defer();
                $http({method:'post', data:{
                    'profile_picture_name': profile_picture.name,
                    'profile_picture_type': profile_picture.type,
                    'patient' : patient
                     },
                    url: "/index.php/insertPatient"}).success(function (patient) {
                    d.resolve(patient);
                }).error(function(){
                    d.reject('error');
                });
                return d.promise;
            },
            deleteProfilePicture: function(imagen){
                var d = $q.defer();
                $http.delete('/index.php/deleteprofilepicture/'+imagen).success(function () {
                }).error(function(){
                    d.reject('error');
                });
                return d.promise;
            },
            updatePatientProfile : function(patient, imagen)
            {
                var d = $q.defer();
                $http({method:'put', data:{
                    'patient' : patient,
                    'imagen_name' : imagen.name,
                    'imagen_type' : imagen.type
                },
                    url: "/index.php/updatepatientprofile"}).success(function (patient) {
                    d.resolve(patient);
                }).error(function(){
                    d.reject('error');
                });

                return d.promise;
            }

            };
    }]);

angular.module('Platease')
    .factory('SocketFactory', ['socketFactory', function(socketFactory){

        var socket = null;

        var factory = {
            init: function(){

                if (socket == null){
                    socket = io.connect('http://localhost:8888', { path: '/' });
                }

                var mysocket =  socketFactory({
                    ioSocket: socket,
                    prefix: '',
                });

                mysocket.forward('error');

                return mysocket;
            },
        };

        return factory;

    }]);

angular.module('Platease')
    .factory('dialog', ['$modal', function($modal){

        var alertModal = function(type, title, message){

            var templateUrl = null;

            switch(type){
                case 'alert':
                    templateUrl = '/templates/modal/alertDialog.html';
                    break;
                case 'success':
                    templateUrl = '/templates/modal/successDialog.html';
                    break;
                case 'confirm':
                    templateUrl = '/templates/modal/confirmDialog.html';
                    break;
            };

            return $modal.open({
                    animation: true,
                    backdrop: 'static',
                    templateUrl: templateUrl,
                    windowClass: type,
                    size: 'md',
                    resolve:{
                        alert_title: function() { return title; },
                        alert_message: function() { return message; }
                    },
                    controller: ['$scope', 'alert_title', 'alert_message', function($scope, alert_title, alert_message){
                        $scope.title = alert_title;
                        $scope.message = alert_message;
                    }]
                }
            );

        };

        return {
            alert: function(title, message){
                return alertModal('alert', title, message).result;
            },
            confirm: function(title, message){
                return alertModal('confirm', title, message).result;
            },
            success: function(title, message){
                return alertModal('success', title, message).result;
            }
        }
    }]);

angular.module('Platease')
    .directive('ekgElem', ['$http', '$interval', '$timeout', function($http, $interval, $timeout){
        return {
            link: function(scope, elem, attrs){

                var height = parseInt(attrs.height ? attrs.height : 0);

                scope.svgHeight = height + 'px';

                var pathDefinition = '';

                var currentOrder = 0;

                scope.ekg_path = '';

                var viewportX = 0;
                var viewportMoveStep = 100;

                scope.readingsToSave = [];

                var updateTransformCommand = function(){
                    scope.transformCommand = 'translate(' + viewportX + ',0)';
                };

                var moveLeft = function(amount){
                    if (amount){
                        viewportX += amount;
                    } else {
                        viewportX += viewportMoveStep;
                    }

                    updateTransformCommand();
                };

                var moveRight = function(amount){
                    if (amount){
                        viewportX -= amount;
                    } else {
                        viewportX -= viewportMoveStep;
                    }

                    updateTransformCommand();
                };

                scope.$parent.$watch('ekg_data', function(newValue){

                    if (newValue){
                        // res es un arreglo de objects, cada object es un paquete
                        // por tanto

                        var readings = newValue.value;

                        scope.readingsToSave = scope.readingsToSave.concat(readings);

                        //convert the value to a scaled value

                        var first = true;

                        var order = 2.5;

                        var scale = 4;

                        var calcPointByReading = function(value, previous){

                            var diff = (previous - value );

                            return diff * 100 * scale;

                        };

                        var previousReading = 0;

                        var path = '';

                        var addPoint = function(order, point){
                            // $timeout(function(){
                                path += ' l ' + order + ' ' + point;
                            // }, 300);
                        };

                        for (k in readings){
                            if (!first){

                                var point = calcPointByReading(readings[k], previousReading);

                                addPoint(order, point);

                            } else {

                                first = false;
                                path += ' M ' + currentOrder + ' ' + parseInt(height / 2);

                            }

                            previousReading = readings[k];

                        }

                        // moveRight(parseInt( readings.length * order / 2 ));

                        scope.ekg_path += path;

                        currentOrder += order * readings.length;
                    }

                });

                scope.moveLeft = function(){
                    moveLeft();
                };

                scope.moveRight = function(){
                    moveRight();
                };

            },
            templateUrl: '/templates/ekg.html',
            replace: true
        };
    }]);
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.io = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var url = _dereq_('./url');
var parser = _dereq_('socket.io-parser');
var Manager = _dereq_('./manager');
var debug = _dereq_('debug')('socket.io-client');

/**
 * Module exports.
 */

module.exports = exports = lookup;

/**
 * Managers cache.
 */

var cache = exports.managers = {};

/**
 * Looks up an existing `Manager` for multiplexing.
 * If the user summons:
 *
 *   `io('http://localhost/a');`
 *   `io('http://localhost/b');`
 *
 * We reuse the existing instance based on same scheme/port/host,
 * and we initialize sockets for each namespace.
 *
 * @api public
 */

function lookup(uri, opts) {
  if (typeof uri == 'object') {
    opts = uri;
    uri = undefined;
  }

  opts = opts || {};

  var parsed = url(uri);
  var source = parsed.source;
  var id = parsed.id;
  var path = parsed.path;
  var sameNamespace = cache[id] && path in cache[id].nsps;
  var newConnection = opts.forceNew || opts['force new connection'] ||
                      false === opts.multiplex || sameNamespace;

  var io;

  if (newConnection) {
    debug('ignoring socket cache for %s', source);
    io = Manager(source, opts);
  } else {
    if (!cache[id]) {
      debug('new io instance for %s', source);
      cache[id] = Manager(source, opts);
    }
    io = cache[id];
  }

  return io.socket(parsed.path);
}

/**
 * Protocol version.
 *
 * @api public
 */

exports.protocol = parser.protocol;

/**
 * `connect`.
 *
 * @param {String} uri
 * @api public
 */

exports.connect = lookup;

/**
 * Expose constructors for standalone build.
 *
 * @api public
 */

exports.Manager = _dereq_('./manager');
exports.Socket = _dereq_('./socket');

},{"./manager":2,"./socket":4,"./url":5,"debug":14,"socket.io-parser":40}],2:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var eio = _dereq_('engine.io-client');
var Socket = _dereq_('./socket');
var Emitter = _dereq_('component-emitter');
var parser = _dereq_('socket.io-parser');
var on = _dereq_('./on');
var bind = _dereq_('component-bind');
var debug = _dereq_('debug')('socket.io-client:manager');
var indexOf = _dereq_('indexof');
var Backoff = _dereq_('backo2');

/**
 * IE6+ hasOwnProperty
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Module exports
 */

module.exports = Manager;

/**
 * `Manager` constructor.
 *
 * @param {String} engine instance or engine uri/opts
 * @param {Object} options
 * @api public
 */

function Manager(uri, opts){
  if (!(this instanceof Manager)) return new Manager(uri, opts);
  if (uri && ('object' == typeof uri)) {
    opts = uri;
    uri = undefined;
  }
  opts = opts || {};

  opts.path = opts.path || '/socket.io';
  this.nsps = {};
  this.subs = [];
  this.opts = opts;
  this.reconnection(opts.reconnection !== false);
  this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
  this.reconnectionDelay(opts.reconnectionDelay || 1000);
  this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);
  this.randomizationFactor(opts.randomizationFactor || 0.5);
  this.backoff = new Backoff({
    min: this.reconnectionDelay(),
    max: this.reconnectionDelayMax(),
    jitter: this.randomizationFactor()
  });
  this.timeout(null == opts.timeout ? 20000 : opts.timeout);
  this.readyState = 'closed';
  this.uri = uri;
  this.connecting = [];
  this.lastPing = null;
  this.encoding = false;
  this.packetBuffer = [];
  this.encoder = new parser.Encoder();
  this.decoder = new parser.Decoder();
  this.autoConnect = opts.autoConnect !== false;
  if (this.autoConnect) this.open();
}

/**
 * Propagate given event to sockets and emit on `this`
 *
 * @api private
 */

Manager.prototype.emitAll = function() {
  this.emit.apply(this, arguments);
  for (var nsp in this.nsps) {
    if (has.call(this.nsps, nsp)) {
      this.nsps[nsp].emit.apply(this.nsps[nsp], arguments);
    }
  }
};

/**
 * Update `socket.id` of all sockets
 *
 * @api private
 */

Manager.prototype.updateSocketIds = function(){
  for (var nsp in this.nsps) {
    if (has.call(this.nsps, nsp)) {
      this.nsps[nsp].id = this.engine.id;
    }
  }
};

/**
 * Mix in `Emitter`.
 */

Emitter(Manager.prototype);

/**
 * Sets the `reconnection` config.
 *
 * @param {Boolean} true/false if it should automatically reconnect
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnection = function(v){
  if (!arguments.length) return this._reconnection;
  this._reconnection = !!v;
  return this;
};

/**
 * Sets the reconnection attempts config.
 *
 * @param {Number} max reconnection attempts before giving up
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionAttempts = function(v){
  if (!arguments.length) return this._reconnectionAttempts;
  this._reconnectionAttempts = v;
  return this;
};

/**
 * Sets the delay between reconnections.
 *
 * @param {Number} delay
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionDelay = function(v){
  if (!arguments.length) return this._reconnectionDelay;
  this._reconnectionDelay = v;
  this.backoff && this.backoff.setMin(v);
  return this;
};

Manager.prototype.randomizationFactor = function(v){
  if (!arguments.length) return this._randomizationFactor;
  this._randomizationFactor = v;
  this.backoff && this.backoff.setJitter(v);
  return this;
};

/**
 * Sets the maximum delay between reconnections.
 *
 * @param {Number} delay
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionDelayMax = function(v){
  if (!arguments.length) return this._reconnectionDelayMax;
  this._reconnectionDelayMax = v;
  this.backoff && this.backoff.setMax(v);
  return this;
};

/**
 * Sets the connection timeout. `false` to disable
 *
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.timeout = function(v){
  if (!arguments.length) return this._timeout;
  this._timeout = v;
  return this;
};

/**
 * Starts trying to reconnect if reconnection is enabled and we have not
 * started reconnecting yet
 *
 * @api private
 */

Manager.prototype.maybeReconnectOnOpen = function() {
  // Only try to reconnect if it's the first time we're connecting
  if (!this.reconnecting && this._reconnection && this.backoff.attempts === 0) {
    // keeps reconnection from firing twice for the same reconnection loop
    this.reconnect();
  }
};


/**
 * Sets the current transport `socket`.
 *
 * @param {Function} optional, callback
 * @return {Manager} self
 * @api public
 */

Manager.prototype.open =
Manager.prototype.connect = function(fn){
  debug('readyState %s', this.readyState);
  if (~this.readyState.indexOf('open')) return this;

  debug('opening %s', this.uri);
  this.engine = eio(this.uri, this.opts);
  var socket = this.engine;
  var self = this;
  this.readyState = 'opening';
  this.skipReconnect = false;

  // emit `open`
  var openSub = on(socket, 'open', function() {
    self.onopen();
    fn && fn();
  });

  // emit `connect_error`
  var errorSub = on(socket, 'error', function(data){
    debug('connect_error');
    self.cleanup();
    self.readyState = 'closed';
    self.emitAll('connect_error', data);
    if (fn) {
      var err = new Error('Connection error');
      err.data = data;
      fn(err);
    } else {
      // Only do this if there is no fn to handle the error
      self.maybeReconnectOnOpen();
    }
  });

  // emit `connect_timeout`
  if (false !== this._timeout) {
    var timeout = this._timeout;
    debug('connect attempt will timeout after %d', timeout);

    // set timer
    var timer = setTimeout(function(){
      debug('connect attempt timed out after %d', timeout);
      openSub.destroy();
      socket.close();
      socket.emit('error', 'timeout');
      self.emitAll('connect_timeout', timeout);
    }, timeout);

    this.subs.push({
      destroy: function(){
        clearTimeout(timer);
      }
    });
  }

  this.subs.push(openSub);
  this.subs.push(errorSub);

  return this;
};

/**
 * Called upon transport open.
 *
 * @api private
 */

Manager.prototype.onopen = function(){
  debug('open');

  // clear old subs
  this.cleanup();

  // mark as open
  this.readyState = 'open';
  this.emit('open');

  // add new subs
  var socket = this.engine;
  this.subs.push(on(socket, 'data', bind(this, 'ondata')));
  this.subs.push(on(socket, 'ping', bind(this, 'onping')));
  this.subs.push(on(socket, 'pong', bind(this, 'onpong')));
  this.subs.push(on(socket, 'error', bind(this, 'onerror')));
  this.subs.push(on(socket, 'close', bind(this, 'onclose')));
  this.subs.push(on(this.decoder, 'decoded', bind(this, 'ondecoded')));
};

/**
 * Called upon a ping.
 *
 * @api private
 */

Manager.prototype.onping = function(){
  this.lastPing = new Date;
  this.emitAll('ping');
};

/**
 * Called upon a packet.
 *
 * @api private
 */

Manager.prototype.onpong = function(){
  this.emitAll('pong', new Date - this.lastPing);
};

/**
 * Called with data.
 *
 * @api private
 */

Manager.prototype.ondata = function(data){
  this.decoder.add(data);
};

/**
 * Called when parser fully decodes a packet.
 *
 * @api private
 */

Manager.prototype.ondecoded = function(packet) {
  this.emit('packet', packet);
};

/**
 * Called upon socket error.
 *
 * @api private
 */

Manager.prototype.onerror = function(err){
  debug('error', err);
  this.emitAll('error', err);
};

/**
 * Creates a new socket for the given `nsp`.
 *
 * @return {Socket}
 * @api public
 */

Manager.prototype.socket = function(nsp){
  var socket = this.nsps[nsp];
  if (!socket) {
    socket = new Socket(this, nsp);
    this.nsps[nsp] = socket;
    var self = this;
    socket.on('connecting', onConnecting);
    socket.on('connect', function(){
      socket.id = self.engine.id;
    });

    if (this.autoConnect) {
      // manually call here since connecting evnet is fired before listening
      onConnecting();
    }
  }

  function onConnecting() {
    if (!~indexOf(self.connecting, socket)) {
      self.connecting.push(socket);
    }
  }

  return socket;
};

/**
 * Called upon a socket close.
 *
 * @param {Socket} socket
 */

Manager.prototype.destroy = function(socket){
  var index = indexOf(this.connecting, socket);
  if (~index) this.connecting.splice(index, 1);
  if (this.connecting.length) return;

  this.close();
};

/**
 * Writes a packet.
 *
 * @param {Object} packet
 * @api private
 */

Manager.prototype.packet = function(packet){
  debug('writing packet %j', packet);
  var self = this;

  if (!self.encoding) {
    // encode, then write to engine with result
    self.encoding = true;
    this.encoder.encode(packet, function(encodedPackets) {
      for (var i = 0; i < encodedPackets.length; i++) {
        self.engine.write(encodedPackets[i], packet.options);
      }
      self.encoding = false;
      self.processPacketQueue();
    });
  } else { // add packet to the queue
    self.packetBuffer.push(packet);
  }
};

/**
 * If packet buffer is non-empty, begins encoding the
 * next packet in line.
 *
 * @api private
 */

Manager.prototype.processPacketQueue = function() {
  if (this.packetBuffer.length > 0 && !this.encoding) {
    var pack = this.packetBuffer.shift();
    this.packet(pack);
  }
};

/**
 * Clean up transport subscriptions and packet buffer.
 *
 * @api private
 */

Manager.prototype.cleanup = function(){
  debug('cleanup');

  var sub;
  while (sub = this.subs.shift()) sub.destroy();

  this.packetBuffer = [];
  this.encoding = false;
  this.lastPing = null;

  this.decoder.destroy();
};

/**
 * Close the current socket.
 *
 * @api private
 */

Manager.prototype.close =
Manager.prototype.disconnect = function(){
  debug('disconnect');
  this.skipReconnect = true;
  this.reconnecting = false;
  if ('opening' == this.readyState) {
    // `onclose` will not fire because
    // an open event never happened
    this.cleanup();
  }
  this.backoff.reset();
  this.readyState = 'closed';
  if (this.engine) this.engine.close();
};

/**
 * Called upon engine close.
 *
 * @api private
 */

Manager.prototype.onclose = function(reason){
  debug('onclose');

  this.cleanup();
  this.backoff.reset();
  this.readyState = 'closed';
  this.emit('close', reason);

  if (this._reconnection && !this.skipReconnect) {
    this.reconnect();
  }
};

/**
 * Attempt a reconnection.
 *
 * @api private
 */

Manager.prototype.reconnect = function(){
  if (this.reconnecting || this.skipReconnect) return this;

  var self = this;

  if (this.backoff.attempts >= this._reconnectionAttempts) {
    debug('reconnect failed');
    this.backoff.reset();
    this.emitAll('reconnect_failed');
    this.reconnecting = false;
  } else {
    var delay = this.backoff.duration();
    debug('will wait %dms before reconnect attempt', delay);

    this.reconnecting = true;
    var timer = setTimeout(function(){
      if (self.skipReconnect) return;

      debug('attempting reconnect');
      self.emitAll('reconnect_attempt', self.backoff.attempts);
      self.emitAll('reconnecting', self.backoff.attempts);

      // check again for the case socket closed in above events
      if (self.skipReconnect) return;

      self.open(function(err){
        if (err) {
          debug('reconnect attempt error');
          self.reconnecting = false;
          self.reconnect();
          self.emitAll('reconnect_error', err.data);
        } else {
          debug('reconnect success');
          self.onreconnect();
        }
      });
    }, delay);

    this.subs.push({
      destroy: function(){
        clearTimeout(timer);
      }
    });
  }
};

/**
 * Called upon successful reconnect.
 *
 * @api private
 */

Manager.prototype.onreconnect = function(){
  var attempt = this.backoff.attempts;
  this.reconnecting = false;
  this.backoff.reset();
  this.updateSocketIds();
  this.emitAll('reconnect', attempt);
};

},{"./on":3,"./socket":4,"backo2":8,"component-bind":11,"component-emitter":12,"debug":14,"engine.io-client":16,"indexof":32,"socket.io-parser":40}],3:[function(_dereq_,module,exports){

/**
 * Module exports.
 */

module.exports = on;

/**
 * Helper for subscriptions.
 *
 * @param {Object|EventEmitter} obj with `Emitter` mixin or `EventEmitter`
 * @param {String} event name
 * @param {Function} callback
 * @api public
 */

function on(obj, ev, fn) {
  obj.on(ev, fn);
  return {
    destroy: function(){
      obj.removeListener(ev, fn);
    }
  };
}

},{}],4:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var parser = _dereq_('socket.io-parser');
var Emitter = _dereq_('component-emitter');
var toArray = _dereq_('to-array');
var on = _dereq_('./on');
var bind = _dereq_('component-bind');
var debug = _dereq_('debug')('socket.io-client:socket');
var hasBin = _dereq_('has-binary');

/**
 * Module exports.
 */

module.exports = exports = Socket;

/**
 * Internal events (blacklisted).
 * These events can't be emitted by the user.
 *
 * @api private
 */

var events = {
  connect: 1,
  connect_error: 1,
  connect_timeout: 1,
  connecting: 1,
  disconnect: 1,
  error: 1,
  reconnect: 1,
  reconnect_attempt: 1,
  reconnect_failed: 1,
  reconnect_error: 1,
  reconnecting: 1,
  ping: 1,
  pong: 1
};

/**
 * Shortcut to `Emitter#emit`.
 */

var emit = Emitter.prototype.emit;

/**
 * `Socket` constructor.
 *
 * @api public
 */

function Socket(io, nsp){
  this.io = io;
  this.nsp = nsp;
  this.json = this; // compat
  this.ids = 0;
  this.acks = {};
  this.receiveBuffer = [];
  this.sendBuffer = [];
  this.connected = false;
  this.disconnected = true;
  if (this.io.autoConnect) this.open();
}

/**
 * Mix in `Emitter`.
 */

Emitter(Socket.prototype);

/**
 * Subscribe to open, close and packet events
 *
 * @api private
 */

Socket.prototype.subEvents = function() {
  if (this.subs) return;

  var io = this.io;
  this.subs = [
    on(io, 'open', bind(this, 'onopen')),
    on(io, 'packet', bind(this, 'onpacket')),
    on(io, 'close', bind(this, 'onclose'))
  ];
};

/**
 * "Opens" the socket.
 *
 * @api public
 */

Socket.prototype.open =
Socket.prototype.connect = function(){
  if (this.connected) return this;

  this.subEvents();
  this.io.open(); // ensure open
  if ('open' == this.io.readyState) this.onopen();
  this.emit('connecting');
  return this;
};

/**
 * Sends a `message` event.
 *
 * @return {Socket} self
 * @api public
 */

Socket.prototype.send = function(){
  var args = toArray(arguments);
  args.unshift('message');
  this.emit.apply(this, args);
  return this;
};

/**
 * Override `emit`.
 * If the event is in `events`, it's emitted normally.
 *
 * @param {String} event name
 * @return {Socket} self
 * @api public
 */

Socket.prototype.emit = function(ev){
  if (events.hasOwnProperty(ev)) {
    emit.apply(this, arguments);
    return this;
  }

  var args = toArray(arguments);
  var parserType = parser.EVENT; // default
  if (hasBin(args)) { parserType = parser.BINARY_EVENT; } // binary
  var packet = { type: parserType, data: args };

  packet.options = {};
  packet.options.compress = !this.flags || false !== this.flags.compress;

  // event ack callback
  if ('function' == typeof args[args.length - 1]) {
    debug('emitting packet with ack id %d', this.ids);
    this.acks[this.ids] = args.pop();
    packet.id = this.ids++;
  }

  if (this.connected) {
    this.packet(packet);
  } else {
    this.sendBuffer.push(packet);
  }

  delete this.flags;

  return this;
};

/**
 * Sends a packet.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.packet = function(packet){
  packet.nsp = this.nsp;
  this.io.packet(packet);
};

/**
 * Called upon engine `open`.
 *
 * @api private
 */

Socket.prototype.onopen = function(){
  debug('transport is open - connecting');

  // write connect packet if necessary
  if ('/' != this.nsp) {
    this.packet({ type: parser.CONNECT });
  }
};

/**
 * Called upon engine `close`.
 *
 * @param {String} reason
 * @api private
 */

Socket.prototype.onclose = function(reason){
  debug('close (%s)', reason);
  this.connected = false;
  this.disconnected = true;
  delete this.id;
  this.emit('disconnect', reason);
};

/**
 * Called with socket packet.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onpacket = function(packet){
  if (packet.nsp != this.nsp) return;

  switch (packet.type) {
    case parser.CONNECT:
      this.onconnect();
      break;

    case parser.EVENT:
      this.onevent(packet);
      break;

    case parser.BINARY_EVENT:
      this.onevent(packet);
      break;

    case parser.ACK:
      this.onack(packet);
      break;

    case parser.BINARY_ACK:
      this.onack(packet);
      break;

    case parser.DISCONNECT:
      this.ondisconnect();
      break;

    case parser.ERROR:
      this.emit('error', packet.data);
      break;
  }
};

/**
 * Called upon a server event.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onevent = function(packet){
  var args = packet.data || [];
  debug('emitting event %j', args);

  if (null != packet.id) {
    debug('attaching ack callback to event');
    args.push(this.ack(packet.id));
  }

  if (this.connected) {
    emit.apply(this, args);
  } else {
    this.receiveBuffer.push(args);
  }
};

/**
 * Produces an ack callback to emit with an event.
 *
 * @api private
 */

Socket.prototype.ack = function(id){
  var self = this;
  var sent = false;
  return function(){
    // prevent double callbacks
    if (sent) return;
    sent = true;
    var args = toArray(arguments);
    debug('sending ack %j', args);

    var type = hasBin(args) ? parser.BINARY_ACK : parser.ACK;
    self.packet({
      type: type,
      id: id,
      data: args
    });
  };
};

/**
 * Called upon a server acknowlegement.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onack = function(packet){
  var ack = this.acks[packet.id];
  if ('function' == typeof ack) {
    debug('calling ack %s with %j', packet.id, packet.data);
    ack.apply(this, packet.data);
    delete this.acks[packet.id];
  } else {
    debug('bad ack %s', packet.id);
  }
};

/**
 * Called upon server connect.
 *
 * @api private
 */

Socket.prototype.onconnect = function(){
  this.connected = true;
  this.disconnected = false;
  this.emit('connect');
  this.emitBuffered();
};

/**
 * Emit buffered events (received and emitted).
 *
 * @api private
 */

Socket.prototype.emitBuffered = function(){
  var i;
  for (i = 0; i < this.receiveBuffer.length; i++) {
    emit.apply(this, this.receiveBuffer[i]);
  }
  this.receiveBuffer = [];

  for (i = 0; i < this.sendBuffer.length; i++) {
    this.packet(this.sendBuffer[i]);
  }
  this.sendBuffer = [];
};

/**
 * Called upon server disconnect.
 *
 * @api private
 */

Socket.prototype.ondisconnect = function(){
  debug('server disconnect (%s)', this.nsp);
  this.destroy();
  this.onclose('io server disconnect');
};

/**
 * Called upon forced client/server side disconnections,
 * this method ensures the manager stops tracking us and
 * that reconnections don't get triggered for this.
 *
 * @api private.
 */

Socket.prototype.destroy = function(){
  if (this.subs) {
    // clean subscriptions to avoid reconnections
    for (var i = 0; i < this.subs.length; i++) {
      this.subs[i].destroy();
    }
    this.subs = null;
  }

  this.io.destroy(this);
};

/**
 * Disconnects the socket manually.
 *
 * @return {Socket} self
 * @api public
 */

Socket.prototype.close =
Socket.prototype.disconnect = function(){
  if (this.connected) {
    debug('performing disconnect (%s)', this.nsp);
    this.packet({ type: parser.DISCONNECT });
  }

  // remove socket from pool
  this.destroy();

  if (this.connected) {
    // fire events
    this.onclose('io client disconnect');
  }
  return this;
};

/**
 * Sets the compress flag.
 *
 * @param {Boolean} if `true`, compresses the sending data
 * @return {Socket} self
 * @api public
 */

Socket.prototype.compress = function(compress){
  this.flags = this.flags || {};
  this.flags.compress = compress;
  return this;
};

},{"./on":3,"component-bind":11,"component-emitter":12,"debug":14,"has-binary":30,"socket.io-parser":40,"to-array":43}],5:[function(_dereq_,module,exports){
(function (global){

/**
 * Module dependencies.
 */

var parseuri = _dereq_('parseuri');
var debug = _dereq_('debug')('socket.io-client:url');

/**
 * Module exports.
 */

module.exports = url;

/**
 * URL parser.
 *
 * @param {String} url
 * @param {Object} An object meant to mimic window.location.
 *                 Defaults to window.location.
 * @api public
 */

function url(uri, loc){
  var obj = uri;

  // default to window.location
  var loc = loc || global.location;
  if (null == uri) uri = loc.protocol + '//' + loc.host;

  // relative path support
  if ('string' == typeof uri) {
    if ('/' == uri.charAt(0)) {
      if ('/' == uri.charAt(1)) {
        uri = loc.protocol + uri;
      } else {
        uri = loc.host + uri;
      }
    }

    if (!/^(https?|wss?):\/\//.test(uri)) {
      debug('protocol-less url %s', uri);
      if ('undefined' != typeof loc) {
        uri = loc.protocol + '//' + uri;
      } else {
        uri = 'https://' + uri;
      }
    }

    // parse
    debug('parse %s', uri);
    obj = parseuri(uri);
  }

  // make sure we treat `localhost:80` and `localhost` equally
  if (!obj.port) {
    if (/^(http|ws)$/.test(obj.protocol)) {
      obj.port = '80';
    }
    else if (/^(http|ws)s$/.test(obj.protocol)) {
      obj.port = '443';
    }
  }

  obj.path = obj.path || '/';

  var ipv6 = obj.host.indexOf(':') !== -1;
  var host = ipv6 ? '[' + obj.host + ']' : obj.host;

  // define unique id
  obj.id = obj.protocol + '://' + host + ':' + obj.port;
  // define href
  obj.href = obj.protocol + '://' + host + (loc && loc.port == obj.port ? '' : (':' + obj.port));

  return obj;
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{"debug":14,"parseuri":38}],6:[function(_dereq_,module,exports){
module.exports = after

function after(count, callback, err_cb) {
    var bail = false
    err_cb = err_cb || noop
    proxy.count = count

    return (count === 0) ? callback() : proxy

    function proxy(err, result) {
        if (proxy.count <= 0) {
            throw new Error('after called too many times')
        }
        --proxy.count

        // after first error, rest are passed to err_cb
        if (err) {
            bail = true
            callback(err)
            // future error callbacks will go to error handler
            callback = err_cb
        } else if (proxy.count === 0 && !bail) {
            callback(null, result)
        }
    }
}

function noop() {}

},{}],7:[function(_dereq_,module,exports){
/**
 * An abstraction for slicing an arraybuffer even when
 * ArrayBuffer.prototype.slice is not supported
 *
 * @api public
 */

module.exports = function(arraybuffer, start, end) {
  var bytes = arraybuffer.byteLength;
  start = start || 0;
  end = end || bytes;

  if (arraybuffer.slice) { return arraybuffer.slice(start, end); }

  if (start < 0) { start += bytes; }
  if (end < 0) { end += bytes; }
  if (end > bytes) { end = bytes; }

  if (start >= bytes || start >= end || bytes === 0) {
    return new ArrayBuffer(0);
  }

  var abv = new Uint8Array(arraybuffer);
  var result = new Uint8Array(end - start);
  for (var i = start, ii = 0; i < end; i++, ii++) {
    result[ii] = abv[i];
  }
  return result.buffer;
};

},{}],8:[function(_dereq_,module,exports){

/**
 * Expose `Backoff`.
 */

module.exports = Backoff;

/**
 * Initialize backoff timer with `opts`.
 *
 * - `min` initial timeout in milliseconds [100]
 * - `max` max timeout [10000]
 * - `jitter` [0]
 * - `factor` [2]
 *
 * @param {Object} opts
 * @api public
 */

function Backoff(opts) {
  opts = opts || {};
  this.ms = opts.min || 100;
  this.max = opts.max || 10000;
  this.factor = opts.factor || 2;
  this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
  this.attempts = 0;
}

/**
 * Return the backoff duration.
 *
 * @return {Number}
 * @api public
 */

Backoff.prototype.duration = function(){
  var ms = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var rand =  Math.random();
    var deviation = Math.floor(rand * this.jitter * ms);
    ms = (Math.floor(rand * 10) & 1) == 0  ? ms - deviation : ms + deviation;
  }
  return Math.min(ms, this.max) | 0;
};

/**
 * Reset the number of attempts.
 *
 * @api public
 */

Backoff.prototype.reset = function(){
  this.attempts = 0;
};

/**
 * Set the minimum duration
 *
 * @api public
 */

Backoff.prototype.setMin = function(min){
  this.ms = min;
};

/**
 * Set the maximum duration
 *
 * @api public
 */

Backoff.prototype.setMax = function(max){
  this.max = max;
};

/**
 * Set the jitter
 *
 * @api public
 */

Backoff.prototype.setJitter = function(jitter){
  this.jitter = jitter;
};


},{}],9:[function(_dereq_,module,exports){
/*
 * base64-arraybuffer
 * https://github.com/niklasvh/base64-arraybuffer
 *
 * Copyright (c) 2012 Niklas von Hertzen
 * Licensed under the MIT license.
 */
(function(){
  "use strict";

  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  // Use a lookup table to find the index.
  var lookup = new Uint8Array(256);
  for (var i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
  }

  exports.encode = function(arraybuffer) {
    var bytes = new Uint8Array(arraybuffer),
    i, len = bytes.length, base64 = "";

    for (i = 0; i < len; i+=3) {
      base64 += chars[bytes[i] >> 2];
      base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
      base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
      base64 += chars[bytes[i + 2] & 63];
    }

    if ((len % 3) === 2) {
      base64 = base64.substring(0, base64.length - 1) + "=";
    } else if (len % 3 === 1) {
      base64 = base64.substring(0, base64.length - 2) + "==";
    }

    return base64;
  };

  exports.decode =  function(base64) {
    var bufferLength = base64.length * 0.75,
    len = base64.length, i, p = 0,
    encoded1, encoded2, encoded3, encoded4;

    if (base64[base64.length - 1] === "=") {
      bufferLength--;
      if (base64[base64.length - 2] === "=") {
        bufferLength--;
      }
    }

    var arraybuffer = new ArrayBuffer(bufferLength),
    bytes = new Uint8Array(arraybuffer);

    for (i = 0; i < len; i+=4) {
      encoded1 = lookup[base64.charCodeAt(i)];
      encoded2 = lookup[base64.charCodeAt(i+1)];
      encoded3 = lookup[base64.charCodeAt(i+2)];
      encoded4 = lookup[base64.charCodeAt(i+3)];

      bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }

    return arraybuffer;
  };
})();

},{}],10:[function(_dereq_,module,exports){
(function (global){
/**
 * Create a blob builder even when vendor prefixes exist
 */

var BlobBuilder = global.BlobBuilder
  || global.WebKitBlobBuilder
  || global.MSBlobBuilder
  || global.MozBlobBuilder;

/**
 * Check if Blob constructor is supported
 */

var blobSupported = (function() {
  try {
    var a = new Blob(['hi']);
    return a.size === 2;
  } catch(e) {
    return false;
  }
})();

/**
 * Check if Blob constructor supports ArrayBufferViews
 * Fails in Safari 6, so we need to map to ArrayBuffers there.
 */

var blobSupportsArrayBufferView = blobSupported && (function() {
  try {
    var b = new Blob([new Uint8Array([1,2])]);
    return b.size === 2;
  } catch(e) {
    return false;
  }
})();

/**
 * Check if BlobBuilder is supported
 */

var blobBuilderSupported = BlobBuilder
  && BlobBuilder.prototype.append
  && BlobBuilder.prototype.getBlob;

/**
 * Helper function that maps ArrayBufferViews to ArrayBuffers
 * Used by BlobBuilder constructor and old browsers that didn't
 * support it in the Blob constructor.
 */

function mapArrayBufferViews(ary) {
  for (var i = 0; i < ary.length; i++) {
    var chunk = ary[i];
    if (chunk.buffer instanceof ArrayBuffer) {
      var buf = chunk.buffer;

      // if this is a subarray, make a copy so we only
      // include the subarray region from the underlying buffer
      if (chunk.byteLength !== buf.byteLength) {
        var copy = new Uint8Array(chunk.byteLength);
        copy.set(new Uint8Array(buf, chunk.byteOffset, chunk.byteLength));
        buf = copy.buffer;
      }

      ary[i] = buf;
    }
  }
}

function BlobBuilderConstructor(ary, options) {
  options = options || {};

  var bb = new BlobBuilder();
  mapArrayBufferViews(ary);

  for (var i = 0; i < ary.length; i++) {
    bb.append(ary[i]);
  }

  return (options.type) ? bb.getBlob(options.type) : bb.getBlob();
};

function BlobConstructor(ary, options) {
  mapArrayBufferViews(ary);
  return new Blob(ary, options || {});
};

module.exports = (function() {
  if (blobSupported) {
    return blobSupportsArrayBufferView ? global.Blob : BlobConstructor;
  } else if (blobBuilderSupported) {
    return BlobBuilderConstructor;
  } else {
    return undefined;
  }
})();

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{}],11:[function(_dereq_,module,exports){
/**
 * Slice reference.
 */

var slice = [].slice;

/**
 * Bind `obj` to `fn`.
 *
 * @param {Object} obj
 * @param {Function|String} fn or string
 * @return {Function}
 * @api public
 */

module.exports = function(obj, fn){
  if ('string' == typeof fn) fn = obj[fn];
  if ('function' != typeof fn) throw new Error('bind() requires a function');
  var args = slice.call(arguments, 2);
  return function(){
    return fn.apply(obj, args.concat(slice.call(arguments)));
  }
};

},{}],12:[function(_dereq_,module,exports){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],13:[function(_dereq_,module,exports){

module.exports = function(a, b){
  var fn = function(){};
  fn.prototype = b.prototype;
  a.prototype = new fn;
  a.prototype.constructor = a;
};
},{}],14:[function(_dereq_,module,exports){

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = _dereq_('./debug');
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // is webkit? http://stackoverflow.com/a/16459606/376773
  return ('WebkitAppearance' in document.documentElement.style) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (window.console && (console.firebug || (console.exception && console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  return JSON.stringify(v);
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs() {
  var args = arguments;
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return args;

  var c = 'color: ' + this.color;
  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
  return args;
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}
  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage(){
  try {
    return window.localStorage;
  } catch (e) {}
}

},{"./debug":15}],15:[function(_dereq_,module,exports){

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = _dereq_('ms');

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lowercased letter, i.e. "n".
 */

exports.formatters = {};

/**
 * Previously assigned color.
 */

var prevColor = 0;

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 *
 * @return {Number}
 * @api private
 */

function selectColor() {
  return exports.colors[prevColor++ % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function debug(namespace) {

  // define the `disabled` version
  function disabled() {
  }
  disabled.enabled = false;

  // define the `enabled` version
  function enabled() {

    var self = enabled;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // add the `color` if not set
    if (null == self.useColors) self.useColors = exports.useColors();
    if (null == self.color && self.useColors) self.color = selectColor();

    var args = Array.prototype.slice.call(arguments);

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %o
      args = ['%o'].concat(args);
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    if ('function' === typeof exports.formatArgs) {
      args = exports.formatArgs.apply(self, args);
    }
    var logFn = enabled.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }
  enabled.enabled = true;

  var fn = exports.enabled(namespace) ? enabled : disabled;

  fn.namespace = namespace;

  return fn;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  var split = (namespaces || '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

},{"ms":35}],16:[function(_dereq_,module,exports){

module.exports =  _dereq_('./lib/');

},{"./lib/":17}],17:[function(_dereq_,module,exports){

module.exports = _dereq_('./socket');

/**
 * Exports parser
 *
 * @api public
 *
 */
module.exports.parser = _dereq_('engine.io-parser');

},{"./socket":18,"engine.io-parser":27}],18:[function(_dereq_,module,exports){
(function (global){
/**
 * Module dependencies.
 */

var transports = _dereq_('./transports');
var Emitter = _dereq_('component-emitter');
var debug = _dereq_('debug')('engine.io-client:socket');
var index = _dereq_('indexof');
var parser = _dereq_('engine.io-parser');
var parseuri = _dereq_('parseuri');
var parsejson = _dereq_('parsejson');
var parseqs = _dereq_('parseqs');

/**
 * Module exports.
 */

module.exports = Socket;

/**
 * Noop function.
 *
 * @api private
 */

function noop(){}

/**
 * Socket constructor.
 *
 * @param {String|Object} uri or options
 * @param {Object} options
 * @api public
 */

function Socket(uri, opts){
  if (!(this instanceof Socket)) return new Socket(uri, opts);

  opts = opts || {};

  if (uri && 'object' == typeof uri) {
    opts = uri;
    uri = null;
  }

  if (uri) {
    uri = parseuri(uri);
    opts.hostname = uri.host;
    opts.secure = uri.protocol == 'https' || uri.protocol == 'wss';
    opts.port = uri.port;
    if (uri.query) opts.query = uri.query;
  } else if (opts.host) {
    opts.hostname = parseuri(opts.host).host;
  }

  this.secure = null != opts.secure ? opts.secure :
    (global.location && 'https:' == location.protocol);

  if (opts.hostname && !opts.port) {
    // if no port is specified manually, use the protocol default
    opts.port = this.secure ? '443' : '80';
  }

  this.agent = opts.agent || false;
  this.hostname = opts.hostname ||
    (global.location ? location.hostname : 'localhost');
  this.port = opts.port || (global.location && location.port ?
       location.port :
       (this.secure ? 443 : 80));
  this.query = opts.query || {};
  if ('string' == typeof this.query) this.query = parseqs.decode(this.query);
  this.upgrade = false !== opts.upgrade;
  this.path = (opts.path || '/engine.io').replace(/\/$/, '') + '/';
  this.forceJSONP = !!opts.forceJSONP;
  this.jsonp = false !== opts.jsonp;
  this.forceBase64 = !!opts.forceBase64;
  this.enablesXDR = !!opts.enablesXDR;
  this.timestampParam = opts.timestampParam || 't';
  this.timestampRequests = opts.timestampRequests;
  this.transports = opts.transports || ['polling', 'websocket'];
  this.readyState = '';
  this.writeBuffer = [];
  this.policyPort = opts.policyPort || 843;
  this.rememberUpgrade = opts.rememberUpgrade || false;
  this.binaryType = null;
  this.onlyBinaryUpgrades = opts.onlyBinaryUpgrades;
  this.perMessageDeflate = false !== opts.perMessageDeflate ? (opts.perMessageDeflate || {}) : false;

  if (true === this.perMessageDeflate) this.perMessageDeflate = {};
  if (this.perMessageDeflate && null == this.perMessageDeflate.threshold) {
    this.perMessageDeflate.threshold = 1024;
  }

  // SSL options for Node.js client
  this.pfx = opts.pfx || null;
  this.key = opts.key || null;
  this.passphrase = opts.passphrase || null;
  this.cert = opts.cert || null;
  this.ca = opts.ca || null;
  this.ciphers = opts.ciphers || null;
  this.rejectUnauthorized = opts.rejectUnauthorized === undefined ? true : opts.rejectUnauthorized;

  // other options for Node.js client
  var freeGlobal = typeof global == 'object' && global;
  if (freeGlobal.global === freeGlobal) {
    if (opts.extraHeaders && Object.keys(opts.extraHeaders).length > 0) {
      this.extraHeaders = opts.extraHeaders;
    }
  }

  this.open();
}

Socket.priorWebsocketSuccess = false;

/**
 * Mix in `Emitter`.
 */

Emitter(Socket.prototype);

/**
 * Protocol version.
 *
 * @api public
 */

Socket.protocol = parser.protocol; // this is an int

/**
 * Expose deps for legacy compatibility
 * and standalone browser access.
 */

Socket.Socket = Socket;
Socket.Transport = _dereq_('./transport');
Socket.transports = _dereq_('./transports');
Socket.parser = _dereq_('engine.io-parser');

/**
 * Creates transport of the given type.
 *
 * @param {String} transport name
 * @return {Transport}
 * @api private
 */

Socket.prototype.createTransport = function (name) {
  debug('creating transport "%s"', name);
  var query = clone(this.query);

  // append engine.io protocol identifier
  query.EIO = parser.protocol;

  // transport name
  query.transport = name;

  // session id if we already have one
  if (this.id) query.sid = this.id;

  var transport = new transports[name]({
    agent: this.agent,
    hostname: this.hostname,
    port: this.port,
    secure: this.secure,
    path: this.path,
    query: query,
    forceJSONP: this.forceJSONP,
    jsonp: this.jsonp,
    forceBase64: this.forceBase64,
    enablesXDR: this.enablesXDR,
    timestampRequests: this.timestampRequests,
    timestampParam: this.timestampParam,
    policyPort: this.policyPort,
    socket: this,
    pfx: this.pfx,
    key: this.key,
    passphrase: this.passphrase,
    cert: this.cert,
    ca: this.ca,
    ciphers: this.ciphers,
    rejectUnauthorized: this.rejectUnauthorized,
    perMessageDeflate: this.perMessageDeflate,
    extraHeaders: this.extraHeaders
  });

  return transport;
};

function clone (obj) {
  var o = {};
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      o[i] = obj[i];
    }
  }
  return o;
}

/**
 * Initializes transport to use and starts probe.
 *
 * @api private
 */
Socket.prototype.open = function () {
  var transport;
  if (this.rememberUpgrade && Socket.priorWebsocketSuccess && this.transports.indexOf('websocket') != -1) {
    transport = 'websocket';
  } else if (0 === this.transports.length) {
    // Emit error on next tick so it can be listened to
    var self = this;
    setTimeout(function() {
      self.emit('error', 'No transports available');
    }, 0);
    return;
  } else {
    transport = this.transports[0];
  }
  this.readyState = 'opening';

  // Retry with the next transport if the transport is disabled (jsonp: false)
  try {
    transport = this.createTransport(transport);
  } catch (e) {
    this.transports.shift();
    this.open();
    return;
  }

  transport.open();
  this.setTransport(transport);
};

/**
 * Sets the current transport. Disables the existing one (if any).
 *
 * @api private
 */

Socket.prototype.setTransport = function(transport){
  debug('setting transport %s', transport.name);
  var self = this;

  if (this.transport) {
    debug('clearing existing transport %s', this.transport.name);
    this.transport.removeAllListeners();
  }

  // set up transport
  this.transport = transport;

  // set up transport listeners
  transport
  .on('drain', function(){
    self.onDrain();
  })
  .on('packet', function(packet){
    self.onPacket(packet);
  })
  .on('error', function(e){
    self.onError(e);
  })
  .on('close', function(){
    self.onClose('transport close');
  });
};

/**
 * Probes a transport.
 *
 * @param {String} transport name
 * @api private
 */

Socket.prototype.probe = function (name) {
  debug('probing transport "%s"', name);
  var transport = this.createTransport(name, { probe: 1 })
    , failed = false
    , self = this;

  Socket.priorWebsocketSuccess = false;

  function onTransportOpen(){
    if (self.onlyBinaryUpgrades) {
      var upgradeLosesBinary = !this.supportsBinary && self.transport.supportsBinary;
      failed = failed || upgradeLosesBinary;
    }
    if (failed) return;

    debug('probe transport "%s" opened', name);
    transport.send([{ type: 'ping', data: 'probe' }]);
    transport.once('packet', function (msg) {
      if (failed) return;
      if ('pong' == msg.type && 'probe' == msg.data) {
        debug('probe transport "%s" pong', name);
        self.upgrading = true;
        self.emit('upgrading', transport);
        if (!transport) return;
        Socket.priorWebsocketSuccess = 'websocket' == transport.name;

        debug('pausing current transport "%s"', self.transport.name);
        self.transport.pause(function () {
          if (failed) return;
          if ('closed' == self.readyState) return;
          debug('changing transport and sending upgrade packet');

          cleanup();

          self.setTransport(transport);
          transport.send([{ type: 'upgrade' }]);
          self.emit('upgrade', transport);
          transport = null;
          self.upgrading = false;
          self.flush();
        });
      } else {
        debug('probe transport "%s" failed', name);
        var err = new Error('probe error');
        err.transport = transport.name;
        self.emit('upgradeError', err);
      }
    });
  }

  function freezeTransport() {
    if (failed) return;

    // Any callback called by transport should be ignored since now
    failed = true;

    cleanup();

    transport.close();
    transport = null;
  }

  //Handle any error that happens while probing
  function onerror(err) {
    var error = new Error('probe error: ' + err);
    error.transport = transport.name;

    freezeTransport();

    debug('probe transport "%s" failed because of error: %s', name, err);

    self.emit('upgradeError', error);
  }

  function onTransportClose(){
    onerror("transport closed");
  }

  //When the socket is closed while we're probing
  function onclose(){
    onerror("socket closed");
  }

  //When the socket is upgraded while we're probing
  function onupgrade(to){
    if (transport && to.name != transport.name) {
      debug('"%s" works - aborting "%s"', to.name, transport.name);
      freezeTransport();
    }
  }

  //Remove all listeners on the transport and on self
  function cleanup(){
    transport.removeListener('open', onTransportOpen);
    transport.removeListener('error', onerror);
    transport.removeListener('close', onTransportClose);
    self.removeListener('close', onclose);
    self.removeListener('upgrading', onupgrade);
  }

  transport.once('open', onTransportOpen);
  transport.once('error', onerror);
  transport.once('close', onTransportClose);

  this.once('close', onclose);
  this.once('upgrading', onupgrade);

  transport.open();

};

/**
 * Called when connection is deemed open.
 *
 * @api public
 */

Socket.prototype.onOpen = function () {
  debug('socket open');
  this.readyState = 'open';
  Socket.priorWebsocketSuccess = 'websocket' == this.transport.name;
  this.emit('open');
  this.flush();

  // we check for `readyState` in case an `open`
  // listener already closed the socket
  if ('open' == this.readyState && this.upgrade && this.transport.pause) {
    debug('starting upgrade probes');
    for (var i = 0, l = this.upgrades.length; i < l; i++) {
      this.probe(this.upgrades[i]);
    }
  }
};

/**
 * Handles a packet.
 *
 * @api private
 */

Socket.prototype.onPacket = function (packet) {
  if ('opening' == this.readyState || 'open' == this.readyState) {
    debug('socket receive: type "%s", data "%s"', packet.type, packet.data);

    this.emit('packet', packet);

    // Socket is live - any packet counts
    this.emit('heartbeat');

    switch (packet.type) {
      case 'open':
        this.onHandshake(parsejson(packet.data));
        break;

      case 'pong':
        this.setPing();
        this.emit('pong');
        break;

      case 'error':
        var err = new Error('server error');
        err.code = packet.data;
        this.onError(err);
        break;

      case 'message':
        this.emit('data', packet.data);
        this.emit('message', packet.data);
        break;
    }
  } else {
    debug('packet received with socket readyState "%s"', this.readyState);
  }
};

/**
 * Called upon handshake completion.
 *
 * @param {Object} handshake obj
 * @api private
 */

Socket.prototype.onHandshake = function (data) {
  this.emit('handshake', data);
  this.id = data.sid;
  this.transport.query.sid = data.sid;
  this.upgrades = this.filterUpgrades(data.upgrades);
  this.pingInterval = data.pingInterval;
  this.pingTimeout = data.pingTimeout;
  this.onOpen();
  // In case open handler closes socket
  if  ('closed' == this.readyState) return;
  this.setPing();

  // Prolong liveness of socket on heartbeat
  this.removeListener('heartbeat', this.onHeartbeat);
  this.on('heartbeat', this.onHeartbeat);
};

/**
 * Resets ping timeout.
 *
 * @api private
 */

Socket.prototype.onHeartbeat = function (timeout) {
  clearTimeout(this.pingTimeoutTimer);
  var self = this;
  self.pingTimeoutTimer = setTimeout(function () {
    if ('closed' == self.readyState) return;
    self.onClose('ping timeout');
  }, timeout || (self.pingInterval + self.pingTimeout));
};

/**
 * Pings server every `this.pingInterval` and expects response
 * within `this.pingTimeout` or closes connection.
 *
 * @api private
 */

Socket.prototype.setPing = function () {
  var self = this;
  clearTimeout(self.pingIntervalTimer);
  self.pingIntervalTimer = setTimeout(function () {
    debug('writing ping packet - expecting pong within %sms', self.pingTimeout);
    self.ping();
    self.onHeartbeat(self.pingTimeout);
  }, self.pingInterval);
};

/**
* Sends a ping packet.
*
* @api private
*/

Socket.prototype.ping = function () {
  var self = this;
  this.sendPacket('ping', function(){
    self.emit('ping');
  });
};

/**
 * Called on `drain` event
 *
 * @api private
 */

Socket.prototype.onDrain = function() {
  this.writeBuffer.splice(0, this.prevBufferLen);

  // setting prevBufferLen = 0 is very important
  // for example, when upgrading, upgrade packet is sent over,
  // and a nonzero prevBufferLen could cause problems on `drain`
  this.prevBufferLen = 0;

  if (0 === this.writeBuffer.length) {
    this.emit('drain');
  } else {
    this.flush();
  }
};

/**
 * Flush write buffers.
 *
 * @api private
 */

Socket.prototype.flush = function () {
  if ('closed' != this.readyState && this.transport.writable &&
    !this.upgrading && this.writeBuffer.length) {
    debug('flushing %d packets in socket', this.writeBuffer.length);
    this.transport.send(this.writeBuffer);
    // keep track of current length of writeBuffer
    // splice writeBuffer and callbackBuffer on `drain`
    this.prevBufferLen = this.writeBuffer.length;
    this.emit('flush');
  }
};

/**
 * Sends a message.
 *
 * @param {String} message.
 * @param {Function} callback function.
 * @param {Object} options.
 * @return {Socket} for chaining.
 * @api public
 */

Socket.prototype.write =
Socket.prototype.send = function (msg, options, fn) {
  this.sendPacket('message', msg, options, fn);
  return this;
};

/**
 * Sends a packet.
 *
 * @param {String} packet type.
 * @param {String} data.
 * @param {Object} options.
 * @param {Function} callback function.
 * @api private
 */

Socket.prototype.sendPacket = function (type, data, options, fn) {
  if('function' == typeof data) {
    fn = data;
    data = undefined;
  }

  if ('function' == typeof options) {
    fn = options;
    options = null;
  }

  if ('closing' == this.readyState || 'closed' == this.readyState) {
    return;
  }

  options = options || {};
  options.compress = false !== options.compress;

  var packet = {
    type: type,
    data: data,
    options: options
  };
  this.emit('packetCreate', packet);
  this.writeBuffer.push(packet);
  if (fn) this.once('flush', fn);
  this.flush();
};

/**
 * Closes the connection.
 *
 * @api private
 */

Socket.prototype.close = function () {
  if ('opening' == this.readyState || 'open' == this.readyState) {
    this.readyState = 'closing';

    var self = this;

    if (this.writeBuffer.length) {
      this.once('drain', function() {
        if (this.upgrading) {
          waitForUpgrade();
        } else {
          close();
        }
      });
    } else if (this.upgrading) {
      waitForUpgrade();
    } else {
      close();
    }
  }

  function close() {
    self.onClose('forced close');
    debug('socket closing - telling transport to close');
    self.transport.close();
  }

  function cleanupAndClose() {
    self.removeListener('upgrade', cleanupAndClose);
    self.removeListener('upgradeError', cleanupAndClose);
    close();
  }

  function waitForUpgrade() {
    // wait for upgrade to finish since we can't send packets while pausing a transport
    self.once('upgrade', cleanupAndClose);
    self.once('upgradeError', cleanupAndClose);
  }

  return this;
};

/**
 * Called upon transport error
 *
 * @api private
 */

Socket.prototype.onError = function (err) {
  debug('socket error %j', err);
  Socket.priorWebsocketSuccess = false;
  this.emit('error', err);
  this.onClose('transport error', err);
};

/**
 * Called upon transport close.
 *
 * @api private
 */

Socket.prototype.onClose = function (reason, desc) {
  if ('opening' == this.readyState || 'open' == this.readyState || 'closing' == this.readyState) {
    debug('socket close with reason: "%s"', reason);
    var self = this;

    // clear timers
    clearTimeout(this.pingIntervalTimer);
    clearTimeout(this.pingTimeoutTimer);

    // stop event from firing again for transport
    this.transport.removeAllListeners('close');

    // ensure transport won't stay open
    this.transport.close();

    // ignore further transport communication
    this.transport.removeAllListeners();

    // set ready state
    this.readyState = 'closed';

    // clear session id
    this.id = null;

    // emit close event
    this.emit('close', reason, desc);

    // clean buffers after, so users can still
    // grab the buffers on `close` event
    self.writeBuffer = [];
    self.prevBufferLen = 0;
  }
};

/**
 * Filters upgrades, returning only those matching client transports.
 *
 * @param {Array} server upgrades
 * @api private
 *
 */

Socket.prototype.filterUpgrades = function (upgrades) {
  var filteredUpgrades = [];
  for (var i = 0, j = upgrades.length; i<j; i++) {
    if (~index(this.transports, upgrades[i])) filteredUpgrades.push(upgrades[i]);
  }
  return filteredUpgrades;
};

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{"./transport":19,"./transports":20,"component-emitter":26,"debug":14,"engine.io-parser":27,"indexof":32,"parsejson":36,"parseqs":37,"parseuri":38}],19:[function(_dereq_,module,exports){
/**
 * Module dependencies.
 */

var parser = _dereq_('engine.io-parser');
var Emitter = _dereq_('component-emitter');

/**
 * Module exports.
 */

module.exports = Transport;

/**
 * Transport abstract constructor.
 *
 * @param {Object} options.
 * @api private
 */

function Transport (opts) {
  this.path = opts.path;
  this.hostname = opts.hostname;
  this.port = opts.port;
  this.secure = opts.secure;
  this.query = opts.query;
  this.timestampParam = opts.timestampParam;
  this.timestampRequests = opts.timestampRequests;
  this.readyState = '';
  this.agent = opts.agent || false;
  this.socket = opts.socket;
  this.enablesXDR = opts.enablesXDR;

  // SSL options for Node.js client
  this.pfx = opts.pfx;
  this.key = opts.key;
  this.passphrase = opts.passphrase;
  this.cert = opts.cert;
  this.ca = opts.ca;
  this.ciphers = opts.ciphers;
  this.rejectUnauthorized = opts.rejectUnauthorized;

  // other options for Node.js client
  this.extraHeaders = opts.extraHeaders;
}

/**
 * Mix in `Emitter`.
 */

Emitter(Transport.prototype);

/**
 * Emits an error.
 *
 * @param {String} str
 * @return {Transport} for chaining
 * @api public
 */

Transport.prototype.onError = function (msg, desc) {
  var err = new Error(msg);
  err.type = 'TransportError';
  err.description = desc;
  this.emit('error', err);
  return this;
};

/**
 * Opens the transport.
 *
 * @api public
 */

Transport.prototype.open = function () {
  if ('closed' == this.readyState || '' == this.readyState) {
    this.readyState = 'opening';
    this.doOpen();
  }

  return this;
};

/**
 * Closes the transport.
 *
 * @api private
 */

Transport.prototype.close = function () {
  if ('opening' == this.readyState || 'open' == this.readyState) {
    this.doClose();
    this.onClose();
  }

  return this;
};

/**
 * Sends multiple packets.
 *
 * @param {Array} packets
 * @api private
 */

Transport.prototype.send = function(packets){
  if ('open' == this.readyState) {
    this.write(packets);
  } else {
    throw new Error('Transport not open');
  }
};

/**
 * Called upon open
 *
 * @api private
 */

Transport.prototype.onOpen = function () {
  this.readyState = 'open';
  this.writable = true;
  this.emit('open');
};

/**
 * Called with data.
 *
 * @param {String} data
 * @api private
 */

Transport.prototype.onData = function(data){
  var packet = parser.decodePacket(data, this.socket.binaryType);
  this.onPacket(packet);
};

/**
 * Called with a decoded packet.
 */

Transport.prototype.onPacket = function (packet) {
  this.emit('packet', packet);
};

/**
 * Called upon close.
 *
 * @api private
 */

Transport.prototype.onClose = function () {
  this.readyState = 'closed';
  this.emit('close');
};

},{"component-emitter":26,"engine.io-parser":27}],20:[function(_dereq_,module,exports){
(function (global){
/**
 * Module dependencies
 */

var XMLHttpRequest = _dereq_('xmlhttprequest-ssl');
var XHR = _dereq_('./polling-xhr');
var JSONP = _dereq_('./polling-jsonp');
var websocket = _dereq_('./websocket');

/**
 * Export transports.
 */

exports.polling = polling;
exports.websocket = websocket;

/**
 * Polling transport polymorphic constructor.
 * Decides on xhr vs jsonp based on feature detection.
 *
 * @api private
 */

function polling(opts){
  var xhr;
  var xd = false;
  var xs = false;
  var jsonp = false !== opts.jsonp;

  if (global.location) {
    var isSSL = 'https:' == location.protocol;
    var port = location.port;

    // some user agents have empty `location.port`
    if (!port) {
      port = isSSL ? 443 : 80;
    }

    xd = opts.hostname != location.hostname || port != opts.port;
    xs = opts.secure != isSSL;
  }

  opts.xdomain = xd;
  opts.xscheme = xs;
  xhr = new XMLHttpRequest(opts);

  if ('open' in xhr && !opts.forceJSONP) {
    return new XHR(opts);
  } else {
    if (!jsonp) throw new Error('JSONP disabled');
    return new JSONP(opts);
  }
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{"./polling-jsonp":21,"./polling-xhr":22,"./websocket":24,"xmlhttprequest-ssl":25}],21:[function(_dereq_,module,exports){
(function (global){

/**
 * Module requirements.
 */

var Polling = _dereq_('./polling');
var inherit = _dereq_('component-inherit');

/**
 * Module exports.
 */

module.exports = JSONPPolling;

/**
 * Cached regular expressions.
 */

var rNewline = /\n/g;
var rEscapedNewline = /\\n/g;

/**
 * Global JSONP callbacks.
 */

var callbacks;

/**
 * Callbacks count.
 */

var index = 0;

/**
 * Noop.
 */

function empty () { }

/**
 * JSONP Polling constructor.
 *
 * @param {Object} opts.
 * @api public
 */

function JSONPPolling (opts) {
  Polling.call(this, opts);

  this.query = this.query || {};

  // define global callbacks array if not present
  // we do this here (lazily) to avoid unneeded global pollution
  if (!callbacks) {
    // we need to consider multiple engines in the same page
    if (!global.___eio) global.___eio = [];
    callbacks = global.___eio;
  }

  // callback identifier
  this.index = callbacks.length;

  // add callback to jsonp global
  var self = this;
  callbacks.push(function (msg) {
    self.onData(msg);
  });

  // append to query string
  this.query.j = this.index;

  // prevent spurious errors from being emitted when the window is unloaded
  if (global.document && global.addEventListener) {
    global.addEventListener('beforeunload', function () {
      if (self.script) self.script.onerror = empty;
    }, false);
  }
}

/**
 * Inherits from Polling.
 */

inherit(JSONPPolling, Polling);

/*
 * JSONP only supports binary as base64 encoded strings
 */

JSONPPolling.prototype.supportsBinary = false;

/**
 * Closes the socket.
 *
 * @api private
 */

JSONPPolling.prototype.doClose = function () {
  if (this.script) {
    this.script.parentNode.removeChild(this.script);
    this.script = null;
  }

  if (this.form) {
    this.form.parentNode.removeChild(this.form);
    this.form = null;
    this.iframe = null;
  }

  Polling.prototype.doClose.call(this);
};

/**
 * Starts a poll cycle.
 *
 * @api private
 */

JSONPPolling.prototype.doPoll = function () {
  var self = this;
  var script = document.createElement('script');

  if (this.script) {
    this.script.parentNode.removeChild(this.script);
    this.script = null;
  }

  script.async = true;
  script.src = this.uri();
  script.onerror = function(e){
    self.onError('jsonp poll error',e);
  };

  var insertAt = document.getElementsByTagName('script')[0];
  if (insertAt) {
    insertAt.parentNode.insertBefore(script, insertAt);
  }
  else {
    (document.head || document.body).appendChild(script);
  }
  this.script = script;

  var isUAgecko = 'undefined' != typeof navigator && /gecko/i.test(navigator.userAgent);
  
  if (isUAgecko) {
    setTimeout(function () {
      var iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      document.body.removeChild(iframe);
    }, 100);
  }
};

/**
 * Writes with a hidden iframe.
 *
 * @param {String} data to send
 * @param {Function} called upon flush.
 * @api private
 */

JSONPPolling.prototype.doWrite = function (data, fn) {
  var self = this;

  if (!this.form) {
    var form = document.createElement('form');
    var area = document.createElement('textarea');
    var id = this.iframeId = 'eio_iframe_' + this.index;
    var iframe;

    form.className = 'socketio';
    form.style.position = 'absolute';
    form.style.top = '-1000px';
    form.style.left = '-1000px';
    form.target = id;
    form.method = 'POST';
    form.setAttribute('accept-charset', 'utf-8');
    area.name = 'd';
    form.appendChild(area);
    document.body.appendChild(form);

    this.form = form;
    this.area = area;
  }

  this.form.action = this.uri();

  function complete () {
    initIframe();
    fn();
  }

  function initIframe () {
    if (self.iframe) {
      try {
        self.form.removeChild(self.iframe);
      } catch (e) {
        self.onError('jsonp polling iframe removal error', e);
      }
    }

    try {
      // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
      var html = '<iframe src="javascript:0" name="'+ self.iframeId +'">';
      iframe = document.createElement(html);
    } catch (e) {
      iframe = document.createElement('iframe');
      iframe.name = self.iframeId;
      iframe.src = 'javascript:0';
    }

    iframe.id = self.iframeId;

    self.form.appendChild(iframe);
    self.iframe = iframe;
  }

  initIframe();

  // escape \n to prevent it from being converted into \r\n by some UAs
  // double escaping is required for escaped new lines because unescaping of new lines can be done safely on server-side
  data = data.replace(rEscapedNewline, '\\\n');
  this.area.value = data.replace(rNewline, '\\n');

  try {
    this.form.submit();
  } catch(e) {}

  if (this.iframe.attachEvent) {
    this.iframe.onreadystatechange = function(){
      if (self.iframe.readyState == 'complete') {
        complete();
      }
    };
  } else {
    this.iframe.onload = complete;
  }
};

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{"./polling":23,"component-inherit":13}],22:[function(_dereq_,module,exports){
(function (global){
/**
 * Module requirements.
 */

var XMLHttpRequest = _dereq_('xmlhttprequest-ssl');
var Polling = _dereq_('./polling');
var Emitter = _dereq_('component-emitter');
var inherit = _dereq_('component-inherit');
var debug = _dereq_('debug')('engine.io-client:polling-xhr');

/**
 * Module exports.
 */

module.exports = XHR;
module.exports.Request = Request;

/**
 * Empty function
 */

function empty(){}

/**
 * XHR Polling constructor.
 *
 * @param {Object} opts
 * @api public
 */

function XHR(opts){
  Polling.call(this, opts);

  if (global.location) {
    var isSSL = 'https:' == location.protocol;
    var port = location.port;

    // some user agents have empty `location.port`
    if (!port) {
      port = isSSL ? 443 : 80;
    }

    this.xd = opts.hostname != global.location.hostname ||
      port != opts.port;
    this.xs = opts.secure != isSSL;
  } else {
    this.extraHeaders = opts.extraHeaders;
  }
}

/**
 * Inherits from Polling.
 */

inherit(XHR, Polling);

/**
 * XHR supports binary
 */

XHR.prototype.supportsBinary = true;

/**
 * Creates a request.
 *
 * @param {String} method
 * @api private
 */

XHR.prototype.request = function(opts){
  opts = opts || {};
  opts.uri = this.uri();
  opts.xd = this.xd;
  opts.xs = this.xs;
  opts.agent = this.agent || false;
  opts.supportsBinary = this.supportsBinary;
  opts.enablesXDR = this.enablesXDR;

  // SSL options for Node.js client
  opts.pfx = this.pfx;
  opts.key = this.key;
  opts.passphrase = this.passphrase;
  opts.cert = this.cert;
  opts.ca = this.ca;
  opts.ciphers = this.ciphers;
  opts.rejectUnauthorized = this.rejectUnauthorized;

  // other options for Node.js client
  opts.extraHeaders = this.extraHeaders;

  return new Request(opts);
};

/**
 * Sends data.
 *
 * @param {String} data to send.
 * @param {Function} called upon flush.
 * @api private
 */

XHR.prototype.doWrite = function(data, fn){
  var isBinary = typeof data !== 'string' && data !== undefined;
  var req = this.request({ method: 'POST', data: data, isBinary: isBinary });
  var self = this;
  req.on('success', fn);
  req.on('error', function(err){
    self.onError('xhr post error', err);
  });
  this.sendXhr = req;
};

/**
 * Starts a poll cycle.
 *
 * @api private
 */

XHR.prototype.doPoll = function(){
  debug('xhr poll');
  var req = this.request();
  var self = this;
  req.on('data', function(data){
    self.onData(data);
  });
  req.on('error', function(err){
    self.onError('xhr poll error', err);
  });
  this.pollXhr = req;
};

/**
 * Request constructor
 *
 * @param {Object} options
 * @api public
 */

function Request(opts){
  this.method = opts.method || 'GET';
  this.uri = opts.uri;
  this.xd = !!opts.xd;
  this.xs = !!opts.xs;
  this.async = false !== opts.async;
  this.data = undefined != opts.data ? opts.data : null;
  this.agent = opts.agent;
  this.isBinary = opts.isBinary;
  this.supportsBinary = opts.supportsBinary;
  this.enablesXDR = opts.enablesXDR;

  // SSL options for Node.js client
  this.pfx = opts.pfx;
  this.key = opts.key;
  this.passphrase = opts.passphrase;
  this.cert = opts.cert;
  this.ca = opts.ca;
  this.ciphers = opts.ciphers;
  this.rejectUnauthorized = opts.rejectUnauthorized;

  // other options for Node.js client
  this.extraHeaders = opts.extraHeaders;

  this.create();
}

/**
 * Mix in `Emitter`.
 */

Emitter(Request.prototype);

/**
 * Creates the XHR object and sends the request.
 *
 * @api private
 */

Request.prototype.create = function(){
  var opts = { agent: this.agent, xdomain: this.xd, xscheme: this.xs, enablesXDR: this.enablesXDR };

  // SSL options for Node.js client
  opts.pfx = this.pfx;
  opts.key = this.key;
  opts.passphrase = this.passphrase;
  opts.cert = this.cert;
  opts.ca = this.ca;
  opts.ciphers = this.ciphers;
  opts.rejectUnauthorized = this.rejectUnauthorized;

  var xhr = this.xhr = new XMLHttpRequest(opts);
  var self = this;

  try {
    debug('xhr open %s: %s', this.method, this.uri);
    xhr.open(this.method, this.uri, this.async);
    try {
      if (this.extraHeaders) {
        xhr.setDisableHeaderCheck(true);
        for (var i in this.extraHeaders) {
          if (this.extraHeaders.hasOwnProperty(i)) {
            xhr.setRequestHeader(i, this.extraHeaders[i]);
          }
        }
      }
    } catch (e) {}
    if (this.supportsBinary) {
      // This has to be done after open because Firefox is stupid
      // http://stackoverflow.com/questions/13216903/get-binary-data-with-xmlhttprequest-in-a-firefox-extension
      xhr.responseType = 'arraybuffer';
    }

    if ('POST' == this.method) {
      try {
        if (this.isBinary) {
          xhr.setRequestHeader('Content-type', 'application/octet-stream');
        } else {
          xhr.setRequestHeader('Content-type', 'text/plain;charset=UTF-8');
        }
      } catch (e) {}
    }

    // ie6 check
    if ('withCredentials' in xhr) {
      xhr.withCredentials = true;
    }

    if (this.hasXDR()) {
      xhr.onload = function(){
        self.onLoad();
      };
      xhr.onerror = function(){
        self.onError(xhr.responseText);
      };
    } else {
      xhr.onreadystatechange = function(){
        if (4 != xhr.readyState) return;
        if (200 == xhr.status || 1223 == xhr.status) {
          self.onLoad();
        } else {
          // make sure the `error` event handler that's user-set
          // does not throw in the same tick and gets caught here
          setTimeout(function(){
            self.onError(xhr.status);
          }, 0);
        }
      };
    }

    debug('xhr data %s', this.data);
    xhr.send(this.data);
  } catch (e) {
    // Need to defer since .create() is called directly fhrom the constructor
    // and thus the 'error' event can only be only bound *after* this exception
    // occurs.  Therefore, also, we cannot throw here at all.
    setTimeout(function() {
      self.onError(e);
    }, 0);
    return;
  }

  if (global.document) {
    this.index = Request.requestsCount++;
    Request.requests[this.index] = this;
  }
};

/**
 * Called upon successful response.
 *
 * @api private
 */

Request.prototype.onSuccess = function(){
  this.emit('success');
  this.cleanup();
};

/**
 * Called if we have data.
 *
 * @api private
 */

Request.prototype.onData = function(data){
  this.emit('data', data);
  this.onSuccess();
};

/**
 * Called upon error.
 *
 * @api private
 */

Request.prototype.onError = function(err){
  this.emit('error', err);
  this.cleanup(true);
};

/**
 * Cleans up house.
 *
 * @api private
 */

Request.prototype.cleanup = function(fromError){
  if ('undefined' == typeof this.xhr || null === this.xhr) {
    return;
  }
  // xmlhttprequest
  if (this.hasXDR()) {
    this.xhr.onload = this.xhr.onerror = empty;
  } else {
    this.xhr.onreadystatechange = empty;
  }

  if (fromError) {
    try {
      this.xhr.abort();
    } catch(e) {}
  }

  if (global.document) {
    delete Request.requests[this.index];
  }

  this.xhr = null;
};

/**
 * Called upon load.
 *
 * @api private
 */

Request.prototype.onLoad = function(){
  var data;
  try {
    var contentType;
    try {
      contentType = this.xhr.getResponseHeader('Content-Type').split(';')[0];
    } catch (e) {}
    if (contentType === 'application/octet-stream') {
      data = this.xhr.response;
    } else {
      if (!this.supportsBinary) {
        data = this.xhr.responseText;
      } else {
        try {
          data = String.fromCharCode.apply(null, new Uint8Array(this.xhr.response));
        } catch (e) {
          var ui8Arr = new Uint8Array(this.xhr.response);
          var dataArray = [];
          for (var idx = 0, length = ui8Arr.length; idx < length; idx++) {
            dataArray.push(ui8Arr[idx]);
          }

          data = String.fromCharCode.apply(null, dataArray);
        }
      }
    }
  } catch (e) {
    this.onError(e);
  }
  if (null != data) {
    this.onData(data);
  }
};

/**
 * Check if it has XDomainRequest.
 *
 * @api private
 */

Request.prototype.hasXDR = function(){
  return 'undefined' !== typeof global.XDomainRequest && !this.xs && this.enablesXDR;
};

/**
 * Aborts the request.
 *
 * @api public
 */

Request.prototype.abort = function(){
  this.cleanup();
};

/**
 * Aborts pending requests when unloading the window. This is needed to prevent
 * memory leaks (e.g. when using IE) and to ensure that no spurious error is
 * emitted.
 */

if (global.document) {
  Request.requestsCount = 0;
  Request.requests = {};
  if (global.attachEvent) {
    global.attachEvent('onunload', unloadHandler);
  } else if (global.addEventListener) {
    global.addEventListener('beforeunload', unloadHandler, false);
  }
}

function unloadHandler() {
  for (var i in Request.requests) {
    if (Request.requests.hasOwnProperty(i)) {
      Request.requests[i].abort();
    }
  }
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{"./polling":23,"component-emitter":26,"component-inherit":13,"debug":14,"xmlhttprequest-ssl":25}],23:[function(_dereq_,module,exports){
/**
 * Module dependencies.
 */

var Transport = _dereq_('../transport');
var parseqs = _dereq_('parseqs');
var parser = _dereq_('engine.io-parser');
var inherit = _dereq_('component-inherit');
var yeast = _dereq_('yeast');
var debug = _dereq_('debug')('engine.io-client:polling');

/**
 * Module exports.
 */

module.exports = Polling;

/**
 * Is XHR2 supported?
 */

var hasXHR2 = (function() {
  var XMLHttpRequest = _dereq_('xmlhttprequest-ssl');
  var xhr = new XMLHttpRequest({ xdomain: false });
  return null != xhr.responseType;
})();

/**
 * Polling interface.
 *
 * @param {Object} opts
 * @api private
 */

function Polling(opts){
  var forceBase64 = (opts && opts.forceBase64);
  if (!hasXHR2 || forceBase64) {
    this.supportsBinary = false;
  }
  Transport.call(this, opts);
}

/**
 * Inherits from Transport.
 */

inherit(Polling, Transport);

/**
 * Transport name.
 */

Polling.prototype.name = 'polling';

/**
 * Opens the socket (triggers polling). We write a PING message to determine
 * when the transport is open.
 *
 * @api private
 */

Polling.prototype.doOpen = function(){
  this.poll();
};

/**
 * Pauses polling.
 *
 * @param {Function} callback upon buffers are flushed and transport is paused
 * @api private
 */

Polling.prototype.pause = function(onPause){
  var pending = 0;
  var self = this;

  this.readyState = 'pausing';

  function pause(){
    debug('paused');
    self.readyState = 'paused';
    onPause();
  }

  if (this.polling || !this.writable) {
    var total = 0;

    if (this.polling) {
      debug('we are currently polling - waiting to pause');
      total++;
      this.once('pollComplete', function(){
        debug('pre-pause polling complete');
        --total || pause();
      });
    }

    if (!this.writable) {
      debug('we are currently writing - waiting to pause');
      total++;
      this.once('drain', function(){
        debug('pre-pause writing complete');
        --total || pause();
      });
    }
  } else {
    pause();
  }
};

/**
 * Starts polling cycle.
 *
 * @api public
 */

Polling.prototype.poll = function(){
  debug('polling');
  this.polling = true;
  this.doPoll();
  this.emit('poll');
};

/**
 * Overloads onData to detect payloads.
 *
 * @api private
 */

Polling.prototype.onData = function(data){
  var self = this;
  debug('polling got data %s', data);
  var callback = function(packet, index, total) {
    // if its the first message we consider the transport open
    if ('opening' == self.readyState) {
      self.onOpen();
    }

    // if its a close packet, we close the ongoing requests
    if ('close' == packet.type) {
      self.onClose();
      return false;
    }

    // otherwise bypass onData and handle the message
    self.onPacket(packet);
  };

  // decode payload
  parser.decodePayload(data, this.socket.binaryType, callback);

  // if an event did not trigger closing
  if ('closed' != this.readyState) {
    // if we got data we're not polling
    this.polling = false;
    this.emit('pollComplete');

    if ('open' == this.readyState) {
      this.poll();
    } else {
      debug('ignoring poll - transport state "%s"', this.readyState);
    }
  }
};

/**
 * For polling, send a close packet.
 *
 * @api private
 */

Polling.prototype.doClose = function(){
  var self = this;

  function close(){
    debug('writing close packet');
    self.write([{ type: 'close' }]);
  }

  if ('open' == this.readyState) {
    debug('transport open - closing');
    close();
  } else {
    // in case we're trying to close while
    // handshaking is in progress (GH-164)
    debug('transport not open - deferring close');
    this.once('open', close);
  }
};

/**
 * Writes a packets payload.
 *
 * @param {Array} data packets
 * @param {Function} drain callback
 * @api private
 */

Polling.prototype.write = function(packets){
  var self = this;
  this.writable = false;
  var callbackfn = function() {
    self.writable = true;
    self.emit('drain');
  };

  var self = this;
  parser.encodePayload(packets, this.supportsBinary, function(data) {
    self.doWrite(data, callbackfn);
  });
};

/**
 * Generates uri for connection.
 *
 * @api private
 */

Polling.prototype.uri = function(){
  var query = this.query || {};
  var schema = this.secure ? 'https' : 'http';
  var port = '';

  // cache busting is forced
  if (false !== this.timestampRequests) {
    query[this.timestampParam] = yeast();
  }

  if (!this.supportsBinary && !query.sid) {
    query.b64 = 1;
  }

  query = parseqs.encode(query);

  // avoid port if default for schema
  if (this.port && (('https' == schema && this.port != 443) ||
     ('http' == schema && this.port != 80))) {
    port = ':' + this.port;
  }

  // prepend ? to query
  if (query.length) {
    query = '?' + query;
  }

  var ipv6 = this.hostname.indexOf(':') !== -1;
  return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
};

},{"../transport":19,"component-inherit":13,"debug":14,"engine.io-parser":27,"parseqs":37,"xmlhttprequest-ssl":25,"yeast":45}],24:[function(_dereq_,module,exports){
(function (global){
/**
 * Module dependencies.
 */

var Transport = _dereq_('../transport');
var parser = _dereq_('engine.io-parser');
var parseqs = _dereq_('parseqs');
var inherit = _dereq_('component-inherit');
var yeast = _dereq_('yeast');
var debug = _dereq_('debug')('engine.io-client:websocket');
var BrowserWebSocket = global.WebSocket || global.MozWebSocket;

/**
 * Get either the `WebSocket` or `MozWebSocket` globals
 * in the browser or try to resolve WebSocket-compatible
 * interface exposed by `ws` for Node-like environment.
 */

var WebSocket = BrowserWebSocket;
if (!WebSocket && typeof window === 'undefined') {
  try {
    WebSocket = _dereq_('ws');
  } catch (e) { }
}

/**
 * Module exports.
 */

module.exports = WS;

/**
 * WebSocket transport constructor.
 *
 * @api {Object} connection options
 * @api public
 */

function WS(opts){
  var forceBase64 = (opts && opts.forceBase64);
  if (forceBase64) {
    this.supportsBinary = false;
  }
  this.perMessageDeflate = opts.perMessageDeflate;
  Transport.call(this, opts);
}

/**
 * Inherits from Transport.
 */

inherit(WS, Transport);

/**
 * Transport name.
 *
 * @api public
 */

WS.prototype.name = 'websocket';

/*
 * WebSockets support binary
 */

WS.prototype.supportsBinary = true;

/**
 * Opens socket.
 *
 * @api private
 */

WS.prototype.doOpen = function(){
  if (!this.check()) {
    // let probe timeout
    return;
  }

  var self = this;
  var uri = this.uri();
  var protocols = void(0);
  var opts = {
    agent: this.agent,
    perMessageDeflate: this.perMessageDeflate
  };

  // SSL options for Node.js client
  opts.pfx = this.pfx;
  opts.key = this.key;
  opts.passphrase = this.passphrase;
  opts.cert = this.cert;
  opts.ca = this.ca;
  opts.ciphers = this.ciphers;
  opts.rejectUnauthorized = this.rejectUnauthorized;
  if (this.extraHeaders) {
    opts.headers = this.extraHeaders;
  }

  this.ws = BrowserWebSocket ? new WebSocket(uri) : new WebSocket(uri, protocols, opts);

  if (this.ws.binaryType === undefined) {
    this.supportsBinary = false;
  }

  if (this.ws.supports && this.ws.supports.binary) {
    this.supportsBinary = true;
    this.ws.binaryType = 'buffer';
  } else {
    this.ws.binaryType = 'arraybuffer';
  }

  this.addEventListeners();
};

/**
 * Adds event listeners to the socket
 *
 * @api private
 */

WS.prototype.addEventListeners = function(){
  var self = this;

  this.ws.onopen = function(){
    self.onOpen();
  };
  this.ws.onclose = function(){
    self.onClose();
  };
  this.ws.onmessage = function(ev){
    self.onData(ev.data);
  };
  this.ws.onerror = function(e){
    self.onError('websocket error', e);
  };
};

/**
 * Override `onData` to use a timer on iOS.
 * See: https://gist.github.com/mloughran/2052006
 *
 * @api private
 */

if ('undefined' != typeof navigator
  && /iPad|iPhone|iPod/i.test(navigator.userAgent)) {
  WS.prototype.onData = function(data){
    var self = this;
    setTimeout(function(){
      Transport.prototype.onData.call(self, data);
    }, 0);
  };
}

/**
 * Writes data to socket.
 *
 * @param {Array} array of packets.
 * @api private
 */

WS.prototype.write = function(packets){
  var self = this;
  this.writable = false;

  // encodePacket efficient as it uses WS framing
  // no need for encodePayload
  var total = packets.length;
  for (var i = 0, l = total; i < l; i++) {
    (function(packet) {
      parser.encodePacket(packet, self.supportsBinary, function(data) {
        if (!BrowserWebSocket) {
          // always create a new object (GH-437)
          var opts = {};
          if (packet.options) {
            opts.compress = packet.options.compress;
          }

          if (self.perMessageDeflate) {
            var len = 'string' == typeof data ? global.Buffer.byteLength(data) : data.length;
            if (len < self.perMessageDeflate.threshold) {
              opts.compress = false;
            }
          }
        }

        //Sometimes the websocket has already been closed but the browser didn't
        //have a chance of informing us about it yet, in that case send will
        //throw an error
        try {
          if (BrowserWebSocket) {
            // TypeError is thrown when passing the second argument on Safari
            self.ws.send(data);
          } else {
            self.ws.send(data, opts);
          }
        } catch (e){
          debug('websocket closed before onclose event');
        }

        --total || done();
      });
    })(packets[i]);
  }

  function done(){
    self.emit('flush');

    // fake drain
    // defer to next tick to allow Socket to clear writeBuffer
    setTimeout(function(){
      self.writable = true;
      self.emit('drain');
    }, 0);
  }
};

/**
 * Called upon close
 *
 * @api private
 */

WS.prototype.onClose = function(){
  Transport.prototype.onClose.call(this);
};

/**
 * Closes socket.
 *
 * @api private
 */

WS.prototype.doClose = function(){
  if (typeof this.ws !== 'undefined') {
    this.ws.close();
  }
};

/**
 * Generates uri for connection.
 *
 * @api private
 */

WS.prototype.uri = function(){
  var query = this.query || {};
  var schema = this.secure ? 'wss' : 'ws';
  var port = '';

  // avoid port if default for schema
  if (this.port && (('wss' == schema && this.port != 443)
    || ('ws' == schema && this.port != 80))) {
    port = ':' + this.port;
  }

  // append timestamp to URI
  if (this.timestampRequests) {
    query[this.timestampParam] = yeast();
  }

  // communicate binary support capabilities
  if (!this.supportsBinary) {
    query.b64 = 1;
  }

  query = parseqs.encode(query);

  // prepend ? to query
  if (query.length) {
    query = '?' + query;
  }

  var ipv6 = this.hostname.indexOf(':') !== -1;
  return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
};

/**
 * Feature detection for WebSocket.
 *
 * @return {Boolean} whether this transport is available.
 * @api public
 */

WS.prototype.check = function(){
  return !!WebSocket && !('__initialize' in WebSocket && this.name === WS.prototype.name);
};

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{"../transport":19,"component-inherit":13,"debug":14,"engine.io-parser":27,"parseqs":37,"ws":undefined,"yeast":45}],25:[function(_dereq_,module,exports){
// browser shim for xmlhttprequest module
var hasCORS = _dereq_('has-cors');

module.exports = function(opts) {
  var xdomain = opts.xdomain;

  // scheme must be same when usign XDomainRequest
  // http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
  var xscheme = opts.xscheme;

  // XDomainRequest has a flow of not sending cookie, therefore it should be disabled as a default.
  // https://github.com/Automattic/engine.io-client/pull/217
  var enablesXDR = opts.enablesXDR;

  // XMLHttpRequest can be disabled on IE
  try {
    if ('undefined' != typeof XMLHttpRequest && (!xdomain || hasCORS)) {
      return new XMLHttpRequest();
    }
  } catch (e) { }

  // Use XDomainRequest for IE8 if enablesXDR is true
  // because loading bar keeps flashing when using jsonp-polling
  // https://github.com/yujiosaka/socke.io-ie8-loading-example
  try {
    if ('undefined' != typeof XDomainRequest && !xscheme && enablesXDR) {
      return new XDomainRequest();
    }
  } catch (e) { }

  if (!xdomain) {
    try {
      return new ActiveXObject('Microsoft.XMLHTTP');
    } catch(e) { }
  }
}

},{"has-cors":31}],26:[function(_dereq_,module,exports){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],27:[function(_dereq_,module,exports){
(function (global){
/**
 * Module dependencies.
 */

var keys = _dereq_('./keys');
var hasBinary = _dereq_('has-binary');
var sliceBuffer = _dereq_('arraybuffer.slice');
var base64encoder = _dereq_('base64-arraybuffer');
var after = _dereq_('after');
var utf8 = _dereq_('utf8');

/**
 * Check if we are running an android browser. That requires us to use
 * ArrayBuffer with polling transports...
 *
 * http://ghinda.net/jpeg-blob-ajax-android/
 */

var isAndroid = navigator.userAgent.match(/Android/i);

/**
 * Check if we are running in PhantomJS.
 * Uploading a Blob with PhantomJS does not work correctly, as reported here:
 * https://github.com/ariya/phantomjs/issues/11395
 * @type boolean
 */
var isPhantomJS = /PhantomJS/i.test(navigator.userAgent);

/**
 * When true, avoids using Blobs to encode payloads.
 * @type boolean
 */
var dontSendBlobs = isAndroid || isPhantomJS;

/**
 * Current protocol version.
 */

exports.protocol = 3;

/**
 * Packet types.
 */

var packets = exports.packets = {
    open:     0    // non-ws
  , close:    1    // non-ws
  , ping:     2
  , pong:     3
  , message:  4
  , upgrade:  5
  , noop:     6
};

var packetslist = keys(packets);

/**
 * Premade error packet.
 */

var err = { type: 'error', data: 'parser error' };

/**
 * Create a blob api even for blob builder when vendor prefixes exist
 */

var Blob = _dereq_('blob');

/**
 * Encodes a packet.
 *
 *     <packet type id> [ <data> ]
 *
 * Example:
 *
 *     5hello world
 *     3
 *     4
 *
 * Binary is encoded in an identical principle
 *
 * @api private
 */

exports.encodePacket = function (packet, supportsBinary, utf8encode, callback) {
  if ('function' == typeof supportsBinary) {
    callback = supportsBinary;
    supportsBinary = false;
  }

  if ('function' == typeof utf8encode) {
    callback = utf8encode;
    utf8encode = null;
  }

  var data = (packet.data === undefined)
    ? undefined
    : packet.data.buffer || packet.data;

  if (global.ArrayBuffer && data instanceof ArrayBuffer) {
    return encodeArrayBuffer(packet, supportsBinary, callback);
  } else if (Blob && data instanceof global.Blob) {
    return encodeBlob(packet, supportsBinary, callback);
  }

  // might be an object with { base64: true, data: dataAsBase64String }
  if (data && data.base64) {
    return encodeBase64Object(packet, callback);
  }

  // Sending data as a utf-8 string
  var encoded = packets[packet.type];

  // data fragment is optional
  if (undefined !== packet.data) {
    encoded += utf8encode ? utf8.encode(String(packet.data)) : String(packet.data);
  }

  return callback('' + encoded);

};

function encodeBase64Object(packet, callback) {
  // packet data is an object { base64: true, data: dataAsBase64String }
  var message = 'b' + exports.packets[packet.type] + packet.data.data;
  return callback(message);
}

/**
 * Encode packet helpers for binary types
 */

function encodeArrayBuffer(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  var data = packet.data;
  var contentArray = new Uint8Array(data);
  var resultBuffer = new Uint8Array(1 + data.byteLength);

  resultBuffer[0] = packets[packet.type];
  for (var i = 0; i < contentArray.length; i++) {
    resultBuffer[i+1] = contentArray[i];
  }

  return callback(resultBuffer.buffer);
}

function encodeBlobAsArrayBuffer(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  var fr = new FileReader();
  fr.onload = function() {
    packet.data = fr.result;
    exports.encodePacket(packet, supportsBinary, true, callback);
  };
  return fr.readAsArrayBuffer(packet.data);
}

function encodeBlob(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  if (dontSendBlobs) {
    return encodeBlobAsArrayBuffer(packet, supportsBinary, callback);
  }

  var length = new Uint8Array(1);
  length[0] = packets[packet.type];
  var blob = new Blob([length.buffer, packet.data]);

  return callback(blob);
}

/**
 * Encodes a packet with binary data in a base64 string
 *
 * @param {Object} packet, has `type` and `data`
 * @return {String} base64 encoded message
 */

exports.encodeBase64Packet = function(packet, callback) {
  var message = 'b' + exports.packets[packet.type];
  if (Blob && packet.data instanceof global.Blob) {
    var fr = new FileReader();
    fr.onload = function() {
      var b64 = fr.result.split(',')[1];
      callback(message + b64);
    };
    return fr.readAsDataURL(packet.data);
  }

  var b64data;
  try {
    b64data = String.fromCharCode.apply(null, new Uint8Array(packet.data));
  } catch (e) {
    // iPhone Safari doesn't let you apply with typed arrays
    var typed = new Uint8Array(packet.data);
    var basic = new Array(typed.length);
    for (var i = 0; i < typed.length; i++) {
      basic[i] = typed[i];
    }
    b64data = String.fromCharCode.apply(null, basic);
  }
  message += global.btoa(b64data);
  return callback(message);
};

/**
 * Decodes a packet. Changes format to Blob if requested.
 *
 * @return {Object} with `type` and `data` (if any)
 * @api private
 */

exports.decodePacket = function (data, binaryType, utf8decode) {
  // String data
  if (typeof data == 'string' || data === undefined) {
    if (data.charAt(0) == 'b') {
      return exports.decodeBase64Packet(data.substr(1), binaryType);
    }

    if (utf8decode) {
      try {
        data = utf8.decode(data);
      } catch (e) {
        return err;
      }
    }
    var type = data.charAt(0);

    if (Number(type) != type || !packetslist[type]) {
      return err;
    }

    if (data.length > 1) {
      return { type: packetslist[type], data: data.substring(1) };
    } else {
      return { type: packetslist[type] };
    }
  }

  var asArray = new Uint8Array(data);
  var type = asArray[0];
  var rest = sliceBuffer(data, 1);
  if (Blob && binaryType === 'blob') {
    rest = new Blob([rest]);
  }
  return { type: packetslist[type], data: rest };
};

/**
 * Decodes a packet encoded in a base64 string
 *
 * @param {String} base64 encoded message
 * @return {Object} with `type` and `data` (if any)
 */

exports.decodeBase64Packet = function(msg, binaryType) {
  var type = packetslist[msg.charAt(0)];
  if (!global.ArrayBuffer) {
    return { type: type, data: { base64: true, data: msg.substr(1) } };
  }

  var data = base64encoder.decode(msg.substr(1));

  if (binaryType === 'blob' && Blob) {
    data = new Blob([data]);
  }

  return { type: type, data: data };
};

/**
 * Encodes multiple messages (payload).
 *
 *     <length>:data
 *
 * Example:
 *
 *     11:hello world2:hi
 *
 * If any contents are binary, they will be encoded as base64 strings. Base64
 * encoded strings are marked with a b before the length specifier
 *
 * @param {Array} packets
 * @api private
 */

exports.encodePayload = function (packets, supportsBinary, callback) {
  if (typeof supportsBinary == 'function') {
    callback = supportsBinary;
    supportsBinary = null;
  }

  var isBinary = hasBinary(packets);

  if (supportsBinary && isBinary) {
    if (Blob && !dontSendBlobs) {
      return exports.encodePayloadAsBlob(packets, callback);
    }

    return exports.encodePayloadAsArrayBuffer(packets, callback);
  }

  if (!packets.length) {
    return callback('0:');
  }

  function setLengthHeader(message) {
    return message.length + ':' + message;
  }

  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, !isBinary ? false : supportsBinary, true, function(message) {
      doneCallback(null, setLengthHeader(message));
    });
  }

  map(packets, encodeOne, function(err, results) {
    return callback(results.join(''));
  });
};

/**
 * Async array map using after
 */

function map(ary, each, done) {
  var result = new Array(ary.length);
  var next = after(ary.length, done);

  var eachWithIndex = function(i, el, cb) {
    each(el, function(error, msg) {
      result[i] = msg;
      cb(error, result);
    });
  };

  for (var i = 0; i < ary.length; i++) {
    eachWithIndex(i, ary[i], next);
  }
}

/*
 * Decodes data when a payload is maybe expected. Possible binary contents are
 * decoded from their base64 representation
 *
 * @param {String} data, callback method
 * @api public
 */

exports.decodePayload = function (data, binaryType, callback) {
  if (typeof data != 'string') {
    return exports.decodePayloadAsBinary(data, binaryType, callback);
  }

  if (typeof binaryType === 'function') {
    callback = binaryType;
    binaryType = null;
  }

  var packet;
  if (data == '') {
    // parser error - ignoring payload
    return callback(err, 0, 1);
  }

  var length = ''
    , n, msg;

  for (var i = 0, l = data.length; i < l; i++) {
    var chr = data.charAt(i);

    if (':' != chr) {
      length += chr;
    } else {
      if ('' == length || (length != (n = Number(length)))) {
        // parser error - ignoring payload
        return callback(err, 0, 1);
      }

      msg = data.substr(i + 1, n);

      if (length != msg.length) {
        // parser error - ignoring payload
        return callback(err, 0, 1);
      }

      if (msg.length) {
        packet = exports.decodePacket(msg, binaryType, true);

        if (err.type == packet.type && err.data == packet.data) {
          // parser error in individual packet - ignoring payload
          return callback(err, 0, 1);
        }

        var ret = callback(packet, i + n, l);
        if (false === ret) return;
      }

      // advance cursor
      i += n;
      length = '';
    }
  }

  if (length != '') {
    // parser error - ignoring payload
    return callback(err, 0, 1);
  }

};

/**
 * Encodes multiple messages (payload) as binary.
 *
 * <1 = binary, 0 = string><number from 0-9><number from 0-9>[...]<number
 * 255><data>
 *
 * Example:
 * 1 3 255 1 2 3, if the binary contents are interpreted as 8 bit integers
 *
 * @param {Array} packets
 * @return {ArrayBuffer} encoded payload
 * @api private
 */

exports.encodePayloadAsArrayBuffer = function(packets, callback) {
  if (!packets.length) {
    return callback(new ArrayBuffer(0));
  }

  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, true, true, function(data) {
      return doneCallback(null, data);
    });
  }

  map(packets, encodeOne, function(err, encodedPackets) {
    var totalLength = encodedPackets.reduce(function(acc, p) {
      var len;
      if (typeof p === 'string'){
        len = p.length;
      } else {
        len = p.byteLength;
      }
      return acc + len.toString().length + len + 2; // string/binary identifier + separator = 2
    }, 0);

    var resultArray = new Uint8Array(totalLength);

    var bufferIndex = 0;
    encodedPackets.forEach(function(p) {
      var isString = typeof p === 'string';
      var ab = p;
      if (isString) {
        var view = new Uint8Array(p.length);
        for (var i = 0; i < p.length; i++) {
          view[i] = p.charCodeAt(i);
        }
        ab = view.buffer;
      }

      if (isString) { // not true binary
        resultArray[bufferIndex++] = 0;
      } else { // true binary
        resultArray[bufferIndex++] = 1;
      }

      var lenStr = ab.byteLength.toString();
      for (var i = 0; i < lenStr.length; i++) {
        resultArray[bufferIndex++] = parseInt(lenStr[i]);
      }
      resultArray[bufferIndex++] = 255;

      var view = new Uint8Array(ab);
      for (var i = 0; i < view.length; i++) {
        resultArray[bufferIndex++] = view[i];
      }
    });

    return callback(resultArray.buffer);
  });
};

/**
 * Encode as Blob
 */

exports.encodePayloadAsBlob = function(packets, callback) {
  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, true, true, function(encoded) {
      var binaryIdentifier = new Uint8Array(1);
      binaryIdentifier[0] = 1;
      if (typeof encoded === 'string') {
        var view = new Uint8Array(encoded.length);
        for (var i = 0; i < encoded.length; i++) {
          view[i] = encoded.charCodeAt(i);
        }
        encoded = view.buffer;
        binaryIdentifier[0] = 0;
      }

      var len = (encoded instanceof ArrayBuffer)
        ? encoded.byteLength
        : encoded.size;

      var lenStr = len.toString();
      var lengthAry = new Uint8Array(lenStr.length + 1);
      for (var i = 0; i < lenStr.length; i++) {
        lengthAry[i] = parseInt(lenStr[i]);
      }
      lengthAry[lenStr.length] = 255;

      if (Blob) {
        var blob = new Blob([binaryIdentifier.buffer, lengthAry.buffer, encoded]);
        doneCallback(null, blob);
      }
    });
  }

  map(packets, encodeOne, function(err, results) {
    return callback(new Blob(results));
  });
};

/*
 * Decodes data when a payload is maybe expected. Strings are decoded by
 * interpreting each byte as a key code for entries marked to start with 0. See
 * description of encodePayloadAsBinary
 *
 * @param {ArrayBuffer} data, callback method
 * @api public
 */

exports.decodePayloadAsBinary = function (data, binaryType, callback) {
  if (typeof binaryType === 'function') {
    callback = binaryType;
    binaryType = null;
  }

  var bufferTail = data;
  var buffers = [];

  var numberTooLong = false;
  while (bufferTail.byteLength > 0) {
    var tailArray = new Uint8Array(bufferTail);
    var isString = tailArray[0] === 0;
    var msgLength = '';

    for (var i = 1; ; i++) {
      if (tailArray[i] == 255) break;

      if (msgLength.length > 310) {
        numberTooLong = true;
        break;
      }

      msgLength += tailArray[i];
    }

    if(numberTooLong) return callback(err, 0, 1);

    bufferTail = sliceBuffer(bufferTail, 2 + msgLength.length);
    msgLength = parseInt(msgLength);

    var msg = sliceBuffer(bufferTail, 0, msgLength);
    if (isString) {
      try {
        msg = String.fromCharCode.apply(null, new Uint8Array(msg));
      } catch (e) {
        // iPhone Safari doesn't let you apply to typed arrays
        var typed = new Uint8Array(msg);
        msg = '';
        for (var i = 0; i < typed.length; i++) {
          msg += String.fromCharCode(typed[i]);
        }
      }
    }

    buffers.push(msg);
    bufferTail = sliceBuffer(bufferTail, msgLength);
  }

  var total = buffers.length;
  buffers.forEach(function(buffer, i) {
    callback(exports.decodePacket(buffer, binaryType, true), i, total);
  });
};

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{"./keys":28,"after":6,"arraybuffer.slice":7,"base64-arraybuffer":9,"blob":10,"has-binary":29,"utf8":44}],28:[function(_dereq_,module,exports){

/**
 * Gets the keys for an object.
 *
 * @return {Array} keys
 * @api private
 */

module.exports = Object.keys || function keys (obj){
  var arr = [];
  var has = Object.prototype.hasOwnProperty;

  for (var i in obj) {
    if (has.call(obj, i)) {
      arr.push(i);
    }
  }
  return arr;
};

},{}],29:[function(_dereq_,module,exports){
(function (global){

/*
 * Module requirements.
 */

var isArray = _dereq_('isarray');

/**
 * Module exports.
 */

module.exports = hasBinary;

/**
 * Checks for binary data.
 *
 * Right now only Buffer and ArrayBuffer are supported..
 *
 * @param {Object} anything
 * @api public
 */

function hasBinary(data) {

  function _hasBinary(obj) {
    if (!obj) return false;

    if ( (global.Buffer && global.Buffer.isBuffer(obj)) ||
         (global.ArrayBuffer && obj instanceof ArrayBuffer) ||
         (global.Blob && obj instanceof Blob) ||
         (global.File && obj instanceof File)
        ) {
      return true;
    }

    if (isArray(obj)) {
      for (var i = 0; i < obj.length; i++) {
          if (_hasBinary(obj[i])) {
              return true;
          }
      }
    } else if (obj && 'object' == typeof obj) {
      if (obj.toJSON) {
        obj = obj.toJSON();
      }

      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key) && _hasBinary(obj[key])) {
          return true;
        }
      }
    }

    return false;
  }

  return _hasBinary(data);
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{"isarray":33}],30:[function(_dereq_,module,exports){
(function (global){

/*
 * Module requirements.
 */

var isArray = _dereq_('isarray');

/**
 * Module exports.
 */

module.exports = hasBinary;

/**
 * Checks for binary data.
 *
 * Right now only Buffer and ArrayBuffer are supported..
 *
 * @param {Object} anything
 * @api public
 */

function hasBinary(data) {

  function _hasBinary(obj) {
    if (!obj) return false;

    if ( (global.Buffer && global.Buffer.isBuffer && global.Buffer.isBuffer(obj)) ||
         (global.ArrayBuffer && obj instanceof ArrayBuffer) ||
         (global.Blob && obj instanceof Blob) ||
         (global.File && obj instanceof File)
        ) {
      return true;
    }

    if (isArray(obj)) {
      for (var i = 0; i < obj.length; i++) {
          if (_hasBinary(obj[i])) {
              return true;
          }
      }
    } else if (obj && 'object' == typeof obj) {
      // see: https://github.com/Automattic/has-binary/pull/4
      if (obj.toJSON && 'function' == typeof obj.toJSON) {
        obj = obj.toJSON();
      }

      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key) && _hasBinary(obj[key])) {
          return true;
        }
      }
    }

    return false;
  }

  return _hasBinary(data);
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{"isarray":33}],31:[function(_dereq_,module,exports){

/**
 * Module exports.
 *
 * Logic borrowed from Modernizr:
 *
 *   - https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cors.js
 */

try {
  module.exports = typeof XMLHttpRequest !== 'undefined' &&
    'withCredentials' in new XMLHttpRequest();
} catch (err) {
  // if XMLHttp support is disabled in IE then it will throw
  // when trying to create
  module.exports = false;
}

},{}],32:[function(_dereq_,module,exports){

var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
},{}],33:[function(_dereq_,module,exports){
module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

},{}],34:[function(_dereq_,module,exports){
(function (global){
/*! JSON v3.3.2 | http://bestiejs.github.io/json3 | Copyright 2012-2014, Kit Cambridge | http://kit.mit-license.org */
;(function () {
  // Detect the `define` function exposed by asynchronous module loaders. The
  // strict `define` check is necessary for compatibility with `r.js`.
  var isLoader = typeof define === "function" && define.amd;

  // A set of types used to distinguish objects from primitives.
  var objectTypes = {
    "function": true,
    "object": true
  };

  // Detect the `exports` object exposed by CommonJS implementations.
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  // Use the `global` object exposed by Node (including Browserify via
  // `insert-module-globals`), Narwhal, and Ringo as the default context,
  // and the `window` object in browsers. Rhino exports a `global` function
  // instead.
  var root = objectTypes[typeof window] && window || this,
      freeGlobal = freeExports && objectTypes[typeof module] && module && !module.nodeType && typeof global == "object" && global;

  if (freeGlobal && (freeGlobal["global"] === freeGlobal || freeGlobal["window"] === freeGlobal || freeGlobal["self"] === freeGlobal)) {
    root = freeGlobal;
  }

  // Public: Initializes JSON 3 using the given `context` object, attaching the
  // `stringify` and `parse` functions to the specified `exports` object.
  function runInContext(context, exports) {
    context || (context = root["Object"]());
    exports || (exports = root["Object"]());

    // Native constructor aliases.
    var Number = context["Number"] || root["Number"],
        String = context["String"] || root["String"],
        Object = context["Object"] || root["Object"],
        Date = context["Date"] || root["Date"],
        SyntaxError = context["SyntaxError"] || root["SyntaxError"],
        TypeError = context["TypeError"] || root["TypeError"],
        Math = context["Math"] || root["Math"],
        nativeJSON = context["JSON"] || root["JSON"];

    // Delegate to the native `stringify` and `parse` implementations.
    if (typeof nativeJSON == "object" && nativeJSON) {
      exports.stringify = nativeJSON.stringify;
      exports.parse = nativeJSON.parse;
    }

    // Convenience aliases.
    var objectProto = Object.prototype,
        getClass = objectProto.toString,
        isProperty, forEach, undef;

    // Test the `Date#getUTC*` methods. Based on work by @Yaffle.
    var isExtended = new Date(-3509827334573292);
    try {
      // The `getUTCFullYear`, `Month`, and `Date` methods return nonsensical
      // results for certain dates in Opera >= 10.53.
      isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 &&
        // Safari < 2.0.2 stores the internal millisecond time value correctly,
        // but clips the values returned by the date methods to the range of
        // signed 32-bit integers ([-2 ** 31, 2 ** 31 - 1]).
        isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708;
    } catch (exception) {}

    // Internal: Determines whether the native `JSON.stringify` and `parse`
    // implementations are spec-compliant. Based on work by Ken Snyder.
    function has(name) {
      if (has[name] !== undef) {
        // Return cached feature test result.
        return has[name];
      }
      var isSupported;
      if (name == "bug-string-char-index") {
        // IE <= 7 doesn't support accessing string characters using square
        // bracket notation. IE 8 only supports this for primitives.
        isSupported = "a"[0] != "a";
      } else if (name == "json") {
        // Indicates whether both `JSON.stringify` and `JSON.parse` are
        // supported.
        isSupported = has("json-stringify") && has("json-parse");
      } else {
        var value, serialized = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
        // Test `JSON.stringify`.
        if (name == "json-stringify") {
          var stringify = exports.stringify, stringifySupported = typeof stringify == "function" && isExtended;
          if (stringifySupported) {
            // A test function object with a custom `toJSON` method.
            (value = function () {
              return 1;
            }).toJSON = value;
            try {
              stringifySupported =
                // Firefox 3.1b1 and b2 serialize string, number, and boolean
                // primitives as object literals.
                stringify(0) === "0" &&
                // FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object
                // literals.
                stringify(new Number()) === "0" &&
                stringify(new String()) == '""' &&
                // FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or
                // does not define a canonical JSON representation (this applies to
                // objects with `toJSON` properties as well, *unless* they are nested
                // within an object or array).
                stringify(getClass) === undef &&
                // IE 8 serializes `undefined` as `"undefined"`. Safari <= 5.1.7 and
                // FF 3.1b3 pass this test.
                stringify(undef) === undef &&
                // Safari <= 5.1.7 and FF 3.1b3 throw `Error`s and `TypeError`s,
                // respectively, if the value is omitted entirely.
                stringify() === undef &&
                // FF 3.1b1, 2 throw an error if the given value is not a number,
                // string, array, object, Boolean, or `null` literal. This applies to
                // objects with custom `toJSON` methods as well, unless they are nested
                // inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`
                // methods entirely.
                stringify(value) === "1" &&
                stringify([value]) == "[1]" &&
                // Prototype <= 1.6.1 serializes `[undefined]` as `"[]"` instead of
                // `"[null]"`.
                stringify([undef]) == "[null]" &&
                // YUI 3.0.0b1 fails to serialize `null` literals.
                stringify(null) == "null" &&
                // FF 3.1b1, 2 halts serialization if an array contains a function:
                // `[1, true, getClass, 1]` serializes as "[1,true,],". FF 3.1b3
                // elides non-JSON values from objects and arrays, unless they
                // define custom `toJSON` methods.
                stringify([undef, getClass, null]) == "[null,null,null]" &&
                // Simple serialization test. FF 3.1b1 uses Unicode escape sequences
                // where character escape codes are expected (e.g., `\b` => `\u0008`).
                stringify({ "a": [value, true, false, null, "\x00\b\n\f\r\t"] }) == serialized &&
                // FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
                stringify(null, value) === "1" &&
                stringify([1, 2], null, 1) == "[\n 1,\n 2\n]" &&
                // JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
                // serialize extended years.
                stringify(new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' &&
                // The milliseconds are optional in ES 5, but required in 5.1.
                stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&
                // Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
                // four-digit years instead of six-digit years. Credits: @Yaffle.
                stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&
                // Safari <= 5.1.5 and Opera >= 10.53 incorrectly serialize millisecond
                // values less than 1000. Credits: @Yaffle.
                stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
            } catch (exception) {
              stringifySupported = false;
            }
          }
          isSupported = stringifySupported;
        }
        // Test `JSON.parse`.
        if (name == "json-parse") {
          var parse = exports.parse;
          if (typeof parse == "function") {
            try {
              // FF 3.1b1, b2 will throw an exception if a bare literal is provided.
              // Conforming implementations should also coerce the initial argument to
              // a string prior to parsing.
              if (parse("0") === 0 && !parse(false)) {
                // Simple parsing test.
                value = parse(serialized);
                var parseSupported = value["a"].length == 5 && value["a"][0] === 1;
                if (parseSupported) {
                  try {
                    // Safari <= 5.1.2 and FF 3.1b1 allow unescaped tabs in strings.
                    parseSupported = !parse('"\t"');
                  } catch (exception) {}
                  if (parseSupported) {
                    try {
                      // FF 4.0 and 4.0.1 allow leading `+` signs and leading
                      // decimal points. FF 4.0, 4.0.1, and IE 9-10 also allow
                      // certain octal literals.
                      parseSupported = parse("01") !== 1;
                    } catch (exception) {}
                  }
                  if (parseSupported) {
                    try {
                      // FF 4.0, 4.0.1, and Rhino 1.7R3-R4 allow trailing decimal
                      // points. These environments, along with FF 3.1b1 and 2,
                      // also allow trailing commas in JSON objects and arrays.
                      parseSupported = parse("1.") !== 1;
                    } catch (exception) {}
                  }
                }
              }
            } catch (exception) {
              parseSupported = false;
            }
          }
          isSupported = parseSupported;
        }
      }
      return has[name] = !!isSupported;
    }

    if (!has("json")) {
      // Common `[[Class]]` name aliases.
      var functionClass = "[object Function]",
          dateClass = "[object Date]",
          numberClass = "[object Number]",
          stringClass = "[object String]",
          arrayClass = "[object Array]",
          booleanClass = "[object Boolean]";

      // Detect incomplete support for accessing string characters by index.
      var charIndexBuggy = has("bug-string-char-index");

      // Define additional utility methods if the `Date` methods are buggy.
      if (!isExtended) {
        var floor = Math.floor;
        // A mapping between the months of the year and the number of days between
        // January 1st and the first of the respective month.
        var Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        // Internal: Calculates the number of days between the Unix epoch and the
        // first day of the given month.
        var getDay = function (year, month) {
          return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);
        };
      }

      // Internal: Determines if a property is a direct property of the given
      // object. Delegates to the native `Object#hasOwnProperty` method.
      if (!(isProperty = objectProto.hasOwnProperty)) {
        isProperty = function (property) {
          var members = {}, constructor;
          if ((members.__proto__ = null, members.__proto__ = {
            // The *proto* property cannot be set multiple times in recent
            // versions of Firefox and SeaMonkey.
            "toString": 1
          }, members).toString != getClass) {
            // Safari <= 2.0.3 doesn't implement `Object#hasOwnProperty`, but
            // supports the mutable *proto* property.
            isProperty = function (property) {
              // Capture and break the object's prototype chain (see section 8.6.2
              // of the ES 5.1 spec). The parenthesized expression prevents an
              // unsafe transformation by the Closure Compiler.
              var original = this.__proto__, result = property in (this.__proto__ = null, this);
              // Restore the original prototype chain.
              this.__proto__ = original;
              return result;
            };
          } else {
            // Capture a reference to the top-level `Object` constructor.
            constructor = members.constructor;
            // Use the `constructor` property to simulate `Object#hasOwnProperty` in
            // other environments.
            isProperty = function (property) {
              var parent = (this.constructor || constructor).prototype;
              return property in this && !(property in parent && this[property] === parent[property]);
            };
          }
          members = null;
          return isProperty.call(this, property);
        };
      }

      // Internal: Normalizes the `for...in` iteration algorithm across
      // environments. Each enumerated key is yielded to a `callback` function.
      forEach = function (object, callback) {
        var size = 0, Properties, members, property;

        // Tests for bugs in the current environment's `for...in` algorithm. The
        // `valueOf` property inherits the non-enumerable flag from
        // `Object.prototype` in older versions of IE, Netscape, and Mozilla.
        (Properties = function () {
          this.valueOf = 0;
        }).prototype.valueOf = 0;

        // Iterate over a new instance of the `Properties` class.
        members = new Properties();
        for (property in members) {
          // Ignore all properties inherited from `Object.prototype`.
          if (isProperty.call(members, property)) {
            size++;
          }
        }
        Properties = members = null;

        // Normalize the iteration algorithm.
        if (!size) {
          // A list of non-enumerable properties inherited from `Object.prototype`.
          members = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
          // IE <= 8, Mozilla 1.0, and Netscape 6.2 ignore shadowed non-enumerable
          // properties.
          forEach = function (object, callback) {
            var isFunction = getClass.call(object) == functionClass, property, length;
            var hasProperty = !isFunction && typeof object.constructor != "function" && objectTypes[typeof object.hasOwnProperty] && object.hasOwnProperty || isProperty;
            for (property in object) {
              // Gecko <= 1.0 enumerates the `prototype` property of functions under
              // certain conditions; IE does not.
              if (!(isFunction && property == "prototype") && hasProperty.call(object, property)) {
                callback(property);
              }
            }
            // Manually invoke the callback for each non-enumerable property.
            for (length = members.length; property = members[--length]; hasProperty.call(object, property) && callback(property));
          };
        } else if (size == 2) {
          // Safari <= 2.0.4 enumerates shadowed properties twice.
          forEach = function (object, callback) {
            // Create a set of iterated properties.
            var members = {}, isFunction = getClass.call(object) == functionClass, property;
            for (property in object) {
              // Store each property name to prevent double enumeration. The
              // `prototype` property of functions is not enumerated due to cross-
              // environment inconsistencies.
              if (!(isFunction && property == "prototype") && !isProperty.call(members, property) && (members[property] = 1) && isProperty.call(object, property)) {
                callback(property);
              }
            }
          };
        } else {
          // No bugs detected; use the standard `for...in` algorithm.
          forEach = function (object, callback) {
            var isFunction = getClass.call(object) == functionClass, property, isConstructor;
            for (property in object) {
              if (!(isFunction && property == "prototype") && isProperty.call(object, property) && !(isConstructor = property === "constructor")) {
                callback(property);
              }
            }
            // Manually invoke the callback for the `constructor` property due to
            // cross-environment inconsistencies.
            if (isConstructor || isProperty.call(object, (property = "constructor"))) {
              callback(property);
            }
          };
        }
        return forEach(object, callback);
      };

      // Public: Serializes a JavaScript `value` as a JSON string. The optional
      // `filter` argument may specify either a function that alters how object and
      // array members are serialized, or an array of strings and numbers that
      // indicates which properties should be serialized. The optional `width`
      // argument may be either a string or number that specifies the indentation
      // level of the output.
      if (!has("json-stringify")) {
        // Internal: A map of control characters and their escaped equivalents.
        var Escapes = {
          92: "\\\\",
          34: '\\"',
          8: "\\b",
          12: "\\f",
          10: "\\n",
          13: "\\r",
          9: "\\t"
        };

        // Internal: Converts `value` into a zero-padded string such that its
        // length is at least equal to `width`. The `width` must be <= 6.
        var leadingZeroes = "000000";
        var toPaddedString = function (width, value) {
          // The `|| 0` expression is necessary to work around a bug in
          // Opera <= 7.54u2 where `0 == -0`, but `String(-0) !== "0"`.
          return (leadingZeroes + (value || 0)).slice(-width);
        };

        // Internal: Double-quotes a string `value`, replacing all ASCII control
        // characters (characters with code unit values between 0 and 31) with
        // their escaped equivalents. This is an implementation of the
        // `Quote(value)` operation defined in ES 5.1 section 15.12.3.
        var unicodePrefix = "\\u00";
        var quote = function (value) {
          var result = '"', index = 0, length = value.length, useCharIndex = !charIndexBuggy || length > 10;
          var symbols = useCharIndex && (charIndexBuggy ? value.split("") : value);
          for (; index < length; index++) {
            var charCode = value.charCodeAt(index);
            // If the character is a control character, append its Unicode or
            // shorthand escape sequence; otherwise, append the character as-is.
            switch (charCode) {
              case 8: case 9: case 10: case 12: case 13: case 34: case 92:
                result += Escapes[charCode];
                break;
              default:
                if (charCode < 32) {
                  result += unicodePrefix + toPaddedString(2, charCode.toString(16));
                  break;
                }
                result += useCharIndex ? symbols[index] : value.charAt(index);
            }
          }
          return result + '"';
        };

        // Internal: Recursively serializes an object. Implements the
        // `Str(key, holder)`, `JO(value)`, and `JA(value)` operations.
        var serialize = function (property, object, callback, properties, whitespace, indentation, stack) {
          var value, className, year, month, date, time, hours, minutes, seconds, milliseconds, results, element, index, length, prefix, result;
          try {
            // Necessary for host object support.
            value = object[property];
          } catch (exception) {}
          if (typeof value == "object" && value) {
            className = getClass.call(value);
            if (className == dateClass && !isProperty.call(value, "toJSON")) {
              if (value > -1 / 0 && value < 1 / 0) {
                // Dates are serialized according to the `Date#toJSON` method
                // specified in ES 5.1 section 15.9.5.44. See section 15.9.1.15
                // for the ISO 8601 date time string format.
                if (getDay) {
                  // Manually compute the year, month, date, hours, minutes,
                  // seconds, and milliseconds if the `getUTC*` methods are
                  // buggy. Adapted from @Yaffle's `date-shim` project.
                  date = floor(value / 864e5);
                  for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++);
                  for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++);
                  date = 1 + date - getDay(year, month);
                  // The `time` value specifies the time within the day (see ES
                  // 5.1 section 15.9.1.2). The formula `(A % B + B) % B` is used
                  // to compute `A modulo B`, as the `%` operator does not
                  // correspond to the `modulo` operation for negative numbers.
                  time = (value % 864e5 + 864e5) % 864e5;
                  // The hours, minutes, seconds, and milliseconds are obtained by
                  // decomposing the time within the day. See section 15.9.1.10.
                  hours = floor(time / 36e5) % 24;
                  minutes = floor(time / 6e4) % 60;
                  seconds = floor(time / 1e3) % 60;
                  milliseconds = time % 1e3;
                } else {
                  year = value.getUTCFullYear();
                  month = value.getUTCMonth();
                  date = value.getUTCDate();
                  hours = value.getUTCHours();
                  minutes = value.getUTCMinutes();
                  seconds = value.getUTCSeconds();
                  milliseconds = value.getUTCMilliseconds();
                }
                // Serialize extended years correctly.
                value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) +
                  "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) +
                  // Months, dates, hours, minutes, and seconds should have two
                  // digits; milliseconds should have three.
                  "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) +
                  // Milliseconds are optional in ES 5.0, but required in 5.1.
                  "." + toPaddedString(3, milliseconds) + "Z";
              } else {
                value = null;
              }
            } else if (typeof value.toJSON == "function" && ((className != numberClass && className != stringClass && className != arrayClass) || isProperty.call(value, "toJSON"))) {
              // Prototype <= 1.6.1 adds non-standard `toJSON` methods to the
              // `Number`, `String`, `Date`, and `Array` prototypes. JSON 3
              // ignores all `toJSON` methods on these objects unless they are
              // defined directly on an instance.
              value = value.toJSON(property);
            }
          }
          if (callback) {
            // If a replacement function was provided, call it to obtain the value
            // for serialization.
            value = callback.call(object, property, value);
          }
          if (value === null) {
            return "null";
          }
          className = getClass.call(value);
          if (className == booleanClass) {
            // Booleans are represented literally.
            return "" + value;
          } else if (className == numberClass) {
            // JSON numbers must be finite. `Infinity` and `NaN` are serialized as
            // `"null"`.
            return value > -1 / 0 && value < 1 / 0 ? "" + value : "null";
          } else if (className == stringClass) {
            // Strings are double-quoted and escaped.
            return quote("" + value);
          }
          // Recursively serialize objects and arrays.
          if (typeof value == "object") {
            // Check for cyclic structures. This is a linear search; performance
            // is inversely proportional to the number of unique nested objects.
            for (length = stack.length; length--;) {
              if (stack[length] === value) {
                // Cyclic structures cannot be serialized by `JSON.stringify`.
                throw TypeError();
              }
            }
            // Add the object to the stack of traversed objects.
            stack.push(value);
            results = [];
            // Save the current indentation level and indent one additional level.
            prefix = indentation;
            indentation += whitespace;
            if (className == arrayClass) {
              // Recursively serialize array elements.
              for (index = 0, length = value.length; index < length; index++) {
                element = serialize(index, value, callback, properties, whitespace, indentation, stack);
                results.push(element === undef ? "null" : element);
              }
              result = results.length ? (whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : ("[" + results.join(",") + "]")) : "[]";
            } else {
              // Recursively serialize object members. Members are selected from
              // either a user-specified list of property names, or the object
              // itself.
              forEach(properties || value, function (property) {
                var element = serialize(property, value, callback, properties, whitespace, indentation, stack);
                if (element !== undef) {
                  // According to ES 5.1 section 15.12.3: "If `gap` {whitespace}
                  // is not the empty string, let `member` {quote(property) + ":"}
                  // be the concatenation of `member` and the `space` character."
                  // The "`space` character" refers to the literal space
                  // character, not the `space` {width} argument provided to
                  // `JSON.stringify`.
                  results.push(quote(property) + ":" + (whitespace ? " " : "") + element);
                }
              });
              result = results.length ? (whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : ("{" + results.join(",") + "}")) : "{}";
            }
            // Remove the object from the traversed object stack.
            stack.pop();
            return result;
          }
        };

        // Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
        exports.stringify = function (source, filter, width) {
          var whitespace, callback, properties, className;
          if (objectTypes[typeof filter] && filter) {
            if ((className = getClass.call(filter)) == functionClass) {
              callback = filter;
            } else if (className == arrayClass) {
              // Convert the property names array into a makeshift set.
              properties = {};
              for (var index = 0, length = filter.length, value; index < length; value = filter[index++], ((className = getClass.call(value)), className == stringClass || className == numberClass) && (properties[value] = 1));
            }
          }
          if (width) {
            if ((className = getClass.call(width)) == numberClass) {
              // Convert the `width` to an integer and create a string containing
              // `width` number of space characters.
              if ((width -= width % 1) > 0) {
                for (whitespace = "", width > 10 && (width = 10); whitespace.length < width; whitespace += " ");
              }
            } else if (className == stringClass) {
              whitespace = width.length <= 10 ? width : width.slice(0, 10);
            }
          }
          // Opera <= 7.54u2 discards the values associated with empty string keys
          // (`""`) only if they are used directly within an object member list
          // (e.g., `!("" in { "": 1})`).
          return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []);
        };
      }

      // Public: Parses a JSON source string.
      if (!has("json-parse")) {
        var fromCharCode = String.fromCharCode;

        // Internal: A map of escaped control characters and their unescaped
        // equivalents.
        var Unescapes = {
          92: "\\",
          34: '"',
          47: "/",
          98: "\b",
          116: "\t",
          110: "\n",
          102: "\f",
          114: "\r"
        };

        // Internal: Stores the parser state.
        var Index, Source;

        // Internal: Resets the parser state and throws a `SyntaxError`.
        var abort = function () {
          Index = Source = null;
          throw SyntaxError();
        };

        // Internal: Returns the next token, or `"$"` if the parser has reached
        // the end of the source string. A token may be a string, number, `null`
        // literal, or Boolean literal.
        var lex = function () {
          var source = Source, length = source.length, value, begin, position, isSigned, charCode;
          while (Index < length) {
            charCode = source.charCodeAt(Index);
            switch (charCode) {
              case 9: case 10: case 13: case 32:
                // Skip whitespace tokens, including tabs, carriage returns, line
                // feeds, and space characters.
                Index++;
                break;
              case 123: case 125: case 91: case 93: case 58: case 44:
                // Parse a punctuator token (`{`, `}`, `[`, `]`, `:`, or `,`) at
                // the current position.
                value = charIndexBuggy ? source.charAt(Index) : source[Index];
                Index++;
                return value;
              case 34:
                // `"` delimits a JSON string; advance to the next character and
                // begin parsing the string. String tokens are prefixed with the
                // sentinel `@` character to distinguish them from punctuators and
                // end-of-string tokens.
                for (value = "@", Index++; Index < length;) {
                  charCode = source.charCodeAt(Index);
                  if (charCode < 32) {
                    // Unescaped ASCII control characters (those with a code unit
                    // less than the space character) are not permitted.
                    abort();
                  } else if (charCode == 92) {
                    // A reverse solidus (`\`) marks the beginning of an escaped
                    // control character (including `"`, `\`, and `/`) or Unicode
                    // escape sequence.
                    charCode = source.charCodeAt(++Index);
                    switch (charCode) {
                      case 92: case 34: case 47: case 98: case 116: case 110: case 102: case 114:
                        // Revive escaped control characters.
                        value += Unescapes[charCode];
                        Index++;
                        break;
                      case 117:
                        // `\u` marks the beginning of a Unicode escape sequence.
                        // Advance to the first character and validate the
                        // four-digit code point.
                        begin = ++Index;
                        for (position = Index + 4; Index < position; Index++) {
                          charCode = source.charCodeAt(Index);
                          // A valid sequence comprises four hexdigits (case-
                          // insensitive) that form a single hexadecimal value.
                          if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) {
                            // Invalid Unicode escape sequence.
                            abort();
                          }
                        }
                        // Revive the escaped character.
                        value += fromCharCode("0x" + source.slice(begin, Index));
                        break;
                      default:
                        // Invalid escape sequence.
                        abort();
                    }
                  } else {
                    if (charCode == 34) {
                      // An unescaped double-quote character marks the end of the
                      // string.
                      break;
                    }
                    charCode = source.charCodeAt(Index);
                    begin = Index;
                    // Optimize for the common case where a string is valid.
                    while (charCode >= 32 && charCode != 92 && charCode != 34) {
                      charCode = source.charCodeAt(++Index);
                    }
                    // Append the string as-is.
                    value += source.slice(begin, Index);
                  }
                }
                if (source.charCodeAt(Index) == 34) {
                  // Advance to the next character and return the revived string.
                  Index++;
                  return value;
                }
                // Unterminated string.
                abort();
              default:
                // Parse numbers and literals.
                begin = Index;
                // Advance past the negative sign, if one is specified.
                if (charCode == 45) {
                  isSigned = true;
                  charCode = source.charCodeAt(++Index);
                }
                // Parse an integer or floating-point value.
                if (charCode >= 48 && charCode <= 57) {
                  // Leading zeroes are interpreted as octal literals.
                  if (charCode == 48 && ((charCode = source.charCodeAt(Index + 1)), charCode >= 48 && charCode <= 57)) {
                    // Illegal octal literal.
                    abort();
                  }
                  isSigned = false;
                  // Parse the integer component.
                  for (; Index < length && ((charCode = source.charCodeAt(Index)), charCode >= 48 && charCode <= 57); Index++);
                  // Floats cannot contain a leading decimal point; however, this
                  // case is already accounted for by the parser.
                  if (source.charCodeAt(Index) == 46) {
                    position = ++Index;
                    // Parse the decimal component.
                    for (; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
                    if (position == Index) {
                      // Illegal trailing decimal.
                      abort();
                    }
                    Index = position;
                  }
                  // Parse exponents. The `e` denoting the exponent is
                  // case-insensitive.
                  charCode = source.charCodeAt(Index);
                  if (charCode == 101 || charCode == 69) {
                    charCode = source.charCodeAt(++Index);
                    // Skip past the sign following the exponent, if one is
                    // specified.
                    if (charCode == 43 || charCode == 45) {
                      Index++;
                    }
                    // Parse the exponential component.
                    for (position = Index; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
                    if (position == Index) {
                      // Illegal empty exponent.
                      abort();
                    }
                    Index = position;
                  }
                  // Coerce the parsed value to a JavaScript number.
                  return +source.slice(begin, Index);
                }
                // A negative sign may only precede numbers.
                if (isSigned) {
                  abort();
                }
                // `true`, `false`, and `null` literals.
                if (source.slice(Index, Index + 4) == "true") {
                  Index += 4;
                  return true;
                } else if (source.slice(Index, Index + 5) == "false") {
                  Index += 5;
                  return false;
                } else if (source.slice(Index, Index + 4) == "null") {
                  Index += 4;
                  return null;
                }
                // Unrecognized token.
                abort();
            }
          }
          // Return the sentinel `$` character if the parser has reached the end
          // of the source string.
          return "$";
        };

        // Internal: Parses a JSON `value` token.
        var get = function (value) {
          var results, hasMembers;
          if (value == "$") {
            // Unexpected end of input.
            abort();
          }
          if (typeof value == "string") {
            if ((charIndexBuggy ? value.charAt(0) : value[0]) == "@") {
              // Remove the sentinel `@` character.
              return value.slice(1);
            }
            // Parse object and array literals.
            if (value == "[") {
              // Parses a JSON array, returning a new JavaScript array.
              results = [];
              for (;; hasMembers || (hasMembers = true)) {
                value = lex();
                // A closing square bracket marks the end of the array literal.
                if (value == "]") {
                  break;
                }
                // If the array literal contains elements, the current token
                // should be a comma separating the previous element from the
                // next.
                if (hasMembers) {
                  if (value == ",") {
                    value = lex();
                    if (value == "]") {
                      // Unexpected trailing `,` in array literal.
                      abort();
                    }
                  } else {
                    // A `,` must separate each array element.
                    abort();
                  }
                }
                // Elisions and leading commas are not permitted.
                if (value == ",") {
                  abort();
                }
                results.push(get(value));
              }
              return results;
            } else if (value == "{") {
              // Parses a JSON object, returning a new JavaScript object.
              results = {};
              for (;; hasMembers || (hasMembers = true)) {
                value = lex();
                // A closing curly brace marks the end of the object literal.
                if (value == "}") {
                  break;
                }
                // If the object literal contains members, the current token
                // should be a comma separator.
                if (hasMembers) {
                  if (value == ",") {
                    value = lex();
                    if (value == "}") {
                      // Unexpected trailing `,` in object literal.
                      abort();
                    }
                  } else {
                    // A `,` must separate each object member.
                    abort();
                  }
                }
                // Leading commas are not permitted, object property names must be
                // double-quoted strings, and a `:` must separate each property
                // name and value.
                if (value == "," || typeof value != "string" || (charIndexBuggy ? value.charAt(0) : value[0]) != "@" || lex() != ":") {
                  abort();
                }
                results[value.slice(1)] = get(lex());
              }
              return results;
            }
            // Unexpected token encountered.
            abort();
          }
          return value;
        };

        // Internal: Updates a traversed object member.
        var update = function (source, property, callback) {
          var element = walk(source, property, callback);
          if (element === undef) {
            delete source[property];
          } else {
            source[property] = element;
          }
        };

        // Internal: Recursively traverses a parsed JSON object, invoking the
        // `callback` function for each value. This is an implementation of the
        // `Walk(holder, name)` operation defined in ES 5.1 section 15.12.2.
        var walk = function (source, property, callback) {
          var value = source[property], length;
          if (typeof value == "object" && value) {
            // `forEach` can't be used to traverse an array in Opera <= 8.54
            // because its `Object#hasOwnProperty` implementation returns `false`
            // for array indices (e.g., `![1, 2, 3].hasOwnProperty("0")`).
            if (getClass.call(value) == arrayClass) {
              for (length = value.length; length--;) {
                update(value, length, callback);
              }
            } else {
              forEach(value, function (property) {
                update(value, property, callback);
              });
            }
          }
          return callback.call(source, property, value);
        };

        // Public: `JSON.parse`. See ES 5.1 section 15.12.2.
        exports.parse = function (source, callback) {
          var result, value;
          Index = 0;
          Source = "" + source;
          result = get(lex());
          // If a JSON string contains multiple tokens, it is invalid.
          if (lex() != "$") {
            abort();
          }
          // Reset the parser state.
          Index = Source = null;
          return callback && getClass.call(callback) == functionClass ? walk((value = {}, value[""] = result, value), "", callback) : result;
        };
      }
    }

    exports["runInContext"] = runInContext;
    return exports;
  }

  if (freeExports && !isLoader) {
    // Export for CommonJS environments.
    runInContext(root, freeExports);
  } else {
    // Export for web browsers and JavaScript engines.
    var nativeJSON = root.JSON,
        previousJSON = root["JSON3"],
        isRestored = false;

    var JSON3 = runInContext(root, (root["JSON3"] = {
      // Public: Restores the original value of the global `JSON` object and
      // returns a reference to the `JSON3` object.
      "noConflict": function () {
        if (!isRestored) {
          isRestored = true;
          root.JSON = nativeJSON;
          root["JSON3"] = previousJSON;
          nativeJSON = previousJSON = null;
        }
        return JSON3;
      }
    }));

    root.JSON = {
      "parse": JSON3.parse,
      "stringify": JSON3.stringify
    };
  }

  // Export for asynchronous module loaders.
  if (isLoader) {
    define(function () {
      return JSON3;
    });
  }
}).call(this);

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{}],35:[function(_dereq_,module,exports){
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} options
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options){
  options = options || {};
  if ('string' == typeof val) return parse(val);
  return options.long
    ? long(val)
    : short(val);
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = '' + str;
  if (str.length > 10000) return;
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
  if (!match) return;
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function short(ms) {
  if (ms >= d) return Math.round(ms / d) + 'd';
  if (ms >= h) return Math.round(ms / h) + 'h';
  if (ms >= m) return Math.round(ms / m) + 'm';
  if (ms >= s) return Math.round(ms / s) + 's';
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function long(ms) {
  return plural(ms, d, 'day')
    || plural(ms, h, 'hour')
    || plural(ms, m, 'minute')
    || plural(ms, s, 'second')
    || ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) return;
  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
  return Math.ceil(ms / n) + ' ' + name + 's';
}

},{}],36:[function(_dereq_,module,exports){
(function (global){
/**
 * JSON parse.
 *
 * @see Based on jQuery#parseJSON (MIT) and JSON2
 * @api private
 */

var rvalidchars = /^[\],:{}\s]*$/;
var rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
var rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
var rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;
var rtrimLeft = /^\s+/;
var rtrimRight = /\s+$/;

module.exports = function parsejson(data) {
  if ('string' != typeof data || !data) {
    return null;
  }

  data = data.replace(rtrimLeft, '').replace(rtrimRight, '');

  // Attempt to parse using the native JSON parser first
  if (global.JSON && JSON.parse) {
    return JSON.parse(data);
  }

  if (rvalidchars.test(data.replace(rvalidescape, '@')
      .replace(rvalidtokens, ']')
      .replace(rvalidbraces, ''))) {
    return (new Function('return ' + data))();
  }
};
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{}],37:[function(_dereq_,module,exports){
/**
 * Compiles a querystring
 * Returns string representation of the object
 *
 * @param {Object}
 * @api private
 */

exports.encode = function (obj) {
  var str = '';

  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      if (str.length) str += '&';
      str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
    }
  }

  return str;
};

/**
 * Parses a simple querystring into an object
 *
 * @param {String} qs
 * @api private
 */

exports.decode = function(qs){
  var qry = {};
  var pairs = qs.split('&');
  for (var i = 0, l = pairs.length; i < l; i++) {
    var pair = pairs[i].split('=');
    qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }
  return qry;
};

},{}],38:[function(_dereq_,module,exports){
/**
 * Parses an URI
 *
 * @author Steven Levithan <stevenlevithan.com> (MIT license)
 * @api private
 */

var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

var parts = [
    'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
];

module.exports = function parseuri(str) {
    var src = str,
        b = str.indexOf('['),
        e = str.indexOf(']');

    if (b != -1 && e != -1) {
        str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
    }

    var m = re.exec(str || ''),
        uri = {},
        i = 14;

    while (i--) {
        uri[parts[i]] = m[i] || '';
    }

    if (b != -1 && e != -1) {
        uri.source = src;
        uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
        uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
        uri.ipv6uri = true;
    }

    return uri;
};

},{}],39:[function(_dereq_,module,exports){
(function (global){
/*global Blob,File*/

/**
 * Module requirements
 */

var isArray = _dereq_('isarray');
var isBuf = _dereq_('./is-buffer');

/**
 * Replaces every Buffer | ArrayBuffer in packet with a numbered placeholder.
 * Anything with blobs or files should be fed through removeBlobs before coming
 * here.
 *
 * @param {Object} packet - socket.io event packet
 * @return {Object} with deconstructed packet and list of buffers
 * @api public
 */

exports.deconstructPacket = function(packet){
  var buffers = [];
  var packetData = packet.data;

  function _deconstructPacket(data) {
    if (!data) return data;

    if (isBuf(data)) {
      var placeholder = { _placeholder: true, num: buffers.length };
      buffers.push(data);
      return placeholder;
    } else if (isArray(data)) {
      var newData = new Array(data.length);
      for (var i = 0; i < data.length; i++) {
        newData[i] = _deconstructPacket(data[i]);
      }
      return newData;
    } else if ('object' == typeof data && !(data instanceof Date)) {
      var newData = {};
      for (var key in data) {
        newData[key] = _deconstructPacket(data[key]);
      }
      return newData;
    }
    return data;
  }

  var pack = packet;
  pack.data = _deconstructPacket(packetData);
  pack.attachments = buffers.length; // number of binary 'attachments'
  return {packet: pack, buffers: buffers};
};

/**
 * Reconstructs a binary packet from its placeholder packet and buffers
 *
 * @param {Object} packet - event packet with placeholders
 * @param {Array} buffers - binary buffers to put in placeholder positions
 * @return {Object} reconstructed packet
 * @api public
 */

exports.reconstructPacket = function(packet, buffers) {
  var curPlaceHolder = 0;

  function _reconstructPacket(data) {
    if (data && data._placeholder) {
      var buf = buffers[data.num]; // appropriate buffer (should be natural order anyway)
      return buf;
    } else if (isArray(data)) {
      for (var i = 0; i < data.length; i++) {
        data[i] = _reconstructPacket(data[i]);
      }
      return data;
    } else if (data && 'object' == typeof data) {
      for (var key in data) {
        data[key] = _reconstructPacket(data[key]);
      }
      return data;
    }
    return data;
  }

  packet.data = _reconstructPacket(packet.data);
  packet.attachments = undefined; // no longer useful
  return packet;
};

/**
 * Asynchronously removes Blobs or Files from data via
 * FileReader's readAsArrayBuffer method. Used before encoding
 * data as msgpack. Calls callback with the blobless data.
 *
 * @param {Object} data
 * @param {Function} callback
 * @api private
 */

exports.removeBlobs = function(data, callback) {
  function _removeBlobs(obj, curKey, containingObject) {
    if (!obj) return obj;

    // convert any blob
    if ((global.Blob && obj instanceof Blob) ||
        (global.File && obj instanceof File)) {
      pendingBlobs++;

      // async filereader
      var fileReader = new FileReader();
      fileReader.onload = function() { // this.result == arraybuffer
        if (containingObject) {
          containingObject[curKey] = this.result;
        }
        else {
          bloblessData = this.result;
        }

        // if nothing pending its callback time
        if(! --pendingBlobs) {
          callback(bloblessData);
        }
      };

      fileReader.readAsArrayBuffer(obj); // blob -> arraybuffer
    } else if (isArray(obj)) { // handle array
      for (var i = 0; i < obj.length; i++) {
        _removeBlobs(obj[i], i, obj);
      }
    } else if (obj && 'object' == typeof obj && !isBuf(obj)) { // and object
      for (var key in obj) {
        _removeBlobs(obj[key], key, obj);
      }
    }
  }

  var pendingBlobs = 0;
  var bloblessData = data;
  _removeBlobs(bloblessData);
  if (!pendingBlobs) {
    callback(bloblessData);
  }
};

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{"./is-buffer":41,"isarray":33}],40:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var debug = _dereq_('debug')('socket.io-parser');
var json = _dereq_('json3');
var isArray = _dereq_('isarray');
var Emitter = _dereq_('component-emitter');
var binary = _dereq_('./binary');
var isBuf = _dereq_('./is-buffer');

/**
 * Protocol version.
 *
 * @api public
 */

exports.protocol = 4;

/**
 * Packet types.
 *
 * @api public
 */

exports.types = [
  'CONNECT',
  'DISCONNECT',
  'EVENT',
  'ACK',
  'ERROR',
  'BINARY_EVENT',
  'BINARY_ACK'
];

/**
 * Packet type `connect`.
 *
 * @api public
 */

exports.CONNECT = 0;

/**
 * Packet type `disconnect`.
 *
 * @api public
 */

exports.DISCONNECT = 1;

/**
 * Packet type `event`.
 *
 * @api public
 */

exports.EVENT = 2;

/**
 * Packet type `ack`.
 *
 * @api public
 */

exports.ACK = 3;

/**
 * Packet type `error`.
 *
 * @api public
 */

exports.ERROR = 4;

/**
 * Packet type 'binary event'
 *
 * @api public
 */

exports.BINARY_EVENT = 5;

/**
 * Packet type `binary ack`. For acks with binary arguments.
 *
 * @api public
 */

exports.BINARY_ACK = 6;

/**
 * Encoder constructor.
 *
 * @api public
 */

exports.Encoder = Encoder;

/**
 * Decoder constructor.
 *
 * @api public
 */

exports.Decoder = Decoder;

/**
 * A socket.io Encoder instance
 *
 * @api public
 */

function Encoder() {}

/**
 * Encode a packet as a single string if non-binary, or as a
 * buffer sequence, depending on packet type.
 *
 * @param {Object} obj - packet object
 * @param {Function} callback - function to handle encodings (likely engine.write)
 * @return Calls callback with Array of encodings
 * @api public
 */

Encoder.prototype.encode = function(obj, callback){
  debug('encoding packet %j', obj);

  if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) {
    encodeAsBinary(obj, callback);
  }
  else {
    var encoding = encodeAsString(obj);
    callback([encoding]);
  }
};

/**
 * Encode packet as string.
 *
 * @param {Object} packet
 * @return {String} encoded
 * @api private
 */

function encodeAsString(obj) {
  var str = '';
  var nsp = false;

  // first is type
  str += obj.type;

  // attachments if we have them
  if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) {
    str += obj.attachments;
    str += '-';
  }

  // if we have a namespace other than `/`
  // we append it followed by a comma `,`
  if (obj.nsp && '/' != obj.nsp) {
    nsp = true;
    str += obj.nsp;
  }

  // immediately followed by the id
  if (null != obj.id) {
    if (nsp) {
      str += ',';
      nsp = false;
    }
    str += obj.id;
  }

  // json data
  if (null != obj.data) {
    if (nsp) str += ',';
    str += json.stringify(obj.data);
  }

  debug('encoded %j as %s', obj, str);
  return str;
}

/**
 * Encode packet as 'buffer sequence' by removing blobs, and
 * deconstructing packet into object with placeholders and
 * a list of buffers.
 *
 * @param {Object} packet
 * @return {Buffer} encoded
 * @api private
 */

function encodeAsBinary(obj, callback) {

  function writeEncoding(bloblessData) {
    var deconstruction = binary.deconstructPacket(bloblessData);
    var pack = encodeAsString(deconstruction.packet);
    var buffers = deconstruction.buffers;

    buffers.unshift(pack); // add packet info to beginning of data list
    callback(buffers); // write all the buffers
  }

  binary.removeBlobs(obj, writeEncoding);
}

/**
 * A socket.io Decoder instance
 *
 * @return {Object} decoder
 * @api public
 */

function Decoder() {
  this.reconstructor = null;
}

/**
 * Mix in `Emitter` with Decoder.
 */

Emitter(Decoder.prototype);

/**
 * Decodes an ecoded packet string into packet JSON.
 *
 * @param {String} obj - encoded packet
 * @return {Object} packet
 * @api public
 */

Decoder.prototype.add = function(obj) {
  var packet;
  if ('string' == typeof obj) {
    packet = decodeString(obj);
    if (exports.BINARY_EVENT == packet.type || exports.BINARY_ACK == packet.type) { // binary packet's json
      this.reconstructor = new BinaryReconstructor(packet);

      // no attachments, labeled binary but no binary data to follow
      if (this.reconstructor.reconPack.attachments === 0) {
        this.emit('decoded', packet);
      }
    } else { // non-binary full packet
      this.emit('decoded', packet);
    }
  }
  else if (isBuf(obj) || obj.base64) { // raw binary data
    if (!this.reconstructor) {
      throw new Error('got binary data when not reconstructing a packet');
    } else {
      packet = this.reconstructor.takeBinaryData(obj);
      if (packet) { // received final buffer
        this.reconstructor = null;
        this.emit('decoded', packet);
      }
    }
  }
  else {
    throw new Error('Unknown type: ' + obj);
  }
};

/**
 * Decode a packet String (JSON data)
 *
 * @param {String} str
 * @return {Object} packet
 * @api private
 */

function decodeString(str) {
  var p = {};
  var i = 0;

  // look up type
  p.type = Number(str.charAt(0));
  if (null == exports.types[p.type]) return error();

  // look up attachments if type binary
  if (exports.BINARY_EVENT == p.type || exports.BINARY_ACK == p.type) {
    var buf = '';
    while (str.charAt(++i) != '-') {
      buf += str.charAt(i);
      if (i == str.length) break;
    }
    if (buf != Number(buf) || str.charAt(i) != '-') {
      throw new Error('Illegal attachments');
    }
    p.attachments = Number(buf);
  }

  // look up namespace (if any)
  if ('/' == str.charAt(i + 1)) {
    p.nsp = '';
    while (++i) {
      var c = str.charAt(i);
      if (',' == c) break;
      p.nsp += c;
      if (i == str.length) break;
    }
  } else {
    p.nsp = '/';
  }

  // look up id
  var next = str.charAt(i + 1);
  if ('' !== next && Number(next) == next) {
    p.id = '';
    while (++i) {
      var c = str.charAt(i);
      if (null == c || Number(c) != c) {
        --i;
        break;
      }
      p.id += str.charAt(i);
      if (i == str.length) break;
    }
    p.id = Number(p.id);
  }

  // look up json data
  if (str.charAt(++i)) {
    try {
      p.data = json.parse(str.substr(i));
    } catch(e){
      return error();
    }
  }

  debug('decoded %s as %j', str, p);
  return p;
}

/**
 * Deallocates a parser's resources
 *
 * @api public
 */

Decoder.prototype.destroy = function() {
  if (this.reconstructor) {
    this.reconstructor.finishedReconstruction();
  }
};

/**
 * A manager of a binary event's 'buffer sequence'. Should
 * be constructed whenever a packet of type BINARY_EVENT is
 * decoded.
 *
 * @param {Object} packet
 * @return {BinaryReconstructor} initialized reconstructor
 * @api private
 */

function BinaryReconstructor(packet) {
  this.reconPack = packet;
  this.buffers = [];
}

/**
 * Method to be called when binary data received from connection
 * after a BINARY_EVENT packet.
 *
 * @param {Buffer | ArrayBuffer} binData - the raw binary data received
 * @return {null | Object} returns null if more binary data is expected or
 *   a reconstructed packet object if all buffers have been received.
 * @api private
 */

BinaryReconstructor.prototype.takeBinaryData = function(binData) {
  this.buffers.push(binData);
  if (this.buffers.length == this.reconPack.attachments) { // done with buffer list
    var packet = binary.reconstructPacket(this.reconPack, this.buffers);
    this.finishedReconstruction();
    return packet;
  }
  return null;
};

/**
 * Cleans up binary packet reconstruction variables.
 *
 * @api private
 */

BinaryReconstructor.prototype.finishedReconstruction = function() {
  this.reconPack = null;
  this.buffers = [];
};

function error(data){
  return {
    type: exports.ERROR,
    data: 'parser error'
  };
}

},{"./binary":39,"./is-buffer":41,"component-emitter":42,"debug":14,"isarray":33,"json3":34}],41:[function(_dereq_,module,exports){
(function (global){

module.exports = isBuf;

/**
 * Returns true if obj is a buffer or an arraybuffer.
 *
 * @api private
 */

function isBuf(obj) {
  return (global.Buffer && global.Buffer.isBuffer(obj)) ||
         (global.ArrayBuffer && obj instanceof ArrayBuffer);
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{}],42:[function(_dereq_,module,exports){
arguments[4][26][0].apply(exports,arguments)
},{"dup":26}],43:[function(_dereq_,module,exports){
module.exports = toArray

function toArray(list, index) {
    var array = []

    index = index || 0

    for (var i = index || 0; i < list.length; i++) {
        array[i - index] = list[i]
    }

    return array
}

},{}],44:[function(_dereq_,module,exports){
(function (global){
/*! https://mths.be/utf8js v2.0.0 by @mathias */
;(function(root) {

	// Detect free variables `exports`
	var freeExports = typeof exports == 'object' && exports;

	// Detect free variable `module`
	var freeModule = typeof module == 'object' && module &&
		module.exports == freeExports && module;

	// Detect free variable `global`, from Node.js or Browserified code,
	// and use it as `root`
	var freeGlobal = typeof global == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/*--------------------------------------------------------------------------*/

	var stringFromCharCode = String.fromCharCode;

	// Taken from https://mths.be/punycode
	function ucs2decode(string) {
		var output = [];
		var counter = 0;
		var length = string.length;
		var value;
		var extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	// Taken from https://mths.be/punycode
	function ucs2encode(array) {
		var length = array.length;
		var index = -1;
		var value;
		var output = '';
		while (++index < length) {
			value = array[index];
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
		}
		return output;
	}

	function checkScalarValue(codePoint) {
		if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
			throw Error(
				'Lone surrogate U+' + codePoint.toString(16).toUpperCase() +
				' is not a scalar value'
			);
		}
	}
	/*--------------------------------------------------------------------------*/

	function createByte(codePoint, shift) {
		return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
	}

	function encodeCodePoint(codePoint) {
		if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
			return stringFromCharCode(codePoint);
		}
		var symbol = '';
		if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
			symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
		}
		else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
			checkScalarValue(codePoint);
			symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
			symbol += createByte(codePoint, 6);
		}
		else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
			symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
			symbol += createByte(codePoint, 12);
			symbol += createByte(codePoint, 6);
		}
		symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
		return symbol;
	}

	function utf8encode(string) {
		var codePoints = ucs2decode(string);
		var length = codePoints.length;
		var index = -1;
		var codePoint;
		var byteString = '';
		while (++index < length) {
			codePoint = codePoints[index];
			byteString += encodeCodePoint(codePoint);
		}
		return byteString;
	}

	/*--------------------------------------------------------------------------*/

	function readContinuationByte() {
		if (byteIndex >= byteCount) {
			throw Error('Invalid byte index');
		}

		var continuationByte = byteArray[byteIndex] & 0xFF;
		byteIndex++;

		if ((continuationByte & 0xC0) == 0x80) {
			return continuationByte & 0x3F;
		}

		// If we end up here, it’s not a continuation byte
		throw Error('Invalid continuation byte');
	}

	function decodeSymbol() {
		var byte1;
		var byte2;
		var byte3;
		var byte4;
		var codePoint;

		if (byteIndex > byteCount) {
			throw Error('Invalid byte index');
		}

		if (byteIndex == byteCount) {
			return false;
		}

		// Read first byte
		byte1 = byteArray[byteIndex] & 0xFF;
		byteIndex++;

		// 1-byte sequence (no continuation bytes)
		if ((byte1 & 0x80) == 0) {
			return byte1;
		}

		// 2-byte sequence
		if ((byte1 & 0xE0) == 0xC0) {
			var byte2 = readContinuationByte();
			codePoint = ((byte1 & 0x1F) << 6) | byte2;
			if (codePoint >= 0x80) {
				return codePoint;
			} else {
				throw Error('Invalid continuation byte');
			}
		}

		// 3-byte sequence (may include unpaired surrogates)
		if ((byte1 & 0xF0) == 0xE0) {
			byte2 = readContinuationByte();
			byte3 = readContinuationByte();
			codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
			if (codePoint >= 0x0800) {
				checkScalarValue(codePoint);
				return codePoint;
			} else {
				throw Error('Invalid continuation byte');
			}
		}

		// 4-byte sequence
		if ((byte1 & 0xF8) == 0xF0) {
			byte2 = readContinuationByte();
			byte3 = readContinuationByte();
			byte4 = readContinuationByte();
			codePoint = ((byte1 & 0x0F) << 0x12) | (byte2 << 0x0C) |
				(byte3 << 0x06) | byte4;
			if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
				return codePoint;
			}
		}

		throw Error('Invalid UTF-8 detected');
	}

	var byteArray;
	var byteCount;
	var byteIndex;
	function utf8decode(byteString) {
		byteArray = ucs2decode(byteString);
		byteCount = byteArray.length;
		byteIndex = 0;
		var codePoints = [];
		var tmp;
		while ((tmp = decodeSymbol()) !== false) {
			codePoints.push(tmp);
		}
		return ucs2encode(codePoints);
	}

	/*--------------------------------------------------------------------------*/

	var utf8 = {
		'version': '2.0.0',
		'encode': utf8encode,
		'decode': utf8decode
	};

	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define(function() {
			return utf8;
		});
	}	else if (freeExports && !freeExports.nodeType) {
		if (freeModule) { // in Node.js or RingoJS v0.8.0+
			freeModule.exports = utf8;
		} else { // in Narwhal or RingoJS v0.7.0-
			var object = {};
			var hasOwnProperty = object.hasOwnProperty;
			for (var key in utf8) {
				hasOwnProperty.call(utf8, key) && (freeExports[key] = utf8[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.utf8 = utf8;
	}

}(this));

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{}],45:[function(_dereq_,module,exports){
'use strict';

var alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split('')
  , length = 64
  , map = {}
  , seed = 0
  , i = 0
  , prev;

/**
 * Return a string representing the specified number.
 *
 * @param {Number} num The number to convert.
 * @returns {String} The string representation of the number.
 * @api public
 */
function encode(num) {
  var encoded = '';

  do {
    encoded = alphabet[num % length] + encoded;
    num = Math.floor(num / length);
  } while (num > 0);

  return encoded;
}

/**
 * Return the integer value specified by the given string.
 *
 * @param {String} str The string to convert.
 * @returns {Number} The integer value represented by the string.
 * @api public
 */
function decode(str) {
  var decoded = 0;

  for (i = 0; i < str.length; i++) {
    decoded = decoded * length + map[str.charAt(i)];
  }

  return decoded;
}

/**
 * Yeast: A tiny growing id generator.
 *
 * @returns {String} A unique id.
 * @api public
 */
function yeast() {
  var now = encode(+new Date());

  if (now !== prev) return seed = 0, prev = now;
  return now +'.'+ encode(seed++);
}

//
// Map each character to its index.
//
for (; i < length; i++) map[alphabet[i]] = i;

//
// Expose the `yeast`, `encode` and `decode` functions.
//
yeast.encode = encode;
yeast.decode = decode;
module.exports = yeast;

},{}]},{},[1])(1)
});

//# sourceMappingURL=app.js.map
