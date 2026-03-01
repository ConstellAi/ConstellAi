/* ============================================================
   ConstellEi – Interactive Scripts
   - Constellation canvas background
   - Scroll reveal observer
   - Navbar scroll effect
   - Mobile menu toggle
   - Card spotlight tracking
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  // ── Page Loader ──────────────────────────────────────────
  const loader = document.querySelector(".page-loader");
  if (loader) {
    window.addEventListener("load", () => {
      setTimeout(() => loader.classList.add("hidden"), 300);
    });
    // Fallback: hide after 2s regardless
    setTimeout(() => loader.classList.add("hidden"), 2000);
  }

  // ── Constellation Canvas ─────────────────────────────────
  const canvas = document.getElementById("constellation-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let w,
      h,
      stars = [],
      mouse = { x: null, y: null };
    const STAR_COUNT = 120;
    const CONNECTION_DIST = 150;
    const MOUSE_DIST = 200;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function createStars() {
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.5 + 0.3,
        });
      }
    }

    function drawStars() {
      ctx.clearRect(0, 0, w, h);

      // Draw connections
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.15;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(123, 94, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.stroke();
          }
        }

        // Mouse connections
        if (mouse.x !== null) {
          const dx = stars[i].x - mouse.x;
          const dy = stars[i].y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_DIST) {
            const alpha = (1 - dist / MOUSE_DIST) * 0.3;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      // Draw stars
      stars.forEach((s) => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230, 225, 255, ${s.opacity})`;
        ctx.fill();

        // Move
        s.x += s.vx;
        s.y += s.vy;

        // Wrap around edges
        if (s.x < -10) s.x = w + 10;
        if (s.x > w + 10) s.x = -10;
        if (s.y < -10) s.y = h + 10;
        if (s.y > h + 10) s.y = -10;
      });

      requestAnimationFrame(drawStars);
    }

    resize();
    createStars();
    drawStars();

    window.addEventListener("resize", () => {
      resize();
      createStars();
    });
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener("mouseout", () => {
      mouse.x = null;
      mouse.y = null;
    });
  }

  // ── Scroll Reveal ────────────────────────────────────────
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    reveals.forEach((el) => observer.observe(el));
  }

  // ── Navbar Scroll ────────────────────────────────────────
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    window.addEventListener(
      "scroll",
      () => {
        navbar.classList.toggle("scrolled", window.scrollY > 40);
      },
      { passive: true },
    );
  }

  // ── Mobile Menu Toggle ───────────────────────────────────
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
    // Close on link click
    navLinks.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => navLinks.classList.remove("open"));
    });
  }

  // ── Card Spotlight Tracking ──────────────────────────────
  document.querySelectorAll(".use-case-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mouse-x", x + "%");
      card.style.setProperty("--mouse-y", y + "%");
    });
  });

  // ── Smooth Anchor Scrolling ──────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
});
