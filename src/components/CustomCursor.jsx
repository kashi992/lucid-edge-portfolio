import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef   = useRef(null);
  const ringRef  = useRef(null);
  const textRef  = useRef(null);

  const pos       = useRef({ x: -200, y: -200 });
  const cur       = useRef({ x: -200, y: -200 });
  const raf       = useRef(null);
  const angle     = useRef(0);
  const hovering  = useRef(false);
  const emailMode = useRef(false);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    const text = textRef.current;

    /* ── mouse move — dot snaps ── */
    const onMove = ({ clientX: x, clientY: y }) => {
      pos.current = { x, y };
      dot.style.left = `${x}px`;
      dot.style.top  = `${y}px`;
    };
    document.addEventListener("mousemove", onMove);

    /* ── RAF: two rings at different lag speeds + gradient rotation ── */
    const tick = () => {
      cur.current.x += (pos.current.x - cur.current.x) * 0.12;
      cur.current.y += (pos.current.y - cur.current.y) * 0.12;

      ring.style.left = `${cur.current.x}px`;
      ring.style.top  = `${cur.current.y}px`;
      text.style.left = `${cur.current.x}px`;
      text.style.top  = `${cur.current.y}px`;

      // spin the gradient border
      angle.current = (angle.current + 1.2) % 360;
      ring.style.background = `conic-gradient(from ${angle.current}deg, #D4FF00 0%, #00e5ff 22%, #bf5af2 44%, #ff6b35 66%, #D4FF00 88%, #00e5ff 100%)`;

      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    /* hide on window leave */
    const hide = () => { dot.style.opacity = "0"; ring.style.opacity = "0"; };
    const show = () => { dot.style.opacity = "1"; ring.style.opacity = "0.8"; };
    document.addEventListener("mouseleave", hide);
    document.addEventListener("mouseenter", show);

    /* ── interactive hover ── */
    const expand = () => {
      if (emailMode.current) return;
      hovering.current = true;
      ring.style.transform = "translate(-50%, -50%) scale(2.2)";
      ring.style.opacity   = "0.9";
      dot.style.transform  = "translate(-50%, -50%) scale(0.3)";
      dot.style.boxShadow   = "0 0 14px 4px rgba(212,255,0,0.8)";
    };
    const contract = () => {
      if (emailMode.current) return;
      hovering.current = false;
      ring.style.transform = "translate(-50%, -50%) scale(1)";
      ring.style.opacity   = "0.8";
      dot.style.transform  = "translate(-50%, -50%) scale(1)";
      dot.style.boxShadow   = "0 0 8px 2px rgba(212,255,0,0.55)";
    };

    const bindInteractive = () => {
      document.querySelectorAll("a:not([data-cursor-skip]), [data-cursor]").forEach(el => {
        if (!el.__cursorBound) {
          el.__cursorBound = true;
          el.addEventListener("mouseenter", expand);
          el.addEventListener("mouseleave", contract);
        }
      });
    };
    bindInteractive();

    /* ── email copy ── */
    const onEmailEnter = () => {
      emailMode.current    = true;
      text.textContent     = "Copy my Email";
      text.style.opacity   = "1";
      dot.style.opacity    = "0";
      ring.style.opacity   = "0";
    };
    const onEmailLeave = () => {
      emailMode.current   = false;
      text.style.opacity = "0";
      dot.style.opacity  = "1";
      ring.style.opacity = "0.8";
    };
    const onClickEmail = (e) => {
      const target = e.target.closest("[data-copy-email]");
      if (target) {
        navigator.clipboard.writeText(target.dataset.copyEmail || "lucidedge@gmail.com").catch(() => {});
        text.textContent = "Copied!";
        setTimeout(() => { text.textContent = "Copy my Email"; }, 2000);
      }
    };
    const bindEmail = () => {
      document.querySelectorAll("[data-copy-email]").forEach(el => {
        if (!el.__emailBound) {
          el.__emailBound = true;
          el.addEventListener("mouseenter", onEmailEnter);
          el.addEventListener("mouseleave", onEmailLeave);
        }
      });
    };
    bindEmail();
    document.addEventListener("click", onClickEmail);

    const obs = new MutationObserver(() => { bindInteractive(); bindEmail(); });
    obs.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", hide);
      document.removeEventListener("mouseenter", show);
      document.removeEventListener("click", onClickEmail);
      cancelAnimationFrame(raf.current);
      obs.disconnect();
    };
  }, []);

  /* shared mask — hollow ring via radial-gradient mask */
  const ringMask = "radial-gradient(circle, transparent 63%, black 64%)";

  return (
    <>
      {/* Dot — lime, glows */}
      <div
        ref={dotRef}
        className="fixed pointer-events-none z-[9999] rounded-full"
        style={{
          width: "7px",
          height: "7px",
          background: "#D4FF00",
          boxShadow: "0 0 8px 2px rgba(212,255,0,0.55)",
          left: "-200px",
          top: "-200px",
          transform: "translate(-50%, -50%)",
          transition: "transform 0.18s ease, box-shadow 0.2s ease, opacity 0.2s ease",
        }}
      />

      {/* Ring 1 — medium lag, gradient border */}
      <div
        ref={ringRef}
        className="fixed pointer-events-none z-[9998] rounded-full"
        style={{
          width: "38px",
          height: "38px",
          left: "-200px",
          top: "-200px",
          opacity: 0.8,
          WebkitMask: ringMask,
          mask: ringMask,
          transform: "translate(-50%, -50%) scale(1)",
          transition: "transform 0.4s cubic-bezier(0.23,1,0.32,1), opacity 0.25s ease",
        }}
      />

      {/* Email label */}
      <div
        ref={textRef}
        className="fixed pointer-events-none z-[9999] whitespace-nowrap rounded-[20px] font-semibold"
        style={{
          left: "-200px",
          top: "-200px",
          opacity: 0,
          background: "var(--blue)",
          color: "var(--orange1)",
          fontFamily: "var(--font)",
          fontSize: "13px",
          padding: "7px 14px",
          transform: "translate(-50%, calc(-50% - 36px))",
          transition: "opacity 0.2s ease",
        }}
      />
    </>
  );
}
