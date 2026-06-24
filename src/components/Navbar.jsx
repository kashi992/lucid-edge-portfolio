import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { SOCIALS } from "../data/services";

export default function Navbar({ visible }) {
  const navRef = useRef(null);

  /* ── Entrance animation ── */
  useEffect(() => {
    if (!visible) return;
    (async () => {
      const { gsap } = await import("gsap");
      gsap.from(navRef.current, { y: -28, opacity: 0, duration: 0.7, ease: "power3.out", delay: 0.15 });
    })();
  }, [visible]);


  /* ── Nav color switch — rootMargin matches reference exactly ── */
  useEffect(() => {
    if (!visible) return;
    const navEl = navRef.current;
    if (!navEl) return;

    const update = (theme) => {
      const isPeach = theme === "peach";
      navEl.querySelectorAll(".nav-name-jm, .nav-link, .nav-social-link").forEach(el => {
        el.classList.toggle("is-peach", isPeach);
      });
    };

    // Matches reference: fires when section enters within 50px of top
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) update(entry.target.dataset.nav);
      });
    }, { rootMargin: "-50px 0px -90% 0px", threshold: 0 });

    const timer = setTimeout(() => {
      document.querySelectorAll("[data-nav]").forEach(s => observer.observe(s));
    }, 100);

    return () => { clearTimeout(timer); observer.disconnect(); };
  }, [visible]);

  if (!visible) return null;

  return (
    <nav
      ref={navRef}
      className="z-[990] flex justify-between items-center w-screen fixed inset-x-0 top-0"
      style={{ marginTop: "2rem", paddingLeft: "4vw", paddingRight: "2vw" }}
    >
      {/* LEFT — wordmark: Lucid · Edge */}
      <div style={{ width: "33%", display: "flex", alignItems: "center" }}>
        <Link
          to="/"
          className="no-underline flex items-center"
          style={{ gap: "0.2rem", paddingTop: "0.5rem", paddingBottom: "0.5rem", paddingRight: "0.5rem" }}
        >
          <span className="nav-name-jm">Lucid</span>
          <div className="dot-jm" />
          <span className="nav-name-jm">Edge</span>
        </Link>
      </div>

      {/* CENTER — About | icon | Work */}
      <ul
        className="m-0 p-0 list-none flex items-center justify-center"
        style={{ width: "33%", gap: 0 }}
      >
        <li style={{ flex: "none" }}>
          <Link to="/about" className="nav-link">About</Link>
        </li>
        <li style={{ flex: "none" }}>
          <Link to="/" className="no-underline inline-flex items-center justify-center">
            <img
              src="/images/le-mark-lime.jpeg"
              alt="Lucid Edge"
              style={{ width: 38, marginTop: "0.4rem", display: "block" }}
            />
          </Link>
        </li>
        <li style={{ flex: "none" }}>
          <Link to="/work" className="nav-link">Work</Link>
        </li>
      </ul>

      {/* RIGHT — social links */}
      <ol
        className="m-0 p-0 list-none flex items-center justify-end"
        style={{ width: "33%" }}
      >
        {SOCIALS.map(({ label, href }) => (
          <li key={label} style={{ flex: "none" }}>
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
  );
}
