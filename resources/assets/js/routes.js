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
                templateUrl: '/tesis/tesis/templates/login_template.html',
            })
            .state('login.form', {
                url: '/login',
                templateUrl: '/tesis/templates/login.html',
                controller: 'LoginController'
            })
            .state('login.register', {
                url: '/register',
                templateUrl: '/tesis/templates/register.html',
                controller: 'RegisterController',
                resolve: {
                    specialties: ['Specialty', function(Specialty){
                        return Specialty.getAll();
                    }]
                }
            })
            .state('login.recover', {
                url: '/recover-password',
                templateUrl: '/tesis/templates/recover.html',
                controller: 'RecoverController'
            })
            .state('logout', {
                url: '/logout',
                controller: 'LogoutController'
            })
            .state('index', {
                templateUrl: '/tesis/templates/index_template.html',
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
                templateUrl: '/tesis/templates/appointments.html',
                resolve: {
                    user_appointments: ['Appointments', function(Appointments){
                        return Appointments.getAllAppoiments();
                    }]
                }
            })
            .state('index.appointments_add', {
                url: '/appointments/new',
                controller: 'NewAppointmentController',
                templateUrl: '/tesis/templates/newAppointment.html',
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
                templateUrl: '/tesis/templates/appointments_user.html',
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
                templateUrl: '/tesis/templates/newAppointment.html',
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
                templateUrl: '/tesis/templates/solicitarappointments.html',
                resolve: {
                    apmt_requests: ['Appointments', function(Appointments){
                        return Appointments.getPendingRequests();
                    }]
                }
            })
            .state('index.appointment_requests_add', {
                url: '/appointment-requests/add',
                controller: 'NewAppointmentRequestController',
                templateUrl: '/tesis/templates/newAppointmentRequest.html',
                resolve: {
                    doctors: ['Doctor', function(Doctor){
                        return Doctor.getAllDoctors();
                    }],
                }
            })
            .state('index.doctor_profile', {
                url: '/doctor-profile',
                controller: 'update_DoctorController',
                templateUrl: '/tesis/templates/update_profile.html',
                resolve: {
                    specialties: ['Specialty', function(Specialty){
                        return Specialty.getAll();
                    }]
                }
            })
            .state('index.patients', {
                url: '/patients',
                controller: 'PatientsController',
                templateUrl: '/tesis/templates/patients.html'
            })
            .state('index.patients_add', {
                url: '/patients/edit/:id',
                controller: 'AddPatientController',
                templateUrl: '/tesis/templates/patient.html',
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
                templateUrl: '/tesis/templates/patient_profile.html',
                resolve: {
                    patient: ['Patients', function(Patients){
                        return Patients.getLoggedPatient();
                    }]
                }
            })
            .state('index.patient_medications', {
                url: '/patient-medications',
                controller: 'PatientMedicationsController',
                templateUrl: '/tesis/templates/patient_medications.html',
                resolve: {
                    meds: ['Medications', function(Medications){
                        return Medications.getCurrentForUser();
                    }]
                }
            })
            .state('index.supervisor_profile', {
                url: '/supervisor-profile',
                controller: 'SupervisorProfileController',
                templateUrl: '/tesis/templates/update_profile_supervisor.html',
            })
            .state('index.monitoring', {
                url: '/monitoring',
                controller: 'sensorsController',
                templateUrl: '/tesis/templates/sensors.html'
            })
            .state('index.patient_appointment_details', {
                url: '/done-appointments',
                controller: 'AppointmentSummaryController',
                templateUrl: '/tesis/templates/appointment_details.html',
                resolve: {
                    user_appointments: ['Appointments', function(Appointments){
                        return Appointments.getDoneAppoiments();
                    }]
                }
            })
            .state('index.patient_appointment_summary', {
                url: '/appointments-summary/:id',
                controller: 'PreviousAppointmentController',
                templateUrl: '/tesis/templates/previous_appointment.html',
                resolve: {
                    appointment: ['Appointments', '$stateParams', function(Appointments, $stateParams){
                        return Appointments.getAppointmentDetails($stateParams.id);
                    }]
                }
            })
            .state('index.patient_appointment_summary_with_referer', {
                url: '/appointments-summary/:id/:appointmentId',
                controller: 'PreviousAppointmentController',
                templateUrl: '/tesis/templates/previous_appointment.html',
                resolve: {
                    appointment: ['Appointments', '$stateParams', function(Appointments, $stateParams){
                        return Appointments.getAppointmentDetails($stateParams.id);
                    }]
                }
            })
            .state('index.super_doctors', {
                url: '/doctors',
                templateUrl: '/tesis/templates/doctors_new.html',
                controller: 'DoctorsController',
                resolve: {
                    doctors: ['Doctor', function(Doctor){
                        return Doctor.getAllDoctorsExtended();
                    }]
                }
            })
            .state('index.super_pending_doctors', {
                url: '/doctors-pending',
                templateUrl: '/tesis/templates/doctors_pending.html',
                controller: 'PendingDoctorsController',
                resolve: {
                    pending_doctors: ['Doctor', function(Doctor){
                        return Doctor.getAllPendingDoctors();
                    }]
                }
            })
            .state('index.super_doctor_profile', {
                url: '/doctor/:id',
                templateUrl: '/tesis/templates/doctor_profile.html',
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
                templateUrl: '/tesis/templates/doctor_small.html',
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