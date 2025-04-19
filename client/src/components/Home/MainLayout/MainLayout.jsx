import React, { useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom';
import AOS from "aos";
import "aos/dist/aos.css";
const slideshowImages = [
  "https://media-hosting.imagekit.io/b0e8d6a814b042f9/slide1.png?Expires=1839649968&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=KtmYWtM1g7PVq3HhvWoS3dhLaIK2MyjgTaXb7lFUkuuHuVbdOBFwabzFXiFc0Xkx7jfQ6tJE8QpJ3Qt-2kx24gXm-1xCPdqLJYM8lSnSIg5shdu~YMTqOQB5i7I9y-n2rkV0v3u7tzVvD2fSH9Q5R8bcJtPmunCqcnhSTKRHP0oHqkdBHeKGa-aNvyoDrXVlVPfmxPvVetNUUBQk4WqNe5Kpb78f3NKN5TzwcrVyz01cpd~Pfoj3gNCwRPgUQq82Q0AQU4H838rDkAlK3-VcyAuL4IT0eDTvsLdDIlUKRZ-ZqmCsPTxHj11JlLyPxl2DBloUIe~pn5UObWWdTuhNGQ__",

  "https://media-hosting.imagekit.io/f34e7c686dcd4c49/slide5.png?Expires=1839649968&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=WT9Rq-lifEBkWU~XBRJzFaWs4yQ7gKpyKp0AetLFZ4XpZIWWRMXZpmudTX~ZKECOoRXP57N76qXonnaWY2pXiGC4GYlyDcBTvYQ7kviqNFWj8nuUKyiGZcRW9jo-E45aGTSHuT1gyUOVgD7ql5gZ-SPwToRa2bzpcVD4F55oxJXy1dAysdsaGx-4TWOeV5Wl4oCd3cXIcKVhvTysJ~mjlE6uhxzHSX4sWUnMLmSHUhwCfkSJFBwxyr1JV5Yi5waTQ7U~MutX-885qC9AbzYPLz5mMPfROgXdfYeALxgmIV57v5bbql4GR8Wd6A8DWbcSU8Rm15By4sxVLGuq3C65-Q__",

  "https://media-hosting.imagekit.io/5e1ee9c6d1fc46f3/slide2.png?Expires=1839649968&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=v2cXzbwkNSNfDEPYL-431Vl6M4EssxDTfx94byCyFWLpoz~S~c6kP-JfsEsigz1QO2sARZDEX099Gw6kg7Sh4H1UgHa4tNAmMNQHYlH~l4VLbsTbxaGKGGBdvrd8M-YuPsxyMhlQDfn47INRoQPtcaXF8ycSSB4vczOeuM6Igu7DD2DL5xGafC2-S961oq29XpNzMR2-SGQk3D5dblSicE3MM-xU87uBPXb~Q-ySYrSEEveM6q0T4Rkecv96NmfstKo0ejekWvQgg-CVnyqD6YY-V6JRJ2ScTdGYNE-NogfF-QyOWqGbYRY1NGNSVyLCQEwSdCm0j40KQ1Jm48UTDg__",

  "https://media-hosting.imagekit.io/d5f56d87b8154001/slide3.png?Expires=1839649968&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=uNVR3NesygIP1Qe9nLxmH~XdpInELGjAbsKUW0C6EoUxU3VU5qOG5qMgCU9soly5D48XiVZM8bTNLmQJBPR8uRVZP4QUYKPmRCyuu7Z~CEvad2MMMIfQwNz3KCTumZRFGVeGycQ~NMRwPwQVUNLzSz3wfkEBP6MlAQ6DTl4mBUQxxaiYTa1Lt3~wkRZBM2CXNWa635Texhb0w5z94-VZyQLTzfJju0ZXRW1iZp7Tf~yRw2rvBSb5~yHO37g2eUNX73nv-37VZC8YF5b58VMJogpdWHFfaGcEF3WCezrETW8VPs-sOHO372ZSKqkJS42IsCc9c~vT1phpO4fRdjaIVw__" ,

  "https://media-hosting.imagekit.io/092091b9aeba4b4a/slide4.png?Expires=1839649968&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=sy0dKpycEqkDy~A5dsFKckF9uSYC6fPoENfDuWlVTKShwt2jVxUST9yPwhvMPG8MVc3Wmndahj0zgC6LMqS4VYAsZblmpemrdh1NhQ40I2yBY2Uf0qTqAo5-ISZti~UlxOd49WanzWB6XuLo2s4qqeQe3WgUJhp-LSCY~Q5~2X9-6iV3NXrPprAcMXwTiySPvPzjA0Yb8nr-ZmPKYEjqkc4zrELQi74bvrUtB9cNwVRax5O~CmkIH2lwD1lQ~Hy1GuFzwwezGHxk1CbU48~UM14~~YlrRDaFgRB5XL89AhlJXwsPJ0CqJX~iRhwAEMM4cZdUW5V3KWQ4ERRJx3N2gg__"
];

const MainLayout = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  // Slideshow every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === slideshowImages.length - 1 ? 0 : prev + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);
 useEffect(() => {
      AOS.init({
        duration: 1500, // Animation duration
        easing: "ease-in-out", // Smooth effect
        mirror: true,
        once: false, // Animation repeats on scroll
      });
    }, []);
  return (
    <div className="bg-gradient-to-tr from-pink-400 to-slate-800 p-4 sm:p-6 space-y-10 max-w-screen-2xl mx-auto">
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center" data-aos="fade-down">
        {/* Slideshow */}
        <div className="w-full h-[250px] sm:h-[360px] rounded-xl overflow-hidden shadow-md">
          <img
            src={slideshowImages[currentIndex]}
            alt="Slideshow"
            className="w-full h-full object-cover transition-all duration-700"
          />
        </div>

        {/* Static Image with Button */}
        <div className="relative w-full h-[250px] sm:h-[320px] rounded-xl overflow-hidden shadow-md" >
          <img
            src="https://media-hosting.imagekit.io/5c298a81f65844e9/couple-fashion.jpg?Expires=1839072431&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=ZkcXNBk~XjicdM-4jwL61JMFD~wn8T02-S51PHlbBR7Wn-zOd1QvzHb5uSyDBuhquS7F1s7zbX1edJ9~hwv-vC2-Gl-OEhBqAmox8JYoMvyqF5~CZ2iiLjFyrWTsdIqgMKnYCqh8dAFm2RfF~I64piCdoIz2ch-ISFxar5BogBW3QeYqE~nJJadIHqBze1CAdjwQncvKul0dddGjXYbmuoUksCNQ9dZ3hkzQm8mqjRz3SLyQMtljTSBLPplABJ02qDf2IlAIfp3rWTkc-0vvh9DnvRczosaMIfgHLwNDrLaerVGYLdreFAcrAobAVBJCQHH6cPvwEPKTwf8cUaFmpg__"
            alt="Promo"
            className="w-full h-full object-cover"
            data-aos="fade-up"
          />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <button onClick={() => navigate('/categories')} className="bg-gradient-to-r from-indigo-600 to-pink-500 hover:from-indigo-700 hover:to-pink-600 hover:cursor-pointer text-white font-semibold py-2 px-6 rounded-full shadow-md">
              Explore Now
            </button> 
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Landscape */}
        <div className="md:col-span-2 w-full h-[200px] sm:h-[330px] rounded-xl overflow-hidden shadow-md" data-aos="fade-up">
          <img
            src="https://media-hosting.imagekit.io/9327923c629e4505/p3.jpg?Expires=1839650861&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=mCW3SlRaMrGuUSd~dUCibekuyYCERmk0ix4pM-N5abVyQtuORt2cDCJhBlsiDNYSEy7htwNb1Uk6XSBx3L~VzxrqshkBr2HnRqBbrXGfDPh851-ne1O6nZ8acxlHaY5baoufs3~WDlvhiCe8MCKrGRQCqI79a2-0bhOTj741PqdaLS2~hisFtDuBxnzThO6vZhKrs2SrTYw1I61ndxttamhkvvblt8uEXMuc0PKD-MBL9KASSBB9F57au56FjgMbOQVK4CZ3nnOfIEuP3DPMuQeTjIsMZ0I9yJQ2BicFRb9s1cCsZh8CnK8x5u3gNXV0caLlur0v-W1XEBnUGNIpmg__"
            alt="Landscape"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Portraits */}
        <div className="flex gap-6">
          <div className="w-full  rounded-xl overflow-hidden shadow-md" data-aos="fade-down">
            <img
              src="https://media-hosting.imagekit.io/aeab8893369048a9/m1.png?Expires=1839650734&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=Zq3jUGlg1sCD-lq2ZqniJIwT0k5E7FiD475bJmPZ2HXzfRhmEHAWl0~DjJUuEq1Nf80X9QroKe~sqxpvavGmAMgKmxZU3kwLBkG14OW83icWnwdVxFZHP7dKooeGcRQUAlnQxas23PKWVaz17RfXIF2KaRfbgbasVwCRJZYL9dAS9QkJCmudWH1u5sco4wOdkCkKduvzZQjZxublinkfLtoZ-Aa5zhygQEfYxOpSC9Wb05rkxZhqWHLbod5MXeeqBOUQqY3FfQIkYi0F4YE6DDWZ0x4JEIAHRUaEr9dfvJp0pbZ--~zqBoHHsdm736e7Q0fjVmTEtWArJe6ySOm7qg__"
              alt="Portrait 1"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full  rounded-xl overflow-hidden shadow-md" data-aos="fade-up">
            <img
              src="https://media-hosting.imagekit.io/5fc1ef6edf534e0c/m2.jpeg?Expires=1839650734&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=m3qTVGhx1jdcU~f7bi~H9smwvwzTZQzdU0SY~x8LKFx9rYHbBxsbE-tYhb~bRP8jtZZXyRhquYHPq45Zvv0NLrj3IsKlC~rlaPWRB1aHAA0L8gmIXD1~SmTg42SombNpvBlkatSODmH3RcqIMay2GQqP2QHlnRd9HDPWl1xsp4~ivHq-dgp9Ify7WQqvkIqPsXS-oRPXf7nxf35Sj3UUBTHgPrFZ0WShtJ2YLXWTXuT9X2-vVO3n5Q3hGj4KsNkN4MjOPXDQK8egsuHwQ-vBGztFDhVYTykKITbtPm~XVw8CGuliGp3z-S97SvdotWpPzlresgmBi3f2F2eRnSXV1g__"
              alt="Portrait 2"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
