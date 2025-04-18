import React from "react";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useUser } from "./components/UserContext/userContext";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import About from "./pages/Navigation/About/About";
import Contact from "./pages/Navigation/Contact/Contact";
import Policies from "./pages/Navigation/Policies/Policies";
import Login from "./pages/Authentication/Login/Login";
import SignUp from "./pages/Authentication/SignUp/SignUp";
import Logout from "./components/Logout/Logout";
import AddCategoryForm from "./pages/Category/AddCategoryForm";
import AddProductForm from "./pages/Product/AddProductForm";
import EditCategory from "./pages/Category/EditCategory";
import DeleteCategory from "./pages/Category/DeleteCategory";
import ShowProduct from "./pages/Product/ShowProduct";
import EditProduct from "./pages/Product/EditProduct";
import AddVendor from "./pages/Vendor/AddVendor";
import ShowVendor from "./pages/Vendor/ShowVendor";
import EditVendor from "./pages/Vendor/EditVendor";
import DeleteVendor from "./pages/Vendor/DeleteVendor";
import ShowCategory from "./pages/Category/ShowCategory";
import UserAccount from "./pages/User/UserAccount";
import AdminHome from "./pages/Admin/AdminHome";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminUser from "./pages/Admin/AdminUser";
import AdminVendor from "./pages/Admin/AdminVendor";
import AdminCategory from "./pages/Admin/AdminCategory";
import AdminProduct from "./pages/Admin/AdminProduct";
import AdminFeedback from "./pages/Admin/AdminFeedback";
import AdminBooking from "./pages/Admin/AdminBooking";
import AllVendors from "./pages/Vendor/AllVendors";
import UserAccountDelete from "./pages/User/UserAccountDelete";
import UserAccountEdit from "./pages/User/UserAccountEdit";
import AllCategories from "./components/Category/AllCategory/AllCategory";
import UserWishlists from "./pages/User/UserWishLists";
import PrivateRoute from "./components/UserContext/PrivateRoute";
import IsAdmin from "./components/UserContext/IsAdmin";
import AdminRoute from "./components/UserContext/AdminRoute";
import PageNotFound from "./pages/Loaders/PageNotFound";
import AuthSuccessPopup from "./pages/Loaders/AuthSuccessPopup";
import SuccessLoader from "./pages/Loaders/SuccessLoader";
import ContactUsLoader from "./pages/Loaders/ContactUsLoader";
import UserBooking from "./pages/User/UserBooking";
import "./App.css";
import ErrorToast from "./components/Popups/ErrorToast";
import ErrorPopup from "./components/Popups/ErrorPopUp";
import UserPasswordChange from "./pages/User/UserPasswordChange";
import VendorLoginForm from "./pages/Authentication/VendorLogin/VendorLoginForm";
import AddCategoryToVendor from "./pages/Vendor/AddCategoriesToVendor";
import VendorAccount from "./pages/Vendor/VendorAccount/VendorAccount";
import VendorCategories from "./pages/Vendor/VendorCategories/VendorCategories";
import VendorProducts from "./pages/Vendor/VendorProducts/VendorProducts";
import VendorFilteredProducts from "./pages/Vendor/VendorFilteredProducts/VendorFilteredProduct";
import UserVendorWishlists from "./pages/User/UserVendorWishlists";
import ShowVendorProducts from "./components/Vendors/VendorShow/ShowVendorProducts";
import DeleteSuccessToast from "./components/Popups/DeleteSuccessToast";
function App() {
  const { setUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  // Simulate a loading state only for Home and Admin Dashboard pages
  useEffect(() => {
    const targetPaths = ["/", "/admin"];
    if (targetPaths.includes(location.pathname)) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2500);

      return () => clearTimeout(timer); // Cleanup the timer on unmount
    } else {
      setIsLoading(false);
    }
  }, [location]);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, [setUser]);

  return (
    <>
      {isLoading ? (
        // Display loading animation while isLoading is true
        <div className="loading-page flex flex-col justify-center gap-6 items-center h-screen">
          <DotLottieReact
            src="https://lottie.host/e32980de-2d5a-4f0c-96ae-853d398fecab/qJq4lBxhtz.lottie"
            loop
            autoplay
            className="w-40 h-40"
          />
          <p className="uppercase text-lg font-bold text-gray-900 animate-pulse py-2">
            Loading...
          </p>
        </div>
      ) : (
        <Routes>
          {/* Home & Other Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/policies" element={<Policies />} />
          <Route
            path="/contact"
            element={
              <PrivateRoute>
                <Contact />
              </PrivateRoute>
            }
          />
          <Route
            path="/contact/confirmed"
            element={
              <PrivateRoute>
                <ContactUsLoader />
              </PrivateRoute>
            }
          />



          {/* User Authentication Routes*/}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/logout" element={<Logout />} />


              {/* Product Routes - CLIENT Side */}
          <Route path="/product/:id" element={<ShowProduct />} />
        
              {/* Category Routes - CLIENT Side */}
          <Route path="/categories" element={<AllCategories />} />
          <Route path="/category" element={<AllCategories />} />
          <Route path="/category/:id/:tag/products" element={<ShowCategory />} />

            {/* User Routes - CLIENT Side */}
          <Route
            path="/user/:id/account"
            element={
              <PrivateRoute>
                <UserAccount />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/:id/account/edit"
            element={
              <PrivateRoute>
                <UserAccountEdit />
              </PrivateRoute>
            }
          />
           <Route
            path="/user/:id/account/delete"
            element={
              <PrivateRoute>
                <UserAccountDelete />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/:id/account/change-password"
            element={
              <PrivateRoute>
                <UserPasswordChange />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/:id/account/wishlists"
            element={
              <PrivateRoute>
                <UserWishlists />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/:id/account/vendor-wishlists"
            element={
              <PrivateRoute>
                <UserVendorWishlists />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/:id/account/bookings"
            element={
              <PrivateRoute>
                <UserBooking />
              </PrivateRoute>
            }
          />
 
              {/* Admin Routes - ADMIN Side */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              </PrivateRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <IsAdmin>
                  <AdminHome />
                </IsAdmin>
              </PrivateRoute>
            }
          >
            <Route path="users" element={<AdminUser />} />
            <Route path="vendors" element={<AdminVendor />} />
            <Route path="categories" element={<AdminCategory />} />
            <Route path="products" element={<AdminProduct />} />
            <Route path="bookings" element={<AdminBooking />} />
            <Route path="feedbacks" element={<AdminFeedback />} />
            <Route path="add-category" element={<AddCategoryForm />} />
            <Route path="add-product" element={<AddProductForm />} />
            <Route path="add-vendor" element={<AddVendor />} />
            <Route
              path="category/:id/edit-category"
              element={<EditCategory />}
            />
            <Route
              path="category/:id/delete-category"
              element={<DeleteCategory />}
            />
            <Route path="product/:id/edit" element={<EditProduct />} />
            <Route path="product/:id/delete" element={<EditProduct />} />
           
            <Route
              path="vendor/:id/account/delete"
              element={<DeleteVendor />}
            />
          </Route>
          <Route
            path="/admin/vendor/:vendorId/add-category"
            element={<AddCategoryToVendor />}
          />
            {/* Vendor Routes - VENDOR Side */}
          <Route path="/vendor/login" element={<VendorLoginForm />} />
          <Route path="/vendor/:id/account" element={<VendorAccount />} />
          <Route path="/vendor/:id/account/categories-listed" element={<VendorCategories />}/>
          <Route path="/vendor/:id/account/products-listed" element={<VendorProducts />}/>
          <Route path="/vendor/:id/:categoryId/:tag/all-products" element={<VendorFilteredProducts />}/>

             {/* Vendor Routes - CLIENT Side */}
          <Route path="/vendors" element={<AllVendors />} />
          <Route path="/all-vendors" element={<AllVendors />} />
          <Route path="/vendor" element={<AllVendors />} />
          <Route path="/vendor/:id/details" element={<ShowVendor />} />
          <Route path="/vendor/:id/details/:categoryId/:tag/all-products" element={<ShowVendorProducts />} />
          <Route path="/vendor/:id/details" element={<ShowVendor />} />
          
          {/*Loader Routes */}
          <Route path="/auth/successfully" element={<AuthSuccessPopup />} />
          <Route
            path="/saved/successfully"
            element={
              <PrivateRoute>
                <SuccessLoader />
              </PrivateRoute>
            }
          />
          <Route path="/error" element={<ErrorPopup />} />
          <Route path="/delete" element={<DeleteSuccessToast />} />
          {/* 404 Page Not Found Route */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      )}
    </>
  );
}

export default App;
