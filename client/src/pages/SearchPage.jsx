import React from 'react';
import Navbar from '../components/Navbars/Navbar/Navbar';
import SearchBox from '../components/Home/SearchBox/SearchBox';

const SearchPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navbar - Same as Home Page */}
      <Navbar />

      {/* Search Content */}
      <div className="container mx-auto">
        <SearchBox />
      </div>
    </div>
  );
};

export default SearchPage;