angular.module('Platease')
    .controller('LoginController', ['$auth', '$state', '$scope', '$rootScope', 'store' ,function($auth, $state, $scope, $rootScope, store){

        $scope.credentials = {
            email: '',
            password: ''
        };

        $scope.tryLogin = function(){
            $auth.login($scope.credentials)
                .then(function(res){
                    if (undefined !== res.data.token && res.data.token ){
                        $state.go('index.appointments');
                    } else {
                        console.log('authentication error');
                    }
                }, function(err){
                    
                });
        };

    }])
    .controller('RegisterController', [function(){

    }])
    .controller('RecoverController', [function(){

    }]);
