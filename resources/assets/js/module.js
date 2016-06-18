angular.module('Platease', [
    'ui.bootstrap',
    'ui.router',
    'ngCookies',
    'chart.js',
    'angularMoment',
    'textAngular',
    'angular-loading-bar',
    'truncate',
    'ng-bs3-datepicker',
    'angular-jwt',
    'satellizer',
    'angular-storage'
]);

angular.module('Platease').constant('angularMomentConfig', {
    preprocess: 'utc', // optional
    timezone: 'UTC' // optional
})
    .constant('BASE_URL', '/')
    .constant('ROLES', {
        supervisor: 'supervisor',
        patient: 'patient',
        doctor: 'doctor'
    })
    .config(['$httpProvider', 'jwtInterceptorProvider', '$authProvider', '$locationProvider', function ($httpProvider, jwtInterceptorProvider, $authProvider, $locationProvider) {

        $authProvider.baseUrl = '/';
        $authProvider.loginUrl = 'api/authenticate';

        // jwtInterceptorProvider.authHeader = 'Authorization';
        //
        // jwtInterceptorProvider.tokenGetter = function(store){
        //     return 'Bearer ' + store.get('satellizer_token');
        // };
        //
        // $httpProvider.interceptors.push('jwtInterceptor');

        // $locationProvider.html5Mode(true);
    }]);
