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
