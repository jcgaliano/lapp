angular
    .module('Platease')
    .controller('medicationsController', ['$scope', 'Medication_Appointment', 'Medications', function($scope, Medication_Appointment, Medications){

        $scope.medicationseemore = false;

        $scope.seemore = function(medication_id, appointment_id){
            $scope.medicationseemore = true;

            Medication_Appointment.getAMedicationAppointmentByid(medication_id, appointment_id).then(function(medication_appointment){
                $scope.medication_appointment = medication_appointment;
            }, function(){
                toastr.success('Error al Traer la Medicación');
            });
        };

        $scope.cancelseemore = function(){
            $scope.medicationseemore = false;
        };
        Medication_Appointment.getAllMedicationsAppointmentByPatient().then(function(medications){
         $scope.medications = medications;
        }, function(){

        })
    }])
    .controller('PatientMedicationsController', ['$scope', 'meds', 'Medications', '$modal', function($scope, meds, Medications, $modal){

        $scope.medications = meds;

        $scope.medicationDone = function(medication){
            if (!medication.done){
                Medications.completeCycle(medication.id)
                    .then(function(res){
                        if (res.status == 'success'){

                            medication.done = true;

                            toastr.success('El ciclo de medicación ha sido completado satisfactoriamente');

                        } else {

                            bootbox.alert(res.message);

                        }
                    }, function(){
                        bootbox.alert('Ha ocurrido un error al intentar completar el ciclo de medicación');
                    });
            }
        };

        $scope.medicationDetails = function(medication){
            $modal.open({
                animation: true,
                template: angular.element(document.getElementById('medication-modal-template')).html(),
                controller: 'MedicationDetailsController',
                size: 'md',
                scope : $scope,
                resolve: {
                    medication: function(){
                        return medication;
                    },
                }
            });
        };
        
    }])
    .controller('MedicationDetailsController', ['$scope', 'medication', function($scope, medication){
        $scope.medication = medication;
    }]);


