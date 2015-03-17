var Forecast = require('forecast.io');
var util = require('util');
var express = require('express');
var geocoder = require('geocoder');
var bodyParser = require('body-parser');
var app = express();
var host = 'localhost';
var port = '3000';
var jsonParser = app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: true })
var googleGeocodeURL = "http://maps.google.com/maps/api/geocode/json"
var path = app.use(express.static(__dirname + '/public'));
var lat = 0;
var lng = 0;
var formatted_address = '';
var forecastOpstions = {
  APIKey: process.env.FORECAST_API_KEY,
  timeout: 1000
}
forecast = new Forecast(forecastOpstions);
var settings = {
  units: 'si',
  exclude: 'minutely,daily,flags'
}

app.get('/home/:name', function (req, res, next) {
  var options = {
    root: __dirname + '/public',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };
  var fileName = req.params.name;
  res.sendFile(fileName, options, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
    else {
      console.log('Sent:', fileName);
    }
  });
})

app.get('/weather', function(req, res){
  var address = req.query.address;
  var passRes = function(data){
    data.formatted_address = formatted_address
    res.json(data);
    res.end();
  }
  geocoder.geocode(address, function ( err, data ) {
    lat = data.results[0].geometry.location.lat
    lng = data.results[0].geometry.location.lng
    formatted_address = data.results[0].formatted_address
    forecast.get(lat, lng, settings, function (err, res, data) {
      if (err) throw err;
      passRes(data)
    });
  });
});

app.listen(port, host, function(){
  console.log('app running: ' + host + ':' + port);
});




