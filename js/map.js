const MapModule = (() => {
  let map;
  let placesIndex = {}; // id -> { place, color }
  let currentPopup = null;
  let routeLayerAdded = false;

  function init(token) {
    mapboxgl.accessToken = token;
    map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v12",
      center: [12.4964, 41.9028],
      zoom: 12.5,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.AttributionControl({ compact: true }));

    map.on("load", () => {
      // Route source
      map.addSource("route", {
        type: "geojson",
        data: { type: "Feature", geometry: { type: "LineString", coordinates: [] } },
      });
      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#2979FF", "line-width": 5, "line-opacity": 0.8 },
      });
      routeLayerAdded = true;
    });

    return map;
  }

  function addMarkers(days, visitedSet) {
    const features = [];

    days.forEach((day) => {
      day.places.forEach((place) => {
        placesIndex[place.id] = { place, color: day.color };
        const visited = visitedSet.has(place.id);
        features.push({
          type: "Feature",
          geometry: { type: "Point", coordinates: [place.lng, place.lat] },
          properties: {
            id: place.id,
            name: place.name,
            description: place.description,
            time: place.time,
            color: visited ? "#9E9E9E" : day.color,
            opacity: visited ? 0.55 : 1,
          },
        });
      });
    });

    map.on("load", () => {
      map.addSource("places", {
        type: "geojson",
        data: { type: "FeatureCollection", features },
      });

      // White border circle
      map.addLayer({
        id: "places-border",
        type: "circle",
        source: "places",
        paint: {
          "circle-radius": 14,
          "circle-color": "#ffffff",
          "circle-opacity": ["get", "opacity"],
        },
      });

      // Colored inner circle
      map.addLayer({
        id: "places-circle",
        type: "circle",
        source: "places",
        paint: {
          "circle-radius": 11,
          "circle-color": ["get", "color"],
          "circle-opacity": ["get", "opacity"],
        },
      });

      // Click handler
      map.on("click", "places-circle", (e) => {
        const props = e.features[0].properties;
        showPopup(props, visitedSet);
      });

      // Pointer cursor
      map.on("mouseenter", "places-circle", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "places-circle", () => {
        map.getCanvas().style.cursor = "";
      });
    });
  }

  function showPopup(props, visitedSet) {
    if (currentPopup) currentPopup.remove();

    const info = placesIndex[props.id];
    if (!info) return;
    const place = info.place;
    const isVisited = visitedSet.has(place.id);

    const html = `
      <div class="popup-title">${place.name}</div>
      <div class="popup-desc">${place.description}</div>
      <div class="popup-time">${place.time}</div>
      <div class="popup-actions">
        <button class="popup-btn popup-btn-visited ${isVisited ? "checked" : ""}"
                onclick="App.toggleVisited('${place.id}')">
          ${isVisited ? "Visitado" : "Marcar visitado"}
        </button>
        <button class="popup-btn popup-btn-route"
                onclick="App.requestRoute(${place.lat}, ${place.lng}, '${place.name}')">
          Ruta
        </button>
      </div>
    `;

    currentPopup = new mapboxgl.Popup({ offset: 14, closeButton: true })
      .setLngLat([place.lng, place.lat])
      .setHTML(html)
      .addTo(map);
  }

  function updateMarkerVisited(placeId, visited) {
    const source = map.getSource("places");
    if (!source) return;

    const data = source._data || source.serialize().data;
    if (!data || !data.features) return;

    const info = placesIndex[placeId];
    if (!info) return;

    data.features = data.features.map((f) => {
      if (f.properties.id === placeId) {
        return {
          ...f,
          properties: {
            ...f.properties,
            color: visited ? "#9E9E9E" : info.color,
            opacity: visited ? 0.55 : 1,
          },
        };
      }
      return f;
    });

    source.setData(data);
  }

  function rebuildSource(visitedSet) {
    const source = map.getSource("places");
    if (!source) return;

    const features = [];
    Object.values(placesIndex).forEach(({ place, color }) => {
      const visited = visitedSet.has(place.id);
      features.push({
        type: "Feature",
        geometry: { type: "Point", coordinates: [place.lng, place.lat] },
        properties: {
          id: place.id,
          name: place.name,
          description: place.description,
          time: place.time,
          color: visited ? "#9E9E9E" : color,
          opacity: visited ? 0.55 : 1,
        },
      });
    });

    source.setData({ type: "FeatureCollection", features });
  }

  function closePopup() {
    if (currentPopup) {
      currentPopup.remove();
      currentPopup = null;
    }
  }

  function drawRoute(coordinates) {
    if (!routeLayerAdded) return;
    map.getSource("route").setData({
      type: "Feature",
      geometry: { type: "LineString", coordinates },
    });

    const bounds = coordinates.reduce(
      (b, coord) => b.extend(coord),
      new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
    );
    map.fitBounds(bounds, { padding: 80, duration: 600 });
  }

  function clearRoute() {
    if (!routeLayerAdded) return;
    map.getSource("route").setData({
      type: "Feature",
      geometry: { type: "LineString", coordinates: [] },
    });
  }

  function flyTo(lng, lat) {
    map.flyTo({ center: [lng, lat], zoom: 15, duration: 800 });
  }

  function geolocate() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocalización no disponible"));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }

  async function fetchRoute(fromLng, fromLat, toLng, toLat) {
    const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${fromLng},${fromLat};${toLng},${toLat}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.routes || !data.routes.length) throw new Error("No se encontró ruta");
    const route = data.routes[0];
    return {
      coordinates: route.geometry.coordinates,
      duration: Math.round(route.duration / 60),
      distance: (route.distance / 1000).toFixed(1),
    };
  }

  return { init, addMarkers, updateMarkerVisited, rebuildSource, closePopup, drawRoute, clearRoute, flyTo, geolocate, fetchRoute };
})();
