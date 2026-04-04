const Itinerary = (() => {
  let panelOpen = false;
  const panelEl = () => document.getElementById("panel");
  const fabEl = () => document.getElementById("fab-btn");

  const CATEGORY_ICONS = {
    landmark: "🏛️",
    comida: "🍝",
    cafe: "☕",
    helado: "🍦",
    tragos: "🍸",
  };

  function render(days, visitedSet) {
    const list = document.getElementById("itinerary-list");
    list.innerHTML = "";

    days.forEach((day) => {
      const group = document.createElement("div");
      group.className = "day-group";

      // Header
      const header = document.createElement("div");
      header.className = "day-header";
      header.innerHTML = `<span class="day-dot" style="background:${day.color}"></span>${day.label}`;
      group.appendChild(header);

      // Sort: unvisited first, then visited
      const sorted = [...day.places].sort((a, b) => {
        const aV = visitedSet.has(a.id) ? 1 : 0;
        const bV = visitedSet.has(b.id) ? 1 : 0;
        return aV - bV;
      });

      sorted.forEach((place) => {
        const visited = visitedSet.has(place.id);
        const item = document.createElement("div");
        item.className = `place-item${visited ? " visited" : ""}`;
        item.innerHTML = `
          <input type="checkbox" class="place-check" data-id="${place.id}"
                 ${visited ? "checked" : ""} style="border-color:${visited ? "" : day.color}">
          <span class="place-icon">${CATEGORY_ICONS[place.category] || "📍"}</span>
          <div class="place-info">
            <div class="place-name">${place.name}</div>
            <div class="place-time">${place.time}</div>
          </div>
          <button class="route-btn" data-lat="${place.lat}" data-lng="${place.lng}" data-name="${place.name}" aria-label="Ruta a ${place.name}">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22c-4-4-8-7.5-8-12a8 8 0 1 1 16 0c0 4.5-4 8-8 12z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </button>
        `;
        group.appendChild(item);
      });

      list.appendChild(group);
    });

    // Bind events
    list.querySelectorAll(".place-check").forEach((cb) => {
      cb.addEventListener("change", (e) => {
        App.toggleVisited(e.target.dataset.id);
      });
    });

    list.querySelectorAll(".route-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const { lat, lng, name } = btn.dataset;
        App.requestRoute(parseFloat(lat), parseFloat(lng), name);
      });
    });
  }

  function toggle() {
    panelOpen = !panelOpen;
    panelEl().classList.toggle("open", panelOpen);
    fabEl().classList.toggle("open", panelOpen);

    const iconList = document.getElementById("fab-icon-list");
    const iconClose = document.getElementById("fab-icon-close");
    iconList.style.display = panelOpen ? "none" : "block";
    iconClose.style.display = panelOpen ? "block" : "none";
  }

  function isOpen() {
    return panelOpen;
  }

  return { render, toggle, isOpen };
})();
