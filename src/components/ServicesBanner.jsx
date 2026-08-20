import { useRef, useEffect } from "react";
import { SERVICES } from "../data/services";

const SERVICE_TAGS = SERVICES.map(s => s.title);

export default function ServicesBanner() {
  const sectionRef  = useRef(null);
  const labelRef    = useRef(null);
  const headingRefs = useRef([]);
  const subRef      = useRef(null);
  const tagsRef     = useRef([]);
  const lineRef     = useRef(null);

  const words = ["What", "We", "Do"];

  useEffect(() => {
    (async () => {
      const { default: gsap } = await import("gsap");

      gsap.set(labelRef.current,    { opacity: 0, y: 16 });
      gsap.set(headingRefs.current, { yPercent: 110 });
      gsap.set(subRef.current,      { opacity: 0, y: 20 });
      gsap.set(tagsRef.current,     { opacity: 0, y: 14 });
      gsap.set(lineRef.current,     { scaleX: 0, transformOrigin: "left center" });

      const tl = gsap.timeline({ delay: 0.35 });

      tl.to(labelRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
        .to(headingRefs.current, {
          yPercent: 0, duration: 1.0, ease: "power4.out", stagger: 0.08,
        }, "-=0.3")
        .to(lineRef.current, { scaleX: 1, duration: 0.8, ease: "power3.inOut" }, "-=0.4")
        .to(subRef.current,  { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.5")
        .to(tagsRef.current, {
          opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.07,
        }, "-=0.4");
    })();
  }, []);

  return (
    <section
      data-nav="grey"
      ref={sectionRef}
      className="w-screen flex flex-col justify-end relative overflow-hidden"
      style={{ background: "var(--bg-warm)", paddingTop: "10vw", paddingBottom: "5vw" }}
    >
      <div className="flex flex-col px-[5vw] gap-[2vw]">

        {/* Label */}
        <p
          ref={labelRef}
          className="m-0 uppercase font-bold tracking-[0.16em]"
          style={{ color: "var(--grey)", fontFamily: "var(--font)", fontSize: "0.72rem" }}
        >
          Lucid Edge · Studio
        </p>

        {/* Heading */}
        <h1
          className="m-0 flex flex-wrap font-extrabold tracking-[-0.04em] leading-[92%] gap-[0_0.22em]"
          style={{
            fontFamily: "var(--font)",
            fontSize: "clamp(3rem, 10vw, 12rem)",
            color: "var(--blue)",
          }}
          aria-label="What We Do."
        >
          {words.map((word, i) => (
            <span key={i} className="overflow-hidden inline-block pb-[0.05em]">
              <span ref={el => (headingRefs.current[i] = el)} className="inline-block">
                {word}
              </span>
            </span>
          ))}
          <span className="overflow-hidden inline-block pb-[0.05em]">
            <span
              ref={el => (headingRefs.current[3] = el)}
              className="inline-block"
              style={{ color: "var(--orange1)" }}
            >.</span>
          </span>
        </h1>

        {/* Divider */}
        <div
          ref={lineRef}
          className="w-full h-[1px]"
          style={{ background: "var(--blue)", opacity: 0.15 }}
        />

        {/* Sub-copy + tags row */}
        <div className="flex flex-col md:flex-row md:items-end gap-[3vw] md:gap-0 justify-between">
          <p
            ref={subRef}
            className="m-0 font-medium leading-[165%] max-w-[38vw]"
            style={{
              fontFamily: "var(--font)",
              fontSize: "clamp(0.9rem, 1.1vw, 1.15rem)",
              color: "var(--grey)",
            }}
          >
            From award-winning 3D animation to timelapse cameras, film production,
            VFX, and creative direction — we bring the full creative toolkit to every
            major project.
          </p>

          {/* Service tags */}
          <ul className="m-0 p-0 list-none flex flex-wrap gap-[0.6vw] md:justify-end">
            {SERVICE_TAGS.map((tag, i) => (
              <li
                key={tag}
                ref={el => (tagsRef.current[i] = el)}
                className="uppercase font-bold tracking-[0.1em] rounded-[100vw] px-[1.1em] py-[0.45em]"
                style={{
                  fontFamily: "var(--font)",
                  fontSize: "clamp(0.55rem, 0.7vw, 0.75rem)",
                  color: "var(--blue)",
                  background: "transparent",
                  border: "1px solid var(--blue)",
                  opacity: 0.7,
                }}
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
