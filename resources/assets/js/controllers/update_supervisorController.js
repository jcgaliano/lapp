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