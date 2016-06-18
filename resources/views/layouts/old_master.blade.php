<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <title>laria - Siteldi</title>

    <link rel="stylesheet" href="{{ asset('/css/vendor.min.css') }}">
    <link rel="stylesheet" href="{{ asset('/css/app.min.css') }}">

    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>
<body  data-ng-app="Platease">
    <div class="container">
        <div class="row">
            <div class="col-xs-12">
                <div class="row">
                    <div class="col-xs-12">
                        <header class="main-header">
                            <h1>
                                <img style="height: 90px;width: 90px" src="/images/logo.png" alt="PLATEASE"/>
                                <img class="" style="margin-top:15px;padding-bottom:15px;padding-left:10px;padding-right: 0px;width: 100px" src="/images/laria.png">
                            </h1>
                        </header>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-3 sidebar" data-ng-cloak="">
                        <div class="panel panel-default">
                            <div class="panel-body">
                                <div class="row">
                                    <div class="col-lg-12 text-center">
                                        <img class="user-fhoto" style="height: 200px;width:200px;border: 9px solid #4ec9d4; -moz-border-radius: 100%;-webkit-border-radius: 100%;border-radius: 100%;" data-ng-src="<?php echo '{{user_data.profile_picture}}' ?>" alt="Foto de Usuario"/>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-12">
                                        <label ng-if="user_data.user_type == 'doctor' || user_data.user_type == 'supervisor'" class="user-name">Dr. <?php echo  '{{ user_data.name }}' ?> <?php echo  '{{ user_data.lastname }}' ?></label>
                                        <h1 ng-if="user_data.user_type == 'patient'" class="user-name"><?php echo  '{{ user_data.name }}' ?> <?php echo  '{{ user_data.lastname }}' ?></h1>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-12">
                                        <br>
                                        <span ng-if="user_data.user_type == 'supervisor'" class="user-name"><?php echo  '{{ user_data.speciality }}' ?></span>
                                        <p><span ng-if="user_data.user_type == 'doctor'" class="user-name"><?php echo  '{{ doctor_speciality.speciality }}' ?></span></p>
                                        <span ng-if="user_data.user_type == 'doctor'" class="user-name"><?php echo  '{{ doctor_second_speciality.speciality }}' ?></span>
                                        <span ng-if="user_data.user_type == 'patient' && user_data.birthday != '0000-00-00' " class="gray-text">Edad: <?php echo  '{{ actual_date | amDifference : user_data.birthday : "years" }}' ?> Años</span>
                                        <span ng-if="user_data.user_type == 'patient' && user_data.birthday == '0000-00-00' " class="gray-text">Edad: No Definida</span>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-12">
                                        <br>
                                        <span ng-if="user_data.user_type == 'supervisor'" class="user-name">Curp: <?php echo  '{{ user_data.curp }}' ?></span>
                                        <span ng-if="user_data.user_type == 'doctor'" class="user-cedula">C&eacute;dula: <?php echo  '{{ user_data.cedula }}' ?></span>
                                        <span ng-if="user_data.user_type == 'patient' && user_data.cell != ''" class="gray-text phone-number">Tel&eacute;fono: <?php echo  '{{ user_data.cell }}' ?></span>
                                        <span ng-if="user_data.user_type == 'patient' && user_data.cell == ''" class="gray-text phone-number">Tel&eacute;fono: No Definido</span>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-12">
                                        <br>
                                        <a href="/index.php/logout"  style="color: #333; text-decoration: none;"><span style="font-family: 'RobotoSlab-Regular';" ><i class="glyphicon glyphicon-log-out" style="margin-right: 5px;color: red"></i>Salir</span></a>
                                        <br>
                                        <br>
                                        <br>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-12">
                                        <ul class="sec-navigation" style=" margin: 0;padding: 0;border: 0;font: inherit;font-size: 18px;vertical-align: baseline;;list-style: none;">
                                            <li ng-if="user_data.user_type == 'patient'"><a ng-class="navigationActiveClass('appointments')" href="#/appointments">Citas</a></li>
                                            <li ng-if="user_data.user_type == 'patient'"><a ng-class="navigationActiveClass('solicitar_appointment')" href="#/solicitar_appointment">Solicitar Citas</a></li>
                                            <li ng-if="user_data.user_type == 'patient'"><a ng-class="navigationActiveClass('medications')" href="#/medications">Medicamentos</a></li>
                                            <li ng-if="user_data.user_type == 'patient'"><a ng-class="navigationActiveClass('appointment_details')" href="#/appointment_details">Reporte de consulta</a></li>
                                            <li ng-if="user_data.user_type == 'patient'"><a ng-class="navigationActiveClass('sensors')" href="#/sensors">Monitoreo</a></li>
                                            <li ng-if="user_data.user_type == 'patient'"><a ng-class="navigationActiveClass('update_profile')" href="#/update_patient_profile">Perfil</a></li>

                                            <li ng-if="user_data.user_type == 'doctor'"><a ng-class="navigationActiveClass('appointments')" href="#/appointments">Citas</a></li>
                                            <li ng-if="user_data.user_type == 'doctor'"><a ng-class="navigationActiveClass('solicitar_appointment')" href="#/solicitar_appointment">Solicitud de Citas</a></li>
                                            <li ng-if="user_data.user_type == 'doctor'"><a ng-class="navigationActiveClass('patient')" href="#/patient">Paciente</a></li>
                                            <li ng-if="user_data.user_type == 'doctor'"><a ng-class="navigationActiveClass('update_profile')" href="#/update_profile">Perfil</a></li>

                                            <li ng-if="user_data.user_type == 'supervisor'"><a ng-class="navigationActiveClass('doctors')" href="#/doctors">Doctores</a></li>
                                            <li ng-if="user_data.user_type == 'supervisor'"><a ng-class="navigationActiveClass('doctors_unapproved')" href="#/doctors_unapproved">Solicitud Doctores</a></li>
                                            <li ng-if="user_data.user_type == 'supervisor'"><a ng-class="navigationActiveClass('update_profile_supervisor')" href="#/update_profile_supervisor">Perfil</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-9 main-content" data-ui-view style="padding-right: 0px;padding-left: 0px">
                    </div>
                </div>
            </div>
        </div>
    </div>

<!-- vendors file -->
<script type="text/javascript" src="{{ asset('/js/vendors.js') }}"></script>
<!-- end vendors file -->

<!-- begin app file -->

<script type="text/javascript" src="js/app.js"></script>


<!-- end app file -->

</body>
</html>