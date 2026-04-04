// ─── Put your Mapbox token here ───
const MAPBOX_TOKEN = "pk.eyJ1IjoiYWdhcmNpYWUiLCJhIjoiY2phdHN2amQ3MW5hcTJ4cGhzd2NlY3Z1eSJ9.d4rzmhRoRZrcPrgu0b2s4Q";
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
    MapModule.rebuildSource(visitedSet, Itinerary.getActiveDay());
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

    // Info modal close
    document.getElementById("info-modal-close").addEventListener("click", closeInfo);
    document.querySelector(".info-modal-overlay").addEventListener("click", closeInfo);

    // Swipe-down to dismiss info modal
    setupModalSwipe();
  }

  function filterDay(dayIndex) {
    MapModule.rebuildSource(visitedSet, dayIndex);
    Itinerary.render(TRIP_DATA.days, visitedSet);
  }

  function showInfo(placeId) {
    const info = PLACE_INFO[placeId];
    if (!info) return;
    document.getElementById("info-modal-title").textContent = info.title;
    document.getElementById("info-modal-body").innerHTML = info.html;
    document.getElementById("info-modal").classList.remove("hidden");
  }

  function closeInfo() {
    const card = document.getElementById("info-modal").querySelector(".info-modal-card");
    card.style.transform = "";
    document.getElementById("info-modal").classList.add("hidden");
  }

  function setupModalSwipe() {
    const card = document.querySelector(".info-modal-card");
    let startY = 0;
    let currentY = 0;
    let dragging = false;

    card.addEventListener("touchstart", (e) => {
      // Only start drag if scrolled to top or touching near the top handle area
      if (card.scrollTop > 0) return;
      startY = e.touches[0].clientY;
      currentY = startY;
      dragging = true;
      card.style.transition = "none";
    }, { passive: true });

    card.addEventListener("touchmove", (e) => {
      if (!dragging) return;
      currentY = e.touches[0].clientY;
      const dy = currentY - startY;
      if (dy > 0) {
        card.style.transform = `translateY(${dy}px)`;
      } else if (card.scrollTop <= 0) {
        // Prevent pulling up beyond original position
        card.style.transform = "translateY(0)";
      }
    }, { passive: true });

    card.addEventListener("touchend", () => {
      if (!dragging) return;
      dragging = false;
      card.style.transition = "";
      const dy = currentY - startY;
      if (dy > 100) {
        closeInfo();
      } else {
        card.style.transform = "translateY(0)";
      }
    });
  }

  // Public API
  return { init, toggleVisited, requestRoute, filterDay, showInfo, closeInfo };
})();

document.addEventListener("DOMContentLoaded", App.init);
