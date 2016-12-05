@extends('layouts.nong_master')

@section('content')
    <div class="row">
        <div class="col-lg-12 text-center">
            <div class="row  outside-logo">
                <div class="col-lg-4 col-lg-offset-4">
                    <h1>
                        <a href="{{ route('homepage') }}">
                            <img class="logo" src="/images/logo.png" alt="logo">
                            <img class="logo-text" src="/images/laria.png" alt="laria">
                        </a>
                    </h1>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-lg-4 col-lg-offset-4">
            <div class="panel panel-default">
                <div class="panel-body">
                    @if (\Session::has('success') || $errors->count() > 0 || \Session::has('error'))
                        <div class="row">
                            <div class="col-xs-12">
                                @if ($errors->count() > 0)
                                    <div class="alert alert-danger" role="alert">NO se ha podido procesar el formulario dado que existen errores en los datos.</div>
                                @endif
                                @if (\Session::has('success'))
                                    <div class="alert alert-success" role="alert">{{ \Session::get('success') }}</div>
                                @endif
                                @if (\Session::has('error'))
                                    <div class="alert alert-danger" role="alert">{{ \Session::get('error') }}</div>
                                @endif
                            </div>
                        </div>
                    @endif
                    @if (!isset($user_error))
                        <form class="login-form" method="post" action="">
                            <h2 class="text-center">Recuperar contraseña</h2>
                            {{ csrf_field() }}
                            <div class="form-group">
                                <label for="password">Contraseña <i class="required">(*)</i></label>
                                <input type="password" class="form-control" name="password" id="password" value="{{ old('password') }}">
                                @if($errors->has('password'))
                                    <label for="password" class="error">
                                        {{ $errors->first('password') }}
                                    </label>
                                @endif
                            </div>
                            <div class="form-group">
                                <label for="password_confirm">Repetir Contraseña <i class="required">(*)</i></label>
                                <input type="password" class="form-control" name="password_confirm" id="password_confirm" value="{{ old('password_confirm') }}">
                                @if($errors->has('password_confirm'))
                                    <label for="password_confirm" class="error">
                                        {{ $errors->first('password_confirm') }}
                                    </label>
                                @endif
                            </div>
                            <div class="form-group" style="">
                                <div class="col-lg-12 text-center">
                                    <div class="form-group text-center login-form-actions">
                                        <button type="submit" class="btn btn-default">Enviar</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    @else
                        <div class="alert alert-danger text-center">
                            {{ $user_error }}
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-lg-4 col-lg-offset-4">
            <div class="panel">
                <div class="panel-body text-center">
                    <a href="{{ route('homepage') }}">Volver al inicio de sesión</a>
                </div>
            </div>
        </div>
    </div>
@endsection