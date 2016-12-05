angular
    .module('Platease')
    .controller('DoctorProfileController', ['$scope', 'user', function($scope, user){

        $scope.user = user;

    }]);

