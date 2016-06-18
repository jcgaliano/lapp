@extends('layouts.login')

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
        <div class="col-lg-8 col-lg-offset-2">
            <div class="panel panel-default login-panel">
                <div class="panel-heading">Solicitud Registro M&eacute;dico</div>
                <div class="panel-body">
                    @if (\Session::has('success') || $errors->count() > 0)
                        <div class="row">
                            <div class="col-xs-12">
                                @if ($errors->count() > 0)
                                    <div class="alert alert-danger" role="alert">NO se ha podido procesar el formulario dado que existen errores en los datos.</div>
                                @endif
                                @if (\Session::has('success'))
                                    <div class="alert alert-success" role="alert">{{ \Session::get('success') }}</div>
                                @endif
                            </div>
                        </div>
                    @endif
                    <form class="form-horizontal" method="post" action="{{ route('post_register_doctor') }}">
                        {{ csrf_field() }}
                        <div class="form-group">
                            <label for="email" class="col-sm-3 control-label text-right">Correo <i class="required">(*)</i></label>
                            <div class="col-sm-9">
                                <input type="email" class="form-control" name="email" id="email" value="{{ old('email') }}">
                                @if($errors->has('email'))
                                    <label for="email" class="error">
                                        {{ $errors->first('email') }}
                                    </label>
                                @endif
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="password" class="col-sm-3 control-label text-right">Contraseña <i class="required">(*)</i></label>
                            <div class="col-sm-9">
                                <input type="password" class="form-control" name="password" id="password" value="{{ old('password') }}">
                                @if($errors->has('password'))
                                    <label for="password" class="error">
                                        {{ $errors->first('password') }}
                                    </label>
                                @endif
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="password_confirm" class="col-sm-3 control-label text-right">Repetir Contraseña <i class="required">(*)</i></label>
                            <div class="col-sm-9">
                                <input type="password_confirm" class="form-control" name="password_confirm" id="password_confirm" value="{{ old('password_confirm') }}">
                                @if($errors->has('password_confirm'))
                                    <label for="password_confirm" class="error">
                                        {{ $errors->first('password_confirm') }}
                                    </label>
                                @endif
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="name" class="col-sm-3 control-label text-right">Nombre <i class="required">(*)</i></label>
                            <div class="col-sm-9">
                                <input type="text" class="form-control" name="name" id="name" value="{{ old('name') }}">
                                @if($errors->has('name'))
                                    <label for="name" class="error">
                                        {{ $errors->first('name') }}
                                    </label>
                                @endif
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="lastname" class="col-sm-3 control-label text-right">Apellidos <i class="required">(*)</i></label>
                            <div class="col-sm-9">
                                <input type="text" class="form-control" name="lastname" id="lastname" value="{{ old('lastname') }}">
                                @if($errors->has('lastname'))
                                    <label for="lastname" class="error">
                                        {{ $errors->first('lastname') }}
                                    </label>
                                @endif
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xs-12">
                                <div class="form-group">
                                    <label for="spec_1" class="col-sm-3 control-label text-right">Especialidades <i class="required">(*)</i></label>
                                    <div class="col-sm-9">
                                        <div class="row">
                                            <div class="col-sm-6">
                                                <select class="form-control" name="spec_1" id="spec_1">
                                                    <option value="">Seleccione...</option>
                                                    @foreach($specs as $spec)
                                                        <option value="{{ $spec->id }}">{{ $spec->speciality }}</option>
                                                    @endforeach
                                                </select>
                                                @if($errors->has('spec_1'))
                                                    <label for="spec_1" class="error">
                                                        {{ $errors->first('spec_1') }}
                                                    </label>
                                                @endif
                                            </div>
                                            <div class="col-sm-6">
                                                <select class="form-control" name="spec_2" id="spec_2">
                                                    @foreach($specs as $spec)
                                                        <option value="">Seleccione...</option>
                                                        <option value="{{ $spec->id }}">{{ $spec->speciality }}</option>
                                                    @endforeach
                                                </select>
                                                @if($errors->has('spec_2'))
                                                    <label for="spec_2" class="error">
                                                        {{ $errors->first('spec_2') }}
                                                    </label>
                                                @endif
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xs-12">
                                <div class="form-group">
                                    <label for="pl" class="col-sm-3 control-label text-right">Licencia profesional <i class="required">(*)</i></label>
                                    <div class="col-sm-9">
                                        <div class="row">
                                            <div class="col-sm-6">
                                                <input class="form-control" name="pl" id="pl" value="{{ old('pl') }}" />
                                                @if($errors->has('pl'))
                                                    <label for="pl" class="error">
                                                        {{ $errors->first('pl') }}
                                                    </label>
                                                @endif
                                            </div>
                                            <div class="col-sm-6">
                                                <div class="form-group">
                                                    <label for="dni" class="col-sm-5 control-label text-right">Cédula <i class="required">(*)</i></label>
                                                    <div class="col-sm-7">
                                                        <input type="text" class="form-control" name="dni" id="dni" />
                                                        @if($errors->has('dni'))
                                                            <label for="dni" class="error">
                                                                {{ $errors->first('dni') }}
                                                            </label>
                                                        @endif
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-group" style="">
                            <div class="col-lg-offset-3 col-lg-6">
                                <button type="submit" class="btn btn-default">Enviar Solicitud</button>
                                <a class="btn btn-danger " href="/login">Cancelar</a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection
