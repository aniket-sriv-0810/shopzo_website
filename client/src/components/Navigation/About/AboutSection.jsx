import React from "react";

const AboutSection = ({ title, text, imageUrl, reverse }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-12 ${reverse ? "md:flex-row-reverse" : ""} `}>
      <div className="overflow-hidden rounded-2xl shadow-lg my-20" >
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-80 object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="text-center md:text-left">
        <h2 className="text-2xl lg:text-3xl font-bold text-red-700 mb-4">
          {title}
        </h2>
        <p className="text-base text-justify sm:text-lg text-gray-600 leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );
};

export default AboutSection;
