import { useState } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar.jsx';

function Search() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        const response = await axios.get(`http://localhost:5000/searchSellers`, { params: { query } });
        setResults(response.data);
    };

    return (
        <div className="min-h-screen bg-[#1abc9c] p-4">
            <Navbar />
            <div className="mt-24">
                <form onSubmit={handleSearch} className="mb-8">
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded mt-2"
                        placeholder="Search for sellers..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button type="submit" className="w-full bg-gray-900 text-white p-2 rounded mt-2 hover:bg-gray-700">Search</button>
                </form>
                <div className="flex flex-wrap space-x-4">
                    {results.map(seller => (
                        <div key={seller.seller_id} className="bg-white p-4 rounded-lg shadow-md max-w-xs">
                            <div className="w-14 h-14 rounded-full overflow-hidden mb-4">
                                <img src={`https://drive.google.com/thumbnail?id=${seller.seller_img_id}`} alt={seller.seller_name} className="w-full h-auto" />
                            </div>
                            <h3 className="text-xl font-semibold">{seller.seller_name}</h3>
                            <p>Price: ${seller.seller_price}</p>
                            <p>Rating: {(seller.rating_total / seller.rating_count).toFixed(1)} ({seller.rating_count} reviews)</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Search;
