angular.module('Platease')
    .factory('dialog', ['$modal', function($modal){

        var alertModal = function(type, title, message){

            var templateUrl = null;

            switch(type){
                case 'alert':
                    templateUrl = '/tesis/templates/modal/alertDialog.html';
                    break;
                case 'success':
                    templateUrl = '/tesis/templates/modal/successDialog.html';
                    break;
                case 'confirm':
                    templateUrl = '/tesis/templates/modal/confirmDialog.html';
                    break;
            };

            return $modal.open({
                    animation: true,
                    backdrop: 'static',
                    templateUrl: templateUrl,
                    windowClass: type,
                    size: 'md',
                    resolve:{
                        alert_title: function() { return title; },
                        alert_message: function() { return message; }
                    },
                    controller: ['$scope', 'alert_title', 'alert_message', function($scope, alert_title, alert_message){
                        $scope.title = alert_title;
                        $scope.message = alert_message;
                    }]
                }
            );

        };

        return {
            alert: function(title, message){
                return alertModal('alert', title, message).result;
            },
            confirm: function(title, message){
                return alertModal('confirm', title, message).result;
            },
            success: function(title, message){
                return alertModal('success', title, message).result;
            }
        }
    }]);
