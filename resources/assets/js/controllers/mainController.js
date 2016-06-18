angular.module('Platease')
    .controller('MainController', ['$rootScope','$scope', '$state', 'UserData', 'Doctor_Especiality', '$timeout', 'SensorData', function($rootScope, $scope, $state, UserData, Doctor_Especiality, $timeout, SensorData){
        $scope.state_name = $state.current.name;

        $rootScope.$on('$locationChangeSuccess', function(e){
            $scope.state_name = $state.current.name;
        });

        $scope.navigationActiveClass = function(stateName){
            return stateName == $state.current.name ? ' active ' : '';
        };

        UserData.then(function(data){
            var date = Date.now();
            $scope.user_data = data[0];
            $scope.user_data.profile_picture = $scope.user_data.profile_picture+"?="+date;

            if($scope.user_data.user_type == 'doctor'){
                Doctor_Especiality.getADoctorEspeciality($scope.user_data.speciality).then(function(doctor_speciality){
                    $scope.doctor_speciality = doctor_speciality;
                }, function(){});
                Doctor_Especiality.getADoctorEspeciality($scope.user_data.second_speciality).then(function(doctor_speciality){
                    $scope.doctor_second_speciality = doctor_speciality;
                }, function(){});
            }
            if($scope.user_data.user_type == 'supervisor'){
               $state.go('doctors');
            }
        }, function(){

        });


        $scope.actual_date  = new Date();



        //$scope.getsensorsdata = function(){
        //    $timeout(function(){
        //        SensorData.getSensorData().then(function(sensors){
        //            console.log(sensors);
        //            toastr.success('ok');
        //        }, function(){
        //            toastr.error('Error al contactar con los sensores');
        //        });
        //        $scope.getsensorsdata();
        //    }, 5000);
        //};
        //$scope.getsensorsdata();


    }]);