import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import Navbar from './components/Navbar.jsx';

function Dashboard() {
    const [cookies] = useCookies(['email']);
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            const response = await axios.get('http://localhost:5000/getSellerServices', { params: { seller_id: cookies.email } });
            setServices(response.data);
        };
        fetchServices();
    }, [cookies.email]);

    return (
        <div className="min-h-screen bg-[#1abc9c] p-4">
            <Navbar />
            <div className="mt-24">
                <h2 className="text-2xl font-semibold text-white">Dashboard</h2>
                <div className="flex flex-wrap mt-4 space-x-4">
                    {services.map(service => (
                        <div key={service.service_id} className="bg-white p-4 rounded-lg shadow-md max-w-xs">
                            <h3 className="text-xl font-semibold">{service.service_name}</h3>
                            <p>Price: ${service.price}</p>
                            <p>Description: {service.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
