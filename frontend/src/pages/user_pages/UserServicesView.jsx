import { useEffect, useState } from "react";
import Navbar from "../../components/user_components/Navbar";
import Footer from "../../components/user_components/Footer";
import { FaCheckCircle, FaTimesCircle, FaClock, FaRupeeSign, FaMapMarkerAlt } from "react-icons/fa";

const UserServicesView = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const userId = user?.id;

    useEffect(() => {
        const fetchUserInquiries = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:4000/api/inquiries/user/${userId}/inquiries`);
                const data = await response.json();
                
                if (data.success) {
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

    const handleImageError = (e) => {
        e.target.src = "https://via.placeholder.com/150?text=No+Image";
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case "Approved":
                return <FaCheckCircle className="text-emerald-500 text-xl" />;
            case "Rejected":
                return <FaTimesCircle className="text-red-500 text-xl" />;
            default:
                return <FaClock className="text-amber-500 text-xl" />;
        }
    };

    const formatPrice = (price) => {
        return price ? `₹${price}` : "N/A";
    };

    return (
        <>
            <Navbar />
            <div className="bg-gray-50 min-h-screen py-12 mt-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Your Service Inquiries
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Track and manage all your service requests in one place
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                            <p className="mt-4 text-gray-600 text-lg">Loading your inquiries...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                            <div className="text-red-500 text-6xl mb-4">
                                <FaTimesCircle className="mx-auto" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Inquiries</h3>
                            <p className="text-gray-600">{error}</p>
                        </div>
                    ) : inquiries.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                            <div className="text-gray-400 text-6xl mb-4">📋</div>
                            <h3 className="text-2xl font-semibold text-gray-800 mb-3">No Inquiries Yet</h3>
                            <p className="text-gray-600 max-w-md mx-auto">
                                You haven&apos;t made any service inquiries yet. Browse our services and send your first inquiry!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {inquiries.map((inquiry) => (
                                <div key={inquiry._id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                                    {/* Service Image */}
                                    <div className="relative h-48">
                                        <img 
                                            src={inquiry.service?.serviceImage ? `http://localhost:4000/uploads/${inquiry.service.serviceImage}` : "https://via.placeholder.com/400?text=Service"}
                                            alt={inquiry.service?.serviceName || "Service"}
                                            className="w-full h-full object-cover"
                                            onError={handleImageError}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                                        
                                        {/* Status Badge */}
                                        <div className="absolute top-4 right-4">
                                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                                                inquiry.status === "Approved" ? "bg-emerald-100 text-emerald-700" :
                                                inquiry.status === "Rejected" ? "bg-red-100 text-red-700" :
                                                "bg-amber-100 text-amber-700"
                                            }`}>
                                                {getStatusIcon(inquiry.status)}
                                                <span className="text-sm font-medium">{inquiry.status}</span>
                                            </div>
                                        </div>

                                        {/* Service Info Overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <h3 className="text-xl font-bold text-white mb-1">
                                                {inquiry.service?.serviceName || "Unknown Service"}
                                            </h3>
                                            <div className="flex items-center text-emerald-100 text-sm">
                                                <FaMapMarkerAlt className="mr-1" />
                                                <span className="truncate">{inquiry.userAddress || "Address not provided"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details Section */}
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center">
                                                <FaRupeeSign className="text-emerald-600" />
                                                <span className="text-xl font-bold text-gray-900 ml-1">
                                                    {formatPrice(inquiry.service?.servicePrice)}
                                                </span>
                                            </div>
                                            <span className="text-sm text-gray-600">
                                                {inquiry.service?.serviceDuration || "Duration N/A"}
                                            </span>
                                        </div>

                                        {/* Additional Info */}
                                        {inquiry.additionalInfo && (
                                            <div className="mt-3 p-3 bg-gray-50 rounded-xl">
                                                <p className="text-sm text-gray-600 line-clamp-2">
                                                    {inquiry.additionalInfo}
                                                </p>
                                            </div>
                                        )}

                                        {/* Preferred Date */}
                                        {inquiry.preferredDate && (
                                            <div className="mt-4 flex items-center text-sm text-gray-600">
                                                <FaClock className="mr-2" />
                                                <span>Preferred Date: {new Date(inquiry.preferredDate).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default UserServicesView;
