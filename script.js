const lazyVideos = document.querySelectorAll("video[data-src]");

const hydrateVideo = (video) => {
  if (!video.src) {
    video.src = video.dataset.src;
    video.load();
  }
};

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          hydrateVideo(video);
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    },
    { rootMargin: "360px 0px" },
  );

  lazyVideos.forEach((video) => observer.observe(video));
} else {
  lazyVideos.forEach((video) => {
    hydrateVideo(video);
    video.play().catch(() => {});
  });
}

document.querySelectorAll("[data-comparison-viewer]").forEach((viewer) => {
  const track = viewer.querySelector("[data-comparison-track]");
  const slides = Array.from(viewer.querySelectorAll("[data-comparison-slide]"));
  const prevButton = viewer.querySelector("[data-comparison-prev]");
  const nextButton = viewer.querySelector("[data-comparison-next]");
  let currentIndex = 0;

  const updateComparison = () => {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === slides.length - 1;

    slides.forEach((slide, index) => {
      const video = slide.querySelector("video");
      if (!video) {
        return;
      }

      if (index === currentIndex) {
        hydrateVideo(video);
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  };

  prevButton.addEventListener("click", () => {
    currentIndex = Math.max(0, currentIndex - 1);
    updateComparison();
  });

  nextButton.addEventListener("click", () => {
    currentIndex = Math.min(slides.length - 1, currentIndex + 1);
    updateComparison();
  });

  updateComparison();
});
