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
