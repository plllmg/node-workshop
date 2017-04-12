var request = require('request-promise');

// Euclidian distance between two points
function getDistance(pos1, pos2) {
    return Math.sqrt(Math.pow(pos1.lat - pos2.lat, 2) + Math.pow(pos1.lng - pos2.lng, 2));
}

function getIssPosition() {
    return request('http://api.open-notify.org/iss-now.json')
        .then(
            function(response) {
                // Parse as JSON
                // Return object with lat and lng
                var data = JSON.parse(response);
                data.iss_position.lng = data.iss_position.longitude;
                data.iss_position.lat = data.iss_position.latitude;
                return data.iss_position
            }
        )
}

function getAddressPosition(address) {
    
    return request('https://maps.googleapis.com/maps/api/geocode/json?address=' + address)
    .then(function(response) {
        var data = JSON.parse(response);
        
        return data.results[0].geometry.location;
    });


}

function getCurrentTemperatureAtPosition(position) {
    return request('https://api.darksky.net/forecast/714e9bce6372ce0d5b09495430edae6f/'+position.lat+','+position.lng)
    .then(function(response) {
        var data = JSON.parse(response);
        
        return data.currently.temperature;
    });

}

function getCurrentTemperature(address) {
    
    return getCurrentTemperatureAtPosition(getAddressPosition(address));
    
}

function getDistanceFromIss(address) {
    
    return Promise.all([getIssPosition(), getAddressPosition(address)])
    .then(values => {
        return getDistance(values[0], values[1]);
    });
    
}

exports.getIssPosition = getIssPosition;
exports.getAddressPosition = getAddressPosition;
exports.getCurrentTemperatureAtPosition = getCurrentTemperatureAtPosition;
exports.getCurrentTemperature = getCurrentTemperature;
exports.getDistanceFromIss = getDistanceFromIss; 