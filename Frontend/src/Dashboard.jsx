import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import Navbar from './components/Navbar.jsx';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
    const [cookies] = useCookies(['seller_id']);
    const [sellerData, setSellerData] = useState({});
    const [reviews, setReviews] = useState([]);
    const [orders, setOrders] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [portfolioFile, setPortfolioFile] = useState(null);
    const navigate = useNavigate();

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
            const response = await axios.get('http://localhost:5000/getPaymentBySeller', {
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

    const handlePortfolioChange = (e) => {
        setPortfolioFile(e.target.files[0]);
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (typeof formData.seller_img_id !== 'string') {
            const fileData = new FormData();
            fileData.append('file', formData.seller_img_id);
            const uploadResponse = await axios.post('http://localhost:5000/uploadFile', fileData);
            formData.seller_img_id = uploadResponse.data.id;
        }

        if (portfolioFile) {
            const portfolioData = new FormData();
            portfolioData.append('file', portfolioFile);
            const uploadResponse = await axios.post('http://localhost:5000/uploadFile', portfolioData);
            formData.portfolio_id = uploadResponse.data.id;
        }

        await axios.put('http://localhost:5000/editSeller', formData);
        setSellerData(formData);
        setIsEditing(false);
    };

    const handleMarkDone = async (paymentId) => {
        try {
            await axios.put('http://localhost:5000/markPaymentDone', { payment_id: paymentId });
            fetchOrders();
            fetchSellerData();
        } catch (error) {
            console.error('Error marking payment as done:', error);
        }
    };    

    const handleCancel = async (paymentId) => {
        try {
            await axios.delete('http://localhost:5000/cancelPayment', { data: { payment_id: paymentId } });
            fetchOrders();
        } catch (error) {
            console.error('Error cancelling payment:', error);
        }
    };

    return (
        <div className="bg-[#1abc9c] min-h-screen overflow-y-auto">
            <Navbar />
            <div className="p-4 flex justify-center">
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
                            <div className="mb-4">
                                <label className="block text-gray-700">Portfolio (PDF)</label>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handlePortfolioChange}
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
                    {sellerData.portfolio_id && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Portfolio</h2>
                            <iframe
                                src={`https://drive.google.com/file/d/${sellerData.portfolio_id}/preview`}
                                width="100%"
                                height="500px"
                                className="mb-4"
                            ></iframe>
                            <a
                                href={`https://drive.google.com/uc?export=download&id=${sellerData.portfolio_id}`}
                                className="block text-center bg-gray-900 text-white p-2 rounded-lg hover:bg-gray-700 transition duration-300"
                                download
                            >
                                Download Portfolio
                            </a>
                        </div>
                    )}
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Reviews</h2>
                    <div className="space-y-4">
                        {reviews.map(review => (
                            <div key={review.review_id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                                <h3 className="text-lg font-semibold text-gray-800">{review.buyer_name}</h3>
                                <p className="text-gray-800 font-semibold">Rating: {review.rating}</p>
                                <p className="text-gray-700">{review.review}</p>
                            </div>
                        ))}
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Recent Orders</h2>
                    <div className="space-y-4">
                        {orders.map(order => (
                            <div key={order.payment_id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                                <p className="text-gray-800 font-semibold">Order ID: {order.payment_id}</p>
                                <p className="text-gray-700">Buyer: {order.buyer_name}</p>
                                <p className="text-gray-700">Order Details: {order.order_details}</p>
                                <p className="text-gray-700">Payment Time: {new Date(order.payment_time).toLocaleString()}</p>
                                <p className="text-gray-700">Status: {order.done ? "Completed" : "Pending"}</p>
                                {!order.done && (
                                    <div className="mt-2 flex space-x-2">
                                        <button
                                            className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-400 transition duration-300"
                                            onClick={() => handleMarkDone(order.payment_id)}
                                        >
                                            Done
                                        </button>
                                        <button
                                            className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-500 transition duration-300"
                                            onClick={() => handleCancel(order.payment_id)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
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
                            <p className="text-gray-700">${sellerData.earnings}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
