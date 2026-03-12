let map;

function getLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      loadMap(userLocation);
    },
    () => {
      alert("Location permission denied");
    }
  );
}

function loadMap(userLocation) {
  map = new google.maps.Map(document.getElementById("map"), {
    center: userLocation,
    zoom: 14
  });

  // User marker
  new google.maps.Marker({
    position: userLocation,
    map: map,
    icon: {
      url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
    },
    title: "Your Location"
  });

  findMetroStations(userLocation);
}

function findMetroStations(userLocation) {
  const service = new google.maps.places.PlacesService(map);

  service.nearbySearch(
    {
      location: userLocation,
      radius: 3000,
      keyword: "metro station"
    },
    (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        results.forEach(place => addMetroMarker(place));
      } else {
        alert("No metro stations found nearby");
      }
    }
  );
}

function addMetroMarker(place) {
  const marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    title: place.name,
    animation: google.maps.Animation.DROP,
    icon: {
      url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
    }
  });

  const infoWindow = new google.maps.InfoWindow({
    content: `<strong>${place.name}</strong><br>${place.vicinity || ""}`
  });

  marker.addListener("click", () => {
    infoWindow.open(map, marker);
  });
}