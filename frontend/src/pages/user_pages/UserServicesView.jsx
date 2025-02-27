import { useEffect, useState } from "react";
import Navbar from "../../components/user_components/Navbar";
import Footer from "../../components/user_components/Footer";

const UserServicesView = () => {
    const [inquiries, setInquiries] = useState([]);
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const userId = user?.id; // Safely access the id
    
    
    useEffect(() => {
        const fetchUserInquiries = async () => {
            try {
                const response = await fetch(`http://localhost:4000/api/inquiries/user/${userId}/inquiries`);
                const data = await response.json();
                setInquiries(data.inquiries);
            } catch (error) {
                console.error("Error fetching inquiries:", error);
            }
        };

        fetchUserInquiries();
    }, [userId]);

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-6">
                <h2 className="text-2xl font-bold mb-4 text-center">Your Inquiries</h2>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-[#354f52] border border-gray-300 shadow-lg rounded-lg">
                        <thead className="bg-[#354f52]">
                            <tr>
                                <th className="py-2 px-4 border-b">Service Image</th>
                                <th className="py-2 px-4 border-b">Service Name</th>
                                <th className="py-2 px-4 border-b">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inquiries.length > 0 ? (
                                inquiries.map((inquiry) => (
                                    <tr key={inquiry._id} className="text-center border-b">
                                       <td className="py-2 px-4 text-center">
    <div className="flex justify-center items-center">
        <img 
            src={`http://localhost:4000/uploads/${inquiry.service.services_img}`} 
            alt={inquiry.service.services_name} 
            className="w-16 h-16 object-cover rounded"
        />
    </div>
</td>
                                        <td className="py-2 px-4">{inquiry.service.services_name}</td>
                                        <td 
                                            className={`py-2 px-4 font-semibold ${
                                                inquiry.status === "Approved" ? "text-green-600" :
                                                inquiry.status === "Rejected" ? "text-red-600" :
                                                "text-yellow-500"
                                            }`}
                                        >
                                            {inquiry.status}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="py-4 text-center text-white">No inquiries found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default UserServicesView;
