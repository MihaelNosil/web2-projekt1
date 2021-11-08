

getData('https://murmuring-eyrie-91657.herokuapp.com/user_locations').then(data => {
    loadUsersLocations(data.users)});


function loadUsersLocations(users){

    if(users.length === 0) return;

    var map = L.map('map').setView([users[0].location.latitude, users[0].location.longitude], 13-1*users.length);
    
    let accessToken = process.env.ACCESS_TOKEN;
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: accessToken
    }).addTo(map);
    
    
    for(let user of users){
        let marker = L.marker([user.location.latitude, user.location.longitude]).addTo(map);
        marker.bindPopup(`<b>${user.name}</b><br>${user.timestamp}`);
        console.log(user)
    }
}

async function getData(url = '') {
    const response = await fetch(url, {
        method: 'GET'
    });
    return response.json(); // parses JSON response into native JavaScript objects
}