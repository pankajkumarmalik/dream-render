import React from "react";
import Image from "next/image";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import "@splidejs/splide/dist/css/splide.min.css";

function Carousel() {
  const images = [
    "/carousel_images/image1.jpg",
    "/carousel_images/image2.jpg",
    "/carousel_images/image3.jpg",
    "/carousel_images/image4.jpg",
    "/carousel_images/image5.jpg",
    "/carousel_images/image6.jpg",
    "/carousel_images/image7.jpg",
    "/carousel_images/image8.jpg",
    "/carousel_images/image9.jpg",
    "/carousel_images/image10.jpg",
    "/carousel_images/image11.jpg",
    "/carousel_images/image12.jpg",
    "/carousel_images/image13.jpg",
  ];

  return (
    <div className="w-full h-[200px] flex justify-center items-center">
      <Splide
        options={{
          type: "loop",
          autoWidth: true, // Ensures smooth scrolling
          gap: "2px",
          focus: "center",
          perMove: 1,
          perPage: 3,
          drag: true, // Prevents manual dragging that disrupts infinite scrolling
          arrows: false,
          pagination: false,
          trimSpace: false,
          clones: images.length, // Ensures enough clones to prevent gaps
          autoScroll: {
            pauseOnHover: false,
            pauseOnFocus: false,
            speed: 1, // Smooth flow
            autoStart: true,
          },
        }}
        extensions={{ AutoScroll }}
      >
        {images.map((src, index) => (
          <SplideSlide key={index}>
            <div className="relative w-[250px] h-[350px]">
              <Image
                src={src}
                alt={`Carousel Image ${index + 1}`}
                layout="fill"
                objectFit="cover"
                className="rounded-xl border border-white/20"
                priority={index < 3} // Prioritize first 3 images
              />
            </div>
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
}

export default Carousel;
