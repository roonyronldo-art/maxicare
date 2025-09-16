"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import useConfig from "@/lib/useConfig";
import { pb } from "@/lib/pocketbase";

export default function ImageCarousel() {
  const { config } = useConfig();

  const slides = [
    {
      img: (() => {
        let v = config?.carousel_img1;
        if (Array.isArray(v)) v = v[0];
        if (!v || v.trim() === "") return "/images/slide1.jpg";
        return v;
      })(),
      caption: config?.carousel_caption1 ?? "",
      imgField: "carousel_img1",
      capField: "carousel_caption1",
    },
    {
      img: (() => {
        let v = config?.carousel_img2;
        if (Array.isArray(v)) v = v[0];
        if (!v || v.trim() === "") return "/images/slide2.jpg";
        return v;
      })(),
      caption: config?.carousel_caption2 ?? "",
      imgField: "carousel_img2",
      capField: "carousel_caption2",
    },
    {
      img: (() => {
        let v = config?.carousel_img3;
        if (Array.isArray(v)) v = v[0];
        if (!v || v.trim() === "") return "/images/slide3.jpg";
        return v;
      })(),
      caption: config?.carousel_caption3 ?? "",
      imgField: "carousel_img3",
      capField: "carousel_caption3",
    },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  const current = slides[index];
  // Ensure we never pass empty string to Image src
  const rawImg = current.img && current.img.trim() !== "" ? current.img : "/images/slide1.jpg";
  const src = rawImg.startsWith("http") || rawImg.startsWith("/")
    ? rawImg
    : pb.files.getURL(config, rawImg);

  return (
    <div className="relative w-full h-60 md:h-72 overflow-hidden rounded-xl shadow-lg">
      <Image
        data-field={current.imgField}
        src={src}
        alt="Carousel Slide"
        fill
        className="object-cover w-full h-full transition-opacity duration-700"
        priority
      />
      {current.caption && (
        <div
          data-field={current.capField}
          className="absolute bottom-0 w-full bg-black/50 text-white py-2 text-center text-lg"
          suppressHydrationWarning
        >
          {current.caption}
        </div>
      )}
      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`block w-3 h-3 rounded-full ${i === index ? "bg-white" : "bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
}
