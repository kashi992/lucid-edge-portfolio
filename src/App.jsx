import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Home     from "./pages/Home";
import About    from "./pages/About";
import Work     from "./pages/Work";
import Services from "./pages/Services";
import Contact  from "./pages/Contact";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/about"     element={<About />} />
        <Route path="/work"      element={<Work />} />
        <Route path="/services"  element={<Services />} />
        <Route path="/contact"   element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}
