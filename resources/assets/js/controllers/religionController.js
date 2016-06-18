angular
    .module('Platease')
    .controller('religionController', ['$scope','$rootScope', 'Patients', '$stateParams', function($scope, $rootScope, Patients, $stateParams){


      Religion.getAllReligions().then(function(religions){

        //$scope.patient = patient;

        }, function(){
            alert('Ha ocurrido un error al obtener las citas médicas');
           });

    }]);