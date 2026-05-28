(function () {
  const header = document.querySelector(".site-header");
  const headerHeight = header ? header.offsetHeight : 80;
  const gnbLinks = Array.from(document.querySelectorAll(".gnb-link"));
  const sectionMap = gnbLinks
    .map((link) => {
      const hash = link.getAttribute("href");
      if (!hash || !hash.startsWith("#")) return null;
      const section = document.querySelector(hash);
      if (!section) return null;
      return { link, section };
    })
    .filter(Boolean);

  /* GNB smooth section navigation */
  gnbLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const hash = link.getAttribute("href");
      if (!hash || !hash.startsWith("#")) return;
      const target = document.querySelector(hash);
      if (!target) return;

      event.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  const syncActiveGnb = () => {
    if (sectionMap.length === 0) return;
    const pivot = window.scrollY + headerHeight + 24;

    let active = sectionMap[0];
    sectionMap.forEach((item) => {
      if (item.section.offsetTop <= pivot) active = item;
    });

    sectionMap.forEach((item) => {
      item.link.classList.toggle("is-active", item === active);
    });
  };

  /* Reveal animation: 30px bottom-up */
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -30px 0px" }
    );
    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("is-visible"));
  }

  /* Count-up numbers when metrics section enters viewport */
  const counters = document.querySelectorAll(".count-up");
  const runCountUp = (el) => {
    const target = Number(el.getAttribute("data-target") || 0);
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const metricArea = document.querySelector(".why__metrics");
  if (metricArea && counters.length > 0 && "IntersectionObserver" in window) {
    const metricObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          counters.forEach((counter) => runCountUp(counter));
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.35 }
    );
    metricObserver.observe(metricArea);
  }

  /* Top button show after 400px and smooth scroll */
  const scrollTopBtn = document.querySelector(".scroll-top");
  if (scrollTopBtn) {
    const toggleScrollTop = () => {
      scrollTopBtn.hidden = window.scrollY <= 400;
      if (header) {
        header.classList.toggle("is-sticky", window.scrollY > 400);
      }
      syncActiveGnb();
    };

    toggleScrollTop();
    window.addEventListener("scroll", toggleScrollTop, { passive: true });
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* Prevent dummy project links from jumping to top */
  document.querySelectorAll(".project-card[href='#']").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
    });
  });

  syncActiveGnb();
})();
