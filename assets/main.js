document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
    });
  }

  const items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add("in"));
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // YouTube: load the player only when clicked (faster page, no tracking until play)
  document.querySelectorAll("a[data-yt]").forEach((a) => {
    a.addEventListener("click", (ev) => {
      ev.preventDefault();
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube-nocookie.com/embed/${a.dataset.yt}?autoplay=1`;
      iframe.title = a.getAttribute("aria-label") || "YouTube video";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      const wrapper = document.createElement("div");
      wrapper.className = "video";
      wrapper.appendChild(iframe);
      a.replaceWith(wrapper);
    });
  });

  // Lightbox for gallery photos (arrow keys / buttons to navigate, Esc or click to close)
  const shots = [...document.querySelectorAll("a[data-lightbox]")];
  let box = null, index = 0;
  const show = (i) => {
    index = (i + shots.length) % shots.length;
    box.querySelector("img").src = shots[index].href;
    box.querySelector("img").alt = shots[index].querySelector("img").alt;
  };
  const close = () => { box?.remove(); box = null; };
  shots.forEach((a, i) => a.addEventListener("click", (ev) => {
    ev.preventDefault();
    box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML = '<img alt=""><button class="prev" aria-label="Previous">&#8249;</button><button class="next" aria-label="Next">&#8250;</button>';
    box.addEventListener("click", (e) => {
      if (e.target.classList.contains("prev")) show(index - 1);
      else if (e.target.classList.contains("next")) show(index + 1);
      else close();
    });
    document.body.appendChild(box);
    show(i);
  }));
  document.addEventListener("keydown", (e) => {
    if (!box) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });

  // Contact forms open the visitor's mail client (no backend needed on GitHub Pages)
  document.querySelectorAll("form[data-mailto]").forEach((form) => {
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const data = new FormData(form);
      const subject = encodeURIComponent(data.get("subject") || "Website enquiry");
      const body = encodeURIComponent(
        `Name: ${data.get("name") || ""}\nEmail: ${data.get("email") || ""}\n\n${data.get("message") || ""}`
      );
      window.location.href = `mailto:${form.dataset.mailto}?subject=${subject}&body=${body}`;
    });
  });
});
