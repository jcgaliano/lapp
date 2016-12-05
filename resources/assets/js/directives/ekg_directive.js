angular.module('Platease')
    .directive('ekgElem', ['$http', '$interval', '$timeout', function($http, $interval, $timeout){
        return {
            link: function(scope, elem, attrs){

                var height = parseInt(attrs.height ? attrs.height : 0);

                scope.svgHeight = height + 'px';

                var pathDefinition = '';

                var currentOrder = 0;

                scope.ekg_path = '';

                var viewportX = 0;
                var viewportMoveStep = 100;

                scope.readingsToSave = [];

                var updateTransformCommand = function(){
                    scope.transformCommand = 'translate(' + viewportX + ',0)';
                };

                var moveLeft = function(amount){
                    if (amount){
                        viewportX += amount;
                    } else {
                        viewportX += viewportMoveStep;
                    }

                    updateTransformCommand();
                };

                var moveRight = function(amount){
                    if (amount){
                        viewportX -= amount;
                    } else {
                        viewportX -= viewportMoveStep;
                    }

                    updateTransformCommand();
                };

                scope.$parent.$watch('ekg_data', function(newValue){

                    if (newValue){
                        // res es un arreglo de objects, cada object es un paquete
                        // por tanto

                        var readings = newValue.value;

                        scope.readingsToSave = scope.readingsToSave.concat(readings);

                        //convert the value to a scaled value

                        var first = true;

                        var order = 2.5;

                        var scale = 4;

                        var calcPointByReading = function(value, previous){

                            var diff = (previous - value );

                            return diff * 100 * scale;

                        };

                        var previousReading = 0;

                        var path = '';

                        var addPoint = function(order, point){
                            // $timeout(function(){
                                path += ' l ' + order + ' ' + point;
                            // }, 300);
                        };

                        for (k in readings){
                            if (!first){

                                var point = calcPointByReading(readings[k], previousReading);

                                addPoint(order, point);

                            } else {

                                first = false;
                                path += ' M ' + currentOrder + ' ' + parseInt(height / 2);

                            }

                            previousReading = readings[k];

                        }

                        // moveRight(parseInt( readings.length * order / 2 ));

                        scope.ekg_path += path;

                        currentOrder += order * readings.length;
                    }

                });

                scope.moveLeft = function(){
                    moveLeft();
                };

                scope.moveRight = function(){
                    moveRight();
                };

            },
            templateUrl: '/tesis/templates/ekg.html',
            replace: true
        };
    }]);