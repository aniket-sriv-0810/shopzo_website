import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const images = [
  "https://media-hosting.imagekit.io/0cf10f43f7ed4c23/s1.png?Expires=1839652445&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=feAKp4HkRbyy39HT-rlXkrmWMz48uwTqDhzgErk7pNcR5c02H0xA6E4rRKwi12~VMFWuDOtwXINFnsUy5-WtPMQtiQCfkdzVuER~aoL6JaP3cl18nXPmmhGSxsplt06PKZltbwuiCpvG7MSq8w~raAmQI~6uE4d8w5MJEq7A6LzpQu349NIHKGHxNcdha0ENsVUvokYWnOuvDZXlFrp33VnHOt8rorhEGBykhQXGVsnK6h~JxCI6kuwDRYZypmmOddemXW7qGEAu46J1YU9uVF90SqKbjlH0tOBc061o2G~-PxC7~mJGMGdMjKx4OmzdpykAxZqziCToKbyMR-bK~w__",

  "https://media-hosting.imagekit.io/469bc096e63846e4/s3.png?Expires=1839652445&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=I~eqmD7KyjVVyhAtPNqv3kM131KnQvnwS2vY6uQhQZ96ZwukrFq7DKaiYTJveBNSVZZCNoaMZPOLx6biHknZMw8gehrSvNq6kHTOYJp6541LCCLQxsbh1HqhcRfzOrbSXGyUPICklUJ1NOsHX9Gav~Trn6Df~pXPCjbcZWDY7ub5~t6t1IeIjAlQOFgEo~tUgS1qKvoX~asL2eNc0Uwf4ech8NMb9irzwnCHLadFk~rjud6RoXyA7L-5xp9CcSeFAj3WG74TeHN4zVaMlhCDjSktU0Z53lhWroxSgaVuJOuvC4aH4Nzecuhn-pUDFfPAlQAiVZ9FVyB4m0daVnHcOA__",

  "https://media-hosting.imagekit.io/b52a6cd721b44cf3/ptr2.png?Expires=1839650464&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=N3jjpvnS4azn7JM8-wtik~1FOiWmBpBQfzlZPbjdzaC3WhYRA7JKxAHoi4h341gPD54H2Rc5uHfXPknCpkYf5Fv3BME0D2ZET97tCVPsnZlgo8xEDid1PVNEArZFMXiISMF24-qjZlm24x5fWAkIWGxgkcrs2T4bb85UvnQ2umliQDE9v2bBJyATM-gFtPYi0309odLavXWyVRkhrpkAg1GLXEQePrLaz3pWgYjXK592jZ9mCxYoO~Ptszaaxi4LAF87gk8qjcSPuKVZgrF8uez5IaBeEyBEzTZ70hzB6KMXG7RQHgeweIpqL-rPuA22xSPPLDAHJE1ac7ILQKWb5g__",
 
  "https://media-hosting.imagekit.io/1231df36709a4fc2/s2.png?Expires=1839652445&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=oBLUy98nahYM7GYuIDr~5-eA9usVnG3k62Ccsga0JQh9QwX4CYkhClRiS5DsOC-CXFm0QC8uAVoDUnwapGAgEPjuo7wBJUTAgMPe5JLGeb74c7awJr3P7GZnkyVbP8ths-Hccj13CXj6R87RHmqptayOX1S8cVUzdzpuztVBVBNXmck-sohr6tZtwM256WJj5wWk1oCvP2zi620Wld1HlSvRSz7IZGFJRkMeIuE-QjSHR4jFjD6yudGRHvE~9eDpnbLycVgorlTECYTHvhHRqt76RBvyhMb6ulBdap3B9cAUTyEALQ88DTw8sGPcGw-aJ~xJWVcj4qaRq3ADp0bOcA__" ,

  "https://media-hosting.imagekit.io/f34e7c686dcd4c49/slide5.png?Expires=1839649968&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=WT9Rq-lifEBkWU~XBRJzFaWs4yQ7gKpyKp0AetLFZ4XpZIWWRMXZpmudTX~ZKECOoRXP57N76qXonnaWY2pXiGC4GYlyDcBTvYQ7kviqNFWj8nuUKyiGZcRW9jo-E45aGTSHuT1gyUOVgD7ql5gZ-SPwToRa2bzpcVD4F55oxJXy1dAysdsaGx-4TWOeV5Wl4oCd3cXIcKVhvTysJ~mjlE6uhxzHSX4sWUnMLmSHUhwCfkSJFBwxyr1JV5Yi5waTQ7U~MutX-885qC9AbzYPLz5mMPfROgXdfYeALxgmIV57v5bbql4GR8Wd6A8DWbcSU8Rm15By4sxVLGuq3C65-Q__",

  "https://media-hosting.imagekit.io/63b3ce1f9cc94e84/s5.png?Expires=1839652445&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=m0uOvT70-KPD-wdqD2hO1-Hg9LLspHrOahCjA95izvbV4obTQP3pKbGl~~VSuLoTlYWCHxrUI1flmtQC30VuxZZ-gMxtTCFgdI6nX7B1YoegtEBgS2j7iWw8mb-z~Y9wzrR5PdImKdrO3onLOxDzQNlb6xEJKqo36bCrSeo9hvGXuyG3~Fu4kLzs~2sRYk4ysSPmFuD8uk~E2W2zBwgnyNooKS61YfqmoyS8baek~~ctZpN8Xh4q-pD71TBH-YVOd8yPMDR~xHZFGRw4VBQNJ9SObL5UfdXS1jUeWw6cKhC-UjiMz5hJka-E2JJiDcN90T97ZGtZqoiROx7QqZM8MQ__"

];

const Slideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // Auto slide every 3 seconds

    return () => clearInterval(interval);
  }, [currentIndex]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <>
      <h1 className="text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-gray-700 text-center mb-10 mt-12 ">
  Explore our Top Collections
</h1>
    
    <div className="relative w-[90%] max-w-6xl mx-auto overflow-hidden rounded-2xl shadow-lg">
   

      <div className="relative w-full h-80 sm:h-[400px] md:h-[550px] lg:h-[650px]">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index + 1}`}
            className={`absolute w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-600 bg-opacity-50 p-1 rounded-full text-white hover:bg-opacity-75 transition"
      >
        <FaArrowLeft size={16} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-600 bg-opacity-50 p-1 rounded-full text-white hover:bg-opacity-75 transition"
      >
        <FaArrowRight size={16} />
      </button>

      {/* Indicator Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-1 h-1 rounded-full transition ${
              index === currentIndex ? "bg-white" : "bg-gray-700"
            }`}
          ></button>
        ))}
      </div>
    </div>
    </>
  );
};

export default Slideshow;
