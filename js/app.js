// ─── Put your Mapbox token here ───
const MAPBOX_TOKEN = "YOUR_MAPBOX_TOKEN_HERE";
// ───────────────────────────────────

const App = (() => {
  const STORAGE_KEY = "rome-trip-visited";
  let visitedSet = new Set();

  function loadVisited() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) visitedSet = new Set(JSON.parse(raw));
    } catch { /* ignore */ }
  }

  function saveVisited() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...visitedSet]));
  }

  function toggleVisited(placeId) {
    if (visitedSet.has(placeId)) {
      visitedSet.delete(placeId);
    } else {
      visitedSet.add(placeId);
    }
    saveVisited();
    MapModule.updateMarkerVisited(placeId, visitedSet.has(placeId));
    MapModule.closePopup();
    Itinerary.render(TRIP_DATA.days, visitedSet);
  }

  async function requestRoute(lat, lng, name) {
    const banner = document.getElementById("route-banner");
    const info = document.getElementById("route-info");

    try {
      info.textContent = "Obteniendo ubicación...";
      banner.classList.remove("hidden");

      const pos = await MapModule.geolocate();
      info.textContent = "Calculando ruta...";

      const route = await MapModule.fetchRoute(pos.lng, pos.lat, lng, lat);
      MapModule.drawRoute(route.coordinates);
      info.textContent = `🚶 ${route.duration} min · ${route.distance} km hasta ${name}`;

      // Close panel on mobile to show route
      if (Itinerary.isOpen() && window.innerWidth < 768) {
        Itinerary.toggle();
      }
    } catch (err) {
      info.textContent = `Error: ${err.message || "No se pudo obtener la ruta"}`;
      setTimeout(() => banner.classList.add("hidden"), 3000);
    }
  }

  function clearRoute() {
    MapModule.clearRoute();
    document.getElementById("route-banner").classList.add("hidden");
  }

  function init() {
    loadVisited();
    MapModule.init(MAPBOX_TOKEN);
    MapModule.addMarkers(TRIP_DATA.days, visitedSet);
    Itinerary.render(TRIP_DATA.days, visitedSet);

    // FAB toggle
    document.getElementById("fab-btn").addEventListener("click", () => {
      Itinerary.toggle();
    });

    // Geolocate button
    document.getElementById("geolocate-btn").addEventListener("click", async () => {
      try {
        const pos = await MapModule.geolocate();
        MapModule.flyTo(pos.lng, pos.lat);
      } catch {
        alert("No se pudo obtener la ubicación");
      }
    });

    // Close route
    document.getElementById("route-close").addEventListener("click", clearRoute);
  }

  // Public API
  return { init, toggleVisited, requestRoute };
})();

document.addEventListener("DOMContentLoaded", App.init);
