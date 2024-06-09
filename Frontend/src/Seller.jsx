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
            const response = await axios.get(`http://localhost:5000/getSellerById`, { params: { seller_id: sellerId } });
            setSellerData(response.data);
        };
        const fetchReviews = async () => {
            const response = await axios.get(`http://localhost:5000/getReviewBySeller`, { params: { seller_id: sellerId } });
            setReviews(response.data);
            console.log(response.data);
        };
        fetchSellerData();
        fetchReviews();
    }, [sellerId]);

    return (
        <div className="min-h-screen bg-[#1abc9c] p-4">
            <Navbar />
            <div className="mt-24">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <div className="w-32 h-32 rounded-full overflow-hidden mb-4 mx-auto">
                        <img src={`https://drive.google.com/thumbnail?id=${sellerData.seller_img_id}`} alt={sellerData.seller_name} className="w-full h-full object-cover" />
                    </div>
                    <h2 className="text-2xl font-semibold text-center mb-4">{sellerData.seller_name}</h2>
                    <p className="text-center mb-2">Price: ${sellerData.seller_price}</p>
                    <p className="text-center mb-2">Location: {sellerData.location}</p>
                    <p className="text-center">Rating: {(sellerData.rating_total)} ({sellerData.rating_count} reviews)</p>
                    <div className="flex justify-center space-x-4 mt-4">
                        <Link to={`/order/${sellerId}`} className="bg-gray-900 text-white p-2 rounded hover:bg-gray-700">Order</Link>
                        <Link to={`/addReview/${sellerId}`} className="bg-gray-900 text-white p-2 rounded hover:bg-gray-700">Add Review</Link>
                    </div>
                </div>
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold text-white">Reviews</h2>
                    <div className="flex flex-wrap mt-4 space-x-4">
                        {reviews.map(review => (
                            <div key={review.review_id} className="bg-white p-4 rounded-lg shadow-md max-w-xs">
                                <h3 className="text-lg font-semibold">{review.buyer_name}</h3>
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

export default Seller;
