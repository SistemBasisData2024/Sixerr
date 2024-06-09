import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import Navbar from './components/Navbar.jsx';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const [cookies, setCookies, removeCookie] = useCookies(['user_id', 'email', 'imageId', 'isSeller', 'isLoggedIn', 'seller_id']);
    const [userData, setUserData] = useState({});
    const [formData, setFormData] = useState({});
    const [profileImage, setProfileImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [orders, setOrders] = useState([]);
    const [isEditingReview, setIsEditingReview] = useState(null);
    const [reviewFormData, setReviewFormData] = useState({ review: '', rating: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/getAccountById', {
                    params: { user_id: cookies.user_id }
                });
                if (response.data) {
                    setUserData(response.data);
                    setFormData(response.data);
                    if (response.data.profile_img) {
                        setProfileImage(`https://drive.google.com/thumbnail?id=${response.data.profile_img}`);
                    }
                } else {
                    console.log('No data received from backend');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchReviews = async () => {
            try {
                const response = await axios.get('http://localhost:5000/getReviewByUser', {
                    params: { user_id: cookies.user_id }
                });
                setReviews(response.data);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:5000/getPaymentByBuyer', {
                    params: { buyer_id: cookies.user_id }
                });
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchUserData();
        fetchReviews();
        fetchOrders();
    }, [cookies.user_id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setProfileImage(URL.createObjectURL(e.target.files[0]));
        setFormData({ ...formData, profile_img: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (typeof formData.profile_img !== 'string') {
            const fileData = new FormData();
            fileData.append('file', formData.profile_img);
            const uploadResponse = await axios.post('http://localhost:5000/uploadFile', fileData);
            formData.profile_img = uploadResponse.data.id;
        }

        await axios.put('http://localhost:5000/editAccount', formData);
        setUserData(formData);
        setIsEditing(false);
    };

    const handleReviewEditChange = (e) => {
        setReviewFormData({ ...reviewFormData, [e.target.name]: e.target.value });
    };

    const handleReviewEditSubmit = async (e) => {
        e.preventDefault();
        await axios.put('http://localhost:5000/editReview', { ...reviewFormData, review_id: isEditingReview });
        const updatedReviews = reviews.map(review =>
            review.review_id === isEditingReview ? { ...review, ...reviewFormData } : review
        );
        setReviews(updatedReviews);
        setIsEditingReview(null);
    };

    const handleReviewDelete = async (review_id) => {
        await axios.delete('http://localhost:5000/deleteReview', { data: { review_id } });
        setReviews(reviews.filter(review => review.review_id !== review_id));
    };

    const handleCancelOrder = async (payment_id) => {
        console.log("Cancelling order with payment_id:", payment_id); // Debugging line
        try {
            await axios.delete('http://localhost:5000/cancelPayment', { data: { payment_id } });
            setOrders(orders.filter(order => order.payment_id !== payment_id));
        } catch (error) {
            console.error('Error cancelling order:', error);
        }
    };

    const handleLogout = (e) => {
        e.preventDefault();
        removeCookie("user_id", { path: '/' });
        removeCookie("email", { path: '/' });
        removeCookie("imageId", { path: '/' });
        removeCookie("isSeller", { path: '/' });
        removeCookie("isLoggedIn", { path: '/' });
        removeCookie("seller_id", { path: '/' });
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#1abc9c] flex flex-col items-center justify-center">
            <Navbar />
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-6xl mt-24 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 flex flex-col items-center">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Profile</h2>
                    {!isEditing ? (
                        <>
                            <div className="mb-4 text-center">
                                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                                    {profileImage ? (
                                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-300"></div>
                                    )}
                                </div>
                                <h3 className="text-xl font-semibold">{userData.username}</h3>
                                <p className="text-gray-700">{userData.email}</p>
                            </div>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="w-full bg-gray-900 text-white p-2 rounded-lg hover:bg-gray-700 transition duration-300"
                            >
                                Edit Profile
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full bg-red-600 text-white p-2 rounded-lg mt-2 hover:bg-red-500 transition duration-300"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <form onSubmit={handleSubmit} className="w-full">
                            <div className="mb-4 text-center">
                                <label className="block text-gray-700">Profile Picture</label>
                                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                                    {profileImage ? (
                                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-300"></div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="w-full p-2 border border-gray-300 rounded mt-2"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    className="w-full p-2 border border-gray-300 rounded mt-2"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="w-full p-2 border border-gray-300 rounded mt-2"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    type="submit"
                                    className="w-full bg-gray-900 text-white p-2 rounded-lg hover:bg-gray-700 transition duration-300"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="w-full bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-400 transition duration-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                <div className="lg:col-span-1">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Orders</h2>
                    <div className="space-y-4 mb-8">
                        {orders.map(order => (
                            <div key={order.payment_id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                                <p className="text-gray-800 font-semibold">Order ID: {order.payment_id}</p>
                                <p className="text-gray-700">Seller: {order.seller_name}</p>
                                <p className="text-gray-700">Order Details: {order.order_details}</p>
                                <p className="text-gray-700">Payment Time: {new Date(order.payment_time).toLocaleString()}</p>
                                <p className="text-gray-700">Status: {order.done ? 'Completed' : 'Pending'}</p>
                                {!order.done && (
                                    <button
                                        className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-500 transition duration-300 mt-2"
                                        onClick={() => handleCancelOrder(order.payment_id)}
                                    >
                                        Cancel Order
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Reviews</h2>
                    <div className="space-y-4">
                        {reviews.map(review => (
                            <div key={review.review_id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                                <h3 className="text-lg font-semibold text-gray-800">Seller: {review.seller_name}</h3>
                                <p className="text-gray-800 font-semibold">Rating: {review.rating}</p>
                                <p className="text-gray-700">{review.review}</p>
                                <div className="flex space-x-2 mt-2">
                                    <button
                                        className="bg-gray-900 text-white p-2 rounded-lg hover:bg-gray-700 transition duration-300"
                                        onClick={() => { 
                                            setIsEditingReview(review.review_id); 
                                            setReviewFormData({ review: review.review, rating: review.rating }); 
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-500 transition duration-300"
                                        onClick={() => handleReviewDelete(review.review_id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {isEditingReview && (
                        <form onSubmit={handleReviewEditSubmit} className="mt-8">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Edit Review</h3>
                            <div className="mb-4">
                                <label className="block text-gray-700">Review</label>
                                <textarea
                                    name="review"
                                    className="w-full p-2 border border-gray-300 rounded mt-2"
                                    value={reviewFormData.review}
                                    onChange={handleReviewEditChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Rating</label>
                                <input
                                    type="number"
                                    name="rating"
                                    className="w-full p-2 border border-gray-300 rounded mt-2"
                                    value={reviewFormData.rating}
                                    onChange={handleReviewEditChange}
                                    required
                                />
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    type="submit"
                                    className="w-full bg-gray-900 text-white p-2 rounded-lg hover:bg-gray-700 transition duration-300"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditingReview(null)}
                                    className="w-full bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-400 transition duration-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;
