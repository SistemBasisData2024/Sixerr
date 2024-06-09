import { useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Navbar from './components/Navbar.jsx';
import { useParams, useNavigate } from 'react-router-dom';

function Order() {
    const { sellerId } = useParams();
    const [cookies] = useCookies(['user_id']);
    const [orderDetails, setOrderDetails] = useState('');
    const navigate = useNavigate();

    const handleOrder = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/makePayment', {
                buyer_id: cookies.user_id,
                seller_id: sellerId,
                order_details: orderDetails,
            });
            navigate('/'); // Redirect to home or orders page
        } catch (error) {
            console.error('Error making payment:', error);
        }
    };

    return (
        <div className="min-h-screen bg-[#1abc9c] flex items-center justify-center">
            <Navbar />
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mt-24">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Place Order</h2>
                <form onSubmit={handleOrder}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Order Details</label>
                        <textarea
                            name="orderDetails"
                            className="w-full p-2 border border-gray-300 rounded mt-2"
                            value={orderDetails}
                            onChange={(e) => setOrderDetails(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gray-900 text-white p-2 rounded hover:bg-gray-700"
                    >
                        Place Order
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Order;
