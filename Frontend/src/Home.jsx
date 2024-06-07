import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar.jsx';
import { Link } from 'react-router-dom';

function Home() {
    const [topSellers, setTopSellers] = useState([]);
    const [reviews, setReviews] = useState([]);
    
    useEffect(() => {
        fetchTopSellers();
        fetchRecentReviews();
    }, []);
    
    const fetchTopSellers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getTopSellers');
            setTopSellers(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Failed to fetch top sellers:', error);
        }
    };
    
    const fetchRecentReviews = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getReviews'); // Assuming there's an endpoint to get recent reviews
            setReviews(response.data);
        } catch (error) {
            console.error('Failed to fetch recent reviews:', error);
        }
    };
    
    return (
        <div className="min-h-screen bg-[#1abc9c] p-4">
            <Navbar />
            <div className="mt-24">
                <h2 className="text-2xl font-semibold text-white">Top Sellers</h2>
                <div className="flex flex-wrap mt-4 space-x-4">
                    {topSellers.map(seller => (
                        <div key={seller.seller_id} className="bg-white p-4 rounded-lg shadow-md max-w-xs">
                            <div className="w-14 h-14 rounded-full overflow-hidden mb-4">
                                <img src={`https://drive.google.com/thumbnail?id=${seller.seller_img_id}`} alt={seller.seller_name} className="w-full h-auto" />
                            </div>
                            <h3 className="text-xl font-semibold">{seller.seller_name}</h3>
                            <p>Price: ${seller.seller_price}</p>
                            <p>Rating: {(seller.rating_total / seller.rating_count).toFixed(1)} ({seller.rating_count} reviews)</p>
                            <Link to={`/seller/${seller.seller_id}`} className="text-blue-500 hover:underline">View Profile</Link>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-8">
                <h2 className="text-2xl font-semibold text-white">Recent Reviews</h2>
                <div className="flex flex-wrap mt-4 space-x-4">
                    {reviews.map(review => (
                        <div key={review.review_id} className="bg-white p-4 rounded-lg shadow-md max-w-xs">
                            <h3 className="text-lg font-semibold">Buyer ID: {review.buyer_id}</h3>
                            <p>Rating: {review.rating}</p>
                            <p>{review.review}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;
