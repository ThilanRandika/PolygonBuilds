import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Cart = ({ itemId }) => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);
    const [quantities, setQuantities] = useState({}); // To store the selected quantities
    const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage popup visibility
    const [expandedItems, setExpandedItems] = useState({}); // To track expanded state of items
    const [editingItemId, setEditingItemId] = useState(null); // Track which item is being edited

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            const response = await axios.get('http://localhost:8070/api/cart/all-cart');
            setCartItems(Array.isArray(response.data) ? response.data : []); // Ensure data is an array
        } catch (error) {
            console.error('Error fetching cart items:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleExpandItem = (itemId) => {
        setExpandedItems((prev) => ({
            ...prev,
            [itemId]: !prev[itemId],
        }));
    };


    const handleEditConfiguration = (itemId) => {
        setEditingItemId(itemId);

        navigate('/createOrder', { state: { itemId } });
    };

    const saveEditedConfiguration = (itemId) => {
        // Logic to save the edited configuration (e.g., make an API call)
        setEditingItemId(null);
    };

    const toggleSelectItem = (itemId) => {
        setSelectedItems((prevSelected) =>
            prevSelected.includes(itemId)
                ? prevSelected.filter((id) => id !== itemId)
                : [...prevSelected, itemId]
        );
    };

    const removeItem = async (itemId) => {
        try {
            await axios.delete(`http://localhost:8070/api/cart/delete/${itemId}`);
            setCartItems(cartItems.filter((item) => item._id !== itemId));
            setQuantities((prevQuantities) => {
                const newQuantities = { ...prevQuantities };
                delete newQuantities[itemId];
                return newQuantities;
            });
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const handleQuantityChange = (itemId, newQuantity) => {
        if (newQuantity < 1) {
            // Prevent setting quantity less than 1
            return;
        }
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [itemId]: newQuantity,
        }));
    };

    const checkout = () => {
        setIsPopupOpen(true); // Open the popup when submitting
    };

    // Function to extract the file name from the model URL
    const extractFileName = (url) => {
        const urlObj = new URL(url);
        const filePath = urlObj.pathname.split('/').pop(); // Extract the part after the last '/'
        const decodedFilePath = decodeURIComponent(filePath); // Decode URL-encoded characters
        const fileName = decodedFilePath.replace('files/', ''); // Remove 'files/' from the decoded path
        return fileName; // Return the cleaned file name
    };

    const confirmOrder = async () => {
        const orderData = selectedItems.map((itemId) => {
            const item = cartItems.find((item) => item._id === itemId);
            return {
                model: item.model,
                quantity: quantities[itemId] || item.quantity, // Use selected quantity
                material: item.material,
                color: item.color,
                quality: item.quality,
                specialInstructions: item.specialInstructions,
                infilType: item.infilType,
                verticalResolution: item.verticalResolution,
            };
        });
    
        try {
            const response = await axios.post('http://localhost:8070/api/order/create-multiple-orders', {
                user_id: 'userId',  // Replace with actual user ID
                cartItems: orderData,
            });
    
            console.log('Orders created successfully:', response.data.message);
    
            // Remove the confirmed items from the cart locally
            setCartItems(cartItems.filter((item) => !selectedItems.includes(item._id)));
            setSelectedItems([]);  // Reset selected items
    
            setIsPopupOpen(false); // Close the popup after confirming
        } catch (error) {
            console.error('Error creating orders:', error);
            alert('There was an error confirming your order. Please try again.');
        }
    };
    

    return (
        <div className="mx-10 p-8">
            {loading ? (
                <p>Loading...</p>
            ) : cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <h2 className="text-2xl font-semibold mb-6">Your Shopping Cart</h2>
                    {cartItems.map((item) => (
                        <div className="mb-6 p-4 border border-gray-300 rounded-lg" key={item._id}>
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden shadow-lg">
                                <img
                                    src={"https://img1.yeggi.com/page_images_cache/6817317_soldier-sister-dialogus-3d-printing-template-to-download-"}
                                    alt={item.model}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-xl font-semibold">
                                    <a href="#" className="hover:text-green-600">
                                        {extractFileName(item.model)}
                                    </a>
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Material: {item.material} | Color: {item.color}
                                </p>
                                <p className="text-gray-600 text-sm">
                                    Finish: {item.quality}
                                </p>
                                <p className="text-gray-600 text-sm">
                                    Quantity:
                                    <input
                                        type="number"
                                        value={quantities[item._id] || item.quantity}
                                        onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                                        className="ml-2 w-16 text-center border rounded-lg"
                                    />
                                </p>
                                <button
                                    onClick={() => handleEditConfiguration(item._id)}
                                    className="mt-2 text-blue-500 hover:text-blue-700 text-sm"
                                >
                                    Edit Configuration
                                </button>
                                <button
                                    onClick={() => toggleExpandItem(item._id)}
                                    className="mt-2 text-green-500 hover:text-green-700 text-sm ml-4"
                                >
                                    {expandedItems[item._id] ? 'Hide Details' : 'View Details'}
                                </button>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                                <input
                                    type="checkbox"
                                    checked={selectedItems.includes(item._id)}
                                    onChange={() => toggleSelectItem(item._id)}
                                    className="cursor-pointer"
                                />
                                <button
                                    onClick={() => removeItem(item._id)}
                                    className="text-red-500 hover:text-red-700 text-sm"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                        {/* Expanded details */}
                        {expandedItems[item._id] && (
                            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                                <p className="text-sm">Dimensions:</p>
                                <ul className="text-gray-600 text-sm">
                                    <li>Width: {item.dimensions?.width || 'N/A'} mm</li>
                                    <li>Height: {item.dimensions?.height || 'N/A'} mm</li>
                                    <li>Depth: {item.dimensions?.depth || 'N/A'} mm</li>
                                </ul>
                                <p className="text-sm">Special Instructions: {item.specialInstructions || 'None'}</p>
                                <p className="text-sm">Infill Type: {item.infilType || 'Default'}</p>
                                <p className="text-sm">Vertical Resolution: {item.verticalResolution || 'Standard'}</p>
                            </div>
                        )}
                        {/* Edit Configuration */}
                        {editingItemId === item._id && (
                            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                <h4 className="text-lg font-semibold mb-2">Edit Configuration</h4>
                                <p className="text-sm">Adjust material, color, and more settings here.</p>
                                <button
                                    onClick={() => saveEditedConfiguration(item._id)}
                                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>
                    ))}
                    <div className="mt-6">
                        <button
                            onClick={checkout}
                            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                        >
                            Submit
                        </button>
                    </div>
                </>
            )}

            {/* Popup for order confirmation */}
            {isPopupOpen && (
                <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-xl font-semibold mb-4">Confirm Your Order</h3>
                        <div className="space-y-4">
                            {selectedItems.map((itemId) => {
                                const item = cartItems.find((item) => item._id === itemId);
                                return (
                                    item && (
                                        <div key={item._id} className="flex flex-col space-y-2">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden shadow-lg">
                                                    <img
                                                        src="https://img1.yeggi.com/page_images_cache/6817317_soldier-sister-dialogus-3d-printing-template-to-download-"
                                                        alt={item.model}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-grow">
                                                    <h4 className="font-semibold text-lg">{extractFileName(item.model)}</h4>
                                                    <p className="text-sm">Material: {item.material}</p>
                                                    <p className="text-sm">Color: {item.color}</p>
                                                    <p className="text-sm">Finish: {item.quality}</p>
                                                    <p className="text-sm">Quantity: {quantities[item._id] || item.quantity}</p> {/* Show selected quantity */}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                );
                            })}
                        </div>
                        <div className="mt-4 flex justify-between">
                            <button
                                onClick={confirmOrder}
                                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
                            >
                                Confirm Order
                            </button>
                            <button
                                onClick={() => setIsPopupOpen(false)}
                                className="px-4 py-2 bg-gray-300 text-black font-semibold rounded-lg hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
