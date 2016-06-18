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
    'angular-storage'
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
                controller: 'RegisterController'
            })
            .state('login.recover', {
                url: '/recover-password',
                templateUrl: '/templates/recover.html',
                controller: 'RecoverController'
            })
            .state('index', {
                templateUrl: '/templates/index_template.html',
                controller: 'GlobalController',
                resolve: {
                    user: ['UserData', function(UserData){
                        return UserData.getData();
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
                    }
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
                    }]
                }
            })
            .state('index.doctor_profile', {
                url: '/doctor-profile',
                controller: 'update_DoctorController',
                templateUrl: '/templates/update_profile.html',
            })
            .state('index.patient_profile', {
                url: '/patient-profile',
                controller: 'PatientProfileController',
                templateUrl: '/templates/update_patient_profile.html',
            })
            .state('index.supervisor_profile', {
                url: '/patient-profile',
                controller: 'SupervisorProfileController',
                templateUrl: '/templates/update_profile_supervisor.html',
            })

        ;

            // .state('index', {
            //     url: '/',
            //     templateUrl: '/templates/index_layout.html',
            //     data: {
            //         authorizedRoles: [ROLES.admin, ROLES.patient, ROLES.doctor]
            //     }
            // })
            // .state('index.appointments', {
            //     url: 'appointments',
            //     templateUrl: '/templates/appointments.html'
            // });

        // Application routes
        // $stateProvider
        //     .state('login', {
        //         url: '/login',
        //         templateUrl: '/templates/login.html',
        //         data: {
        //             requiresLogin: false,
        //         }
        //     })
        //     .state('sensors', {
        //         url: '/sensors',
        //         templateUrl: '/templates/sensors.html',
        //         data: {
        //             requiresLogin: true,
        //             validated : true
        //         }
        //     })
        //     .state('appointments', {
        //         url: '/appointments',
        //         templateUrl: '/templates/appointments.html',
        //         data: {
        //             requiresLogin: true,
        //             validated : true
        //         }
        //     })
        //     .state('appointment_details', {
        //         url: '/appointment_details',
        //         templateUrl: '/templates/appointment_details.html',
        //         data: {
        //             requiresLogin: true,
        //             validated : true
        //         }
        //     })
        //     .state('personal_data', {
        //         url: '/personal_data',
        //         templateUrl: '/templates/personal_data.html',
        //         data: {
        //             requiresLogin: true,
        //             validated : true
        //         }
        //     })
        //     .state('patient', {
        //         url: '/patient',
        //         templateUrl: '/templates/patient.html',
        //         data: {
        //             requiresLogin: true,
        //             validated : true
        //         }
        //     })
        //     .state('appoiment_patient', {
        //         url: '/appoiment_patient/:user_id/:appointment_id',
        //         templateUrl: '/templates/appoiments_user.html',
        //         data: {
        //             requiresLogin: true,
        //             validated : true
        //         }
        //     })
        //     .state('update_profile', {
        //         url: '/update_profile',
        //         templateUrl: '/templates/update_profile.html',
        //         data: {
        //             requiresLogin: true
        //         }
        //     })
        //     .state('update_patient_profile', {
        //         url: '/update_patient_profile',
        //         templateUrl: '/templates/update_patient_profile.html',
        //         data: {
        //             requiresLogin: true
        //         }
        //     })
        //     .state('update_profile_supervisor', {
        //         url: '/update_profile_supervisor',
        //         templateUrl: '/templates/update_profile_supervisor.html',
        //         data: {
        //             requiresLogin: true
        //         }
        //     })
        //     .state('doctors', {
        //         url: '/doctors',
        //         templateUrl: '/templates/doctors.html',
        //         data: {
        //             requiresLogin: true,
        //             validated : true
        //         }
        //     })
        //     .state('doctors_unapproved', {
        //         url: '/doctors_unapproved',
        //         templateUrl: '/templates/doctors_unapproved.html',
        //         data: {
        //             requiresLogin: true,
        //             validated : true
        //         }
        //     })
        //     .state('solicitar_appointment', {
        //         url: '/solicitar_appointment',
        //         templateUrl: '/templates/solicitarappointments.html',
        //         data: {
        //             requiresLogin: true,
        //             validated : true
        //         }
        //     })
        //     .state('medications', {
        //         url: '/medications',
        //         templateUrl: '/templates/medications.html',
        //         data: {
        //             requiresLogin: true,
        //             validated : true
        //         }
        //     });
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
    .controller('GlobalController', ['$scope', 'user', function($scope, user){
        $scope.user = user;

        console.log(user);

    }]);
angular.module('Platease')
    .controller('LoginController', ['$auth', '$state', '$scope', '$rootScope', 'store' ,function($auth, $state, $scope, $rootScope, store){

        $scope.credentials = {
            email: '',
            password: ''
        };

        $scope.tryLogin = function(){
            $auth.login($scope.credentials)
                .then(function(res){
                    if (undefined !== res.data.token && res.data.token ){
                        $state.go('index.appointments');
                    } else {
                        console.log('authentication error');
                    }
                }, function(err){
                    
                });
        };

    }])
    .controller('RegisterController', [function(){

    }])
    .controller('RecoverController', [function(){

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
    .controller('NewAppointmentController', ['$scope', 'patients', 'Appointments', '$state', 'appointment', function($scope, patients, Appointments, $state, appointment){

        $scope.patients = patients;

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
                    }
                }
            });
            if ($('#appointment_form').valid()){
                $scope.upsertAppointment();
            }
        };

        $scope.upsertAppointment = function () {

            $scope.datetime = $scope.date + " " + $scope.time.getHours() + ":" + $scope.time.getMinutes();

            Appointments.upsertAppointment(undefined !== appointment && appointment ? appointment.id : null, $scope.datetime, $scope.appointment.patient_id)
                .then(function(res){
                    toastr.success(res.message);
                    $state.go('index.appointments');
                }, function(res){
                    toastr.error(res.message);
                });
        };
    }]);
angular
    .module('Platease')
    .controller('appointmentDetailsController', ['$scope', 'AppoimentDetails', function($scope, AppoimentDetails){
        $scope.seemorescreen = false;
        AppoimentDetails.getAllIndicationsByPatient().then(function(data){

            $scope.data = data;

        }, function(){
            alert('Ha ocurrido un error al obtener las citas médicas');
        });

        $scope.seemore = function(appointment_id){
            $scope.seemorescreen = true;
            AppoimentDetails.getAIndicationsByPatient(appointment_id).then(function(appointment_detatail){
                $scope.appointment_detatail = appointment_detatail;
             }, function(){

             });
        };

        $scope.cancelseemore = function(){
            $scope.seemorescreen = false;
        };

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
    }]);


angular
    .module('Platease')
    .controller('sensorsController', ['$scope','$timeout', 'SensorData', function($scope, $timeout, SensorData){

        $scope.sensor_data = {
            cloudsalud: {
                tag: 'realtime',
                success: true,
                error: false,
                sensors: [
                    {
                        id: 0,
                        name: 'Temperatura',
                        value: 37.2,
                        type_sensor: 1,
                        labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio"],
                        series: 'Temperatura corporal',
                        data: [
                            [35.6, 37, 37.5, 38, 38.3, 0, 0],
                        ]
                    },
                    {
                        id: 1,
                        name: 'Oxígeno',
                        value: 87,
                        type_sensor: 3,
                        labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio"],
                        series: 'Concentracion de oxígeno',
                        data: [
                            [40, 60, 80, 70, 60, 0, 0],
                        ]
                    },
                    {
                        id: 2,
                        name: 'Ritmo cardíaco',
                        value: 93,
                        type_sensor: 2,
                        labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio"],
                        series: 'Ritmo cardíaco',
                        data: [
                            [98, 90, 130, 146, 30, 0, 0],
                        ]
                    },

                ]
            }
        };

        //SensorData.then(function(data){
        //
        //    //var sensors = data.laria.sensors;
        //    //
        //    //for(var i in sensors){
        //    //   console.log(sensors[i]);
        //    //}
        //
        //}, function(){
        //    alert('Ha ocurrido un error al obtener datos de los sensores');
        //});
    }]);


angular
    .module('Platease')
    .controller('patientController', ['$scope', '$http', 'Patients', '$q', '$modal', '$timeout', function ($scope, $http, Patients, $q, $modal, $timeout) {
        var picture = null;
        $scope.insertShow = false;
        $scope.profile_picture = 'public/uploads/users_pictures/default.jpg';
        var archivos = document.getElementById('picture');
        archivos.addEventListener('change', upload, false);
        //var pictureBox = document.getElementById('profile_picture');

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
                    $scope.profile_picture = '/public/images/loading.gif';
                });
            }, 0);
        }

        function finish() {
            toastr.success("Se Vinculó Imagen al Usuario");
            $scope.imagen = picture;
            $timeout(function () {
                $scope.$apply(function () {
                    $scope.profile_picture = '/public/uploads/users_pictures/' + picture.name;
                });
            }, 0);
        }

        Patients.getAllPatients().then(function (patients) {
            $scope.patients = patients;
        }, function () {
            toastr.error("Error en la Operación");
        });

        $scope.showAddPatient = function () {
            $scope.insertShow = true;
            $scope.updateShowButton = false;
            $scope.insertShowButton = true;
            $scope.patient = "";
        };

        $scope.cancelInsertPatient = function (patient_id) {

            $scope.insertShow = false;
            $scope.profile_picture = 'public/uploads/users_pictures/default.jpg';
            if (picture != null && picture != " ") {
                Patients.deleteProfilePicture(picture.name).then(function () {
                    toastr.info('Se Desvinculó Imagen al Usuario');
                    var date = new Date();
                    $scope.profile_picture = 'public/uploads/users_pictures/default.jpg';
                }, function () {
                    toastr.error("Error Eliminando Imagen");
                });
                $scope.patient = "";
                picture = null;
            }
        };

        $scope.insertPatient = function () {
            $("#patient_form").
                validate({
                    rules: {
                        email: {
                            required: true,
                            email: true,
                            remote: "validar_email.php"
                        },
                        name: {
                            required: true,
                            minlength: 3
                        },
                        lastname: {
                            required: true,
                            minlength: 10
                        },
                        documentation:{
                            required: true
                        },
                        document: {
                            required: true,
                            minlength: 5
                        },
                        idDisp: {
                            required: true,
                            number: true

                        }
                    }
                });
            if ($('#patient_form').valid()){
                $scope.insertShow = true;
                if (picture == null) {
                    $scope.imagen = {'name': 'default', 'type': "image/jpeg"}
                }
                Patients.insertPatient($scope.patient, $scope.imagen).then(function (patient) {
                    $scope.patients.push(patient);
                    $scope.insertShow = false;
                    toastr.success('Operación Realizada Satisfactoriamente');
                    picture = null;
                    $scope.patient = "";
                }, function () {
                    toastr.error("Error al Inzertar Paciente");
                });
            }
        };

        $scope.toSearch = function (criterial) {

            Patients.searchPatient(criterial).then(function (patient) {
                $scope.patients = patient;
            }, function () {
                toastr.error("Error al Relizar la Operación");
            });
        };

        $scope.deletepatient = function (patient_id, index) {
            Patients.deletePatient(patient_id).then(function (patient) {
                $scope.patients.splice(index, 1);
                toastr.success('Operación Realizada Satisfactoriamente');
                $scope.patient = " ";
                picture = null;
            }, function () {
                toastr.error("Error al Relizar la Operación");
            });
        };

        $scope.loadpatienttoedit = function (index, patient_id) {

            Patients.selectSinglePatientById(patient_id).then(function (patient) {
                var date = Date.now();
                $scope.patientIndex = index;
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

                $scope.insertShow = true;
                $scope.insertShowButton = false;
                $scope.updateShowButton = true;
            }, function () {
                toastr.error("Error al Relizar la Operación");
            });
        };

        $scope.updatePatient = function (patient_id) {
            $("#patient_form").
                validate({
                    rules: {
                        email: {
                            required: true,
                            email: true,
                        },
                        name: {
                            required: true,
                            minlength: 3
                        },
                        lastname: {
                            required: true,
                            minlength: 10
                        },
                        documentation:{
                            required: true
                        },
                        document: {
                            required: true,
                            minlength: 5
                        },
                        idDisp: {
                            required: true,
                            number: true

                        }
                    }
                });
            if ($('#patient_form').valid()){
                        if (picture == null) {
                            $scope.imagen = {'name': " ", 'type': " "}
                        }
                        Patients.updatePatient(patient_id, $scope.patient, $scope.imagen).then(function (updatedpatient) {
                            $scope.insertShow = false;
                            $scope.patients.splice($scope.patientIndex, 1, updatedpatient);
                            toastr.success('Operación Realizada Satisfactoriamente');


                            $timeout(function () {
                                $scope.$apply(function () {
                                    //$scope.profile_picture.path = updatedpatient.profile_picture;
                                    $scope.profile_picture = updatedpatient.profile_picture;
                                });
                            }, 0);
                            $scope.patient = "";
                            picture = null;
                        }, function () {
                            toastr.error("Error al Relizar la Operación");
                        });
            }

        };

        $scope.confirmdelete = function (patient_id, index) {

            Patients.selectSinglePatientById(patient_id).then(function (patient) {
                var date = Date.now();
                $scope.patientIndex = index;
                $scope.profile_picture = patient.profile_picture + "?t=" + date;
                $scope.patient = {
                    'patient_id': patient.id,
                    'lugar_origen' : patient.lugar_origen,
                    'email': patient.email,
                    'name': patient.name,
                    'lastname': patient.lastname,
                    'curp': patient.curp,
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
            $modal.open({
                animation: true,
                templateUrl: '/public/templates/modal/deletepatient.html',
                controller: 'patientController',
                size: 'md',
                scope : $scope
            }).result.then(function () {
                    $scope.deletepatient(patient_id, index);
                }, function () {
                    $scope.patient = "";
                    $scope.profile_picture = '/public/uploads/users_pictures/default.jpg';
                });
        };
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
            toastr.error("Error al Relizar la Operaci&oacute;n");
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
    .controller('doctorsController', ['$scope', 'Doctor', '$q', 'Patients', '$http', '$modal', function ($scope, Doctor, $q, Patients, $http, $modal) {

        toastr.options.closeButton = true;
        $scope.updateShow = false;

        Doctor.getAllDoctors().then(function(doctors){
            $scope.doctors = doctors;
        }, function(){
            toastr.error('Error al Traer Lista de Doctores');
        });

        $scope.deleteDoctor = function(doctor_id){
            Doctor.deleteDoctor(doctor_id).then(function(){
                Doctor.getAllDoctors().then(function(doctors){
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
                templateUrl: '/public/templates/modal/deletedoctor.html',
                controller: 'doctorsController',
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
                toastr.error('Error al traer medico');
            });



        }

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
    .controller('update_DoctorController', ['$auth', '$scope', '$http', 'Patients', '$q', '$modal', '$timeout', 'user', function ($auth, $scope, $http, Patients, $q, $modal, $timeout, user) {

        $scope.doctor = user;

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
                    solicitud.open("POST", '/api/profile-picture', true);
                    solicitud.setRequestHeader('Authorization', 'Bearer ' + $auth.getToken());
                    solicitud.send(datos);
                } else {
                    toastr.error("Imágenes de Menos de 2 MB");
                }
            } else {
                toastr.error("Solo Imágenes PNG o JPG");
            }
        }

        function begin() {
            $timeout(function () {
                $scope.$apply(function () {
                    $scope.doctor.profile_picture = '/images/loading.gif';
                });
            }, 0);
        }

        function finish() {
            console.log(arguments);
            toastr.success("Se Vinculó Imagen al Usuario");
            $scope.imagen = picture;
            $timeout(function () {
                $scope.$apply(function () {
                    $scope.doctor.profile_picture = '/uploads/users_pictures/' + picture.name;
                });
            }, 0);
        }

        $scope.updateDoctor = function(doctor){

            $("#upadate_doctor").
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
                            required: true
                        },
                        cedula: {
                            required: true
                        },
                        password:{
                            minlength: 5
                        },
                        repassword:{
                            minlength: 5,
                            equalTo : password
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
            if ($('#upadate_doctor').valid()){

                var imagen_profile;
                if($scope.imagen == null){
                    imagen_profile = {
                        'name' : null,
                        'type' : null
                    };
                }else{
                    imagen_profile = $scope.imagen;
                }

                Doctor.updateDoctor(doctor, imagen_profile).then(function(doctor){
                    window.location = "/index.php";
                }, function(){

                });

            }

        };
    }]);
angular
    .module('Platease')
    .controller('update_SupervisorController', ['$scope', '$http', 'Supervisor', '$q', '$modal', '$timeout', 'Doctor', 'Doctor_Especiality', 'UserData', function ($scope, $http, Supervisor, $q, $modal, $timeout, Doctor, Doctor_Especiality, UserData) {

        var picture = null;
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
                    $scope.supervisor.profile_picture = 'public/images/loading.gif';
                });
            }, 0);
        }

        function finish() {
            toastr.success("Se Vinculó Imagen al Usuario");
            $scope.imagen = picture;
            $timeout(function () {
                $scope.$apply(function () {
                    $scope.supervisor.profile_picture = 'public/uploads/users_pictures/' + picture.name;
                });
            }, 0);
        }

        Supervisor.getASupervisorById().then(function(supervisor){
            var date = Date.now();
            $scope.supervisor = supervisor;
            $scope.supervisor.profile_picture = $scope.supervisor.profile_picture+"?t="+date;
        }, function(){

        });


        $scope.updatesupervisor = function(supervisor){

            $("#update_profile_supervisor").
                validate({
                    rules: {
                        name: {
                            required: true,
                            minlength: 3
                        },
                        lastname: {
                            required: true,
                            minlength: 10
                        },
                        email:{
                            required:true,
                            email:true
                        },
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
                        }
                    }
                });
            if ($('#update_profile_supervisor').valid()){
                var imagen_profile;
                if($scope.imagen == null){
                    imagen_profile = {
                        'name' : null,
                        'type' : null
                    };
                }else{
                    imagen_profile = $scope.imagen;
                }

                Supervisor.updateSupervisor(supervisor, imagen_profile).then(function(supervisor){
                    window.location = "/index.php";
                }, function(){

                });
            }
        }

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
    .controller('NewAppointmentRequestController', ['$scope', 'doctors', 'Appointments', '$state', function($scope, doctors, Appointments, $state){

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

                Appointments.upsertAppointmentRequest(undefined !== appointment && appointment ? appointment.id : null, $scope.datetime, $scope.appointment.patient_id)
                    .then(function(res){
                            toastr.success(res.message);
                            $state.go('index.appointments');
                    }, function(res){
                            toastr.error(res.message);
                    });
        };
}]);

angular
    .module('Platease')
    .controller('DoctorProfileController', ['$scope', 'user', function($scope, user){

        $scope.user = user;

    }])
    .controller('PatientProfileController', ['$scope', 'user', function($scope, user){

    }])
    .controller('SupervisorProfileController', ['$scope', 'user', function($scope, user){

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
            }
        };
    }]);

angular.module('Platease')
    .factory('Supervisor', ['$http', '$timeout', '$q', function($http, $timeout, $q){
      return {
          getASupervisorById : function()
          {
              var d = $q.defer();
              $http.get('/index.php/getasupervisor')
                  .success(function(res){
                      d.resolve(res);
                  })
                  .error(function(status){
                      d.reject(status);
                  });

              return d.promise;
          },
          updateSupervisor : function(supervisor, imagen)
          {
              var d = $q.defer();
              $http({method:'put', data:{
                  'supervisor' : supervisor,
                  'imagen_name' : imagen.name,
                  'imagen_type' : imagen.type
              },
                  url: "/index.php/updatesupervisor"}).success(function (doctor) {
                  d.resolve(doctor);
              }).error(function(){
                  d.reject('error');
              });

              return d.promise;
          }
      };
    }]);

angular.module('Platease')
    .factory('SensorData', ['$http', '$timeout', '$q', function($http, $timeout, $q){
        return {
            getSensorData : function()
            {
                var d = $q.defer();
                $http.get('/index.php/getsensordata')
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
    .factory('Medications', ['$http', '$timeout', '$q', function($http, $timeout, $q){
       return {
           getAllMedications : function()
           {
               var d = $q.defer();
               $http.get('/index.php/medications')
                   .success(function(res){
                       d.resolve(res);
                   })
                   .error(function(status){
                       d.reject(status);
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
                $http.delete('/index.php/deletedoctor/'+doctor_id)
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
            updateDoctor : function(doctor, imagen)
            {
                var d = $q.defer();
                $http({method:'put', data:{
                    'doctor' : doctor,
                    'imagen_name' : imagen.name,
                    'imagen_type' : imagen.type
                },
                    url: "/index.php/updatedoctor"}).success(function (doctor) {
                    d.resolve(doctor);
                }).error(function(){
                    d.reject('error');
                });

                return d.promise;
            },
            certifyDoctor : function(doctor_id)
            {
                var d = $q.defer();
                $http({method:'put', data:{
                    'doctor_id' : doctor_id
                },
                    url: "/index.php/certifydoctor"}).success(function (doctor) {
                    d.resolve(doctor);
                }).error(function(){
                    d.reject('error');
                });

                return d.promise;
            }

        };
    }]);

angular.module('Platease')
    .factory('Doctor_Especiality', ['$http', '$timeout', '$q', function($http, $timeout, $q){
        return {
            getAllDoctorEspecialities : function()
            {
                var d = $q.defer();
                $http.get('/index.php/getalldoctorespecialities')
                    .success(function(res){
                        d.resolve(res);
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
                upsertAppointment: function(appointment_id, date, patient_id){
                    var d = $q.defer();

                    $http.post('/api/appointment', {date: date, patient: patient_id, id: appointment_id})
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

                    $http.get('/api/appointment/'+appointment_id)
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
                doAppointment: function(appointment){
                    var d = $q.defer();
                    $http({ method:'put', data:{
                        'appointment_id': appointment.appointment_id,
                        'indications': appointment.indications
                    },
                        url: "/index.php/doappointment"}).success(function (appointment) {
                        d.resolve(appointment);
                    }).error(function(){
                        d.reject('error');
                    });
                    return d.promise;
                }
            };
    }]);

angular.module('Platease')
    .factory('Patients', ['$http', '$timeout', '$q', function($http, $timeout, $q){
        return{
                getAllPatients :  function(){
                    var d = $q.defer();
                    $http.get('/api/patients').success(function (patients) {
                        if (patients.status == 'success'){
                            d.resolve(patients.data);
                        } else {
                            dlreject(patients);
                        }

                    }).error(function(){
                        d.reject('error');
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
                $http.delete('/index.php/deletepatient/'+patient_id).success(function (patient) {
                    d.resolve(patient);
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

//# sourceMappingURL=app.js.map
