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
    }]);

