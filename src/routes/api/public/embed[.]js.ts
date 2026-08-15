import { createFileRoute } from "@tanstack/react-router";

/**
 * Host-page helper served from the studio app itself, so a WordPress page only
 * ever needs one script tag. It creates (or upgrades) an iframe and keeps its
 * height in sync with the embedded studio pages.
 */
const SCRIPT = `(function () {
  function mount(el) {
    if (el.dataset.hlsMounted === "1") return;
    el.dataset.hlsMounted = "1";
    var src = el.getAttribute("data-hls-src");
    if (!src) return;
    var frame = document.createElement("iframe");
    frame.src = src;
    frame.title = el.getAttribute("data-hls-title") || "High Light Source Film Studios";
    frame.loading = "lazy";
    frame.setAttribute("allow", "clipboard-write; fullscreen");
    frame.style.width = "100%";
    frame.style.border = "0";
    frame.style.display = "block";
    frame.style.minHeight = (el.getAttribute("data-hls-min-height") || "900") + "px";
    el.appendChild(frame);
    el.__hlsFrame = frame;
  }

  function init() {
    var nodes = document.querySelectorAll("[data-hls-embed]");
    for (var i = 0; i < nodes.length; i++) mount(nodes[i]);
  }

  window.addEventListener("message", function (event) {
    var data = event.data;
    if (!data || data.type !== "hls:embed:height") return;
    var nodes = document.querySelectorAll("[data-hls-embed]");
    for (var i = 0; i < nodes.length; i++) {
      var frame = nodes[i].__hlsFrame;
      if (frame && frame.contentWindow === event.source) {
        frame.style.height = data.height + "px";
        frame.style.minHeight = "0px";
      }
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();`;

export const Route = createFileRoute("/api/public/embed.js")({
  server: {
    handlers: {
      GET: async () =>
        new Response(SCRIPT, {
          headers: {
            "Content-Type": "application/javascript; charset=utf-8",
            "Cache-Control": "public, max-age=300",
            "Access-Control-Allow-Origin": "*",
          },
        }),
    },
  },
});
