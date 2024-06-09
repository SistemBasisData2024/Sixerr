import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar.jsx';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useCookies } from 'react-cookie';

function Seller() {
    const { sellerId } = useParams();
    const [cookies] = useCookies(['seller_id']);
    const [sellerData, setSellerData] = useState({});
    const [reviews, setReviews] = useState([]);
    const [mapVisible, setMapVisible] = useState(false);
    const [center, setCenter] = useState(null);
    const [marker, setMarker] = useState(null);
    const [portfolioVisible, setPortfolioVisible] = useState(false);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_MAPS_API_KEY,
    });

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

    useEffect(() => {
        if (isLoaded && sellerData.location) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ address: sellerData.location }, (results, status) => {
                if (status === 'OK') {
                    const { lat, lng } = results[0].geometry.location;
                    const newCenter = { lat: lat(), lng: lng() };
                    setCenter(newCenter);
                } else {
                    console.error('Geocode was not successful for the following reason:', status);
                }
            });
        }
    }, [isLoaded, sellerData.location]);

    const handleLocationClick = () => {
        setMapVisible(!mapVisible);
    };

    const handlePortfolioClick = () => {
        setPortfolioVisible(!portfolioVisible);
    };

    return (
        <div className="min-h-screen bg-[#1abc9c] p-4">
            <Navbar />
            <div className="mt-24 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white p-8 rounded-lg shadow-md">
                    <div className="w-32 h-32 rounded-full overflow-hidden mb-4 mx-auto">
                        <img src={`https://drive.google.com/thumbnail?id=${sellerData.seller_img_id}`} alt={sellerData.seller_name} className="w-full h-full object-cover" />
                    </div>
                    <h2 className="text-2xl font-semibold text-center mb-4">{sellerData.seller_name}</h2>
                    {sellerData.portfolio_id && (
                        <div className="text-center mb-4">
                            <button 
                                className="bg-gray-900 text-white p-2 rounded-lg hover:bg-gray-700 transition duration-300"
                                onClick={handlePortfolioClick}
                            >
                                Show Portfolio
                            </button>
                        </div>
                    )}
                    <p className="text-center mb-2">Price: ${sellerData.seller_price}</p>
                    <p className="text-center mb-2">
                        Location: {sellerData.location}
                        <button 
                            className="bg-gray-900 text-white p-2 rounded-lg hover:bg-gray-700 transition duration-300 ml-2"
                            onClick={handleLocationClick}
                        >
                            Show Map
                        </button>
                    </p>
                    <p className="text-center">Rating: {sellerData.rating_total} ({sellerData.rating_count} reviews)</p>
                    {cookies.seller_id !== sellerId && (
                        <div className="flex justify-center space-x-4 mt-4">
                            <Link to={`/order/${sellerId}`} className="bg-gray-900 text-white p-2 rounded-lg hover:bg-gray-700 transition duration-300">Order</Link>
                            <Link to={`/addReview/${sellerId}`} className="bg-gray-900 text-white p-2 rounded-lg hover:bg-gray-700 transition duration-300">Add Review</Link>
                        </div>
                    )}
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
            {mapVisible && center && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg shadow-md max-w-3xl w-full">
                        <GoogleMap
                            mapContainerStyle={{ width: '100%', height: '400px' }}
                            center={center}
                            zoom={15}
                        >
                            <Marker position={center} />
                        </GoogleMap>
                        <button
                            className="mt-4 bg-gray-900 text-white p-2 rounded-lg hover:bg-gray-700 transition duration-300"
                            onClick={handleLocationClick}
                        >
                            Close Map
                        </button>
                    </div>
                </div>
            )}
            {portfolioVisible && sellerData.portfolio_id && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg shadow-md max-w-3xl w-full">
                        <iframe
                            src={`https://drive.google.com/file/d/${sellerData.portfolio_id}/preview`}
                            width="100%"
                            height="500px"
                        ></iframe>
                        <button
                            className="mt-4 bg-gray-900 text-white p-2 rounded-lg hover:bg-gray-700 transition duration-300"
                            onClick={handlePortfolioClick}
                        >
                            Close Portfolio
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Seller;
