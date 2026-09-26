// Fountain Information Technology Limited — shared site behaviour

document.addEventListener("DOMContentLoaded", () => {
  // Mobile nav toggle
  const toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("nav-open");
    });
  }

  // Footer year
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Back-to-top button (injected so every page gets it without repeating markup)
  const backToTop = document.createElement("button");
  backToTop.className = "back-to-top";
  backToTop.type = "button";
  backToTop.setAttribute("aria-label", "Back to top");
  backToTop.textContent = "↑";
  document.body.appendChild(backToTop);

  window.addEventListener(
    "scroll",
    () => {
      backToTop.classList.toggle("show", window.scrollY > 480);
    },
    { passive: true }
  );

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Scroll-reveal animation for cards, steps, timeline items etc.
  const revealTargets = document.querySelectorAll(
    ".card, .step, .timeline-item, .value-item, .faq-item, .stat-card"
  );
  if (revealTargets.length && "IntersectionObserver" in window) {
    revealTargets.forEach((el) => el.classList.add("reveal"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach((el) => observer.observe(el));
  }

  // Contact form — submits to Web3Forms (web3forms.com), a free service
  // that emails submissions directly to the inbox tied to the access key
  // set in contact.html. No backend or paid plan required.
  const form = document.querySelector("#contact-form");
  if (form) {
    const success = document.querySelector(".form-success");
    const error = document.querySelector(".form-error");
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      success?.classList.remove("show");
      error?.classList.remove("show");

      const accessKey = form.querySelector('[name="access_key"]')?.value;
      if (!accessKey || accessKey === "YOUR_WEB3FORMS_ACCESS_KEY") {
        if (error) {
          error.textContent = "This form isn't connected yet — add a Web3Forms access key in contact.html.";
          error.classList.add("show");
        }
        return;
      }

      const data = Object.fromEntries(new FormData(form));
      data.name = `${data["first-name"] || ""} ${data["last-name"] || ""}`.trim();

      const originalLabel = submitBtn ? submitBtn.textContent : "";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
      }

      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data),
        });
        const result = await response.json();

        if (result.success) {
          success?.classList.add("show");
          success?.scrollIntoView({ behavior: "smooth", block: "center" });
          form.reset();
        } else {
          throw new Error(result.message || "Submission failed");
        }
      } catch (err) {
        if (error) {
          error.textContent = "Something went wrong sending your message. Please try again, or email us directly.";
          error.classList.add("show");
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        }
      }
    });
  }
});
