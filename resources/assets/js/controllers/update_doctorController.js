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