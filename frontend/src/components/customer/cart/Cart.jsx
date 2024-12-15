import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import CartItem from './CartItem'; // Import the new component
import { AuthContext } from '../../../context/AuthContext';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [expandedItems, setExpandedItems] = useState({});
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const {user} = useContext(AuthContext);


  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get('http://localhost:8070/api/cart/all-cart');
      setCartItems(Array.isArray(response.data) ? response.data : []);
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

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: newQuantity,
    }));
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
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const extractFileName = (url) => {
    const urlObj = new URL(url);
    const filePath = urlObj.pathname.split('/').pop(); // Extract the part after the last '/'
    const decodedFilePath = decodeURIComponent(filePath); // Decode URL-encoded characters
    const fileName = decodedFilePath.replace('files/', ''); // Remove 'files/' from the decoded path
    return fileName; // Return the cleaned file name
  };

  const confirmOrder = async () => {
    if (selectedItems.length === 0) {
      alert("No items selected for order!");
      return;
    }
  
    try {
      // Filter the selected cart items
      const selectedCartItems = cartItems.filter((item) => selectedItems.includes(item._id));
  
      // Map the cart items to include necessary data for the API call
      const orderPayload = selectedCartItems.map((item) => ({
        _id: item._id,
        model: item.model,
        image: item.image,
        quantity: quantities[item._id] || item.quantity,
        material: item.material,
        color: item.color,
        specialInstructions: item.specialInstructions,
        process: item.process,
        finish: item.finish,
        fileUnits: item.fileUnits,
        infill: item.infill,
        layerHeight: item.layerHeight,
        technicalDrawing: item.technicalDrawing,
        printOrientation: item.printOrientation,
        tolerance: item.tolerance,
        cosmeticSide: item.cosmeticSide,
        industryDescription: item.industryDescription,
        hardnessDescription: item.hardnessDescription,
      }));

  
      // API call to create orders
      const response = await axios.post('http://localhost:8070/api/order/create-multiple-orders', {
        user_id: user._id,
        cartItems: orderPayload,
      });
  
      if (response.status === 201) {
        alert("Orders confirmed successfully!");
        setIsPopupOpen(false);
  
        // Refresh the cart after successful order creation
        fetchCartItems();
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      alert("Failed to confirm order. Please try again.");
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
            <CartItem
              key={item._id}
              item={item}
              quantities={quantities}
              expandedItems={expandedItems}
              selectedItems={selectedItems}
              toggleExpandItem={toggleExpandItem}
              handleQuantityChange={handleQuantityChange}
              toggleSelectItem={toggleSelectItem}
              removeItem={removeItem}
            />
          ))}
          <div className="mt-6">
            <button
              onClick={() => setIsPopupOpen(true)}
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
                    <div key={item._id} className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                        <img
                          src="https://via.placeholder.com/150"
                          alt={item.model}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold">{extractFileName(item.model)}</h4>
                        <p className="text-sm">Material: {item.material}</p>
                        <p className="text-sm">Quantity: {quantities[itemId] || item.quantity}</p>
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
