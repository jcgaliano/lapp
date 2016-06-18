@extends('layouts/email')

@section('content')
    <tr>
        <td align="center" valign="top">
            <!-- CENTERING TABLE // -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td align="center" valign="top">
                        <!-- FLEXIBLE CONTAINER // -->
                        <table border="0" cellpadding="0" cellspacing="0" width="500" class="flexibleContainer">
                            <tr>
                                <td align="center" valign="top" width="500" class="flexibleContainerCell">
                                    <table border="0" cellpadding="30" cellspacing="0" width="100%">
                                        <tr>
                                            <td align="center" valign="top">

                                                <!-- CONTENT TABLE // -->
                                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                    <tr>
                                                        <td valign="top" class="textContent">
                                                            <div style="text-align:justify; font-family:Helvetica,Arial,sans-serif;font-size:15px;margin-bottom:0;margin-top:3px;color:#5F5F5F;line-height:135%;">
                                                                Estimado Doctor:<br>
                                                                Usted se ha registrado una cuenta en nuestra aplicación de manera satisfactoria. Para poder hacer inicio de sesión la cuenta debe ser aprobada antes por los administradores, usted será notificado de esta aprobación vía email.
                                                                <br>
                                                                <br>
                                                                <br>
                                                                {{--<div style="text-align: center">--}}
                                                                    {{--<table align="center" border="0" cellpadding="0" cellspacing="0" width="50%" class="emailButton" style="background-color: #3498DB;">--}}
                                                                        {{--<tr>--}}
                                                                            {{--<td align="center" valign="middle" class="buttonContent" style="padding-top:15px;padding-bottom:15px;padding-right:15px;padding-left:15px;">--}}
                                                                                {{--<a style="color:#FFFFFF;text-decoration:none;font-family:Helvetica,Arial,sans-serif;font-size:20px;line-height:135%;" href="" target="_blank">Aceptar</a>--}}
                                                                            {{--</td>--}}
                                                                        {{--</tr>--}}
                                                                    {{--</table>--}}
                                                                {{--</div>--}}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </table>
                                                <!-- // CONTENT TABLE -->

                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        <!-- // FLEXIBLE CONTAINER -->
                    </td>
                </tr>
            </table>
            <!-- // CENTERING TABLE -->
        </td>
    </tr>
@endsection