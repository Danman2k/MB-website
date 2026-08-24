const data = window.siteData || { links: [] };

function appendLinkIcon(parent, item) {
  if (item.icon) {
    const icon = document.createElement("i");
    icon.className = item.icon;
    icon.setAttribute("aria-hidden", "true");
    parent.appendChild(icon);
  }
}

function makeButton(item, showText) {
  const a = document.createElement("a");
  a.className = "link-button";
  a.href = item.url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.setAttribute("aria-label", item.label);

  appendLinkIcon(a, item);

  if (showText) {
    const label = document.createElement("span");
    label.textContent = item.label;
    a.appendChild(label);
  } else {
    a.classList.add("icon-only");
  }

  return a;
}

function renderLinks() {
  const container = document.getElementById("link-buttons");
  if (!container) return;
  data.links.forEach((link) => {
    container.appendChild(makeButton(link, false));
  });
}

function renderNavLinks() {
  const container = document.getElementById("nav-social-links");
  if (!container) return;
  data.links.forEach((link) => {
    container.appendChild(makeButton(link, false));
  });
}

function renderContactLinks() {
  const container = document.getElementById("contact-links");
  if (!container) return;
  data.links.forEach((link) => {
    container.appendChild(makeButton(link, true));
  });
}

function makeCard(item, clickable) {
  const card = document.createElement(clickable ? "a" : "article");
  card.className = "card-item";

  if (clickable) {
    card.href = item.url || "#";
    card.target = "_blank";
    card.rel = "noopener noreferrer";
  }

  const image = document.createElement("img");
  image.src = item.image;
  image.alt = item.title;

  const meta = document.createElement("div");
  meta.className = "card-meta";

  const title = document.createElement("div");
  title.className = "card-title";
  title.textContent = item.title;

  const subtitle = document.createElement("div");
  subtitle.className = "card-subtitle";
  subtitle.textContent = item.subtitle || "";

  meta.append(title, subtitle);
  card.append(image, meta);
  return card;
}

function formatShowListLine(show) {
  if (show.date && show.label) return `${show.date} - ${show.label}`;
  return show.label || show.date || "";
}

function renderShowListItems(list, shows) {
  if (!list || !Array.isArray(shows)) return;
  shows.forEach((show) => {
    const item = document.createElement("li");
    item.textContent = formatShowListLine(show);
    list.appendChild(item);
  });
}

function renderUpcomingShowListItems(list, shows) {
  if (!list || !Array.isArray(shows)) return;
  shows.forEach((show) => {
    const item = document.createElement("li");
    item.className = "shows-list-item";

    const details = document.createElement("span");
    details.className = "shows-list-details";
    details.textContent = formatShowListLine(show);

    item.appendChild(details);

    const ticketUrl = show.ticketUrl || show.url;
    if (ticketUrl) {
      const ticketLink = document.createElement("a");
      ticketLink.className = "link-button shows-ticket-button";
      ticketLink.href = ticketUrl;
      ticketLink.target = "_blank";
      ticketLink.rel = "noopener noreferrer";
      ticketLink.textContent = "Get Tickets";
      item.appendChild(ticketLink);
    }

    list.appendChild(item);
  });
}

function renderShows() {
  const upcoming = data.upcomingShows || [];
  const upcomingSection = document.getElementById("upcoming-shows-section");
  const upcomingList = document.getElementById("upcoming-shows-list");
  const empty = document.getElementById("upcoming-shows-empty");

  if (upcoming.length > 0) {
    if (upcomingSection) upcomingSection.hidden = false;
    if (empty) empty.hidden = true;
    renderUpcomingShowListItems(upcomingList, upcoming);
  } else {
    if (upcomingSection) upcomingSection.hidden = true;
    if (empty) empty.hidden = false;
  }

  const pastContainer = document.getElementById("past-shows-list");
  const years = data.pastShowsByYear || [];
  if (!pastContainer) return;

  years.forEach(({ year, shows }) => {
    const yearBlock = document.createElement("section");
    yearBlock.className = "shows-year";

    const heading = document.createElement("h3");
    heading.className = "shows-year-title";
    heading.textContent = year;

    const list = document.createElement("ul");
    list.className = "shows-list";
    renderShowListItems(list, shows);

    yearBlock.append(heading, list);
    pastContainer.appendChild(yearBlock);
  });
}

function renderMusicGrid() {
  const container = document.getElementById("music-grid");
  if (!container || !Array.isArray(data.music)) return;
  data.music.forEach((item) => container.appendChild(makeCard(item, true)));
}

function renderFeaturedVideo() {
  const iframe = document.getElementById("featured-video");
  const fallback = document.getElementById("video-fallback");
  const hint = document.getElementById("video-local-hint");
  const video = data.featuredVideo;
  if (!iframe || !video?.id) return;

  const watchUrl = `https://www.youtube.com/watch?v=${video.id}`;
  const thumbUrl = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
  const canEmbed =
    window.location.protocol === "http:" || window.location.protocol === "https:";

  iframe.title = video.title || iframe.title;

  if (!canEmbed) {
    iframe.hidden = true;
    if (fallback) {
      fallback.hidden = false;
      fallback.href = watchUrl;
      const thumb = fallback.querySelector("img");
      if (thumb) {
        thumb.src = thumbUrl;
        thumb.alt = video.title || "Video thumbnail";
      }
    }
    if (hint) hint.hidden = false;
    return;
  }

  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    origin: window.location.origin,
  });

  iframe.src = `https://www.youtube.com/embed/${video.id}?${params.toString()}`;
}

function initMailingListForm() {
  const form = document.getElementById("mailing-list-form");
  if (!form) return;

  const config = data.mailingList || {};
  const status = document.getElementById("mailing-form-status");
  const emailInput = document.getElementById("mailing-email");
  const nameField = document.getElementById("mailing-name-field");
  const nameInput = document.getElementById("mailing-name");
  const hiddenContainer = document.getElementById("mailing-hidden-fields");

  const showStatus = (message, type) => {
    if (!status) return;
    status.textContent = message;
    status.hidden = !message;
    status.classList.toggle("is-error", type === "error");
    status.classList.toggle("is-success", type === "success");
  };

  if (new URLSearchParams(window.location.search).has("subscribed")) {
    showStatus("You're on the list. Thanks for joining.", "success");
  }

  if (emailInput && config.emailFieldName) {
    emailInput.name = config.emailFieldName;
  }

  if (nameField && nameInput && config.nameFieldName) {
    nameField.hidden = false;
    nameInput.name = config.nameFieldName;
  }

  if (hiddenContainer && Array.isArray(config.hiddenFields)) {
    config.hiddenFields.forEach(({ name, value }) => {
      if (!name) return;
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value ?? "";
      hiddenContainer.appendChild(input);
    });
  }

  if (config.formAction) {
    form.action = config.formAction;
    form.method = (config.method || "post").toLowerCase();
    if (config.openInNewTab) {
      form.target = "_blank";
      form.rel = "noopener noreferrer";
    }
  }

  form.addEventListener("submit", (event) => {
    if (!config.formAction) {
      event.preventDefault();
      showStatus(
        "Mailing list signup is not configured yet. Add your provider URL to mailingList.formAction in site-data.js.",
        "error"
      );
      return;
    }
    showStatus("", null);
  });
}

function initMobileNav() {
  const header = document.querySelector(".site-nav");
  const menu = header?.querySelector(".nav-menu");
  if (!header || !menu) return;

  if (!menu.id) menu.id = "site-nav-menu";

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "nav-toggle";
  toggle.setAttribute("aria-controls", menu.id);
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Open menu");
  toggle.innerHTML =
    '<i class="fa-solid fa-bars nav-toggle-icon nav-toggle-open" aria-hidden="true"></i>' +
    '<i class="fa-solid fa-xmark nav-toggle-icon nav-toggle-close" aria-hidden="true"></i>';

  header.insertBefore(toggle, menu);

  const setOpen = (open) => {
    header.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (open) header.classList.remove("nav-hidden");
  };

  toggle.addEventListener("click", () => {
    setOpen(!header.classList.contains("nav-open"));
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });

  window.matchMedia("(min-width: 761px)").addEventListener("change", (event) => {
    if (event.matches) setOpen(false);
  });
}

function initScrollNav() {
  const header = document.querySelector(".site-nav");
  if (!header) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  const setNavHeight = () => {
    document.documentElement.style.setProperty("--nav-height", `${header.offsetHeight}px`);
  };

  const setHidden = (hidden) => {
    header.classList.toggle("nav-hidden", hidden);
  };

  setNavHeight();
  window.addEventListener("resize", setNavHeight);

  const onScroll = () => {
    const currentScrollY = window.scrollY;
    const delta = currentScrollY - lastScrollY;

    if (header.classList.contains("nav-open")) {
      lastScrollY = currentScrollY;
      return;
    }

    if (currentScrollY <= 16) {
      setHidden(false);
    } else if (delta > 8) {
      setHidden(true);
    } else if (delta < -5) {
      setHidden(false);
    }

    lastScrollY = currentScrollY;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
    },
    { passive: true }
  );
}

renderLinks();
renderNavLinks();
renderContactLinks();
renderShows();
renderMusicGrid();
renderFeaturedVideo();
initMailingListForm();
initMobileNav();
initScrollNav();
