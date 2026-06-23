import { useEffect, useRef, useState } from "react";
import { PROJECTS } from "../data/work";

/* ── Lazy video — starts playing only when visible ────────────────────── */
function LazyVideo({ src }) {
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
      className="w-full block rounded-[0.3rem]"
      style={{ pointerEvents: "none" }}
    />
  );
}

/* ── Single project media grid ────────────────────────────────────────── */
function ProjectMedia({ project }) {
  return (
    <div
      className="w-full"
      style={{
        display: "grid",
        gap: "8px",
        gridTemplateColumns: project.cols === 2 ? "1fr 1fr" : "1fr",
      }}
    >
      {project.media.map((m, i) =>
        m.type === "video" ? (
          <LazyVideo key={i} src={m.src} />
        ) : (
          <img
            key={i}
            src={m.src}
            alt=""
            loading="lazy"
            className="w-full block rounded-[0.3rem]"
            style={{ pointerEvents: "none" }}
          />
        )
      )}
    </div>
  );
}

/* ── Single project block ─────────────────────────────────────────────── */
function ProjectItem({ project, innerRef }) {
  return (
    <div
      id={project.id}
      ref={innerRef}
      className="w-full flex flex-col relative"
      style={{ gap: "3rem", marginBottom: "8vw", padding: "4rem 8px 8px" }}
    >
      {/* blue accent dot */}
      <div
        className="absolute rounded-[10px]"
        style={{
          width: "0.3rem", height: "0.3rem",
          background: "var(--orange1)",
          top: "1.6rem", left: "-0.6rem",
        }}
      />

      {/* 4-col info grid */}
      <div
        className="w-full"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "16px", alignItems: "start" }}
      >
        {/* col 1: title + year + CTA */}
        <div className="flex flex-col gap-4 pl-4">
          <h3
            className="m-0 font-semibold leading-[110%] whitespace-pre-line"
            style={{ color: "#313131", fontFamily: "var(--font)", fontSize: "1.8rem" }}
          >
            {project.title}
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
            {project.year}
          </div>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
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
        <div className="flex flex-col gap-3">
          <span
            className="uppercase font-bold tracking-[0.1em]"
            style={{ fontSize: "0.6rem", color: "var(--grey)", fontFamily: "var(--font)", opacity: 0.6 }}
          >
            Challenge
          </span>
          <p
            className="m-0 font-semibold leading-[150%]"
            style={{ fontSize: "0.85rem", color: "var(--grey)", fontFamily: "var(--font)" }}
          >
            {project.challenge}
          </p>
        </div>

        {/* col 3: services */}
        <div className="flex flex-col gap-3">
          <span
            className="uppercase font-bold tracking-[0.1em]"
            style={{ fontSize: "0.6rem", color: "var(--grey)", fontFamily: "var(--font)", opacity: 0.6 }}
          >
            Services
          </span>
          <div className="flex flex-wrap gap-[0.3rem]">
            {project.services.map((s, i) => (
              <span
                key={i}
                style={{
                  border: "1px solid rgba(53,89,254,0.16)",
                  borderRadius: "0.3rem",
                  padding: "0.4rem 0.7rem",
                  fontSize: "0.8rem",
                  fontWeight: 600,
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
        <div className="flex flex-col gap-3">
          <span
            className="uppercase font-bold tracking-[0.1em]"
            style={{ fontSize: "0.6rem", color: "var(--grey)", fontFamily: "var(--font)", opacity: 0.6 }}
          >
            Role
          </span>
          <p
            className="m-0 font-semibold leading-[150%]"
            style={{ fontSize: "0.85rem", color: "var(--grey)", fontFamily: "var(--font)" }}
          >
            {project.role}
          </p>
        </div>
      </div>

      {/* media grid */}
      <ProjectMedia project={project} />
    </div>
  );
}

/* ── Main WorkSection ─────────────────────────────────────────────────── */
export default function WorkSection() {
  const [activeId, setActiveId] = useState(PROJECTS[0].id);
  const itemRefs  = useRef({});
  const heroRef   = useRef(null);
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

  /* GSAP entrance on hero headline */
  useEffect(() => {
    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger }  = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const words = headlineRef.current?.querySelectorAll(".ww");
      if (words) {
        gsap.set(words, { yPercent: 110 });
        gsap.to(words, {
          yPercent: 0, duration: 1, ease: "power3.out",
          stagger: 0.05, delay: 0.2,
        });
      }

      /* project info cols slide in on scroll */
      document.querySelectorAll(".proj-col").forEach(el => {
        const i = +el.dataset.col;
        gsap.fromTo(el,
          { opacity: 0, y: 30 },
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
      className="flex w-screen min-h-screen"
      style={{ background: "var(--bg-cold)" }}
    >
      {/* ── Sticky sidebar navigation ── */}
      <nav
        className="sticky top-0 h-screen flex flex-col justify-center overflow-y-auto"
        style={{ width: "14vw", paddingLeft: "4vw", zIndex: 50, flexShrink: 0 }}
      >
        <ul className="flex flex-col gap-[0.15rem] list-none m-0 p-0">
          {PROJECTS.map(p => {
            const isActive = activeId === p.id;
            return (
              <li key={p.id}>
                <button
                  onClick={() => scrollToProject(p.id)}
                  className="flex items-center gap-[0.8rem] text-left w-full border-none bg-transparent cursor-pointer transition-all duration-200"
                  style={{
                    opacity: isActive ? 1 : 0,
                    height: "2rem",
                    padding: isActive ? "0 0.8rem 0 0.5rem" : "0",
                    marginLeft: isActive ? "-0.5rem" : "0",
                    background: isActive ? "rgba(0,0,0,0.05)" : "transparent",
                    borderRadius: isActive ? "22px" : "0",
                    fontFamily: "var(--font)",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "var(--grey)",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = "1"; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.opacity = "0"; }}
                >
                  {/* dot */}
                  <span
                    className="shrink-0 rounded-full"
                    style={{
                      width: "0.3rem", height: "0.3rem",
                      background: isActive ? "var(--blue)" : "var(--grey)",
                      opacity: isActive ? 1 : 0.58,
                    }}
                  />
                  {p.title.split("\n")[0]}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Main content ── */}
      <div
        className="flex flex-col relative overflow-visible"
        style={{ width: "86vw", paddingLeft: "0", paddingRight: "4vw" }}
      >
        {/* Hero */}
        <div
          ref={heroRef}
          className="flex flex-col justify-end relative"
          style={{ width: "71vw", height: "32vw", marginBottom: "9vw" }}
        >
          <h1
            ref={headlineRef}
            className="m-0 font-semibold"
            style={{
              color: "var(--grey)",
              fontFamily: "var(--font)",
              fontSize: "7vw",
              fontWeight: 600,
              lineHeight: "105%",
              letterSpacing: "-0.3vw",
            }}
          >
            <span style={{ color: "var(--orange1)", marginRight: "0.15em" }}>T--.</span>
            {HEADLINE.split(" ").map((word, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom" style={{ paddingBottom: "0.05em" }}>
                <span className="ww inline-block">{word}{i < HEADLINE.split(" ").length - 1 ? "\u00A0" : ""}</span>
              </span>
            ))}
          </h1>
          <img
            src="/images/folder-juanmora.png"
            alt=""
            loading="lazy"
            className="absolute pointer-events-none"
            style={{ right: "2vw", bottom: "0", width: "20vw" }}
          />
        </div>

        {/* Project items */}
        <div className="flex flex-col w-full" style={{ paddingLeft: "1rem" }}>
          {PROJECTS.map(p => (
            <div key={p.id} id={p.id} ref={el => itemRefs.current[p.id] = el} className="w-full flex flex-col relative" style={{ gap: "3rem", marginBottom: "8vw", padding: "4rem 8px 8px" }}>
              {/* accent dot */}
              <div
                className="absolute rounded-[10px]"
                style={{ width: "0.3rem", height: "0.3rem", background: "var(--orange1)", top: "1.6rem", left: "-0.6rem" }}
              />

              {/* 4-col info grid */}
              <div className="w-full" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "16px", alignItems: "start" }}>
                {/* col 1 */}
                <div className="proj-col flex flex-col gap-4 pl-4" data-col="0">
                  <h3 className="m-0 font-semibold leading-[110%] whitespace-pre-line" style={{ color: "#313131", fontFamily: "var(--font)", fontSize: "1.8rem" }}>
                    {p.title}
                  </h3>
                  <div className="inline-flex self-start" style={{ border: "1px solid rgba(0,0,0,0.12)", borderRadius: "20rem", padding: "0.4rem 0.6rem", fontSize: "0.65rem", fontWeight: 400, color: "var(--grey)", fontFamily: "var(--font)", letterSpacing: "0.02rem", lineHeight: "100%" }}>
                    {p.year}
                  </div>
                  {p.liveUrl && (
                    <a href={p.liveUrl} target="_blank" rel="noreferrer" className="main-cont-button self-start" style={{ fontSize: "0.8rem" }}>
                      <div className="icon-wrapper-cta-first"><img src="/images/arrow-grey-out.svg" alt="" className="w-[14px] block" /></div>
                      <div className="text-wrapper-cta" style={{ padding: "0.6rem 1rem", fontSize: "0.8rem" }}>See it live</div>
                      <div className="icon-wrapper-cta"><img src="/images/arrow-grey-out.svg" alt="" className="w-[14px] block" /></div>
                    </a>
                  )}
                </div>

                {/* col 2: challenge */}
                <div className="proj-col flex flex-col gap-3" data-col="1">
                  <span className="uppercase font-bold tracking-[0.1em]" style={{ fontSize: "0.6rem", color: "var(--grey)", fontFamily: "var(--font)", opacity: 0.6 }}>Challenge</span>
                  <p className="m-0 font-semibold leading-[150%]" style={{ fontSize: "0.85rem", color: "var(--grey)", fontFamily: "var(--font)" }}>{p.challenge}</p>
                </div>

                {/* col 3: services */}
                <div className="proj-col flex flex-col gap-3" data-col="2">
                  <span className="uppercase font-bold tracking-[0.1em]" style={{ fontSize: "0.6rem", color: "var(--grey)", fontFamily: "var(--font)", opacity: 0.6 }}>Services</span>
                  <div className="flex flex-wrap gap-[0.3rem]">
                    {p.services.map((s, i) => (
                      <span key={i} style={{ border: "1px solid rgba(105,105,90,0.18)", borderRadius: "0.3rem", padding: "0.4rem 0.7rem", fontSize: "0.8rem", fontWeight: 600, color: "var(--grey)", fontFamily: "var(--font)", lineHeight: "100%", background: "rgba(205,225,225,0.55)" }}>{s}</span>
                    ))}
                  </div>
                </div>

                {/* col 4: role */}
                <div className="proj-col flex flex-col gap-3" data-col="3">
                  <span className="uppercase font-bold tracking-[0.1em]" style={{ fontSize: "0.6rem", color: "var(--grey)", fontFamily: "var(--font)", opacity: 0.6 }}>Role</span>
                  <p className="m-0 font-semibold leading-[150%]" style={{ fontSize: "0.85rem", color: "var(--grey)", fontFamily: "var(--font)" }}>{p.role}</p>
                </div>
              </div>

              {/* media */}
              <div
                className="proj-media w-full"
                style={{ display: "grid", gap: "8px", gridTemplateColumns: p.cols === 2 ? "1fr 1fr" : "1fr" }}
              >
                {p.media.map((m, mi) =>
                  m.type === "video"
                    ? <LazyVideo key={mi} src={m.src} />
                    : <img key={mi} src={m.src} alt="" loading="lazy" className="w-full block rounded-[0.3rem]" style={{ pointerEvents: "none" }} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
