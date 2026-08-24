import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { SOCIALS } from "../data/services";

const NAV_LINKS = [
  { label: "About", to: "/about" },
  { label: "Work",  to: "/work"  },
];

const NAV_ITEMS = [
  { label: "About Us",  to: "/about"    },
  { label: "Our Work",  to: "/work"     },
  { label: "Services",  to: "/services" },
  { label: "Contact",   to: "/contact"  },
];

export default function Navbar({ visible }) {
  const navRef   = useRef(null);
  const { pathname } = useLocation();

  /* ── Entrance animation ── */
  useEffect(() => {
    if (!visible) return;
    (async () => {
      const { gsap } = await import("gsap");
      gsap.from(navRef.current, { y: -28, opacity: 0, duration: 0.7, ease: "power3.out", delay: 0.15 });
    })();
  }, [visible]);

  /* ── Nav color switch ── */
  useEffect(() => {
    if (!visible) return;
    const navEl = navRef.current;
    if (!navEl) return;

    const update = (theme) => {
      document.querySelectorAll(".nav-name-jm, .nav-link, .nav-social-link, .nav-link-mobile").forEach(el => {
        el.classList.toggle("is-peach", theme === "peach");
      });
    };

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

  /* ── Logo hover animation ──
     Text chars: drift up y:-2px then return y:0 (stagger 0.1s, power2.out)
     Dot:        instant y:-10px scale:1.2, then elastic bounce back (0.7s, amplitude:1 period:0.3)
  ── */
  useEffect(() => {
    if (!visible) return;
    (async () => {
      const { gsap } = await import("gsap");
      const navEl = navRef.current;
      if (!navEl) return;

      const wordmark = navEl.querySelector(".nav-wordmark");
      if (!wordmark) return;

      // Split both name spans into chars
      wordmark.querySelectorAll(".nav-name-jm").forEach(span => {
        const text = span.textContent;
        span.innerHTML = text
          .split("")
          .map(ch => `<span class="nav-char">${ch}</span>`)
          .join("");
      });

      const chars = [...wordmark.querySelectorAll(".nav-char")];
      const dot   = wordmark.querySelector(".dot-jm");

      const onEnter = () => {
        const tl = gsap.timeline({ overwrite: true });
        // Chars: drift up
        tl.to(chars, { y: -2, duration: 0.2, stagger: { each: 0.05 }, ease: "power2.out" }, 0);
        // Chars: return
        tl.to(chars, { y: 0,  duration: 0.2, stagger: { each: 0.05 }, ease: "power2.out" }, 0.2);
        // Dot: instant jump
        tl.set(dot, { y: -10, scale: 1.2 }, 0);
        // Dot: elastic return
        tl.to(dot, { y: 0, scale: 1, duration: 0.7, ease: "elastic.out(1, 0.3)" }, 0.5);
      };

      const onLeave = () => {
        gsap.killTweensOf([chars, dot]);
        gsap.set([chars, dot], { y: 0, scale: 1 });
      };

      wordmark.addEventListener("mouseenter", onEnter);
      wordmark.addEventListener("mouseleave", onLeave);
    })();
  }, [visible]);

  /* ── Typing hover animation — matches reference site exactly ──
     Stage 1: chars fade OUT + move up y:-2px  (0.2s, stagger 0.1s, power3.out)
     Stage 2: chars fade IN  + return y:0      (0.3s, starts at t=0.2, stagger 0.1s, power3.out)
  ── */
  useEffect(() => {
    if (!visible) return;
    const cleanups = [];

    (async () => {
      const { gsap } = await import("gsap");
      const navEl = navRef.current;
      if (!navEl) return;

      navEl.querySelectorAll(".nav-link, .nav-social-link").forEach(link => {
        // Split text into individual character spans
        const original = link.textContent;
        link.innerHTML = original
          .split("")
          .map(ch => ch === " " ? " " : `<span class="nav-char">${ch}</span>`)
          .join("");

        const chars = [...link.querySelectorAll(".nav-char")];
        let tl = null;

        const onEnter = () => {
          if (tl) tl.kill();
          tl = gsap.timeline();
          // Stage 1: fade out + drift up
          tl.to(chars, {
            opacity: 0,
            y: -2,
            duration: 0.2,
            stagger: { each: 0.05 },
            ease: "power3.out",
          });
          // Stage 2: fade in + return (starts right after stage 1)
          tl.fromTo(chars,
            { opacity: 0, y: 4 },
            {
              opacity: 1,
              y: 0,
              duration: 0.3,
              stagger: { each: 0.05 },
              ease: "power3.out",
            },
            "-=0.1"
          );
        };

        const onLeave = () => {
          if (tl) tl.kill();
          gsap.set(chars, { opacity: 1, y: 0 });
        };

        link.addEventListener("mouseenter", onEnter);
        link.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          link.removeEventListener("mouseenter", onEnter);
          link.removeEventListener("mouseleave", onLeave);
        });
      });
    })();

    return () => cleanups.forEach(fn => fn());
  }, [visible]);

  if (!visible) return null;

  return (
    <>
    <nav
      ref={navRef}
      className="z-[990] flex justify-between items-center w-full fixed inset-x-0 top-0 mt-4 md:px-[2vw] px-4"
    >
      {/* LEFT — wordmark */}
      <div className="flex items-center" style={{ flex: "0 0 33%", minWidth: 0 }}>
        <Link
          to="/"
          className="nav-wordmark no-underline flex items-center gap-2 whitespace-nowrap p-2 backdrop-blur-[10px] rounded-full"
        >
          <img
            src="/images/LE_logotype_lime.png"
            alt="Lucid Edge"
            className="block object-contain"
            style={{ height: "1.4rem", pointerEvents: "none" }}
          />
        </Link>
      </div>

      {/* CENTER — spacer */}
      <div style={{ flex: "0 0 33%" }} />

      {/* RIGHT — nav links (hidden on mobile) */}
      <ul
        className="m-0 p-0 list-none hidden md:flex items-center justify-end gap-3"
        style={{ flex: "0 0 33%", minWidth: 0 }}
      >
        {NAV_ITEMS.map(({ label, to }) => (
          <li key={to} style={{ flex: "none" }}>
            <Link
              to={to}
              className={`nav-link is-peach${pathname === to ? " is-active" : ""}`}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      {/* COMMENTED OUT — social links (Email, Facebook, Instagram, Phone) */}
      {/* <ol
        className="m-0 p-0 list-none hidden md:flex items-center justify-end"
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
      </ol> */}
    </nav>

    {/* Mobile bottom nav */}
    <div className="nav-menu-mobile md:hidden">
      {NAV_ITEMS.map(({ label, to }) => (
        <Link
          key={to}
          to={to}
          className={`nav-link-mobile${pathname === to ? " is-active" : ""}`}
        >
          {label}
        </Link>
      ))}
    </div>
    </>
  );
}
