import { useEffect, useRef, useState } from "react";
import { PROJECTS } from "../data/work";

/* ── Lazy video — starts playing only when visible ────────────────────── */
function LazyVideo({ src, className, style }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.src = src; el.play().catch(() => {}); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [src]);
  return (
    <video
      ref={ref}
      loop muted playsInline
      className={className || "w-full block"}
      style={{ borderRadius: "0.3rem", pointerEvents: "none", ...(style || {}) }}
    />
  );
}

/* ── Media grid — per-project layout ─────────────────────────────────── */
function ProjectMedia({ project }) {
  /* 2-col projects */
  const is2col = project.cols === 2;

  return (
    <div
      className="proj-media w-full"
      style={{
        display: "grid",
        gridTemplateColumns: is2col ? "1fr 1fr" : "1fr 1fr 1fr 1fr",
        gap: "8px",
      }}
    >
      {project.media.map((m, i) => {
        /* For 1-col (4-col grid) projects, each item spans all 4 cols */
        const spanStyle = !is2col ? { gridColumn: "1 / -1" } : {};
        return m.type === "video" ? (
          <LazyVideo
            key={i}
            src={m.src}
            style={{ ...spanStyle, borderRadius: "0.3rem", width: "100%" }}
          />
        ) : (
          <img
            key={i}
            src={m.src}
            alt=""
            loading="lazy"
            className="w-full block"
            style={{ borderRadius: "0.3rem", pointerEvents: "none", ...spanStyle }}
          />
        );
      })}
    </div>
  );
}

/* ── Main WorkSection ─────────────────────────────────────────────────── */
export default function WorkSection() {
  const [activeId, setActiveId] = useState(PROJECTS[0].id);
  const itemRefs    = useRef({});
  const headlineRef = useRef(null);

  /* IntersectionObserver — track active project in sidebar */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) setActiveId(e.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    PROJECTS.forEach(p => {
      const el = itemRefs.current[p.id];
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  /* GSAP animations */
  useEffect(() => {
    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger }  = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      /* headline word reveal */
      const words = headlineRef.current?.querySelectorAll(".ww");
      const tSpan = headlineRef.current?.querySelector(".t-span");
      if (words) {
        gsap.set(words, { yPercent: 110 });
        gsap.to(words, {
          yPercent: 0, duration: 1, ease: "power3.out",
          stagger: 0.05, delay: 0.2,
        });
      }
      if (tSpan) {
        gsap.fromTo(tSpan,
          { opacity: 0.01, x: -10 },
          { opacity: 1, x: 0, duration: 0.8, ease: "power3.out", delay: 0.1 }
        );
      }

      /* project info cols slide in on scroll */
      document.querySelectorAll(".proj-col").forEach(el => {
        const i = +el.dataset.col;
        gsap.fromTo(el,
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: i * 0.08,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }
        );
      });

      /* media reveal */
      document.querySelectorAll(".proj-media").forEach(el => {
        gsap.fromTo(el,
          { opacity: 0, scale: 0.97 },
          {
            opacity: 1, scale: 1, duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          }
        );
      });
    })();
  }, []);

  const scrollToProject = (id) => {
    const el = itemRefs.current[id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const HEADLINE = "Passionate about the craft and little details";

  return (
    <div
      data-nav="grey"
      className="flex w-screen"
      style={{ background: "var(--bg-grey)", alignItems: "flex-start" }}
    >
      {/* ── Sticky sidebar navigation ── */}
      <nav
        className="work-sidebar sticky top-0 flex flex-col justify-center overflow-y-auto"
        style={{ width: "14vw", height: "100vh", paddingLeft: "4vw", zIndex: 50, flexShrink: 0 }}
      >
        <ul className="flex flex-col list-none m-0 p-0" style={{ gap: "0.15rem" }}>
          {PROJECTS.map(p => {
            const isActive = activeId === p.id;
            return (
              <li key={p.id} style={{ height: "2rem", display: "flex", alignItems: "center" }}>
                <button
                  onClick={() => scrollToProject(p.id)}
                  className="flex items-center text-left border-none bg-transparent cursor-pointer"
                  style={{
                    gap: "0.6rem",
                    paddingLeft: "8px",
                    paddingRight: isActive ? "8px" : "0",
                    marginLeft: "-8px",
                    background: isActive ? "rgba(0,0,0,0.05)" : "transparent",
                    borderRadius: "22px",
                    fontFamily: "var(--font)",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "var(--grey)",
                    whiteSpace: "nowrap",
                    height: "100%",
                    transition: "background 0.2s",
                  }}
                >
                  {/* dot */}
                  <span
                    className="shrink-0 rounded-full"
                    style={{
                      width: "0.3rem", height: "0.3rem",
                      background: isActive ? "var(--blue)" : "var(--grey)",
                      opacity: isActive ? 1 : 0.5,
                      flexShrink: 0,
                    }}
                  />
                  {isActive && <span>{p.title.split("\n")[0]}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Main content ── */}
      <div
        className="work-main flex flex-col"
        style={{ width: "86vw", gap: "0", paddingRight: "4vw" }}
      >
        {/* Hero */}
        <div
          className="work-hero flex flex-col justify-end relative"
          style={{ width: "71vw", height: "32vw", margin: "9vw 0" }}
        >
          <h1
            ref={headlineRef}
            className="work-headline m-0"
            style={{
              color: "var(--grey)",
              fontFamily: "var(--font)",
              fontSize: "7vw",
              fontWeight: 600,
              lineHeight: "105%",
              letterSpacing: "-0.3vw",
            }}
          >
            <span
              className="t-span opacity-0 invisible"
              style={{ color: "var(--orange1)", marginRight: "0.15em" }}
            >---</span>
            {HEADLINE.split(" ").map((word, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom" style={{ paddingBottom: "0.05em" }}>
                <span className="ww inline-block">{word}{i < HEADLINE.split(" ").length - 1 ? "\u00A0" : ""}</span>
              </span>
            ))}
          </h1>

          {/* Folder — bottom-left, small, reference exact */}
          <img
            src="/images/folder-juanmora.png"
            alt=""
            loading="lazy"
            className="absolute pointer-events-none"
            style={{ left: 0, top: "8.4vw", width: "7.6vw" }}
          />
        </div>

        {/* Project items */}
        <div className="flex flex-col w-full">
          {PROJECTS.map(p => (
            <div
              key={p.id}
              id={p.id}
              ref={el => { itemRefs.current[p.id] = el; }}
              className="work-card w-full flex flex-col relative"
              style={{
                background: "#fff",
                padding: "4rem 8px 8px",
                gap: "3rem",
                marginBottom: "8vw",
              }}
            >
              {/* accent dot */}
              <div
                className="absolute rounded-[10px]"
                style={{
                  width: "0.3rem", height: "0.3rem",
                  background: "var(--orange1)",
                  top: "1.6rem", left: "1rem",
                }}
              />

              {/* 4-col info grid */}
              <div
                className="work-info-grid w-full"
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "16px", alignItems: "start" }}
              >
                {/* col 1: title + year + CTA */}
                <div className="proj-col flex flex-col" data-col="0" style={{ gap: "1rem", paddingLeft: "1rem", width: "95%" }}>
                  <h3
                    className="m-0 whitespace-pre-line"
                    style={{
                      color: "#313131",
                      fontFamily: "var(--font)",
                      fontSize: "1.8rem",
                      fontWeight: 600,
                      lineHeight: "110%",
                    }}
                  >
                    {p.title}
                  </h3>
                  <div
                    className="inline-flex self-start"
                    style={{
                      border: "1px solid rgba(0,0,0,0.12)",
                      borderRadius: "20rem",
                      padding: "0.4rem 0.6rem",
                      fontSize: "0.65rem",
                      fontWeight: 400,
                      color: "var(--grey)",
                      fontFamily: "var(--font)",
                      letterSpacing: "0.02rem",
                      lineHeight: "100%",
                    }}
                  >
                    {p.year}
                  </div>
                  {p.liveUrl && p.liveUrl !== "#" && (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="main-cont-button self-start"
                      style={{ fontSize: "0.8rem" }}
                    >
                      <div className="icon-wrapper-cta-first">
                        <img src="/images/arrow-grey-out.svg" alt="" className="w-[14px] block" />
                      </div>
                      <div className="text-wrapper-cta" style={{ padding: "0.6rem 1rem", fontSize: "0.8rem" }}>
                        See it live
                      </div>
                      <div className="icon-wrapper-cta">
                        <img src="/images/arrow-grey-out.svg" alt="" className="w-[14px] block" />
                      </div>
                    </a>
                  )}
                </div>

                {/* col 2: challenge */}
                <div className="proj-col flex flex-col" data-col="1" style={{ gap: "1rem", width: "90%" }}>
                  <p
                    className="m-0"
                    style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--grey)", fontFamily: "var(--font)", opacity: 0.7 }}
                  >
                    Challenge:
                  </p>
                  <p
                    className="m-0"
                    style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--grey)", fontFamily: "var(--font)", lineHeight: "150%" }}
                  >
                    {p.challenge}
                  </p>
                </div>

                {/* col 3: services */}
                <div className="proj-col flex flex-col" data-col="2" style={{ gap: "1rem", width: "90%" }}>
                  <p
                    className="m-0"
                    style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--grey)", fontFamily: "var(--font)", opacity: 0.7 }}
                  >
                    Services:
                  </p>
                  <div className="flex flex-wrap" style={{ gap: "0.3rem" }}>
                    {p.services.map((s, i) => (
                      <span
                        key={i}
                        style={{
                          border: "1px solid rgba(0,0,0,0.1)",
                          borderRadius: "0.3rem",
                          padding: "0.4rem 0.7rem",
                          fontSize: "0.8rem",
                          fontWeight: 500,
                          color: "var(--grey)",
                          fontFamily: "var(--font)",
                          lineHeight: "100%",
                          background: "#fff",
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* col 4: role */}
                <div className="proj-col flex flex-col" data-col="3" style={{ gap: "1rem", width: "90%" }}>
                  <p
                    className="m-0"
                    style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--grey)", fontFamily: "var(--font)", opacity: 0.7 }}
                  >
                    Role:
                  </p>
                  <p
                    className="m-0"
                    style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--grey)", fontFamily: "var(--font)", lineHeight: "150%" }}
                  >
                    {p.role}
                  </p>
                </div>
              </div>

              {/* media grid */}
              <ProjectMedia project={p} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
