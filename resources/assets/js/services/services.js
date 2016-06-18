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
