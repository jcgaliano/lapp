angular
    .module('Platease')
    .controller('AddPatientController', ['$scope', 'patient', 'Patients', '$state', function($scope, patient, Patients, $state){

        $scope.patient = patient ? angular.copy(patient) : { profile_picture: '/images/default-profile.png' };

        $scope.upload = function (file) {

            if (file){
                $scope.uploading = true;

                Upload.upload({
                    url: '/api/profile-picture',
                    data: {
                        file: file
                    }
                }).then(
                    function(res){
                        $scope.uploading = false;
                        if (res.data.status == 'success'){
                            $scope.patient.profile_picture = res.data.file;
                        } else {
                            alert('Ha ocurrido un error al subir la imagen');
                        }
                    },
                    function(reason){
                        $scope.uploading = false;
                    }
                );
            }
        };

        $scope.updatePatient = function(patient){

            $("#update_patient").
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
                    documentation_type: {
                        required : true
                    },
                    documentation: {
                        required : true
                    },
                    cell: {
                        required: true,
                        number: true,
                        minlength: 7
                    },
                    date: {
                        required: true
                    },
                    gender: {
                        required: true
                    },
                    city: {
                        required: true
                    },
                    street:{
                        required : true
                    },
                    origin:{
                        required : true
                    },
                    postal_code: {
                        number: true,
                        minlength: 5,
                        maxlength: 5
                    },
                    min_temp: {
                        number: true
                    },
                    max_temp: {
                        number: true
                    },
                    min_crate: {
                        number: true
                    },
                    max_crate: {
                        number: true
                    }
                }
            });
            if ($('#update_patient').valid()){

                Patients.upsertPatient($scope.patient).then(function(res){

                    if (res.status == 'success'){
                        toastr.success('Los datos han sido guardados satisfactoriamente')
                        return;
                    }
                    
                    if (res.status == 'exists'){
                        bootbox.alert(res.message);
                    }

                    if (res.status == 'need_move'){
                        bootbox.confirm(res.message, function(confirmRes){
                            if (confirmRes == true){
                                Patients.movePatient(res.patient_id)
                                    .then(function(res){
                                        if (res.status == 'success'){
                                            toastr.success(res.message);

                                            $state.go('index.patients');

                                        } else {
                                            toastr.error(res.message);
                                        }
                                    }, function(){

                                    });
                            }
                        });
                    }

                    if (res.status == 'fail'){
                        bootbox.alert(res.message);
                    }

                }, function(reason){
                    console.log('failed', arguments);
                });

            }

        };


    }])
    .controller('PatientsController', ['$scope', 'Patients', '$modal', function($scope, Patients, $modal){

        $scope.loading = true;

        $scope.actual_date = new Date();

        var fetchPatients = function(criteria){
            Patients.getPatientsByUser(criteria).
                then(function(patients){
                    $scope.patients = patients;
            }, function(){
                toastr.error('Ha ocurrido un error al obtener los pacientes');
            });
        };

        fetchPatients();

        $scope.termFilter = function(criteria){

            fetchPatients(criteria);

        };

        $scope.removePatient = function(patient, index){

            $scope.patient = patient;

            $modal.open({
                templateUrl: '/tesis/templates/modal/deletepatient.html',
                animation: true,
                size: 'md',
                scope : $scope
            }).result.then(function(res){
                if (res){
                    Patients.deletePatient(patient.id).then(function(res){

                        if (res.status == 'success'){

                            toastr.success(res.message);

                            $scope.patients.splice(index, 1);

                        } else {
                            toastr.error(res.message);
                        }

                    }, function(){
                        toastr.error('Ha ocurrido un error al eliminar el paciente, inténtelo nuevamente');
                    });
                }
            });

        };

    }])
    .controller('PatientProfileController', ['$scope', 'patient', 'Patients', '$state', 'Upload', 'UserData', function($scope, patient, Patients, $state, Upload, UserData){

        $scope.patient = patient ? angular.copy(patient) : { profile_picture: '/images/default-profile.png' };

        $scope.statuses = [
            {id: 1, value: 'Ninguno', name: 'Ninguno'},
            {id: 2, value: 'Soltero', name: 'Soltero'},
            {id: 3, value: 'Casado', name: 'Casado'},
            {id: 4, value: 'Viudo', name: 'Viudo'},
            {id: 5, value: 'Union Libre', name: 'Unión Libre'}
        ];

        $scope.selectedMaritalStatus = function(status){
            console.log(status);
            for(var i in $scope.statuses){
                if ($scope.statuses[i].value == status){
                    console.log($scope.statuses[i].id)
                    return $scope.statuses[i].id;
                }
            }
        };

        $scope.upload = function (file) {

            if (file){
                $scope.uploading = true;

                Upload.upload({
                    url: '/api/profile-picture',
                    data: {
                        file: file
                    }
                }).then(
                    function(res){
                        $scope.uploading = false;
                        if (res.data.status == 'success'){
                            $scope.patient.profile_picture = res.data.file;
                            UserData.setData(angular.copy($scope.patient));
                            $scope.$emit('profile_updated', {});
                        } else {
                            bootbox.alert('Ha ocurrido un error al subir la imagen');
                        }
                    },
                    function(reason){
                        $scope.uploading = false;
                    }
                );
            }
        };

        $scope.updatePatient = function(patient){

            $("#update_patient").
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
                    documentation_type: {
                        required : true
                    },
                    documentation: {
                        required : true
                    },
                    cell: {
                        required: true,
                        number: true,
                        minlength: 7
                    },
                    date: {
                        required: true
                    },
                    gender: {
                        required: true
                    },
                    city: {
                        required: true
                    },
                    street:{
                        required : true
                    },
                    origin:{
                        required : true
                    },
                    postal_code: {
                        number: true,
                        minlength: 5,
                        maxlength: 5
                    },
                    min_temp: {
                        number: true
                    },
                    max_temp: {
                        number: true
                    },
                    min_crate: {
                        number: true
                    },
                    max_crate: {
                        number: true
                    }
                }
            });
            if ($('#update_patient').valid()){

                Patients.upsertPatient($scope.patient).then(function(res){

                    switch (res.status) {
                        case 'success':
                            UserData.setData(angular.copy($scope.patient));
                            $scope.$emit('profile_updated', {});
                            toastr.success('Los datos han sido guardados satisfactoriamente')
                            return;
                            break;
                        case 'fail':
                            bootbox.alert(res.message);
                            break;
                        default:
                            bootbox.alert('En nuestra base de datos ya existe un paciente con estos datos. Por favor, revíselos antes de guardar los cambios.')
                            break;
                    }

                }, function(reason){
                    console.log('failed', arguments);
                });

            }

        };

    }])
    .controller('MonitoringController', ['$scope', function($scope){

    }]);