angular
    .module('Platease')
    .controller('appointmentDetailsController', ['$scope', 'appointment', 'SocketFactory', '$state', '$modal', 'medications', 'Appointments', 'dialog', function($scope, appointment, sf, $state, $modal, medications, Appointments, dialog){
        
        $scope.appointment = appointment;
        $scope.actual_date = new Date();

        $scope.device_id = appointment.patient.device_id;
        
        $scope.device_status = false;

        $scope.toggle_device = function(){
            $scope.device_status = !$scope.device_status;

            sf.emit($scope.device_status == true ? 'turnOnDevice' : 'turnOffDevice', {deviceId: $scope.device_id});
        };

        var host_down_message = 'Ha sido imposible conectar con el servidor de tiempo real. Reintentando...';

        sf = sf.init();

        sf.on('connect_error', function(){
            $scope.device_status_message = host_down_message;
        });

        sf.on('connect_timeout', function(){
            $scope.device_status_message = host_down_message;
        });

        sf.on('reconnect_error', function(){
            $scope.device_status_message = host_down_message;
        });

        sf.on('reconnect_failed', function(){
            $scope.device_status_message = host_down_message;
        });

        $scope.stopReceivingData = function(){

            sf.emit('stopReceivingData', {
                deviceId: $scope.device_id
            });

            sf.removeAllListeners();

        };

        $scope.loadingPreviousAppointments = true;

        Appointments.getPrevious(appointment.id)
            .then(function(res){
                $scope.loadingPreviousAppointments = false;
                $scope.previous_appointments = res.data;
            }, function(){
                $scope.loadingPreviousAppointments = false;
            });



        //init the socket connection listening for events
        sf.emit('connectDevice', {deviceId: $scope.device_id});

        sf.on('connectedDevice', function(data){
            $scope.bindDataEvents();
        });

        $scope.sensors = {};

        $scope.bindDataEvents = function(){

            sf.emit('readyForData', {
                dataType: {
                    sensor_data: true,
                    ekg_data: true
                }
            });

            sf.on('deviceData', function(data){

                if ((undefined !== data.sensors && data.sensors) || (undefined !== data.ekg_data && data.ekg_data)){

                    $scope.device_status_message = 'El dispositivo está transmitiendo correctamente';

                    if (undefined !== data.sensors && data.sensors){
                        //sensor data

                        for (var i in data.sensors){
                            $scope.sensors[data.sensors[i].name] = data.sensors[i].value;
                        }

                    }

                    if (undefined !== data.ekg_data && data.ekg_data){
                        for (var i in data.ekg_data){
                            $scope.ekg_data = data.ekg_data[i]
                        }
                    }

                } else {
                    $scope.device_status_message = 'Ha ocurrido un error en la transmisión con el dispositivo';
                }

            });
        };

        $scope.editMedication = function(med){

            if (undefined !== med){
                $scope.selected_med = med;
            }

            $modal.open({
                animation: true,
                templateUrl: '/templates/modal/newmedication.html',
                controller: 'MedicationFormController',
                size: 'md',
                scope : $scope,
                resolve: {
                    medications: function(){
                        return medications;
                    },
                    selected_medication: function(){
                        if (med == undefined){
                            return null;
                        } else {
                            return med;
                        }
                    }
                }
            }).result.then(function(medication){

                Appointments.linkMedicationToAppointment(undefined == med ? 'add' : 'edit', appointment.id, medication)
                    .then(function(res){
                        if (res.status == 'success'){
                            toastr.success(res.message)
                            if (med == undefined){

                                if (undefined !== $scope.appointment.medications){
                                    $scope.appointment.medications.push(res.data);
                                } else {
                                    $scope.appointment.medications = [];
                                    $scope.appointment.medications.push(res.data);
                                }

                            } else {
                                $scope.selected_med.dose = medication.dose;
                                $scope.selected_med.iterations = medication.iterations;
                                $scope.selected_med.notes = medication.notes;
                            }

                        } else {
                            toastr.error(res.message);
                        }
                    }, function(){
                        toastr.error('Ha ocurrido un error al agregar el medicamento');
                    });

            }, function(){});
        };

        $scope.removeMedication = function(med){

            dialog.confirm('Alerta', 'Estás a punto de eliminar este medicamento. ¿Deseas continuar?')
                .then(function(res){
                    if (res == true){
                        Appointments.removeMedication(med.medication_id, med.appointment_id)
                            .then(function(res){
                                if (res.status == 'success'){

                                    var pos = $scope.appointment.medications.indexOf(med);

                                    if (pos > -1){
                                        $scope.appointment.medications.splice(pos, 1);
                                    }

                                    toastr.success('El medicamento ha sido eliminado');

                                } else {
                                    toastr.error(res.message);
                                }
                            }, function(){
                                dialog.alert('Aviso', 'Ha ocurrido un error al eliminar el medicamento. Inténtelo nuevamente.')
                            });
                    }
                });

        };

        $scope.saveAppointment = function(){

            if ($scope.appointment.indications && $scope.appointment.indications.trim().length > 0){

                var readings = {
                    heart_rate: null,
                    temperature: null,
                    weight: null,
                    glucose_level: null,
                    height: null
                };

                if (undefined != $scope.sensors && $scope.sensors){

                    readings.heart_rate = $scope.sensors.heart_rate ? $scope.sensors.heart_rate : null;
                    readings.temperature = $scope.sensors.temperature ? $scope.sensors.temperature : null;
                    readings.weight = $scope.sensors.weight ? $scope.sensors.weight : null;
                    readings.glucose_level = $scope.sensors.glucose_level ? $scope.sensors.glucose_level : null;
                    readings.height = $scope.sensors.height ? $scope.sensors.height : null;

                }

                Appointments.saveIndications($scope.appointment.id, $scope.appointment.indications, readings)
                    .then(function(res){
                        if (res.status == 'success'){

                            $scope.stopReceivingData();

                            $state.go('index.appointments');

                        } else {
                            toastr.error(res.message);
                        }
                    }, function(){
                        toastr.error('Ha ocurrido un error al guardar la cita');
                    });

            } else {
                dialog.alert('Aviso', 'Para aceptar la consulta como realizada, debe llenar el campo de indicaciones.', function(){});
            }

        };

        $scope.gotoAppointments = function(){

            if ($scope.appointment.indications && $scope.appointment.indications.trim().length > 0){

                dialog.confirm('Aviso', 'Hay cambios sin guardar en esta consulta. ¿Desea abandonar la página?')
                    .then(function(res){
                        if (res == true){

                            $scope.stopReceivingData();

                            $state.go('index.appointments');

                        }
                    });

            } else {

                $scope.stopReceivingData();

                $state.go('index.appointments');

            }

        };

        $scope.seeEkg = function(){

            $modal.open({
                animation: true,
                templateUrl: '/templates/modal/ekgModal.html',
                size: 'lg',
                scope : $scope
            }).result.then(function(readings){
                if (readings !== false){
                    Appointments.saveEkgReadings($scope.appointment.id, readings)
                        .then(function(res){
                            if (res.status == 'success'){
                                toastr.success('El electrocardiograma ha sido guardado satisfactoriamente');
                            } else {
                                toastr.error(res.message);
                            }
                        }, function(){
                            dialog.alert('Alerta','Ha ocurrido un error al guardar el electrocardiograma');
                        });
                }
            });

        };

    }])
    .controller('MedicationFormController', ['$scope', 'medications', '$modalInstance', 'selected_medication', function($scope, medications, $modalInstance, selected_medication){

        $scope.medications = medications;

        $scope.selected_medication = selected_medication;

        if (selected_medication){
            $scope.newmedications = {
                medication_id: selected_medication.medication_id,
                dose: selected_medication.dose,
                iterations: selected_medication.iterations,
                notes: selected_medication.notes
            }
        }

        $scope.saveMedication = function(){

            $('#newmedication_form').validate({
                rules: {
                    medications: 'required',
                    dose: 'required',
                    iterations: 'required',
                }
            })

            if ($('#newmedication_form').valid()){

                $modalInstance.close($scope.newmedications);

            }
        }
    }]);