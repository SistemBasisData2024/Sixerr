import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import Navbar from './components/Navbar.jsx';

function Dashboard() {
    const [cookies] = useCookies(['seller_id']);
    const [sellerData, setSellerData] = useState({});
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetchSellerData();
        fetchSellerReviews();
    }, [cookies.seller_id]);

    const fetchSellerData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getSellerById', {
                params: { seller_id: cookies.seller_id }
            });
            if (response.data) {
                setSellerData(response.data);
            } else {
                console.log('No seller data received from backend');
            }
        } catch (error) {
            console.error('Error fetching seller data:', error);
        }
    };

    const fetchSellerReviews = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getReviewBySeller', {
                params: { seller_id: cookies.seller_id }
            });
            setReviews(response.data);
        } catch (error) {
            console.error('Error fetching seller reviews:', error);
        }
    };

    return (
        <div className="min-h-screen bg-[#1abc9c] flex flex-col items-center">
            <Navbar />
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl mt-24">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Dashboard</h2>
                <div className="flex items-center mb-8">
                    <div className="w-24 h-24 rounded-full overflow-hidden mr-4">
                        {sellerData.seller_img_id ? (
                            <img src={`https://drive.google.com/thumbnail?id=${sellerData.seller_img_id}`} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gray-300"></div>
                        )}
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">{sellerData.seller_name}</h3>
                        <p className="text-gray-700">Price: ${sellerData.seller_price}</p>
                        <p className="text-gray-700">Location: {sellerData.location}</p>
                    </div>
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Reviews</h2>
                <div className="space-y-4">
                    {reviews.map(review => (
                        <div key={review.review_id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                            <p className="text-gray-800 font-semibold">Rating: {review.rating}</p>
                            <p className="text-gray-700">{review.review}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
