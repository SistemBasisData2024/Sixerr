import { useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import Navbar from './components/Navbar.jsx';

function Review() {
    const [cookies] = useCookies(['email']);
    const [formData, setFormData] = useState({
        buyer_id: cookies.email,
        seller_id: '',
        review: '',
        rating: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:5000/addReview', formData);
    };

    return (
        <div className="min-h-screen bg-[#1abc9c] flex items-center justify-center">
            <Navbar />
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mt-24">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Leave a Review</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Seller ID</label>
                        <input
                            type="text"
                            name="seller_id"
                            className="w-full p-2 border border-gray-300 rounded mt-2"
                            value={formData.seller_id}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Rating</label>
                        <input
                            type="number"
                            name="rating"
                            className="w-full p-2 border border-gray-300 rounded mt-2"
                            value={formData.rating}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Review</label>
                        <textarea
                            name="review"
                            className="w-full p-2 border border-gray-300 rounded mt-2"
                            value={formData.review}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gray-900 text-white p-2 rounded hover:bg-gray-700"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Review;
