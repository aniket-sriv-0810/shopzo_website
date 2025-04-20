import Logo from '../../assets/black-website-logo.png';
const ReviewCard = ({ review }) => {
  return (
    <div className="w-full sm:w-80 bg-white shadow-lg rounded-2xl p-6 border border-gray-300 shadow-gray-400">
      <div className="flex items-center gap-4">
        <img
          src={review.image}// or a default user avatar
          alt="User"
          className="w-10 h-10 rounded-full shadow-md"
        />
        <div>
          <h2 className="text-base font-semibold text-gray-700">
            {review.name || "Anonymous"}
          </h2>
          <p className="text-sm text-gray-500">{review.email}</p>
        </div>
      </div>

      <div className="flex justify-center items-center mt-4">
        {[1, 2, 3, 4, 5].map(rate => (
          <span
            key={rate}
            className={`text-2xl ${review.rating >= rate ? "text-yellow-400" : "text-gray-300"}`}
          >
            ★
          </span>
        ))}
      </div>

      <p className="mt-4 text-gray-600 break-words">{review.comment}</p>
      <div className="flex justify-end items-center mt-6">
        <p className="text-sm text-gray-500 font-semibold">Verified by</p>
        <img src={Logo} alt="Brand logo" className="w-16 ml-2" />
      </div>
    
    </div>
  );
};

export default ReviewCard