import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Register from './Register';
import Login from './Login';
import SellerRegistration from './SellerRegistration';
import Profile from './Profile';
import Seller from './Seller';
import Search from './Search';
import Review from './Review';
import Dashboard from './Dashboard';
import "./App.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registerSeller" element={<SellerRegistration />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/seller/:sellerId" element={<Seller />} />
          <Route path="/search" element={<Search />} />
          <Route path="/review" element={<Review />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
