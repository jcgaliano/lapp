angular.module('Platease')
    .controller('LoginController', ['$auth', '$state', '$scope', '$rootScope', 'store', 'UserData' ,function($auth, $state, $scope, $rootScope, store, UserData){

        $scope.credentials = {
            email: '',
            password: ''
        };

        if (angular.element(document.getElementById('error_message')).length > 0){
            $scope.auth_message = angular.element(document.getElementById('error_message'))[0].value;
        }

        if (angular.element(document.getElementById('success_message')).length > 0){
            $scope.success_message = angular.element(document.getElementById('success_message'))[0].value;
        }

        $scope.tryLogin = function(){
            $auth.login($scope.credentials)
                .then(function(res){
                    if (undefined !== res.data.token && res.data.token ){

                        var ud = UserData.getData();

                        if (undefined !== ud.then){

                            ud.then(function(userData){

                                switch(userData.user_type){
                                    case 'patient':
                                    case 'doctor':
                                        $state.go('index.appointments');
                                        break;
                                    case 'supervisor':
                                        $state.go('index.super_doctors');
                                        break;
                                }

                            });

                        } else {
                            
                            switch(ud.user_type){
                                case 'patient':
                                case 'doctor':
                                    $state.go('index.appointments');
                                    break;
                                case 'supervisor':
                                    $state.go('index.super_doctors');
                                    break;
                            }

                        }

                    } else {

                        if (undefined !== res.data.message){
                            $scope.auth_message = res.data.message;
                        } else {
                            $scope.auth_message = 'Las credenciales utilizadas son inválidas';
                        }

                    }
                }, function(err){

                    switch(err.status){
                        case 401:
                            $scope.auth_message = 'Las credenciales utilizadas son inválidas';
                            break;
                        case 500:
                            $scope.auth_message = 'Ha ocurrido un error al realizar el inicio de sesión';
                            break;
                    }
                });
        };
    }])
    .controller('RegisterController', ['$scope', 'specialties', 'UserData', 'dialog', '$state', function($scope, specialties, UserData, dialog, $state){

        $scope.specialties = specialties;

        $scope.registerUser = function(){

            $('#register-form').validate({
                rules: {
                    email: {
                        required: true,
                        email: true
                    },
                    password: {
                        required: true
                    },
                    password_confirm: {
                        required: true,
                        equalTo: '#password'
                    },
                    name: 'required',
                    lastname: 'required',
                    spec_1: 'required',
                    pl: 'required',
                    dni: 'required'
                }
            });

            if ($('#register-form').valid()){

                UserData.registerUser($scope.user)
                    .then(function(res){
                        if (res.status == 'success'){
                            dialog.alert('Aviso', res.message).then(function(){
                                $state.go('login.form');
                            });
                        } else {
                            dialog.alert('Aviso', res.message).then(function(){

                            });
                        }
                    }, function(data){
                        if (data instanceof Object){

                            var messages = [];

                            for (var key in data){
                                if (data[key]){
                                    messages.push('<li>' + data[key]);
                                }
                            }

                            if (messages.length > 0){

                                dialog.alert('Aviso', 'Ha ocurrido un error al procesar el registro. Revise los siguientes datos: <br><ul class="modal-error-list">' + messages.join('</li>') + '</ul>');

                            } else {
                                dialog.alert('Aviso', 'Ha ocurrido un error al procesar el registro. Inténtelo nuevamente');
                            }


                        } else {
                            dialog.alert('Aviso', 'Ha ocurrido un error al procesar el registro. Inténtelo nuevamente');
                        }
                    });

            }

        };

    }])
    .controller('RecoverController', ['$scope', 'UserData', function($scope, UserData){

        $scope.email = '';

        $scope.doRecoverPassword = function(){

            $('#recover-form').validate({
                rules: {
                    email: {
                        required: true,
                        email: true
                    }
                }
            });

            if ($('#recover-form').valid()){

                UserData.recoverPassword($scope.email)
                    .then(function(res){
                         if (res.status == 'success'){
                             $scope.showSuccess = true;
                             $scope.successMessage = res.message;
                         } else {
                             $scope.showError = true;
                             $scope.errorMessage = res.message;
                         }
                    }, function(){
                        $scope.showError = true;
                        $scope.errorMessage = 'Ha ocurrido un error al restablecer la contraseña. Inténtelo nuevamente';
                    });

            }

        };

    }])
    .controller('LogoutController', ['$auth', '$state', 'UserData', function($auth, $state, UserData){

        UserData.logout().then(function(){

            UserData.clearData();

            $auth.logout();

            $state.go('login.form');
        });

    }]);
