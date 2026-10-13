(function () {
  "use strict";

  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const header = document.getElementById("siteHeader");
  const backToTop = document.getElementById("backToTop");
  const yearEl = document.getElementById("year");


  navToggle.addEventListener("click", function () {
    const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isExpanded));
    navToggle.classList.toggle("active");
    navLinks.classList.toggle("open");
  });


  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("open");
      navToggle.classList.remove("active");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });


  function handleScroll() {
    header.classList.toggle("scrolled", window.scrollY > 10);
    backToTop.classList.toggle("show", window.scrollY > 400);
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });


  const sections = document.querySelectorAll("section[id]");
  const navAnchors = document.querySelectorAll(".nav-link");

  const spy = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navAnchors.forEach(function (anchor) {
            anchor.classList.toggle("active", anchor.getAttribute("href") === "#" + id);
          });
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  sections.forEach(function (section) {
    spy.observe(section);
  });


  const revealEls = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });


  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const text = btn.getAttribute("data-copy");
      copyText(text);
    });
  });

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(function () { showToast("Copied: " + text); })
        .catch(function () { fallbackCopy(text); });
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      showToast("Copied: " + text);
    } catch (err) {
      showToast("Copy failed — please copy manually.");
    }
    document.body.removeChild(textarea);
  }


  let toastTimer = null;

  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 2200);
  }


  yearEl.textContent = new Date().getFullYear();
})();
