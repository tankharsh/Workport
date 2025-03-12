import { useEffect, useState } from "react";
import Navbar from "../../components/user_components/Navbar";
import Footer from "../../components/user_components/Footer";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";

const UserServicesView = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const userId = user?.id; // Safely access the id
    
    useEffect(() => {
        const fetchUserInquiries = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:4000/api/inquiries/user/${userId}/inquiries`);
                const data = await response.json();
                
                if (data.success) {
                    console.log("Inquiries data:", data.inquiries);
                    // Check if service and serviceImage exist in the response
                    if (data.inquiries.length > 0) {
                        console.log("First inquiry service:", data.inquiries[0].service);
                        console.log("Service image field:", data.inquiries[0].service?.serviceImage);
                    }
                    setInquiries(data.inquiries);
                } else {
                    setError(data.message || "Failed to fetch inquiries");
                }
            } catch (error) {
                console.error("Error fetching inquiries:", error);
                setError("An error occurred while fetching your inquiries");
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUserInquiries();
        }
    }, [userId]);

    // Function to handle missing images
    const handleImageError = (e) => {
        e.target.src = "https://via.placeholder.com/150?text=No+Image";
    };

    // Function to get status icon
    const getStatusIcon = (status) => {
        switch(status) {
            case "Approved":
                return <FaCheckCircle className="text-green-500 text-xl" />;
            case "Rejected":
                return <FaTimesCircle className="text-red-500 text-xl" />;
            default:
                return <FaClock className="text-yellow-500 text-xl" />;
        }
    };

    // Function to format price
    const formatPrice = (price) => {
        return price ? `₹${price}` : "N/A";
    };

    return (
        <>
            <Navbar />
            <div className="bg-gray-100 min-h-screen py-8 mt-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="bg-[#2D4E35] py-6">
                            <h2 className="text-2xl md:text-3xl font-bold text-center text-white">
                                Your Service Inquiries
                            </h2>
                        </div>
                        
                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2D4E35]"></div>
                            </div>
                        ) : error ? (
                            <div className="text-center py-16">
                                <div className="text-red-500 text-lg mb-2">Error</div>
                                <p className="text-gray-600">{error}</p>
                            </div>
                        ) : inquiries.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="text-gray-400 text-5xl mb-4">📋</div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Inquiries Found</h3>
                                <p className="text-gray-500">You haven&apos;t made any service inquiries yet.</p>
                            </div>
                        ) : (
                            <div className="p-4 md:p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {inquiries.map((inquiry) => (
                                        <div key={inquiry._id} className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                            <div className="relative h-48 bg-gray-200">
                                                {inquiry.service && inquiry.service.serviceImage ? (
                                                    <img 
                                                        src={`http://localhost:4000/uploads/${inquiry.service.serviceImage}`} 
                                                        alt={inquiry.service.serviceName || "Service"} 
                                                        className="w-full h-full object-cover"
                                                        onError={handleImageError}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                                        <span className="text-gray-400 text-lg">No Image Available</span>
                                                    </div>
                                                )}
                                                <div className="absolute top-3 right-3">
                                                    <div className={`flex items-center justify-center rounded-full w-10 h-10 ${
                                                        inquiry.status === "Approved" ? "bg-green-100" :
                                                        inquiry.status === "Rejected" ? "bg-red-100" :
                                                        "bg-yellow-100"
                                                    }`}>
                                                        {getStatusIcon(inquiry.status)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">
                                                    {inquiry.service?.serviceName || "Unknown Service"}
                                                </h3>
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="text-gray-600 text-sm">
                                                        {inquiry.service?.serviceDuration || "Duration N/A"}
                                                    </span>
                                                    <span className="font-bold text-[#2D4E35]">
                                                        {formatPrice(inquiry.service?.servicePrice)}
                                                    </span>
                                                </div>
                                                <div className="pt-3 border-t border-gray-200">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-gray-500">Status:</span>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                            inquiry.status === "Approved" ? "bg-green-100 text-green-800" :
                                                            inquiry.status === "Rejected" ? "bg-red-100 text-red-800" :
                                                            "bg-yellow-100 text-yellow-800"
                                                        }`}>
                                                            {inquiry.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default UserServicesView;
