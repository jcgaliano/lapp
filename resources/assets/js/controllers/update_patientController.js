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