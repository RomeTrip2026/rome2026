const MapModule = (() => {
  let map;
  let markers = {};
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
      // Add empty route source
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
    days.forEach((day) => {
      day.places.forEach((place) => {
        const el = document.createElement("div");
        el.className = "custom-marker";
        el.style.backgroundColor = day.color;

        if (visitedSet.has(place.id)) {
          el.classList.add("visited");
        }

        const marker = new mapboxgl.Marker({ element: el, anchor: "center" })
          .setLngLat([place.lng, place.lat])
          .addTo(map);

        el.addEventListener("click", (e) => {
          e.stopPropagation();
          showPopup(place, day.color, visitedSet);
        });

        markers[place.id] = { marker, el, color: day.color };
      });
    });
  }

  function showPopup(place, color, visitedSet) {
    if (currentPopup) currentPopup.remove();

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

    currentPopup = new mapboxgl.Popup({ offset: 18, closeButton: true })
      .setLngLat([place.lng, place.lat])
      .setHTML(html)
      .addTo(map);
  }

  function updateMarkerVisited(placeId, visited) {
    const m = markers[placeId];
    if (!m) return;
    if (visited) {
      m.el.classList.add("visited");
    } else {
      m.el.classList.remove("visited");
      m.el.style.backgroundColor = m.color;
    }
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

    // Fit map to route bounds
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

  return { init, addMarkers, updateMarkerVisited, closePopup, drawRoute, clearRoute, flyTo, geolocate, fetchRoute };
})();
