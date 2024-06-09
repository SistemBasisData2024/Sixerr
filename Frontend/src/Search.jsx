import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar.jsx';
import { useLocation, useNavigate } from 'react-router-dom';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function Search() {
    const query = useQuery().get('query') || '';
    const [searchQuery, setSearchQuery] = useState(query);
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (query) {
            handleSearch(query);
        } else {
            fetchAllSellers();
        }
    }, [query]);

    const handleSearch = async (searchQuery) => {
        const response = await axios.get(`http://localhost:5000/searchSellers`, { params: { query: searchQuery } });
        setResults(response.data);
    };

    const fetchAllSellers = async () => {
        const response = await axios.get(`http://localhost:5000/getSellers`);
        setResults(response.data);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate(`/search?query=${searchQuery}`);
        handleSearch(searchQuery);
    };

    const handleSellerClick = (sellerId) => {
        navigate(`/seller/${sellerId}`);
    };

    return (
        <div className="min-h-screen bg-[#1abc9c] p-4">
            <Navbar />
            <div className="mt-24">
                <form onSubmit={handleSubmit} className="mb-8">
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded mt-2"
                        placeholder="Search for sellers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="w-full bg-gray-900 text-white p-2 rounded mt-2 hover:bg-gray-700">Search</button>
                </form>
                {results.length > 0 ? (
                    <div className="flex flex-wrap space-x-4">
                        {results.map(seller => (
                            <div
                                key={seller.seller_id}
                                className="bg-white p-4 rounded-lg shadow-md max-w-xs cursor-pointer"
                                onClick={() => handleSellerClick(seller.seller_id)}
                            >
                                <div className="w-14 h-14 rounded-full overflow-hidden mb-4">
                                    <img src={`https://drive.google.com/thumbnail?id=${seller.seller_img_id}`} alt={seller.seller_name} className="w-full h-auto" />
                                </div>
                                <h3 className="text-xl font-semibold">{seller.seller_name}</h3>
                                <p>Price: ${seller.seller_price}</p>
                                <p>Rating: {seller.rating_count ? (seller.rating_total).toFixed(1) : 'No ratings yet'} ({seller.rating_count} reviews)</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-white text-center">
                        <p>No results found for "{searchQuery}".</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Search;
