angular
    .module('Platease')
    .controller('UnapprovedAppointmentsController', ['$scope', 'Appointments', 'dialog', 'apmt_requests', function ($scope, Appointments, dialog, apmt_requests) {

        toastr.options.closeButton = true;

        $scope.appointments = apmt_requests;

        $scope.removeAppointment = function(appointment, index){
                dialog.confirm('Confirmación', '¿Desea eliminar la solicitud de cita y todos los datos asociados a esta?')
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
                                                        toastr.error('Ha ocurrido un error al eliminar la solicitud');
                                                }
                                        });

                            }
                });
        };

        $scope.approveAppointment = function(appointment, index){
                dialog.confirm('Confirmación', '¿Desea aprobar la solicitud de cita? Si lo hace el paciente será notificado por email y la cita será agregada a su agenda')
                    .then(function(res){
                            if (res == true){
                                    Appointments.approveAppointment(appointment.appointment_id)
                                        .then(function(res){
                                                $scope.appointments.splice(index,1);
                                                toastr.success(res.message);
                                        }, function(res){
                                                if (undefined !== res.message){
                                                        toastr.error(res.message);
                                                } else {
                                                        toastr.error('Ha ocurrido un error al eliminar la solicitud');
                                                }
                                        });

                            }
                    });
        };

        //$scope.date = new Date();
        // $scope.time = new Date();
        // $scope.hstep = 1;
        // $scope.mstep = 5;
        //
        // $scope.options = {
        //     hstep: [1, 2, 3],
        //     mstep: [1, 5, 10, 15, 25, 30]
        // };
        //
        // $scope.ismeridian = true;
        // $scope.toggleMode = function() {
        //     $scope.ismeridian = ! $scope.ismeridian;
        // };
        //
        // $scope.update = function() {
        //     var d = new Date();
        //     d.setHours( 14 );
        //     d.setMinutes( 0 );
        //     $scope.time = d;
        // };
        //
        //
        //

        // $scope.insertShow = false;

        // Appointments.getAllUnapprovedAppoiments().then(function (appoiments) {
        //     $scope.appoiments = appoiments;
        // }, function () {
        //     toastr.error("Error al Relizar la Operación");
        // });
        //

        // $scope.showInsert = function () {
        //     $scope.insertShow = true;
        //     $scope.insertShowButton = true;
        //     $scope.time = new Date();
        //     Doctor.getAllDoctors().then(function (doctors) {
        //         $scope.doctors = doctors;
        //
        //     }, function () {
        //         toastr.error("Error al Obtener Datos de los Doctores");
        //     });
        // };

        // $scope.calcelInsertAppoiment = function () {
        //     $scope.insertShow = false;
        //     $scope.insertShowButton = false;
        //     $scope.updateShowButton = false;
        //     $scope.appointment.patient_id = "";
        // };

        // $scope.handleInsert =function(){
        //
        //     $("#solicitar_appointment_form").
        //         validate({
        //             rules: {
        //                 doctor: {
        //                     required: true
        //                 },
        //                 date: {
        //                     required: true
        //                 }
        //             }
        //         });
        //     if ($('#solicitar_appointment_form').valid()){
        //         $scope.inserAppoiment();
        //     }
        // };

        // $scope.inserAppoiment = function () {
        //     $scope.datetime = $scope.date+" "+$scope.time.getHours()+":"+$scope.time.getMinutes();
        //     $http({
        //         method: 'post', data: {
        //             'date': $scope.datetime,
        //             'doctor': $scope.appointment.doctor_id
        //         },
        //         url: "/index.php/insertaunapprovedppointment"
        //     }).success(function (data) {
        //         Appointments.getAllUnapprovedAppoiments().then(function (appoiments) {
        //             $scope.appoiments = appoiments;
        //         }, function () {
        //             toastr.error("Error al Relizar la Operación");
        //         });
        //         toastr.success('Se Cre&oacute; la Sita Satisfactoriamente.');
        //     });
        //
        //     $scope.calcelInsertAppoiment();
        // };

        // $scope.removeunapprovedAppoiment = function (appoiment_id, index) {
        //
        //     Appointments.deleteAppoiment(appoiment_id).then(function (data) {
        //         $scope.appoiments.splice(index,1);
        //         toastr.success('Sita Eliminada Satisfactoriamente');
        //     }, function () {
        //         toastr.error("Error al Eliminar la Solicitud de Cita");
        //     });
        // };

        // $scope.approveAppointment = function(appoiment_id, index){
        //
        //     Appointments.approveAppointment(appoiment_id).then(function(appointment){
        //         $scope.appoiments.splice(index, 1);
        //         toastr.success('Sita Aprobada Satisfactoriamente');
        //     }, function(){
        //         toastr.error("Error al al Aprobar la Cita");
        //     });
        //
        // };

        // $scope.confirApproveAppointment = function(appoiment, index){
        //     $scope.appointment = appoiment;
        //     console.log($scope);
        //     $modal.open({
        //         animation: true,
        //         templateUrl: '/public/tesis/templates/modal/approveapp.html',
        //         controller: 'unapprovedAppointmentsController',
        //         size: 'md',
        //         scope : $scope
        //     }).result.then(function () {
        //             $scope.approveAppointment(appoiment.appoiment_id, index);
        //         }, function () {
        //             toastr.info("Operación Cancelada");
        //         });
        //
        // };

        // $scope.confirmdeleteunapprovedAppointment = function (appoiment_id, index) {
        //
        //     Appointments.oneAppoiment(appoiment_id).then(function(appointment){
        //         $scope.appointment = appointment;
        //     }, function(){
        //         toastr.error("Error al Relizar la Operación");
        //     });
        //
        //     $modal.open({
        //         animation: true,
        //         templateUrl: '/public/tesis/templates/modal/deleteunapprovedapp.html',
        //         controller: 'unapprovedAppointmentsController',
        //         size: 'md',
        //         scope : $scope
        //     }).result.then(function () {
        //             $scope.removeunapprovedAppoiment(appoiment_id, index);
        //         }, function () {
        //             toastr.info("Operación Cancelada");
        //         });
        // };


}])
    .controller('NewAppointmentRequestController', ['$scope', 'doctors', 'Appointments', '$state', 'Doctor', 'dialog', function($scope, doctors, Appointments, $state, Doctor, dialog){

        $scope.doctors = doctors;

        $scope.date = new Date();

        $scope.time = new Date();
        $scope.date = $scope.time.getFullYear()+"-" + ($scope.time.getMonth() < 10 ? '0' + $scope.time.getMonth() : $scope.time.getMonth())+"-"+$scope.time.getDate();

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
                            doctor: {
                                required: true
                            },
                            date: {
                                required: true
                            }
                        }
                    });
                if ($('#appointment_form').valid()){
                        $scope.upsertAppointmentRequest();
                }
        };

        $scope.upsertAppointmentRequest = function () {

                $scope.datetime = $scope.date + " " + $scope.time.getHours() + ":" + $scope.time.getMinutes();

                Appointments.upsertAppointmentRequest(undefined !== $scope.appointment && $scope.appointment ? $scope.appointment.id : null, $scope.datetime, $scope.appointment.doctor_id, $scope.appointment.area_id)
                    .then(function(res){
                            toastr.success(res.message);
                            $state.go('index.appointment_requests');
                    }, function(res){
                            toastr.error(res.message);
                    });
        };

        $scope.selectDoctor = function(){
            $scope.loading_doctor_specs = true;
            Doctor.getSpecialtiesById($scope.appointment.doctor_id)
                .then(function(res){
                    $scope.loading_doctor_specs = false;
                    if (res.data.length > 0){
                        $scope.specialties = res.data;
                    } else {
                        dialog.alert('Aviso', 'El doctor no ha especificado sus especialidades aún. La cita será creada pero sin área específica.');
                    }
                }, function(){
                    $scope.loading_doctor_specs = false;
                    dialog.alert('Aviso', 'Ha ocurrido un error al obtener las especialidades del doctor.');
                });
        };
}]);
