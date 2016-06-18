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