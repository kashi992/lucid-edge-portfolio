import { useRef, useEffect, useState } from "react";

const SERVICES = [
  "3D Animation",
  "Film & Photography Production",
  "Creative Direction",
  "Visual Effects for TV & Film",
  "TimeLapse Camera",
  "Other",
];

export default function ContactForm() {
  const sectionRef = useRef(null);
  const wrapRef    = useRef(null);

  const [form, setForm]     = useState({ name: "", email: "", service: "", message: "" });
  const [status, setStatus] = useState(null); // null | "sending" | "sent" | "error"

  useEffect(() => {
    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      gsap.set(wrapRef.current, { y: 40, opacity: 0 });
      gsap.to(wrapRef.current, {
        y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 90%", once: true },
      });
    })();
  }, []);

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = e => {
    e.preventDefault();
    setStatus("sending");
    const subject = `Enquiry from ${form.name}`;
    const body    = `Name: ${form.name}\nEmail: ${form.email}\nService: ${form.service}\n\n${form.message}`;
    window.location.href = `mailto:mbeddows@lucidedge.com.au?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("sent");
  };

  const inputStyle = {
    fontFamily: "var(--font)",
    fontSize: "clamp(0.9rem, 1vw, 1.05rem)",
    color: "var(--blue)",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid var(--blue)",
    outline: "none",
    width: "100%",
    padding: "0.9em 0",
    borderRadius: 0,
    opacity: 0.85,
  };

  const labelStyle = {
    fontFamily: "var(--font)",
    fontSize: "0.65rem",
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "var(--grey)",
    opacity: 0.7,
    display: "block",
    marginBottom: "0.3em",
  };

  return (
    <section
      ref={sectionRef}
      data-nav="grey"
      className="w-screen flex flex-col items-center"
      style={{ background: "var(--bg-warm)", paddingBottom: "6vw" }}
    >
      <div
        ref={wrapRef}
        className="w-[90vw] md:w-[80vw] rounded-[2vw] overflow-hidden"
        style={{ border: "1px solid rgba(34,34,34,0.12)", background: "var(--bg-cold)" }}
      >
        {/* Form header */}
        <div
          className="flex flex-col md:flex-row md:items-center justify-between gap-[1.5vw] px-[4vw] py-[3vw]"
          style={{ borderBottom: "1px solid rgba(34,34,34,0.1)" }}
        >
          <h2
            className="m-0 font-extrabold tracking-[-0.03em] leading-[100%]"
            style={{
              fontFamily: "var(--font)",
              fontSize: "clamp(1.4rem, 2.5vw, 3rem)",
              color: "var(--blue)",
            }}
          >
            Start a Project
          </h2>
          <p
            className="m-0 font-medium leading-[160%]"
            style={{
              fontFamily: "var(--font)",
              fontSize: "clamp(0.8rem, 0.9vw, 1rem)",
              color: "var(--grey)",
              maxWidth: "32vw",
            }}
          >
            Fill in the form and we'll get back to you within 24 hours.
          </p>
        </div>

        {/* Form body */}
        <form onSubmit={onSubmit} className="flex flex-col gap-[3vw] px-[4vw] py-[4vw]">

          {/* Name + Email row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[3vw]">
            <div>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text"
                name="name"
                required
                placeholder="Lucid Edge"
                value={form.name}
                onChange={onChange}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                name="email"
                required
                placeholder="hello@yourcompany.com"
                value={form.email}
                onChange={onChange}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Service select */}
          <div>
            <label style={labelStyle}>Service Required</label>
            <select
              name="service"
              required
              value={form.service}
              onChange={onChange}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option value="" disabled>Select a service…</option>
              {SERVICES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div>
            <label style={labelStyle}>Your Message</label>
            <textarea
              name="message"
              required
              rows={5}
              placeholder="Tell us about your project…"
              value={form.message}
              onChange={onChange}
              style={{ ...inputStyle, resize: "none", lineHeight: "165%" }}
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between gap-[2vw] flex-wrap">
            <p
              className="m-0 font-medium"
              style={{
                fontFamily: "var(--font)",
                fontSize: "clamp(0.75rem, 0.85vw, 0.9rem)",
                color: "var(--grey)",
                opacity: 0.6,
              }}
            >
              We'll respond within 24 hours.
            </p>

            <button
              type="submit"
              disabled={status === "sending" || status === "sent"}
              className="flex items-center gap-[1em] font-bold tracking-[-0.01em] rounded-[100vw] px-[2em] py-[0.85em] transition-opacity"
              style={{
                fontFamily: "var(--font)",
                fontSize: "clamp(0.85rem, 1vw, 1.05rem)",
                background: status === "sent" ? "var(--grey)" : "var(--blue)",
                color: status === "sent" ? "var(--bg-warm)" : "var(--orange1)",
                border: "none",
                cursor: status === "sent" ? "default" : "pointer",
                opacity: status === "sending" ? 0.6 : 1,
              }}
            >
              {status === "sending" && "Sending…"}
              {status === "sent"    && "Message Sent ✓"}
              {status === "error"   && "Try Again"}
              {!status              && (
                <>
                  Send Message
                  <span style={{ fontSize: "1.1em", lineHeight: 1 }}>→</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </section>
  );
}
