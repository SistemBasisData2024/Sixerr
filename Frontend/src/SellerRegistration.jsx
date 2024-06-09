import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import Navbar from './components/Navbar.jsx';

function SellerRegistration() {
    const navigate = useNavigate();
    const [cookies] = useCookies(['email']);
    const [formData, setFormData] = useState({
        user_id: cookies.user_id,
        seller_name: '',
        seller_price: '',
        seller_img_id: '',
        portfolio_id: '',
        location: '',
    });
    const [file, setFile] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (file) {
            const fileData = new FormData();
            fileData.append('file', file);
            const uploadResponse = await axios.post('http://localhost:5000/uploadFile', fileData);
            formData.seller_img_id = uploadResponse.data.id;
        }
        await axios.post('http://localhost:5000/registerSeller', formData);
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#1abc9c] flex items-center justify-center">
            <Navbar />
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mt-24">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Register as a Seller</h2>
                <form onSubmit={handleSubmit}>
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
                        className="w-full bg-gray-900 text-white p-2 rounded hover:bg-gray-700"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SellerRegistration;
