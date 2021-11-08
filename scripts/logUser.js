locateUser()

function locateUser() {
    let status = document.querySelector('#status');
    let location = document.querySelector('#location');

    let caption = document.querySelector('#caption').textContent;
    let username = caption.slice(caption.indexOf(" ")+1, caption.length)
    
    location.textContent = '';
    
    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        status.textContent = '';
        location.textContent = `Current location: Latitude = ${latitude} °, Longitude = ${longitude} °`;
        

        postData('https://localhost:4041/location', { latitude, longitude, username });
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


async function postData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) 
    });
}










