import { useEffect, useState } from "react";
import axios from "axios";

const CategoryDropdown = ({ value, onChange }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/category`, { withCredentials: true })
      .then((res) => {
        console.log(res.data);
        setCategories(res.data.data.categories || []);
      })
      .catch(() => setCategories([]));
  }, []);

  return (
    <div>
      <label className="block font-medium mb-2 text-gray-700">Select Category</label>
      <select
        name="category"
        value={value}
        onChange={onChange}
        required
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
      >
        <option value="">Select...</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.title} - {cat.tag}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryDropdown;
