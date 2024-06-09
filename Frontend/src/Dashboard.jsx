import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import Navbar from './components/Navbar.jsx';

function Dashboard() {
    const [cookies] = useCookies(['seller_id']);
    const [sellerData, setSellerData] = useState({});
    const [reviews, setReviews] = useState([]);
    const [orders, setOrders] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchSellerData();
        fetchSellerReviews();
        fetchOrders();
    }, [cookies.seller_id]);

    const fetchSellerData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getSellerById', {
                params: { seller_id: cookies.seller_id }
            });
            if (response.data) {
                setSellerData(response.data);
                setFormData(response.data);
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

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getOrdersBySeller', {
                params: { seller_id: cookies.seller_id }
            });
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, seller_img_id: e.target.files[0] });
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (typeof formData.seller_img_id !== 'string') {
            const fileData = new FormData();
            fileData.append('file', formData.seller_img_id);
            const uploadResponse = await axios.post('http://localhost:5000/uploadFile', fileData);
            formData.seller_img_id = uploadResponse.data.id;
        }

        await axios.put('http://localhost:5000/editSeller', formData);
        setSellerData(formData);
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-[#1abc9c] flex flex-col items-center overflow-y-auto">
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
                        <button 
                            onClick={handleEditClick} 
                            className="mt-2 bg-gray-900 text-white p-2 rounded-lg hover:bg-gray-700 transition duration-300"
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>
                {isEditing && (
                    <form onSubmit={handleSave} className="mb-8">
                        <div className="mb-4">
                            <label className="block text-gray-700">Seller Name</label>
                            <input
                                type="text"
                                name="seller_name"
                                className="w-full p-2 border border-gray-300 rounded mt-2"
                                value={formData.seller_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Price</label>
                            <input
                                type="number"
                                name="seller_price"
                                className="w-full p-2 border border-gray-300 rounded mt-2"
                                value={formData.seller_price}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Location</label>
                            <input
                                type="text"
                                name="location"
                                className="w-full p-2 border border-gray-300 rounded mt-2"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Profile Image</label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="w-full p-2 border border-gray-300 rounded mt-2"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-gray-900 text-white p-2 rounded hover:bg-gray-700 transition duration-300"
                        >
                            Save Changes
                        </button>
                    </form>
                )}
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Reviews</h2>
                <div className="space-y-4">
                    {reviews.map(review => (
                        <div key={review.review_id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                            <p className='text-gray-800 font-semibold'>{review.buyer_name}</p>
                            <p className="text-gray-800 font-semibold">Rating: {review.rating}</p>
                            <p className="text-gray-700">{review.review}</p>
                        </div>
                    ))}
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Recent Orders</h2>
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order.order_id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                            <p className="text-gray-800 font-semibold">Order ID: {order.order_id}</p>
                            <p className="text-gray-700">Buyer: {order.buyer_name}</p>
                            <p className="text-gray-700">Amount: ${order.amount}</p>
                            <p className="text-gray-700">Status: {order.status}</p>
                        </div>
                    ))}
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Statistics</h2>
                <div className="flex justify-around">
                    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800">Total Reviews</h3>
                        <p className="text-gray-700">{reviews.length}</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800">Average Rating</h3>
                        <p className="text-gray-700">{sellerData.rating_total ? (sellerData.rating_total).toFixed(1) : 'N/A'}</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800">Total Earnings</h3>
                        <p className="text-gray-700">${sellerData.total_earnings}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
