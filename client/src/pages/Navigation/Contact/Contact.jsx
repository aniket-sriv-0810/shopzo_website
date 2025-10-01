// Contact.js (Main Page)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../components/UserContext/userContext';
import { authAxios } from '../../../utils/auth';
import Navbar from '../../../components/Navbars/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import ContactHeader from '../../../components/Navigation/Contact/ContactHeader';
import ContactInfo from '../../../components/Navigation/Contact/ContactInfo';
import ContactForm from '../../../components/Navigation/Contact/ContactForm';
import ContactFooter from '../../../components/Navigation/Contact/ContactFooter';
import ErrorPopup from '../../../components/Popups/ErrorPopUp';

const Contact = () => {
  const { user } = useUser();
  const [contact, setContact] = useState({ message: "" });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleInput = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const dataSent = { user: user._id, message: contact.message };
      console.log("Data sent:", dataSent);

      const response = await authAxios.post(`/api/navigation/contact`, dataSent);

      if (response.status === 200) {
        setContact({ message: "" });
        navigate('/contact/confirmed');
      }
    } catch (error) {
      setError("Failed to send feedback! Please try again later");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <div className="border-1 border-gray-300">
        <Navbar />
      </div>
      <div className="text-center">
        {error && <ErrorPopup message={error} onClose={() => setError("")} />}
      </div>
      <section className="bg-gradient-to-tr from-teal-400 to-slate-500 text-gray-900 py-16 px-6 md:px-12 lg:px-24 xl:px-32">
        <div className="max-w-7xl mx-auto">
          <ContactHeader />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-24">
            <ContactInfo />
            <ContactForm handleInput={handleInput} handleSubmit={handleSubmit} contact={contact} user={user} loading={loading} />
          </div>
          <div className='my-32'>
            <ContactFooter />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Contact;
