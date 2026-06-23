import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { SOCIALS } from "../data/services";

export default function Navbar({ visible }) {
  const navRef = useRef(null);

  /* entrance animation */
  useEffect(() => {
    if (!visible) return;
    (async () => {
      const { gsap } = await import("gsap");
      gsap.from(navRef.current, { y: -28, opacity: 0, duration: 0.7, ease: "power3.out", delay: 0.15 });
    })();
  }, [visible]);

  /* color switch — fires when section crosses the mid-viewport line */
  useEffect(() => {
    if (!visible) return;
    const navEl = navRef.current;
    if (!navEl) return;

    const update = (navValue) => {
      const isPeach = navValue === "peach";
      navEl.querySelectorAll(".nav-name-jm, .nav-link, .nav-social-link").forEach(el => {
        el.classList.toggle("is-peach", isPeach);
      });
      /* also tint the pill backdrop */
      const pill = navEl.querySelector(".nav-pill");
      if (pill) {
        pill.style.background = isPeach
          ? "rgba(10,10,10,0.35)"
          : "rgba(200,200,200,0.18)";
        pill.style.borderColor = isPeach
          ? "rgba(255,255,255,0.08)"
          : "rgba(0,0,0,0.08)";
      }
    };

    /* rootMargin -45% top/bottom = only fires when section straddles mid-viewport */
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) update(entry.target.dataset.nav);
      });
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });

    const timer = setTimeout(() => {
      document.querySelectorAll("[data-nav]").forEach(s => observer.observe(s));
    }, 100);

    return () => { clearTimeout(timer); observer.disconnect(); };
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      <div className="top-glow">
        <div className="top-glow-blur" />
      </div>

      <nav
        ref={navRef}
        className="z-[990] flex justify-between items-center w-screen mt-6 pl-[2vw] pr-[2vw] fixed inset-x-0 top-0"
      >
        {/* frosted glass pill behind everything */}
        <div
          className="nav-pill absolute inset-0 rounded-full mx-[1.5vw] my-[0.3rem] pointer-events-none"
          style={{
            background: "rgba(200,200,200,0.18)",
            border: "1px solid rgba(0,0,0,0.08)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            transition: "background 0.45s ease, border-color 0.45s ease",
          }}
        />

        {/* LEFT — wordmark */}
        <div className="w-1/3 flex items-center relative z-10">
          <Link to="/" className="flex items-center gap-[0.4rem] py-2 pr-2 no-underline">
            <img
              src="/images/le-mark-lime.jpeg"
              alt="LE"
              className="w-7 h-7 object-contain rounded-full"
              onError={e => { e.target.style.display = "none"; }}
            />
            <span className="nav-name-jm">LUCID</span>
            <div className="dot-jm" />
            <span className="nav-name-jm">EDGE</span>
          </Link>
        </div>

        {/* CENTER — nav links */}
        <ul className="w-1/3 flex justify-center items-center gap-0 m-0 p-0 list-none relative z-10">
          <li>
            <Link to="/about" className="nav-link">About</Link>
          </li>
          <li>
            <Link to="/" className="inline-flex items-center justify-center no-underline">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-[11px] bg-[rgba(100,100,100,0.1)]"
                style={{ WebkitBackdropFilter: "blur(11px)" }}
              >
                <img
                  src="/images/le-mark-dark.jpeg"
                  alt="LE"
                  className="w-[18px] h-[18px] object-contain rounded-full"
                  onError={e => {
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML = '<span style="font-weight:700;font-size:0.75rem;color:var(--grey)">LE</span>';
                  }}
                />
              </div>
            </Link>
          </li>
          <li>
            <a href="/work" className="nav-link">Work</a>
          </li>
        </ul>

        {/* RIGHT — social links */}
        <ol className="w-1/3 flex justify-end items-center m-0 p-0 list-none relative z-10">
          {SOCIALS.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                className="nav-social-link"
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
              >{label}</a>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
