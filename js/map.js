const MapModule = (() => {
  let map;
  let placesIndex = {}; // id -> { place, color, dayIndex }
  let currentPopup = null;
  let routeLayerAdded = false;
  let visitedSetRef = new Set();

  // SVG paths for each category icon (white stroke on transparent)
  const ICON_SVGS = {
    landmark: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-4h6v4"/></svg>`,
    comida: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>`,
    cafe: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>`,
    helado: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22L8 12h8z"/><path d="M12 12a5 5 0 0 1-5-5 5 5 0 0 1 10 0 5 5 0 0 1-5 5z"/><path d="M7.5 7a2.5 2.5 0 0 1 5 0"/><path d="M11.5 7a2.5 2.5 0 0 1 5 0"/></svg>`,
    tragos: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 22h8"/><path d="M12 11v11"/><path d="M19 3l-7 8-7-8z"/></svg>`,
  };

  function loadCategoryIcons() {
    const size = 24;
    const ratio = window.devicePixelRatio || 1;
    const promises = Object.entries(ICON_SVGS).map(([category, svg]) => {
      return new Promise((resolve) => {
        const img = new Image();
        const blob = new Blob([svg], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = size * ratio;
          canvas.height = size * ratio;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, size * ratio, size * ratio);
          URL.revokeObjectURL(url);
          map.addImage(`icon-${category}`, ctx.getImageData(0, 0, size * ratio, size * ratio), {
            pixelRatio: ratio,
          });
          resolve();
        };
        img.src = url;
      });
    });
    return Promise.all(promises);
  }

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
    visitedSetRef = visitedSet;
    const features = [];

    days.forEach((day, dayIdx) => {
      day.places.forEach((place) => {
        placesIndex[place.id] = { place, color: day.color, dayIndex: dayIdx };
        const visited = visitedSet.has(place.id);
        features.push(makeFeature(place, day.color, dayIdx, visited, false));
      });
    });

    map.on("load", async () => {
      await loadCategoryIcons();

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
          "circle-radius": 16,
          "circle-color": "#ffffff",
          "circle-opacity": ["get", "opacity"],
        },
      });

      // Colored circle
      map.addLayer({
        id: "places-circle",
        type: "circle",
        source: "places",
        paint: {
          "circle-radius": 13,
          "circle-color": ["get", "color"],
          "circle-opacity": ["get", "opacity"],
        },
      });

      // Category icon on top
      map.addLayer({
        id: "places-icon",
        type: "symbol",
        source: "places",
        layout: {
          "icon-image": ["get", "icon"],
          "icon-size": 0.6,
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
        },
        paint: {
          "icon-opacity": ["get", "opacity"],
        },
      });

      map.on("click", "places-circle", (e) => {
        const props = e.features[0].properties;
        showPopup(props, visitedSetRef);
      });
      map.on("click", "places-icon", (e) => {
        const props = e.features[0].properties;
        showPopup(props, visitedSetRef);
      });

      map.on("mouseenter", "places-circle", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "places-circle", () => {
        map.getCanvas().style.cursor = "";
      });
    });
  }

  function makeFeature(place, dayColor, dayIndex, visited, dimmed) {
    return {
      type: "Feature",
      geometry: { type: "Point", coordinates: [place.lng, place.lat] },
      properties: {
        id: place.id,
        name: place.name,
        description: place.description,
        time: place.time,
        dayIndex,
        color: (dimmed || visited) ? "#9E9E9E" : dayColor,
        opacity: dimmed ? 0.2 : visited ? 0.55 : 1,
        icon: `icon-${place.category}`,
      },
    };
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
          ${isVisited ? "Visitado" : "Marcar"}
        </button>
        <button class="popup-btn popup-btn-route"
                onclick="App.requestRoute(${place.lat}, ${place.lng}, '${place.name}')">
          Ruta
        </button>
        <button class="popup-btn popup-btn-info"
                onclick="App.showInfo('${place.id}')">
          Info
        </button>
      </div>
    `;

    currentPopup = new mapboxgl.Popup({ offset: 16, closeButton: true })
      .setLngLat([place.lng, place.lat])
      .setHTML(html)
      .addTo(map);
  }

  function rebuildSource(visitedSet, activeDayIndex, activeCategory) {
    visitedSetRef = visitedSet;
    const source = map.getSource("places");
    if (!source) return;

    const features = [];
    Object.values(placesIndex).forEach(({ place, color, dayIndex }) => {
      const visited = visitedSet.has(place.id);
      const dimmedDay = activeDayIndex !== null && activeDayIndex !== undefined && dayIndex !== activeDayIndex;
      const dimmedCat = activeCategory !== null && activeCategory !== undefined && place.category !== activeCategory;
      const dimmed = dimmedDay || dimmedCat;
      features.push(makeFeature(place, color, dayIndex, visited, dimmed));
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

  return { init, addMarkers, rebuildSource, closePopup, drawRoute, clearRoute, flyTo, geolocate, fetchRoute };
})();
