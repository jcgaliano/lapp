<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <base href="/tesis" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <title>laria - Siteldi</title>
    <link rel="stylesheet" href="{{ asset('/tesis/css/vendor.min.css') }}">
    <link rel="stylesheet" href="{{ asset('/tesis/css/login-register.min.css') }}">
    <link rel="stylesheet" href="{{ asset('/tesis/css/app.min.css') }}">
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>
<body>
<div class="container">
    @yield('content')
</div>
<!-- vendors file -->
<script type="text/javascript" src="{{ asset('/tesis/js/vendors.js') }}"></script>
<!-- end vendors file -->

<!-- begin app file -->




<!-- end app file -->

</body>
</html>