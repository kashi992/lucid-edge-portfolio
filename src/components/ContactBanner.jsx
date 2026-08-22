import { useRef, useEffect } from "react";

export default function ContactBanner() {
  const labelRef    = useRef(null);
  const headingRefs = useRef([]);
  const lineRef     = useRef(null);
  const subRef      = useRef(null);
  const detailRefs  = useRef([]);

  const words = ["Get", "In", "Touch"];

  const details = [
    { label: "Email",    value: "mbeddows@lucidedge.com.au", href: "mailto:mbeddows@lucidedge.com.au" },
    { label: "Phone",    value: "+61 (0)414 088 037",        href: "tel:+61414088037" },
    { label: "Location", value: "Suite 5.3, 2-4 Hill St, Surry Hills, Sydney NSW 2010", href: null },
  ];

  useEffect(() => {
    (async () => {
      const { default: gsap } = await import("gsap");

      gsap.set(labelRef.current,    { opacity: 0, y: 16 });
      gsap.set(headingRefs.current, { yPercent: 110 });
      gsap.set(lineRef.current,     { scaleX: 0, transformOrigin: "left center" });
      gsap.set(subRef.current,      { opacity: 0, y: 20 });
      gsap.set(detailRefs.current,  { opacity: 0, y: 14 });

      const tl = gsap.timeline({ delay: 0.35 });

      tl.to(labelRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
        .to(headingRefs.current, {
          yPercent: 0, duration: 1.0, ease: "power4.out", stagger: 0.08,
        }, "-=0.3")
        .to(lineRef.current, { scaleX: 1, duration: 0.8, ease: "power3.inOut" }, "-=0.4")
        .to(subRef.current,  { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.5")
        .to(detailRefs.current, {
          opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.1,
        }, "-=0.4");
    })();
  }, []);

  return (
    <section
      data-nav="grey"
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
          Lucid Edge · Contact
        </p>

        {/* Heading */}
        <h1
          className="m-0 flex flex-wrap font-extrabold tracking-[-0.04em] leading-[92%] gap-[0_0.22em]"
          style={{
            fontFamily: "var(--font)",
            fontSize: "clamp(3rem, 10vw, 12rem)",
            color: "var(--blue)",
          }}
          aria-label="Get In Touch."
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

        {/* Sub-copy + contact details row */}
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
            Have a project in mind? We'd love to hear about it. Reach out and
            let's start a conversation about how Lucid Edge can help bring
            your vision to life.
          </p>

          {/* Contact detail pills */}
          <ul className="m-0 p-0 list-none flex flex-wrap gap-[0.6vw] md:justify-end">
            {details.map(({ label, value, href }, i) => (
              <li
                key={label}
                ref={el => (detailRefs.current[i] = el)}
              >
                {href ? (
                  <a
                    href={href}
                    className="no-underline flex flex-col uppercase font-bold tracking-[0.1em] rounded-[100vw] px-[1.1em] py-[0.45em]"
                    style={{
                      fontFamily: "var(--font)",
                      fontSize: "clamp(0.55rem, 0.7vw, 0.75rem)",
                      color: "var(--blue)",
                      background: "transparent",
                      border: "1px solid var(--blue)",
                      opacity: 0.7,
                    }}
                  >
                    <span style={{ opacity: 0.5, fontSize: "0.85em" }}>{label}</span>
                    <span>{value}</span>
                  </a>
                ) : (
                  <div
                    className="flex flex-col uppercase font-bold tracking-[0.1em] rounded-[100vw] px-[1.1em] py-[0.45em]"
                    style={{
                      fontFamily: "var(--font)",
                      fontSize: "clamp(0.55rem, 0.7vw, 0.75rem)",
                      color: "var(--blue)",
                      background: "transparent",
                      border: "1px solid var(--blue)",
                      opacity: 0.7,
                    }}
                  >
                    <span style={{ opacity: 0.5, fontSize: "0.85em" }}>{label}</span>
                    <span>{value}</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
