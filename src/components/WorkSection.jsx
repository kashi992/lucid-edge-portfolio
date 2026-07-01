import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { PROJECTS } from "../data/work";
import "../assets/css/style.css";
import CTAButton from "./CTAButton";

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
  const cols = project.gridCols === 2 ? 2 : 4;

  return (
    <div
      className="proj-media w-full"
      style={{
        display: "grid",
        gridTemplateColumns: cols === 2 ? "1fr 1fr" : "1fr 1fr 1fr 1fr",
        gap: "8px",
      }}
    >
      {project.media.map((m, i) => {
        const span = m.span || cols;
        const colSpan = Math.min(span, cols);
        const itemStyle = {
          gridColumn: `span ${colSpan}`,
          borderRadius: "0.3rem",
          width: "100%",
        };
        const hideClass = m.hide ? "hidden sm:block" : "";

        return m.type === "video" ? (
          <LazyVideo
            key={i}
            src={m.src}
            className={`block ${hideClass}`}
            style={itemStyle}
          />
        ) : (
          <img
            key={i}
            src={m.src}
            alt=""
            loading="lazy"
            className={`w-full block ${hideClass}`}
            style={{ ...itemStyle, pointerEvents: "none" }}
          />
        );
      })}
    </div>
  );
}

/* ── Main WorkSection ─────────────────────────────────────────────────── */
export default function WorkSection({ loaded }) {
  const [activeId, setActiveId] = useState(null);
  const itemRefs        = useRef({});
  const headlineRef     = useRef(null);
  const headlineWrapRef = useRef(null);
  const challengeRefs   = useRef([]);
  const roleRefs        = useRef([]);

  /* IntersectionObserver — track active project in sidebar */
  useEffect(() => {
    const visible = new Set();
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        });
        if (visible.size === 0) setActiveId(null);
        else setActiveId([...visible][0]);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    PROJECTS.forEach(p => {
      const el = itemRefs.current[p.id];
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  /* Headline entrance — fires after loader completes */
  useEffect(() => {
    if (!loaded) return;
    const wrapEl  = headlineWrapRef.current;
    const h1El    = headlineRef.current;
    const wordEls = h1El ? [...h1El.querySelectorAll(".ww")] : [];

    // Trigger CSS slide-up
    if (wrapEl) {
      wrapEl.classList.remove("hero-wrap-hidden");
      wrapEl.classList.add("hero-slide-up");
    }

    // Color sweep after slide starts (0.15s slide delay + small offset)
    (async () => {
      const { default: gsap } = await import("gsap");
      gsap.set(wordEls, { color: "#ffbc95" });
      gsap.to(wordEls, {
        color: "var(--grey)",
        duration: 1, ease: "power3.out",
        stagger: { each: 0.1 },
        delay: 0.35,
      });
    })();
  }, [loaded]);

  /* GSAP scroll animations */
  useEffect(() => {
    if (!loaded) return;
    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger }  = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      /* Hide all work chars upfront */
      [...challengeRefs.current, ...roleRefs.current].forEach(el => {
        if (el) gsap.set(el.querySelectorAll(".work-char"), { opacity: 0 });
      });

      /* Sequential char reveal per project: challenge → role */
      PROJECTS.forEach((p, i) => {
        const challengeEl = challengeRefs.current[i];
        const roleEl      = roleRefs.current[i];
        if (!challengeEl) return;

        ScrollTrigger.create({
          trigger: challengeEl,
          start: "top 88%",
          once: true,
          onEnter: () => {
            const challengeChars = challengeEl.querySelectorAll(".work-char");
            gsap.to(challengeChars, {
              opacity: 1, duration: 0.06, stagger: 0.004, ease: "power2.out",
              onComplete: () => {
                if (!roleEl) return;
                const roleChars = roleEl.querySelectorAll(".work-char");
                gsap.to(roleChars, { opacity: 1, duration: 0.06, stagger: 0.004, ease: "power2.out" });
              },
            });
          },
        });
      });

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
  }, [loaded]);

  const scrollToProject = (id) => {
    const el = itemRefs.current[id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const HEADLINE = "Two decades of productions that win bids and deliver impact";

  return (
    <div
      data-nav="grey"
      className="flex w-screen gap-4"
      style={{ background: "var(--bg-grey)", alignItems: "flex-start" }}
    >
      {/* ── Sticky sidebar navigation ── */}
      <nav
        className="hidden lg:flex sticky top-0 flex-col justify-center overflow-y-auto flex-shrink-0 xl:pt-0 pt-[100px] ps-[3vw] w-[14vw] h-screen z-50"
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
      <div className="flex flex-col w-full lg:w-[86vw] px-0 md:px-[4vw] lg:px-0 lg:pr-[4vw]">
        {/* Hero */}
        <div
          className="flex flex-col justify-end relative lg:w-[71vw] w-[80%] xl:my-[14vw] my-[20vw] md:mx-0 mx-auto"
        >
          <div ref={headlineWrapRef} className="hero-wrap-hidden">
            <h1
              ref={headlineRef}
              className="m-0 flex flex-wrap font-semibold text-[10vw] lg:text-[7vw] text-center lg:text-left tracking-[-0.35vw] lg:tracking-[-0.3vw]"
              style={{
                color: "var(--grey)",
                fontFamily: "var(--font)",
                lineHeight: "105%",
              }}
            >
              {/* invisible spacer so text clears the folder icon */}
              <span className="opacity-0 text-[75%]" style={{ pointerEvents: "none" }}>{"——\u00A0"}</span>
              {HEADLINE.split(" ").map((word, i) => (
                <span key={i} className="ww" style={{ display: "inline" }}>
                  {word}{i < HEADLINE.split(" ").length - 1 ? "\u00A0" : ""}
                </span>
              ))}
            </h1>
          </div>

          {/* Folder — bottom-left, small, reference exact */}
          <img
            src="/images/folder-juanmora.png"
            alt=""
            loading="lazy"
            className="absolute pointer-events-none top-0 left-0 w-[7.6vw]"
          />
        </div>

        {/* Project items */}
        <div className="flex flex-col w-full">
          {PROJECTS.map(p => (
            <div
              key={p.id}
              id={p.id}
              ref={el => { itemRefs.current[p.id] = el; }}
              className="w-full flex flex-col relative mb-[14vw] lg:mb-[8vw] px-5 pb-2 pt-[10vw] lg:pt-16 gap-[5vw] lg:gap-[3rem]"
              style={{ background: "#fff", }}
            >
              {/* accent dot */}
              <div
                className="absolute rounded-[10px] w-[0.3rem] h-[0.3rem] md:left-[-20px] md:top-[80px] top-[50px] left-[10px]"
                style={{
                  background: "var(--blue)",
                }}
              />

              {/* 4-col info grid */}
              <div
                className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:gap-4 items-start"
              >
                {/* col 1: title + year + CTA */}
                <div className="proj-col flex flex-col mb-[5vw] lg:mb-0 w-full lg:w-[90%]  md:row-span-3 lg:row-span-1 md:ps-[1rem] gap-[1rem]" data-col="0">
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
                  <CTAButton href="https://lucidedge.com.au" label="See it live" />
                </div>

                {/* col 2: challenge */}
                <div className="proj-col flex flex-col mb-[5vw] lg:mb-0 w-full lg:w-[90%]" data-col="1" style={{ gap: "1rem" }}>
                  <p
                    className="m-0"
                    style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--grey)", fontFamily: "var(--font)", opacity: 0.7 }}
                  >
                    Challenge:
                  </p>
                  <p
                    ref={el => { challengeRefs.current[PROJECTS.indexOf(p)] = el; }}
                    className="m-0"
                    style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--grey)", fontFamily: "var(--font)", lineHeight: "150%" }}
                  >
                    {p.challenge.split("").map((ch, ci) =>
                      ch === " "
                        ? <span key={ci} className="work-char" style={{ display: "inline-block", width: "0.25em" }}>&nbsp;</span>
                        : <span key={ci} className="work-char">{ch}</span>
                    )}
                  </p>
                </div>

                {/* col 3: services */}
                <div className="proj-col flex flex-col mb-[5vw] lg:mb-0 w-full lg:w-[90%]" data-col="2" style={{ gap: "1rem" }}>
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
                <div className="proj-col flex flex-col mb-[5vw] lg:mb-0 w-full lg:w-[90%]" data-col="3" style={{ gap: "1rem" }}>
                  <p
                    className="m-0"
                    style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--grey)", fontFamily: "var(--font)", opacity: 0.7 }}
                  >
                    Role:
                  </p>
                  <p
                    ref={el => { roleRefs.current[PROJECTS.indexOf(p)] = el; }}
                    className="m-0"
                    style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--grey)", fontFamily: "var(--font)", lineHeight: "150%" }}
                  >
                    {p.role.split("").map((ch, ci) =>
                      ch === " "
                        ? <span key={ci} className="work-char" style={{ display: "inline-block", width: "0.25em" }}>&nbsp;</span>
                        : <span key={ci} className="work-char">{ch}</span>
                    )}
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
