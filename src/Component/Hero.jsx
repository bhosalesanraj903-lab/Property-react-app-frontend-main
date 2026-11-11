import { useEffect, useState } from "react";
import chinese from "../assets/images/chinese-city.jpg";
import door from "../assets/images/door-opening.jpg";
import pexel from "../assets/images/pexels-curtis.jpg";

export default function Hero() {
  const [text, setText] = useState({
    title: "Welcome",
    subtitle: "Delicious Food Awaits"
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("carouselText"));
    if (saved) setText(saved);
  }, []);

  return (
    <div className="container-fluid">
      <div className="px-3 px-md-5 position-relative">

        {/* Overlay Text */}
        <div
          className="
            position-absolute 
            top-50 start-50 translate-middle 
            text-center text-white 
            bg-dark bg-opacity-50 
            rounded
          "
          style={{
            zIndex: 10,
            padding: "clamp(12px, 2vw, 32px)"
          }}
        >
          <h1
            className="fw-bold"
            style={{
              fontSize: "clamp(1.5rem, 4vw, 4rem)",
              lineHeight: 1.1
            }}
          >
            {text.title}
          </h1>

          <p
            style={{
              fontSize: "clamp(0.9rem, 1.5vw, 1.5rem)",
              marginBottom: 0
            }}
          >
            {text.subtitle}
          </p>
        </div>

        {/* Carousel */}
        <div
          id="carouselExampleSlidesOnly"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner rounded overflow-hidden">

            <div className="carousel-item active">
              <div className="ratio ratio-21x9">
                <img
                  src={chinese}
                  className="img-fluid w-100 h-100 object-fit-cover"
                  alt="..."
                />
              </div>
            </div>

            <div className="carousel-item">
              <div className="ratio ratio-21x9">
                <img
                  src={pexel}
                  className="img-fluid w-100 h-100 object-fit-cover"
                  alt="..."
                />
              </div>
            </div>

            <div className="carousel-item">
              <div className="ratio ratio-21x9">
                <img
                  src={door}
                  className="img-fluid w-100 h-100 object-fit-cover"
                  alt="..."
                />
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
