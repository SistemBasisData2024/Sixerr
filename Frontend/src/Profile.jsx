import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import Navbar from './components/Navbar.jsx';

function Profile() {
    const [cookies] = useCookies(['user_id']);
    const [userData, setUserData] = useState({});
    const [formData, setFormData] = useState({});
    const [profileImage, setProfileImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                console.log('Fetching user data for user_id:', cookies.user_id); // Debugging log
                const response = await axios.get('http://localhost:5000/getAccountById', {
                    user_id: cookies.user_id
                });
                console.log('Response from backend:', response);
                if (response.data) {
                    setUserData(response.data);
                    setFormData(response.data);
                    if (response.data.profile_img) {
                        setProfileImage(`https://drive.google.com/thumbnail?id=${response.data.profile_img}`);
                    }
                } else {
                    console.log('No data received from backend'); // Debugging log
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
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

    console.log('User Data:', userData); // Debugging log
    return (
        <div className="min-h-screen bg-[#1abc9c] flex items-center justify-center">
            <Navbar />
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mt-24">
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
                            className="w-full bg-gray-900 text-white p-2 rounded hover:bg-gray-700"
                        >
                            Edit Profile
                        </button>
                    </>
                ) : (
                    <form onSubmit={handleSubmit}>
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
                        <button
                            type="submit"
                            className="w-full bg-gray-900 text-white p-2 rounded hover:bg-gray-700"
                        >
                            Save Changes
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="w-full bg-gray-500 text-white p-2 rounded mt-2 hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Profile;
