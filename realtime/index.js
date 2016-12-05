var express = require('express')
var app = express()
var server = require('http').createServer(app);
var io = require('socket.io')(server, {serveClient: true, path: '/'});
var http = require('http');

var activeDevices = [];

var requestedDataByDevice = [];

var connectedSockets = [];

io.set('origins', '*:*');

var handleFetchData = function(socket, deviceId, dataType){
	if (undefined !== requestedDataByDevice[socket.id]){
		if (requestedDataByDevice[socket.id]['sensor_data'] == true || requestedDataByDevice[socket.id]['ekg_data'] == true){

			bindApiFetchAndDataSending(socket, deviceId, dataType);
			
		} else {

			console.log('not requesting again');

		}		
	}
};

var bindApiFetchAndDataSending = function(socket, deviceId, dataType){

	if (undefined !== requestedDataByDevice[socket.id]){
		if (dataType == 'sensor_data' && requestedDataByDevice[socket.id]['sensor_data'] == true){	
			http.get('http://127.0.0.1:3000/sim/devicedata/5', function(res){
				res.on('data', function(data){
					var response = JSON.parse(data.toString());

					if (undefined !== response.laria){
						//the response was successfull
						if (undefined !== response.laria.success && response.laria.success){

							socket.emit('deviceData', {
								status: 'success',
								sensors: response.laria.sensors !== undefined && response.laria.sensors ? response.laria.sensors : null
							});

							handleFetchData(socket, deviceId, dataType);

						} else {

							socket.emit('deviceData', {
								status: 'fail',
								message: 'El servidor de datos en tiempo real ha devuelto un error'
							});

							handleFetchData(socket, deviceId, dataType);
						}
					} else {

						socket.emit('deviceData', {
							status: 'fail',
							message: 'Error general en transmisión de datos'
						});

						handleFetchData(socket, deviceId, dataType);
					}
					
				});
			});
		}

		if (dataType == 'ekg_data' && requestedDataByDevice[socket.id]['ekg_data'] == true){
			http.get('http://127.0.0.1:3000/sim/ekg/5', function(res){
				res.on('data', function(data){
					var response = JSON.parse(data.toString());

					if (undefined !== response.laria){
						//the response was successfull
						if (undefined !== response.laria.success && response.laria.success){

							socket.emit('deviceData', {
								status: 'success',
								ekg_data: response.laria.records !== undefined && response.laria.records ? response.laria.records : null
							});

							handleFetchData(socket, deviceId, dataType);

						} else {

							socket.emit('deviceData', {
								status: 'fail',
								message: 'El servidor de datos en tiempo real ha devuelto un error'
							});

							handleFetchData(socket, deviceId, dataType);
						}
					} else {

						socket.emit('deviceData', {
							status: 'fail',
							message: 'Error general en transmisión de datos'
						});

						handleFetchData(socket, deviceId, dataType);
					}
					
				});
			});
		}
	}
};

io.on('connection', function(socket){

	socket.on('turnOnDevice', function(data){

		if (activeDevices.indexOf(data.deviceId) == -1){
			activeDevices.push(data.deviceId);
		}

	});

	socket.on('turnOffDevice', function(data){

		var pos = activeDevices.indexOf(data.deviceId)
		if (pos !== false){
			activeDevices.splice(pos, 1);
		}

	});

	socket.on('connectDevice', function(data){

		connectedSockets[socket.id] = {
			'socket': socket,
			'deviceId': data.deviceId
		};

		socket.emit('connectedDevice', {deviceId: data.deviceId});

	});

	socket.on('readyForData', function(data){

		requestedDataByDevice[socket.id] = data.dataType;

		console.log('connected_sockets: ', requestedDataByDevice);

		if (data.dataType['sensor_data'] == true){

			bindApiFetchAndDataSending(socket, data.deviceId, 'sensor_data');	

		}
		
		if (data.dataType['ekg_data'] == true){

			bindApiFetchAndDataSending(socket, data.deviceId, 'ekg_data');	
		} 

	});

	socket.on('stopReceivingData', function(data){
		delete requestedDataByDevice[socket.id];
		// var deviceId = data.deviceId;

		// var pos = activeDevices.indexOf(deviceId);

		// if (pos > -1){
		// 	activeDevices = activeDevices.splice(pos, 1);
		// }
	});

	socket.on('ackDataReceived', function(data){
		console.log('ackDataReceived', data);
	});

	socket.on('disconnect', function(){
		delete requestedDataByDevice[socket.id];
	});
});


app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://newlaria.localhost');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

server.listen(8888);