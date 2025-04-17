import React from 'react'
import { useUser } from '../../UserContext/userContext';
const NavHeader = () => {
  const { user } = useUser();
  return (
    <div>
      <h1 className="hidden xs:block xs:text-xs sm:text-lg sm:block lg:hidden xl:block text-black font-semibold truncate" data-aos="fade-up">
            <p >Welcome <span className='text-yellow-600 font-semibold capitalize'>{user ? user.name : null}</span> to The Shopzo  </p>
          </h1>
    </div>
  )
}

export default NavHeader
