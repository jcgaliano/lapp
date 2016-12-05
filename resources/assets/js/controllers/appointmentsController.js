angular
    .module('Platease')
    .controller('AppointmentsController', ['$scope', 'Appointments', '$q', 'Patients', '$http', '$modal', '$stateParams', 'user_appointments', 'dialog', function ($scope, Appointments, $q, Patients, $http, $modal, $stateParams, user_appointments, dialog) {

        $scope.cantRecordsByPages = 10;

        $scope.assited = false;

        $scope.appointments = user_appointments;

        toastr.options.closeButton = true;

        $scope.setAssisted = function(assisted){
            $scope.assisted = assisted;
            $scope.toSearch()
        };

        $scope.termFilter = function(criteria){
            $scope.criterial = criteria;
            $scope.toSearch();
        };

        $scope.toSearch = function(){

            Appointments.searchAppoiments($scope.criterial, $scope.assisted).then(function(data){

                $scope.appointments = data;

            }, function(){
                toastr.error("Error al Relizar la Operación");
            });
        };

        $scope.removeAppointment = function(appointment, index){
            dialog.confirm('Confirmación', '¿Desea eliminar la cita y todos los datos asociados a esta?')
                .then(function(res){
                    if (res == true){
                        Appointments.removeAppointment(appointment.appointment_id)
                            .then(function(res){
                                $scope.appointments.splice(index,1);
                                toastr.success(res.message);
                            }, function(res){
                                if (undefined !== res.message){
                                    toastr.error(res.message);
                                } else {
                                    toastr.error('Ha ocurrido un error al eliminar la cita');
                                }
                            });

                    }
                });
        };

    }])
    .controller('NewAppointmentController', ['$scope', 'patients', 'Appointments', '$state', 'appointment', 'specialties',function($scope, patients, Appointments, $state, appointment, specialties){

        $scope.patients = patients;

        $scope.specialties = specialties;

        if (appointment != null){
            $scope.appointment = appointment;

            $scope.date = appointment.datetime.date;

            var datetemp = new Date();

            datetemp.setHours(appointment.datetime.time[0]);
            datetemp.setMinutes(appointment.datetime.time[1]);
            $scope.time = datetemp;

        } else {

            $scope.date = new Date();

            $scope.time = new Date();
            $scope.date = $scope.time.getFullYear()+"-" + ($scope.time.getMonth() < 10 ? '0' + $scope.time.getMonth() : $scope.time.getMonth())+"-"+$scope.time.getDate();

        }

        $scope.hstep = 1;
        $scope.mstep = 1;

        $scope.options = {
            hstep: [1, 2, 3],
            mstep: [1, 5, 10, 15, 25, 30]
        };

        $scope.ismeridian = true;
        $scope.toggleMode = function() {
            $scope.ismeridian = ! $scope.ismeridian;
        };

        $scope.update = function() {
            var d = new Date();
            d.setHours( 14 );
            d.setMinutes( 0 );
            $scope.time = d;
        };

        $scope.handleInsert =function(){

            $("#appointment_form").
            validate({
                rules: {
                    patient: {
                        required: true
                    },
                    date: {
                        required: true
                    },
                    area_id: {
                        required: true
                    }
                }
            });
            if ($('#appointment_form').valid()){
                $scope.upsertAppointment();
            }
        };

        $scope.upsertAppointment = function () {

            $scope.datetime = $scope.date + " " + $scope.time.getHours() + ":" + $scope.time.getMinutes();

            Appointments.upsertAppointment(undefined !== appointment && appointment ? appointment.id : null, $scope.datetime, $scope.appointment.patient_id, $scope.appointment.area_id)
                .then(function(res){
                    toastr.success(res.message);
                    $state.go('index.appointments');
                }, function(res){
                    toastr.error(res.message);
                });
        };
    }])
    .controller('AppointmentSummaryController', ['$scope', 'user_appointments', function($scope, user_appointments){

        $scope.appointments = user_appointments;

    }])
    .controller('PreviousAppointmentController', ['$scope', 'appointment', '$stateParams', 'Appointments', 'dialog', '$modal', '$state', function($scope, appointment, $stateParams, Appointments, dialog, $modal, $state){

        if ($stateParams.appointmentId){
            $scope.previousAppointmentId = $stateParams.appointmentId;
        }

        $scope.appointment = appointment;

        $scope.loadingResources = true;

        Appointments.getResources($stateParams.id)
            .then(function(res){
                $scope.loadingResources = false;

                $scope.resources = res;

            }, function(){
                $scope.loadingResources = false;
                dialog.alert('Error', 'Ha ocurrido un error al obtener los recursos asociados a la cita');
            });

        $scope.showResource = function(resource){

            switch(resource.raw_type){
                case 'ekg':

                    if (resource.value && resource.value.length > 0){

                        $scope.ekg_data = {
                            value: resource.value
                        };

                        $modal.open({
                            animation: true,
                            templateUrl: '/tesis/templates/modal/ekgModalWithoutSave.html',
                            size: 'lg',
                            scope : $scope
                        });
                        
                    } else {
                        dialog.alert('Error', 'La vista del electrocardiograma no puede ser cargada debido a que este no contiene datos.');
                    }

                    break;
                case 'sensors':

                        $scope.hideSaveEkg = true;

                        $scope.sensors = resource.value;

                        $modal.open({
                            animation: true,
                            templateUrl: '/tesis/templates/modal/sensorsModal.html',
                            size: 'md',
                            scope: $scope
                        });

                    break;
            }

        };


    }]);