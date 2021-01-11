    mapboxgl.accessToken =  mapToken // from ejs
        const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
        center: campground.geometry.coordinates, // starting position [lng, lat]
        zoom: 10 // starting zoom
      });

new mapboxgl.Marker()
      .setLngLat(campground.geometry.coordinates)
      .addTo(map)