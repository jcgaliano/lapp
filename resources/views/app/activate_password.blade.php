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
                    <form method="post" action="{{ route('post_activate_account_action', ['token' => $token]) }}" class="login-form">
                        {{ csrf_field() }}
                        <div class="form-group">
                            <p class="text-center">
                                Estimado usuario. Antes de completar la activación de la cuenta usted debe establecer su contraseña, para hacerlo complete los campos a continuación
                            </p>
                        </div>
                        <div class="form-group">
                            <label for="password">Contraseña</label>
                            <input type="password" class="form-control" name="password" id="password">
                            @if($errors->has('password'))
                                <label for="password" class="error">
                                    {{ $errors->first('password') }}
                                </label>
                            @endif
                        </div>
                        <div class="form-group">
                            <label for="password_confirm">Repetir Contraseña</label>
                            <input type="password" class="form-control" name="password_confirm" id="password_confirm">
                            @if($errors->has('password_confirm'))
                                <label for="password_confirm" class="error">
                                    {{ $errors->first('password_confirm') }}
                                </label>
                            @endif
                        </div>
                        <div class="form-group text-center login-form-actions">
                            <button type="submit" class="btn btn-default">Activar cuenta</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection
