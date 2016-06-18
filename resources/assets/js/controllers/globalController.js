angular.module('Platease')
    .controller('GlobalController', ['$scope', 'user', function($scope, user){
        $scope.user = user;

        console.log(user);

    }]);