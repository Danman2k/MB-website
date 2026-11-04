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
  ["contact-links", "footer-links"].forEach((id) => {
    const container = document.getElementById(id);
    if (!container) return;
    const showText = id === "contact-links";
    data.links.forEach((link) => container.appendChild(makeButton(link, showText)));
  });
}

function makeLinkButton(label, url, variant, options = {}) {
  const a = document.createElement("a");
  a.className = `btn btn-${variant}`;
  a.href = url;
  if (options.download) {
    a.setAttribute("download", "");
  } else {
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  }
  a.textContent = label;
  return a;
}

function makeTag(text) {
  const tag = document.createElement("span");
  tag.className = "tag";
  tag.textContent = text;
  return tag;
}

// Dates in site-data.js are M/D/YY.
function parseShowDate(value) {
  const parts = String(value || "").split("/").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
  const [month, day, year] = parts;
  return new Date(year < 100 ? 2000 + year : year, month - 1, day);
}

function formatShowDate(value) {
  const date = parseShowDate(value);
  if (!date) return value || "";
  return date
    .toLocaleDateString("en-US", { month: "short", day: "numeric" })
    .toUpperCase();
}

function splitShowLabel(label) {
  const text = label || "";
  const comma = text.indexOf(", ");
  if (comma === -1) return { venue: text, city: "" };
  return { venue: text.slice(0, comma), city: text.slice(comma + 2) };
}

function makeShowRow(show, upcoming) {
  const item = document.createElement("li");
  item.className = upcoming ? "show-row show-row--upcoming" : "show-row";

  const date = document.createElement("span");
  date.className = "label show-row-date";
  date.textContent = formatShowDate(show.date);

  const { venue, city } = splitShowLabel(show.label);
  const place = document.createElement("span");
  const venueEl = document.createElement("span");
  venueEl.className = "show-row-venue";
  venueEl.textContent = venue;
  place.appendChild(venueEl);
  if (show.tag) {
    place.append(" ");
    place.appendChild(makeTag(show.tag));
  }
  if (city) {
    const cityEl = document.createElement("span");
    cityEl.className = "show-row-city";
    cityEl.textContent = city;
    place.appendChild(cityEl);
  }

  item.append(date, place);

  const ticketUrl = show.ticketUrl || show.url;
  if (upcoming && ticketUrl) {
    item.appendChild(makeLinkButton("Tickets", ticketUrl, "primary"));
  }
  return item;
}

function renderShows() {
  const upcoming = data.upcomingShows || [];
  const years = data.pastShowsByYear || [];
  const upcomingSection = document.getElementById("upcoming-shows-section");
  const upcomingList = document.getElementById("upcoming-shows-list");
  const empty = document.getElementById("upcoming-shows-empty");

  if (upcomingSection) upcomingSection.hidden = upcoming.length === 0;
  if (empty) empty.hidden = upcoming.length > 0;
  upcoming.forEach((show) => upcomingList?.appendChild(makeShowRow(show, true)));

  const pastContainer = document.getElementById("past-shows-list");
  if (!pastContainer) return;

  years.forEach(({ year, shows }, index) => {
    const yearBlock = document.createElement("details");
    yearBlock.className = "shows-year";
    if (index === 0) yearBlock.open = true;

    const summary = document.createElement("summary");
    const heading = document.createElement("h4");
    heading.textContent = year;
    const total = document.createElement("span");
    total.className = "label";
    total.textContent = `${shows.length} ${shows.length === 1 ? "show" : "shows"}`;
    summary.append(heading, total);

    const list = document.createElement("ul");
    list.className = "show-rows";
    shows.forEach((show) => list.appendChild(makeShowRow(show, false)));

    yearBlock.append(summary, list);
    pastContainer.appendChild(yearBlock);
  });
}

function renderHeroNext() {
  const el = document.getElementById("hero-next");
  const next = (data.upcomingShows || [])[0];
  if (!el || !next) return;
  const { venue, city } = splitShowLabel(next.label);
  el.textContent = "Next: ";
  const strong = document.createElement("strong");
  strong.textContent = `${formatShowDate(next.date)} · ${venue}${city ? `, ${city}` : ""}`;
  el.appendChild(strong);
  el.hidden = false;
}

function injectEventSchema() {
  const shows = data.upcomingShows || [];
  if (!shows.length) return;
  const events = shows
    .map((show) => {
      const date = parseShowDate(show.date);
      if (!date) return null;
      const { venue, city } = splitShowLabel(show.label);
      const event = {
        "@type": "MusicEvent",
        name: `Mindfully Blind at ${venue}`,
        startDate: date.toISOString().slice(0, 10),
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: { "@type": "Place", name: venue, address: city || venue },
        performer: { "@id": "https://mindfullyblind.com/#band" },
      };
      const ticketUrl = show.ticketUrl || show.url;
      if (ticketUrl) event.offers = { "@type": "Offer", url: ticketUrl };
      return event;
    })
    .filter(Boolean);
  if (!events.length) return;
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": events });
  document.head.appendChild(script);
}

function makeRelease(item, featured) {
  const release = document.createElement("article");
  release.className = featured ? "release release--featured reveal" : "release reveal";

  const art = document.createElement("a");
  art.className = "release-art";
  art.href = item.url || "#";
  art.target = "_blank";
  art.rel = "noopener noreferrer";
  art.setAttribute("aria-label", `Listen to ${item.title} on ${item.subtitle || "Spotify"}`);

  const image = document.createElement("img");
  image.src = item.image;
  image.alt = `${item.title} album art`;
  image.width = 1024;
  image.height = 1024;
  image.loading = "lazy";
  art.appendChild(image);
  if (item.isNew) art.appendChild(makeTag("New"));

  const title = document.createElement("h3");
  title.className = "release-title";
  title.textContent = item.title;

  const links = document.createElement("div");
  links.className = "release-links";
  const platforms = [
    { label: item.subtitle || "Spotify", url: item.url },
    ...(Array.isArray(item.links) ? item.links : []),
  ].filter((platform) => platform.url);
  platforms.forEach((platform, index) => {
    links.appendChild(
      makeLinkButton(platform.label, platform.url, featured && index === 0 ? "primary" : "secondary")
    );
  });

  release.append(art, title, links);
  return release;
}

function renderMusicGrid() {
  const container = document.getElementById("music-grid");
  if (!container || !Array.isArray(data.music)) return;
  data.music.forEach((item, index) => container.appendChild(makeRelease(item, index === 0)));
}

function renderWatchVideo() {
  const container = document.getElementById("watch-video");
  const video = data.featuredVideo;
  if (!container || !video?.id) return;

  const watchUrl = `https://www.youtube.com/watch?v=${video.id}`;
  const canEmbed =
    window.location.protocol === "http:" || window.location.protocol === "https:";

  // Lite embed: show the thumbnail and only load YouTube when someone presses play.
  const button = document.createElement(canEmbed ? "button" : "a");
  button.className = "video-lite-button";
  if (canEmbed) {
    button.type = "button";
  } else {
    button.href = watchUrl;
    button.target = "_blank";
    button.rel = "noopener noreferrer";
  }
  button.setAttribute("aria-label", `Play ${video.title || "video"}`);
  button.innerHTML =
    '<span class="video-play" aria-hidden="true"><i class="fa-solid fa-play"></i></span>' +
    '<span class="label video-label">Play video</span>';

  const thumb = document.createElement("img");
  thumb.src = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
  thumb.alt = "";
  thumb.loading = "lazy";
  button.prepend(thumb);

  if (canEmbed) {
    button.addEventListener("click", () => {
      const params = new URLSearchParams({ rel: "0", autoplay: "1", origin: window.location.origin });
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube.com/embed/${video.id}?${params.toString()}`;
      iframe.title = video.title || "Mindfully Blind music video";
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      iframe.allowFullscreen = true;
      container.replaceChildren(iframe);
    });
  }

  container.appendChild(button);
}

function renderFooter() {
  const year = document.getElementById("footer-year");
  if (year) year.textContent = new Date().getFullYear();
}

function initReveal() {
  const items = Array.from(document.querySelectorAll(".reveal"));
  if (!items.length) return;
  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -10% 0px" }
  );
  items.forEach((item, index) => {
    item.style.setProperty("--reveal-delay", `${(index % 3) * 40}ms`);
    observer.observe(item);
  });
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

function initSectionNav() {
  const sections = Array.from(document.querySelectorAll(".site-section[id]"));
  const navLinks = Array.from(document.querySelectorAll(".nav-menu a[data-section]"));
  if (!sections.length || !navLinks.length) return;

  const sectionById = new Map(sections.map((section) => [section.id, section]));

  const setActiveSection = (sectionId) => {
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.dataset.section === sectionId);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (!visible.length) return;
      setActiveSection(visible[0].target.id);
    },
    {
      root: null,
      rootMargin: "-35% 0px -45% 0px",
      threshold: [0, 0.15, 0.35, 0.55],
    }
  );

  sections.forEach((section) => observer.observe(section));

  const scrollToSection = (sectionId) => {
    const section = sectionById.get(sectionId);
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${sectionId}`);
    setActiveSection(sectionId);
  };

  document.querySelectorAll("a[data-section]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const sectionId = link.dataset.section || link.getAttribute("href")?.slice(1);
      if (!sectionId || !sectionById.has(sectionId)) return;
      event.preventDefault();
      scrollToSection(sectionId);
    });
  });

  document.querySelector(".brand")?.addEventListener("click", (event) => {
    if (!sectionById.has("home")) return;
    event.preventDefault();
    scrollToSection("home");
  });

  const initialSection = window.location.hash.replace("#", "");
  if (initialSection && sectionById.has(initialSection)) {
    requestAnimationFrame(() => scrollToSection(initialSection));
  } else {
    setActiveSection("home");
  }
}

renderLinks();
renderNavLinks();
renderContactLinks();
renderShows();
renderHeroNext();
injectEventSchema();
renderMusicGrid();
renderWatchVideo();
renderFeaturedVideo();
renderFooter();
initReveal();
initMobileNav();
initScrollNav();
initSectionNav();
