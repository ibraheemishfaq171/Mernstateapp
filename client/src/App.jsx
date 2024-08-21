import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./component/Header";
import About from "./pages/About";
import Home from "./pages/Home";
import Profile from "./pages/profile";
import SignIn from "./pages/signIn";
import SignOUT from "./pages/signout";

import PrivateRoute from "./component/PrivateRoute";
import CreateListing from "./pages/createListing";
import Listing from "./pages/Listing";
import Search from "./pages/Search";
import signup from "./pages/signup";
import updateListing from "./pages/UpdateListing";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/about" Component={About} />
        <Route path="/signin" Component={SignIn} />
        <Route path="/Signout" Component={SignOUT} />
        <Route path="Listing/:listingid" Component={Listing} />
        <Route Component={PrivateRoute}>
          <Route path="/Profile" Component={Profile} />
          <Route path="/create_listing" Component={CreateListing} />
          <Route path="/update_listing/:listingid" Component={updateListing} />
        </Route>

        <Route path="/signup" Component={signup} />
        <Route path="/search" Component={Search} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
