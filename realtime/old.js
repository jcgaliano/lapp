var public_folder = __dirname + '/public/';
var existsSync = fs.existsSync(public_folder);

function getResponse(filename, callback){

	filename = public_folder + filename;

	fs.exists(filename, function(exists){
		if (exists){
			fs.stat(filename, function(err, stats){
				if (err){

					console.log(err);

				} else {
					
					fs.open(filename, 'r', function(err, fd){
						
						var buffer = new Buffer(stats.size);

						fs.read(fd, buffer, 0, buffer.length, null, function(error, bytesRead, buffer){
							 var data = buffer.toString("utf8");
  							 callback(data);
						});

					});

				}
			});
		} else {
			console.log('Missing response file');
		}
	});	
}

function generateRandomValue(min, max){
	return Math.random() * (max - min) + min;
};

function getRandomRangedValuesArray(size, min, max){

	var arr = [];

	for (var i = 0; i < size; i++){
		arr.push(generateRandomValue(min, max));
	}

	return arr;
};

function generateEkgData(numReadings){
	var readings = [];

	var initialReading = 1;

	for(var i = 0; i < numReadings ; i++){

		var diff = Math.sin(i) * Math.random() / 5;

		// if (i > numReadings / 2){
		// 	initialReading = initialReading - diff;
		// } else {
			// initialReading = initialReading + diff;
		// }

		initialReading = 1 + diff;

		readings.push(initialReading);
	}

	return readings;
};

function getEkgData(numReadings, callback){
	
	var data = generateEkgData(numReadings);

	callback(data);
}

app.get('/', function (req, res) {
  
	getResponse('index.html', function(data){
		
		res.writeHead(200, {
  			"Content-Type": "text/html"
		});
	
	    res.end(data);
	});

});

app.get('/sim/devicedata/:deviceId', function(req, res){

	console.log('requesting device data for device: ' + req.params.deviceId);

	res.writeHead(200, {
		"Content-Type": 'application/json',
		"Access-Control-Allow-Origin": "*"
	});

	res.end(JSON.stringify(
		{		
		
		  "laria":
		  	{
			    "tag": "real_time",
			    "deviceId": req.params.deviceId,
			    "success": true,
			    "error": false,
			    "sensors": [
					{
						"id": 0,
						"name": "temperature",
						"value": generateRandomValue(36, 38),
						"type_sensor": 1
					},
					{
						"id": 1,
						"name": "heart_rate",
						"value": generateRandomValue(60,100),
						"type_sensor": 2
					},
					{
						"id": 2,
						"name": "oxygen_levels",
						"value": generateRandomValue(80,100),
						"type_sensor": 3
					},
					{
						"id": 3,
						"name": "falling_status",
						"value": generateRandomValue(10,20),
						"type_sensor": 4
					},
					{
						"id": 4,
						"name": "weight",
						"value": generateRandomValue(90,90),
						"type_sensor": 5
					},
					{
						"id": 5,
						"name": "height",
						"value": generateRandomValue(180,180),
						"type_sensor": 6
					}

			    ]
			}
		}
	));

});

app.get('/sim/ekg/:deviceId', function(req, res){

	console.log('requesting ekg data for device: ' + req.params.deviceId);

	res.writeHead(200, {
		"Content-Type": 'application/json',
		"Access-Control-Allow-Origin": "*"
	});

	getEkgData(100, function(data){
		res.end(JSON.stringify(
			{
				"laria": {
					"tag": "cgc",
					"deviceId": req.params.deviceId,
					"success": true,
					"error":false,
					"records":[
						{
							"id_sensor": 1,
							"date":"2015-11-06T06:00:00.000Z",
							"id_packet":404076,
							"time":"17:16:31",
							"value": data
							// "value": [1.3245117187,1.327734375,1.3309570312,1.3341796875,1.3341796875,1.3374023438,1.3374023438,1.3374023438,1.3341796875,1.3245117187,1.2987304687,1.2729492188,1.2568359375,1.2729492188,1.3341796875,1.4373046875,1.57265625,1.7015625,1.7499023437,1.6918945313,1.546875,1.3857421875,1.26328125,1.1891601563,1.1633789062,1.1698242187,1.1956054687,1.2278320312,1.26328125,1.2987304687,1.3212890625,1.3374023438,1.3502929687,1.3567382812,1.3599609375,1.36640625,1.3696289063,1.3728515625,1.379296875,1.379296875,1.3825195312,1.3825195312,1.3825195312,1.3825195312,1.3857421875,1.3889648437,1.3954101562,1.3986328125,1.3986328125,1.3954101562]
						}
					]
				}
			}
		));
	});
});
