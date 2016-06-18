angular
    .module('Platease')
    .controller('DoctorProfileController', ['$scope', 'user', function($scope, user){

        $scope.user = user;

    }])
    .controller('PatientProfileController', ['$scope', 'user', function($scope, user){

    }])
    .controller('SupervisorProfileController', ['$scope', 'user', function($scope, user){

    }]);

