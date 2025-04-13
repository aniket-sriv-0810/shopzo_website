import React from "react";
import Navbar from "../../../components/Navbars/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import AboutHeader from "../../../components/Navigation/About/AboutHeader";
import AboutSection from "../../../components/Navigation/About/AboutSection";
import WhyChooseUs from "../../../components/Navigation/About/WhyChooseUs";
import Testimonial from "../../../components/Navigation/About/Testimonial";
import CallToAction from "../../../components/Navigation/About/CallToAction";

const About = () => {
  return (
    <>
      {/* Navbar */}
      <div className="bg-gradient-to-r from-slate-600 to-slate-800">
        <Navbar />
      </div>

      {/* About Content */}
      <section className="bg-gradient-to-b from-gray-100 to-gray-50 text-gray-900 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <AboutHeader />

          <AboutSection
  title="Who We Are"
  text="At The Shopzo, we're building a bridge between offline vendors and the digital world. Our platform empowers local sellers to showcase their products online by category, making it easy for users to discover, explore, and reserve items—while supporting in-person purchases from trusted nearby stores."
  imageUrl="https://images.unsplash.com/photo-1556740749-887f6717d7e4"
/>

<AboutSection
  title="Our Mission"
  text="Our mission is to bring visibility to authentic, offline businesses and create a seamless browsing experience for customers. We envision a world where technology uplifts traditional commerce, making local shopping efficient, personalized, and community-driven."
  imageUrl="https://images.unsplash.com/photo-1556740749-887f6717d7e4"
  reverse
/>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-16">
            <div className="order-2 md:order-1">
              <WhyChooseUs />
            </div>
            <div className="overflow-hidden rounded-2xl shadow-lg order-1 md:order-2">
              <img
                src="https://images.unsplash.com/photo-1556740749-887f6717d7e4"
                alt="Why Choose Us"
                className="w-full h-80 object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          <Testimonial />
          <CallToAction />
        </div>
      </section>

      <Footer />
    </>
  );
};

export default About;
