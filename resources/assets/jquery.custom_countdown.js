(function(){

    $.fn.customCountdown = function(timeToCount){

        var self = this;

        self.formatTime = function(minutes, seconds){
            if (minutes.toString().length == 1){
                minutes = '0' + minutes;
            }

            if (seconds.toString().length == 1){
                seconds = '0' + seconds;
            }

            return minutes + ':' + seconds;
        };

        return $(this).each(function(){

            var that = this;



            //convert the time to an integer value representing the seconds

            var timeParts = timeToCount.split(':');

            var numberOfSeconds = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);

            $(this).text(self.formatTime(timeParts[0], timeParts[1]));

            var countDown = function(){
                setTimeout(function(){
                    numberOfSeconds -= 1;

                    //convert number of seconds to countdown time
                    var minutes = parseInt(numberOfSeconds / 60);
                    var seconds = numberOfSeconds - minutes * 60;


                    $(that).text(self.formatTime(minutes, seconds));

                    if (numberOfSeconds > 0){
                        $(that).trigger('custom_countdown.tick');
                        countDown();
                    } else {
                        $(that).trigger('custom_countdown.finish');
                    }
                }, '1000');
            };

            countDown();
        });

    };

})(jQuery);