document.documentElement.classList.remove("no-js");

const accentStarField = document.createElement("div");
accentStarField.className = "accent-star-field";
accentStarField.setAttribute("aria-hidden", "true");

[
  "gold-satin.png",
  "silver-embroidered.png",
  "gold-embroidered.png",
  "newsprint.png",
  "gold-embroidered.png",
  "silver-embroidered.png",
  "mustard-crayon.png",
].forEach((asset, index) => {
  const star = document.createElement("img");
  star.className = `accent-star accent-star-${index + 1}`;
  star.src = `assets/decor/stars/${asset}`;
  star.alt = "";
  star.decoding = "async";
  accentStarField.appendChild(star);
});

document.body.prepend(accentStarField);

const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#site-nav");

function closeNavigation() {
  nav?.classList.remove("open");
  toggle?.setAttribute("aria-expanded", "false");
  toggle?.setAttribute("aria-label", "Open navigation");
}

toggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("open") ?? false;
  toggle.setAttribute("aria-expanded", String(isOpen));
  toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNavigation));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeNavigation();
});

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());

const copyEmailButton = document.querySelector("[data-copy-email]");
copyEmailButton?.addEventListener("click", async () => {
  const email = copyEmailButton.dataset.copyEmail;

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(email);
    } else {
      const temporaryInput = document.createElement("textarea");
      temporaryInput.value = email;
      temporaryInput.setAttribute("readonly", "");
      temporaryInput.style.position = "fixed";
      temporaryInput.style.opacity = "0";
      document.body.appendChild(temporaryInput);
      temporaryInput.select();
      document.execCommand("copy");
      temporaryInput.remove();
    }

    copyEmailButton.textContent = "Email copied!";
    window.setTimeout(() => {
      copyEmailButton.textContent = email;
    }, 2200);
  } catch {
    copyEmailButton.textContent = "Copy failed — select email";
  }
});
