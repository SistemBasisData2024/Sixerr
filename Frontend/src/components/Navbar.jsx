import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const [cookies, setCookies, removeCookie] = useCookies(["user_id", "email", "imageId", "isSeller", "isLoggedIn", "seller_id"]);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/search?query=${searchQuery}`);
    };

    return (
        <div className="flex justify-between items-center bg-gray-900 p-4 text-white fixed top-0 left-0 w-full shadow-md z-10">
            <Link to="/" className="text-xl font-bold">SIXERR</Link>
            <div className="flex items-center space-x-4">
                <form onSubmit={handleSearch} className="flex">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="p-2 rounded-l bg-gray-700 text-white border-none outline-none"
                    />
                    <button
                        type="submit"
                        className="bg-gray-800 p-2 rounded-r hover:bg-gray-700"
                    >
                        Search
                    </button>
                </form>
                <Link className="hover:bg-gray-700 p-2 rounded" to="/search">Sellers</Link>
                {cookies.isLoggedIn && (
                    <>
                        {cookies.isSeller ? (
                            <Link className="hover:bg-gray-700 p-2 rounded" to="/dashboard">Dashboard</Link>
                        ) : (
                            <Link className="hover:bg-gray-700 p-2 rounded" to="/registerSeller">Register as Seller</Link>
                        )}
                    </>
                )}
                {cookies.isLoggedIn ? (
                    <div className="flex items-center space-x-4">
                        <Link className="hover:bg-gray-700 p-2 rounded" to="/profile">Profile</Link>
                        <div className="w-14 h-14 rounded-full overflow-hidden">
                            <img src={`https://drive.google.com/thumbnail?id=${cookies.imageId}`} alt="User" />
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center space-x-4">
                        <Link className="hover:bg-gray-700 p-2 rounded" to="/login">Sign In</Link>
                        <Link className="hover:bg-gray-700 p-2 rounded" to="/register">Join</Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Navbar;
