import React, { useEffect } from "react";
import STLImageGenarator from "../ModelRendering/STLImageGenarator";

const CartItem = ({
  item,
  quantities,
  expandedItems,
  selectedItems,
  toggleExpandItem,
  handleQuantityChange,
  toggleSelectItem,
  removeItem,
}) => {
    useEffect(()=> {
        console.log('item.model', item.model)
    },[])
  // Decode the URL to handle encoded characters like '%2F'
  const decodedUrl = decodeURIComponent(item.model);

  // Extract the file name and extension from the URL
  const fileName = decodedUrl.split("/").pop(); // Get the last part after the slash
  const displayName = fileName.split(".")[0]; // Remove the file extension
  const fileExtension = fileName.split(".").pop().toLowerCase(); // Get file extension

  // Determine whether the file is an STL file
  const isSTLFile = fileExtension === "stl";

  // Fallback image for non-STL files
  const placeholderImage = "https://via.placeholder.com/150";

  return (
    <div className="border border-gray-300 rounded-lg p-4 mb-4 shadow-sm">
      {/* Compact View */}
      <div className="flex items-start">
        <div className="flex-shrink-0 w-50 h-50 bg-gray-200 rounded-md overflow-hidden shadow-md">
            <div className="w-full h-full">
              <STLImageGenarator fileUrl={item.model} />
            </div>
        </div>
        <div className="flex-grow ml-4">
          {/* Display the extracted file name */}
          <h3 className="text-lg font-semibold">{displayName}</h3>
          <p className="text-sm text-gray-600">Material: {item.material}</p>
          <p className="text-sm text-gray-600">Process: CNC Machining</p>
          <p className="text-sm">
            Quantity:
            <input
              type="number"
              value={quantities[item._id] || item.quantity}
              onChange={(e) =>
                handleQuantityChange(item._id, parseInt(e.target.value))
              }
              className="ml-2 w-16 text-center border rounded-md"
            />
          </p>
        </div>
        <div className="flex flex-col items-end">
          <button
            onClick={() => toggleExpandItem(item._id)}
            className="text-blue-500 hover:text-blue-700"
          >
            {expandedItems[item._id] ? "▲" : "▼"}
          </button>
          <input
            type="checkbox"
            checked={selectedItems.includes(item._id)}
            onChange={() => toggleSelectItem(item._id)}
            className="mt-2 cursor-pointer"
          />
          <button
            onClick={() => removeItem(item._id)}
            className="mt-2 text-red-500 hover:text-red-700 text-sm"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Expanded View */}
      {expandedItems[item._id] && (
        <div className="mt-4 p-4 rounded-md">
          <h4 className="text-sm font-semibold">Details</h4>
          <p className="text-sm text-gray-600">
            Measurement: {item.dimensions || "N/A"}
          </p>
          <p className="text-sm text-gray-600">Precision Tolerance: ±0.13mm</p>
          <p className="text-sm text-gray-600">
            Price: <span className="font-bold">${item.price}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default CartItem;
