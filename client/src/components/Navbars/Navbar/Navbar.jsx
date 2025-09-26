import React , {useEffect} from 'react'
import Header from './Header'
import MobileLocationNav from './MobileLocationNav'
import MobileBottomNav from './MobileBottomNav'
import AOS from "aos";
import "aos/dist/aos.css";
import OfferDetail from './OfferDetail'
const Navbar = () => {
   useEffect(() => {
      AOS.init({
        duration: 1500, // Animation duration
        easing: "ease-in-out", // Smooth effect
        mirror: true,
        once: false, // Animation repeats on scroll
      });
    }, []);
  return (
    <div className="w-full">
      <OfferDetail/>
      {/* Header with Logo, Search, Wishlist, and Profile */}
      <Header />
      {/* Mobile-only Location Navigation */}
      <MobileLocationNav />
      {/* Mobile-only Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}

export default Navbar
