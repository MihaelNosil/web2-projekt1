locateUser()
function locateUser() {
    let status = document.querySelector('#status');
    let location = document.querySelector('#location');
    location.textContent = '';
    
    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        status.textContent = '';
        location.textContent = `Current location: Latitude = ${latitude} °, Longitude = ${longitude} °`;

        var map = L.map('map').setView([latitude, longitude], 4);

        let accessToken = process.env.ACCESS_TOKEN;
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: accessToken
        }).addTo(map);
    }
    
    function error() {
        status.textContent = 'Unable to retrieve your location';
    }
    
    if(!navigator.geolocation) {
        status.textContent = 'Geolocation is not supported by your browser';
    } else {
        status.textContent = 'Locating…';
        navigator.geolocation.getCurrentPosition(success, error);
    }
    
}


