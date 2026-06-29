import { useEffect, useRef } from "react";
import { IMAGES } from "../data/services";

const FILES = [
  { color: "#7B6EF6", rotate: -12, x: -22 },
  { color: "#4E9EFF", rotate:   0, x:   0 },
  { color: "#5BD4A4", rotate:  12, x:  22 },
];

function FileCard({ color }) {
  return (
    <div
      className="w-[58px] h-[72px] bg-white rounded-[6px] overflow-hidden flex flex-col flex-shrink-0"
      style={{ boxShadow: "0 6px 18px rgba(0,0,0,0.22)" }}
    >
      <div style={{ background: color, height: 14 }} />
      <div className="px-[8px] py-[6px] flex flex-col gap-1">
        <div className="h-[3px] rounded-[9px] bg-[#ddd]" />
        <div className="h-[3px] rounded-[9px] bg-[#eee]" />
        <div className="h-[3px] rounded-[9px] w-[60%] bg-[#eee]" />
      </div>
    </div>
  );
}

export default function WorkCTA() {
  const wrapRef        = useRef(null);
  const wTextRef       = useRef(null);
  const rkTextRef      = useRef(null);
  const folderRef      = useRef(null);
  const flapRef        = useRef(null);
  const fileRefs       = useRef([]);
  const topLabelRef    = useRef(null);
  const bottomLabelRef = useRef(null);
  const gsapRef        = useRef(null);
  const cursorIconRef  = useRef(null);
  const cursorRaf      = useRef(null);
  const cursorPos      = useRef({ x: -200, y: -200 });
  const cursorCur      = useRef({ x: -200, y: -200 });

  /* ── entrance + float ── */
  useEffect(() => {
    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      gsapRef.current = gsap;

      gsap.set(wTextRef.current,  { xPercent: -60, opacity: 0 });
      gsap.set(rkTextRef.current, { xPercent:  60, opacity: 0 });
      gsap.set(folderRef.current, { scale: 0.6, opacity: 0, yPercent: 15 });
      gsap.set(topLabelRef.current,    { opacity: 0, y: 12 });
      gsap.set(bottomLabelRef.current, { opacity: 0, y: -12 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: wrapRef.current, start: "top 75%", once: true },
      });

      tl.to([wTextRef.current, rkTextRef.current], {
          xPercent: 0, opacity: 1, duration: 0.85, ease: "power3.out", stagger: 0.05,
        })
        .to(folderRef.current, {
          scale: 1, opacity: 1, yPercent: 0, duration: 0.7, ease: "back.out(1.4)",
        }, "-=0.4")
        .to([topLabelRef.current, bottomLabelRef.current], {
          opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.1,
        }, "-=0.3");

      /* float */
      gsap.to(folderRef.current, {
        y: "-=14", duration: 2.2, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 0.8,
      });
    })();
  }, []);

  /* ── mouse parallax (GSAP quickTo — no conflict with float y) ── */
  useEffect(() => {
    const section = wrapRef.current;
    const folder  = folderRef.current;
    if (!section || !folder) return;

    let rotYTo, rotXTo, cleanup;
    (async () => {
      const { default: gsap } = await import("gsap");
      gsap.set(folder, { transformPerspective: 900 });
      rotYTo = gsap.quickTo(folder, "rotateY", { duration: 0.5, ease: "power2.out" });
      rotXTo = gsap.quickTo(folder, "rotateX", { duration: 0.5, ease: "power2.out" });

      const onMove = (e) => {
        const { left, top, width, height } = section.getBoundingClientRect();
        const rx = ((e.clientX - left) / width  - 0.5) * 2;
        const ry = ((e.clientY - top)  / height - 0.5) * 2;
        rotYTo(rx * 9);
        rotXTo(-ry * 7);
      };
      const onLeave = () => { rotYTo(0); rotXTo(0); };

      section.addEventListener("mousemove", onMove);
      section.addEventListener("mouseleave", onLeave);
      cleanup = () => {
        section.removeEventListener("mousemove", onMove);
        section.removeEventListener("mouseleave", onLeave);
      };
    })();

    return () => { cleanup?.(); };
  }, []);

  /* ── custom pill cursor follows mouse ── */
  useEffect(() => {
    const onMove = (e) => {
      cursorPos.current = { x: e.clientX, y: e.clientY };
    };
    document.addEventListener("mousemove", onMove);
    return () => document.removeEventListener("mousemove", onMove);
  }, []);

  const startCursorFollow = () => {
    const icon = cursorIconRef.current;
    if (!icon) return;
    const tick = () => {
      cursorCur.current.x += (cursorPos.current.x - cursorCur.current.x) * 0.14;
      cursorCur.current.y += (cursorPos.current.y - cursorCur.current.y) * 0.14;
      icon.style.transform = `translate(${cursorCur.current.x}px, ${cursorCur.current.y}px) translate(-50%, -50%)`;
      cursorRaf.current = requestAnimationFrame(tick);
    };
    cancelAnimationFrame(cursorRaf.current);
    cursorRaf.current = requestAnimationFrame(tick);
  };

  const stopCursorFollow = () => {
    cancelAnimationFrame(cursorRaf.current);
  };

  /* ── folder open / close — exact IX2 values from webflow.js ── */
  const handleFolderEnter = () => {
    const gsap = gsapRef.current;
    if (!gsap) return;

    // front flap: rotationX 0 → -35deg, elastic-out (amplitude 0.7, period 0.3), 0.68s
    gsap.to(flapRef.current, {
      rotateX: -35,
      duration: 0.68,
      ease: "elastic.out(0.7, 0.3)",
      transformOrigin: "bottom center",
    });

    // file cards fan out
    fileRefs.current.forEach((f, i) => {
      gsap.to(f, {
        y: -54,
        rotate: FILES[i].rotate,
        x: FILES[i].x,
        duration: 0.65,
        ease: "power3.out",
        delay: 0.1 + i * 0.06,
      });
    });

    // pill cursor: fade in (t-e2221d1b: opacity 0 → 100%, 0.3s)
    gsap.to(cursorIconRef.current, { opacity: 1, duration: 0.3, ease: "power2.out" });
    startCursorFollow();
    document.dispatchEvent(new CustomEvent("cursor:hide"));
  };

  const handleFolderLeave = () => {
    const gsap = gsapRef.current;
    if (!gsap) return;

    gsap.to(flapRef.current, {
      rotateX: 0,
      duration: 0.68,
      ease: "elastic.out(0.7, 0.3)",
      transformOrigin: "bottom center",
    });

    fileRefs.current.forEach((f) => {
      gsap.to(f, { y: 0, rotate: 0, x: 0, duration: 0.45, ease: "power2.inOut" });
    });

    // pill cursor: fade out
    gsap.to(cursorIconRef.current, { opacity: 0, duration: 0.3, ease: "power2.out" });
    stopCursorFollow();
    document.dispatchEvent(new CustomEvent("cursor:show"));
  };

  return (
    <section
      data-nav="grey"
      ref={wrapRef}
      className="work-cta-section flex justify-center items-center w-screen relative overflow-hidden z-[5] h-[63vw] pb-[3vw]"
      style={{ background: "var(--bg-cold)" }}
    >
      {/* W */}
      <div
        ref={wTextRef}
        className="absolute z-20 left-0 top-1/2 -translate-y-1/2 text-[43vw] font-semibold leading-[100%] tracking-[-1vw]"
        style={{ color: "var(--orange1)", fontFamily: "var(--font)" }}
      >W</div>

      {/* rk */}
      <div
        ref={rkTextRef}
        className="absolute z-20 right-0 top-1/2 -translate-y-1/2 text-[43vw] font-semibold leading-[100%] tracking-[-1vw]"
        style={{ color: "var(--orange1)", fontFamily: "var(--font)" }}
      >rk</div>

      {/* Center */}
      <div className="relative z-[21] flex flex-col justify-center items-center gap-[80px] mt-[10vw]">
        <p
          ref={topLabelRef}
          className="m-0 text-[0.9rem] font-semibold tracking-[0.03rem]"
          style={{ fontFamily: "var(--font)", color: "var(--grey)" }}
        >
          Curious?... Check out my
        </p>

        {/* Folder */}
        <div style={{ perspective: "600px" }}>
          <a
            href="#work"
            ref={folderRef}
            data-cursor-skip
            className="folder-wrapper no-underline block relative cursor-pointer"
            onMouseEnter={handleFolderEnter}
            onMouseLeave={handleFolderLeave}
          >
            {/* File cards — sit inside the folder top, revealed when flap opens */}
            <div className="absolute left-1/2 -translate-x-1/2 flex z-[3] pointer-events-none gap-2 bottom-[58%]">
              {FILES.map((f, i) => (
                <div key={i} ref={el => fileRefs.current[i] = el}>
                  <FileCard color={f.color} />
                </div>
              ))}
            </div>

            {/* Back of folder */}
            <img src={IMAGES.folderBack} loading="lazy" alt=""
              className="block relative z-[1] top-[-40px]" />

            {/* Folder body */}
            <img src={IMAGES.projectsFolder} loading="lazy" alt=""
              className="absolute inset-0 z-[4] w-full h-full" />

            {/* Front flap — rotates open on hover */}
            <img
              src={IMAGES.folderFront}
              loading="lazy"
              alt=""
              ref={flapRef}
              className="absolute inset-0 z-[5] w-full h-full [transform-origin:bottom_center]"
            />
          </a>
        </div>

        <p
          ref={bottomLabelRef}
          className="m-0 opacity-60 text-[0.9rem] font-semibold tracking-[0.03rem]"
          style={{ fontFamily: "var(--font)", color: "var(--grey)" }}
        >
          Or keep scrolling
        </p>
      </div>
      {/* Pill cursor — follows mouse, visible only on folder hover */}
      <div
        ref={cursorIconRef}
        className="fixed pointer-events-none z-[9998] top-0 left-0 flex items-center justify-center rounded-[30px] p-[15px]"
        style={{ opacity: 0, background: "var(--orange1)", willChange: "transform" }}
      >
        <img src={IMAGES.arrowGrey} alt="" style={{ width: 14, display: "block" }} />
      </div>
    </section>
  );
}
