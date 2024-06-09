import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar.jsx';

function Seller() {
    const { sellerId } = useParams();
    const [sellerData, setSellerData] = useState({});
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchSellerData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/getSellerById`, { params: { seller_id: sellerId } });
                setSellerData(response.data);
            } catch (error) {
                console.error('Error fetching seller data:', error);
            }
        };
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/getReviewBySeller`, { params: { seller_id: sellerId } });
                setReviews(response.data);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };
        fetchSellerData();
        fetchReviews();
    }, [sellerId]);

    return (
        <div className="min-h-screen bg-[#1abc9c] p-4">
            <Navbar />
            <div className="mt-24 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white p-8 rounded-lg shadow-md">
                    <div className="w-32 h-32 rounded-full overflow-hidden mb-4 mx-auto">
                        <img src={`https://drive.google.com/thumbnail?id=${sellerData.seller_img_id}`} alt={sellerData.seller_name} className="w-full h-full object-cover" />
                    </div>
                    <h2 className="text-2xl font-semibold text-center mb-4">{sellerData.seller_name}</h2>
                    <p className="text-center mb-2">Price: ${sellerData.seller_price}</p>
                    <p className="text-center mb-2">Location: {sellerData.location}</p>
                    <p className="text-center">Rating: {sellerData.rating_total} ({sellerData.rating_count} reviews)</p>
                    <div className="flex justify-center space-x-4 mt-4">
                        <Link to={`/order/${sellerId}`} className="bg-gray-900 text-white p-2 rounded-lg hover:bg-gray-700 transition duration-300">Order</Link>
                        <Link to={`/addReview/${sellerId}`} className="bg-gray-900 text-white p-2 rounded-lg hover:bg-gray-700 transition duration-300">Add Review</Link>
                    </div>
                </div>
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-semibold text-white mb-4">Reviews</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        {reviews.map(review => (
                            <div key={review.review_id} className="bg-white p-4 rounded-lg shadow-md">
                                <h3 className="text-lg font-semibold mb-2">{review.buyer_name}</h3>
                                <p className="mb-1">Rating: {review.rating}</p>
                                <p>{review.review}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Seller;
