import { useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Navbar from './components/Navbar.jsx';
import { useParams, useNavigate } from 'react-router-dom';

function AddReview() {
    const { sellerId } = useParams();
    const [cookies] = useCookies(['user_id']);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(5);
    const navigate = useNavigate();

    const handleAddReview = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/addReview', {
                buyer_id: cookies.user_id,
                seller_id: sellerId,
                review: reviewText,
                rating: rating,
            });
            navigate(`/seller/${sellerId}`);
        } catch (error) {
            console.error('Error adding review:', error);
        }
    };

    return (
        <div className="min-h-screen bg-[#1abc9c] flex items-center justify-center">
            <Navbar />
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mt-24">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Review</h2>
                <form onSubmit={handleAddReview}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Review</label>
                        <textarea
                            name="reviewText"
                            className="w-full p-2 border border-gray-300 rounded mt-2"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Rating</label>
                        <input
                            type="number"
                            name="rating"
                            className="w-full p-2 border border-gray-300 rounded mt-2"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            min="1"
                            max="5"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gray-900 text-white p-2 rounded hover:bg-gray-700"
                    >
                        Add Review
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddReview;
