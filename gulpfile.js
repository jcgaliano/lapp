var elixir = require('laravel-elixir');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {

    //handle javascripts
    mix.scripts([
        '/bower_components/jquery/dist/jquery.min.js',
        '/bower_components/angular-bootstrap3-datepicker/example/js/bootstrap.js',
        '/bower_components/angular/angular.js',
        '/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
        '/bower_components/angular-ui-router/release/angular-ui-router.js',
        '/bower_components/angular-cookies/angular-cookies.js',
        '/bower_components/angular-jwt/dist/angular-jwt.min.js',
        '/bower_components/satellizer/satellizer.min.js',
        '/bower_components/moment/min/moment-with-locales.min.js',
        '/bower_components/angular-moment/angular-moment.min.js',
        '/bower_components/textAngular/dist/textAngular-rangy.min.js',
        '/bower_components/textAngular/dist/textAngular-sanitize.min.js',
        '/bower_components/textAngular/dist/textAngular.min.js',
        '/bower_components/Chart.js/Chart.js',
        '/bower_components/angular-chart.js/dist/angular-chart.js',
        '/bower_components/angular-bootstrap3-datepicker/example/js/moment.js',
        '/bower_components/moment/locale/es.js',
        '/bower_components/angular-bootstrap3-datepicker/example/js/ng-bs3-datepicker.js',
        '/bower_components/toastr/toastr.js',
        '/bower_components/angular-loading-bar/build/loading-bar.min.js',
        '/bower_components/angular-truncate/src/truncate.js',
        '/bower_components/angular-cookies/angular-cookies.js',
        '/bower_components/jquery-validation/dist/jquery.validate.js',
        '/bower_components/jquery-validation/dist/additional-methods.js',
        '/bower_components/jquery-validation/src/localization/messages_es.js',
        '/js/ui-bootstrap-tpls-0.14.2.min.js',
        '/bower_components/a0-angular-storage/dist/angular-storage.min.js',
        '/bower_components/angular-socket-io/socket.min.js',
        '/bower_components/ng-file-upload-shim/ng-file-upload-shim.js',
        '/bower_components/ng-file-upload-shim/ng-file-upload.js',
        '/bower_components/bootbox/bootbox.js'
    ],
        'public/js/vendors.js',
        'resources/assets/'
    );

    mix.scripts([
        '/bower_components/jquery/dist/jquery.min.js',
        '/bower_components/angular-bootstrap3-datepicker/example/js/bootstrap.js',
    ],
        'public/js/login.js',
        'resources/assets/'
    );

    mix.scripts([
        '/js/module.js',
        '/js/routes.js',
        '/js/controllers/globalController.js',
        '/js/controllers/authController.js',
        '/js/controllers/mainController.js',
        '/js/controllers/appointmentsController.js',
        '/js/controllers/appointmentDetailsController.js',
        '/js/controllers/medicationsController.js',
        '/js/controllers/sensorsController.js',
        '/js/controllers/patientController.js',
        '/js/controllers/appoiment_userController.js',
        '/js/controllers/religionController.js',
        '/js/controllers/doctorsController.js',
        '/js/controllers/unapproveddoctorsController.js',
        '/js/controllers/update_patientController.js',
        '/js/controllers/update_doctorController.js',
        '/js/controllers/update_supervisorController.js',
        '/js/controllers/solicitudappointmentsController.js',
        '/js/controllers/personalDataController.js',
        '/js/services/services.js',
        '/js/directives/dialogs.js',
        '/js/directives/ekg_directive.js',
        '/js/socket.io.js'
    ],
        'public/js/app.js',
        'resources/assets/'
    );

    //handle stylesheets
    mix.styles([
        // '/bower_components/bootstrap/dist/css/bootstrap.min.css',
        '/bower_components/bootstrap-sass/assets/stylesheets/bootstrap.css',
        '/bower_components/bootstrap/dist/css/bootstrap-theme.min.css',
        '/bower_components/angular-chart.js/dist/angular-chart.css',
        '/bower_components/textAngular/dist/textAngular.css',
        '/bower_components/font-awesome/css/font-awesome.css',
        '/bower_components/toastr/toastr.css',
        '/bower_components/angular-loading-bar/build/loading-bar.css',
        '/bower_components/angular-bootstrap3-datepicker/example/css/ng-bs3-datepicker.css'
    ],
        'public/css/vendor.min.css',
        'resources/assets/'
    );

    mix.styles([
        '/css/main/stylesheets/fonts.css',
        '/css/main/stylesheets/screen.css',
    ],
        'public/css/app.min.css',
        'resources/assets/'
    );

    mix.styles([
        '/css/main/stylesheets/login.css',
    ],
        'public/css/login-register.min.css',
        'resources/assets/'
    );

    mix.copy('resources/assets/images/', 'public/images');

});
