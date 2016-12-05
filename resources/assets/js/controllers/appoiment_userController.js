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
                templateUrl: '/public/tesis/templates/modal/newmedication.html',
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
                templateUrl: '/public/tesis/templates/modal/deletemedication.html',
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
                templateUrl: '/public/tesis/templates/modal/newmedication.html',
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
                templateUrl: '/public/tesis/templates/modal/deletepatient.html',
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