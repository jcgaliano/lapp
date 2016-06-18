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