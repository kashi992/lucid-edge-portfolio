import { useEffect, useRef } from "react";
import { IMAGES } from "../data/services";

const FILES = [
  { color: "#7B6EF6", rotate: -12, x: -22 },
  { color: "#4E9EFF", rotate:   0, x:   0 },
  { color: "#5BD4A4", rotate:  12, x:  22 },
];

function FileCard({ color, style }) {
  return (
    <div
      className="w-[58px] h-[72px] bg-white rounded-[6px] overflow-hidden flex flex-col flex-shrink-0"
      style={{
        boxShadow: "0 6px 18px rgba(0,0,0,0.22)",
        ...style,
      }}
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

  /* ── mouse parallax ── */
  useEffect(() => {
    const section = wrapRef.current;
    const folder  = folderRef.current;
    if (!section || !folder) return;
    const onMove = (e) => {
      const { left, top, width, height } = section.getBoundingClientRect();
      const rx = ((e.clientX - left) / width  - 0.5) * 2;
      const ry = ((e.clientY - top)  / height - 0.5) * 2;
      folder.style.transform = `perspective(900px) rotateY(${rx * 9}deg) rotateX(${-ry * 7}deg)`;
    };
    const onLeave = () => { folder.style.transform = ""; };
    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  /* ── folder open / close ── */
  const handleFolderEnter = () => {
    const gsap = gsapRef.current;
    if (!gsap) return;
    gsap.to(flapRef.current, {
      rotateX: -160, duration: 0.75, ease: "power2.inOut",
    });
    fileRefs.current.forEach((f, i) => {
      gsap.to(f, {
        y: -54,
        rotate: FILES[i].rotate,
        x: FILES[i].x,
        duration: 0.65,
        ease: "power3.out",
        delay: 0.15 + i * 0.08,
      });
    });
  };

  const handleFolderLeave = () => {
    const gsap = gsapRef.current;
    if (!gsap) return;
    gsap.to(flapRef.current, {
      rotateX: 0, duration: 0.6, ease: "power2.inOut",
    });
    fileRefs.current.forEach((f) => {
      gsap.to(f, { y: 0, rotate: 0, x: 0, duration: 0.45, ease: "power2.inOut" });
    });
  };

  return (
    <section
      data-nav="grey"
      ref={wrapRef}
      className="flex justify-center items-center w-screen relative overflow-hidden z-[5] h-[63vw] pb-[3vw]"
      style={{ background: "var(--bg-warm)" }}
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
          className="folder-wrapper no-underline block relative cursor-pointer [transform-style:preserve-3d]"
          onMouseEnter={handleFolderEnter}
          onMouseLeave={handleFolderLeave}
        >
          {/* File cards — sit just inside the top of the folder body, hidden until flap opens */}
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

          {/* Folder body (covers bottom of files) */}
          <img src={IMAGES.projectsFolder} loading="lazy" alt=""
            className="absolute inset-0 z-[4] w-full h-full" />

          {/* Front flap — rotates open on hover */}
          <img
            src={IMAGES.folderFront}
            loading="lazy"
            alt=""
            ref={flapRef}
            className="absolute inset-0 z-[5] w-full h-[270px] [transform-origin:bottom_center]"
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
    </section>
  );
}
