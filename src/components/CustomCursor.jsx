import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef    = useRef(null);
  const cursorRef = useRef(null);
  const iconRef   = useRef(null);
  const textRef   = useRef(null);
  const pos       = useRef({ x: 0, y: 0 });
  const cur       = useRef({ x: 0, y: 0 });
  const raf       = useRef(null);

  useEffect(() => {
    const el   = dotRef.current;
    const icon = iconRef.current;
    const text = textRef.current;

    const onMove = ({ clientX: x, clientY: y }) => {
      pos.current = { x, y };
    };

    const tick = () => {
      cur.current.x += (pos.current.x - cur.current.x) * 0.12;
      cur.current.y += (pos.current.y - cur.current.y) * 0.12;
      el.style.left = `${cur.current.x}px`;
      el.style.top  = `${cur.current.y}px`;
      if (cursorRef.current) {
        cursorRef.current.style.left = `${cur.current.x}px`;
        cursorRef.current.style.top  = `${cur.current.y}px`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    document.addEventListener("mousemove", onMove);

    const onEmailEnter = () => {
      text.textContent = "Copy my Email";
      text.classList.add("visible");
      el.style.opacity = "0";
    };
    const onEmailLeave = () => {
      text.classList.remove("visible");
      el.style.opacity = "1";
    };
    const onClick = (e) => {
      const target = e.target.closest("[data-copy-email]");
      if (target) {
        navigator.clipboard.writeText(target.dataset.copyEmail || "juan@morable.co").catch(() => {});
        text.textContent = "Great! Email copied";
        setTimeout(() => { text.textContent = "Copy my Email"; }, 2000);
      }
    };

    const bindHovers = () => {
      document.querySelectorAll("[data-copy-email]").forEach(el => {
        if (!el.__cursorBound) {
          el.__cursorBound = true;
          el.addEventListener("mouseenter", onEmailEnter);
          el.addEventListener("mouseleave", onEmailLeave);
        }
      });
    };
    bindHovers();
    document.addEventListener("click", onClick);

    const obs = new MutationObserver(bindHovers);
    obs.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(raf.current);
      obs.disconnect();
    };
  }, []);

  return (
    <>
      {/* Always-visible dot cursor */}
      <div
        ref={dotRef}
        className="fixed z-[9999] pointer-events-none w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{ background: "var(--grey)" }}
      />
      {/* Email hover cursor */}
      <div ref={cursorRef} className="cursor-jm pointer-events-none">
        <div ref={iconRef} className="cursor-jm-icon">
          <img src="/images/arrow-grey.svg" alt="" className="w-[14px] block" />
        </div>
        <div ref={textRef} className="text-jm-cursor">copy</div>
      </div>
    </>
  );
}
