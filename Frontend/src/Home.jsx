import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar.jsx';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
    const [topSellers, setTopSellers] = useState([]);
    const [reviews, setReviews] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        fetchTopSellers();
        fetchRecentReviews();
    }, []);
    
    const fetchTopSellers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getTopSellers');
            setTopSellers(response.data);
        } catch (error) {
            console.error('Failed to fetch top sellers:', error);
        }
    };
    
    const fetchRecentReviews = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getReviews');
            setReviews(response.data);
        } catch (error) {
            console.error('Failed to fetch recent reviews:', error);
        }
    };

    const handleCardClick = (sellerId) => {
        navigate(`/seller/${sellerId}`);
    };
    
    return (
        <div className="min-h-screen bg-[#1abc9c] p-4">
            <Navbar />
            <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-semibold text-white mb-4">Top Sellers</h2>
                    <div className="space-y-4">
                        {topSellers.map(seller => (
                            <div 
                                key={seller.seller_id} 
                                className="bg-white p-4 rounded-lg shadow-md max-w-full cursor-pointer"
                                onClick={() => handleCardClick(seller.seller_id)}
                            >
                                <div className="flex items-center mb-4">
                                    <div className="w-14 h-14 rounded-full overflow-hidden">
                                        <img src={`https://drive.google.com/thumbnail?id=${seller.seller_img_id}`} alt={seller.seller_name} className="w-full h-auto" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-xl font-semibold">{seller.seller_name}</h3>
                                        <p>Price: ${seller.seller_price}</p>
                                        <p>Rating: {(seller.rating_total).toFixed(1)} ({seller.rating_count} reviews)</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-semibold text-white mb-4">Recent Reviews</h2>
                    <div className="space-y-4">
                        {reviews.map(review => (
                            <div key={review.review_id} className="bg-white p-4 rounded-lg shadow-md max-w-full">
                                <h3 className="text-lg font-semibold">{review.seller_name}</h3>
                                <p className="text-sm text-gray-600">Reviewed By: {review.buyer_name}</p>
                                <p>Rating: {review.rating}</p>
                                <p>{review.review}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
