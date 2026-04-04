const Itinerary = (() => {
  let panelOpen = false;
  let activeDay = null; // null = all days
  const panelEl = () => document.getElementById("panel");
  const fabEl = () => document.getElementById("fab-btn");

  const CATEGORY_ICONS = {
    landmark: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-4h6v4"/></svg>',
    comida: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>',
    cafe: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>',
    helado: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22L8 12h8z"/><path d="M12 12a5 5 0 0 1-5-5 5 5 0 0 1 10 0 5 5 0 0 1-5 5z"/><path d="M7.5 7a2.5 2.5 0 0 1 5 0"/><path d="M11.5 7a2.5 2.5 0 0 1 5 0"/></svg>',
    tragos: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 22h8"/><path d="M12 11v11"/><path d="M19 3l-7 8-7-8z"/></svg>',
  };

  function render(days, visitedSet) {
    const list = document.getElementById("itinerary-list");
    list.innerHTML = "";

    // Day filter tabs
    const tabs = document.createElement("div");
    tabs.className = "day-tabs";

    const allTab = document.createElement("button");
    allTab.className = `day-tab${activeDay === null ? " active" : ""}`;
    allTab.textContent = "Todos";
    allTab.addEventListener("click", () => {
      activeDay = null;
      App.filterDay(null);
    });
    tabs.appendChild(allTab);

    days.forEach((day, idx) => {
      const tab = document.createElement("button");
      tab.className = `day-tab${activeDay === idx ? " active" : ""}`;
      tab.innerHTML = `<span class="tab-dot" style="background:${day.color}"></span>${day.date.slice(5)}`;
      tab.addEventListener("click", () => {
        activeDay = idx;
        App.filterDay(idx);
      });
      tabs.appendChild(tab);
    });

    list.appendChild(tabs);

    // Render days
    const daysToShow = activeDay !== null ? [{ day: days[activeDay], idx: activeDay }] : days.map((day, idx) => ({ day, idx }));

    daysToShow.forEach(({ day }) => {
      const group = document.createElement("div");
      group.className = "day-group";

      const header = document.createElement("div");
      header.className = "day-header";
      header.innerHTML = `<span class="day-dot" style="background:${day.color}"></span>${day.label}`;
      group.appendChild(header);

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
          <span class="place-icon">${CATEGORY_ICONS[place.category] || ""}</span>
          <button class="info-btn" data-place-id="${place.id}" aria-label="Info ${place.name}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
          </button>
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

    list.querySelectorAll(".info-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        App.showInfo(btn.dataset.placeId);
      });
    });

    list.querySelectorAll(".route-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const { lat, lng, name } = btn.dataset;
        App.requestRoute(parseFloat(lat), parseFloat(lng), name);
      });
    });
  }

  function getActiveDay() {
    return activeDay;
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

  function setupSwipe() {
    const panel = panelEl();
    const list = document.getElementById("itinerary-list");
    let startY = 0;
    let currentY = 0;
    let dragging = false;

    panel.addEventListener("touchstart", (e) => {
      startY = e.touches[0].clientY;
      currentY = startY;
      dragging = false;
    }, { passive: true });

    panel.addEventListener("touchmove", (e) => {
      currentY = e.touches[0].clientY;
      const dy = currentY - startY;

      if (!dragging && dy > 8 && list.scrollTop <= 0) {
        dragging = true;
        startY = currentY;
        panel.style.transition = "none";
      }

      if (dragging) {
        const offset = currentY - startY;
        if (offset > 0) {
          e.preventDefault();
          panel.style.transform = `translateY(${offset}px)`;
        }
      }
    }, { passive: false });

    panel.addEventListener("touchend", () => {
      if (!dragging) return;
      dragging = false;
      panel.style.transition = "";
      const dy = currentY - startY;
      if (dy > 80) {
        panel.style.transform = "";
        toggle();
      } else {
        panel.style.transform = "translateY(0)";
      }
    });
  }

  return { render, toggle, isOpen, getActiveDay, setupSwipe };
})();
