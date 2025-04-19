import React from "react";
import { FaShareAlt } from "react-icons/fa";

const ShareBtn = ({ productName, productLink }) => {
  const handleShare = async () => {
    const shareData = {
      title: `Check out this hotel: ${productName}`,
      text: `I found this amazing hotel called ${productLink}. You can check it out here:`,
      url: hotelLink,
    };

    try {
      if (navigator.share) {
        // Use the Web Share API if available
        await navigator.share(shareData);
      } else {
        // Fallback for browsers without Web Share API
        navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      }
    } catch (error) {
    }
  };

  return (
   <div onClick={handleShare} >
      <FaShareAlt className="w-6 h-6  text-white hover:scale-110  " />
      </div>
  );
};

export default ShareBtn;
