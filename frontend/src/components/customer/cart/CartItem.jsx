import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { ModelContext } from "../../../../context/ModelContext";
import STLImageGenarator from "../ModelRendering/3Dprinting/modelAnalysis/STLImageGenarator";

const placeholderImage = "https://via.placeholder.com/150"; // Placeholder for missing/failed 3D model images.

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
  const navigate = useNavigate();
  const { setModelLink } = useContext(ModelContext);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    console.log("item.model", item.model);
  }, [item]);

  const decodedUrl = decodeURIComponent(item.model);
  const fileName = decodedUrl.split("/").pop();
  const fileExtension = fileName.split(".").pop().toLowerCase();

  const isSTLFile = fileExtension === "stl";

  const handleImageError = () => setImageError(true);

  const handleEditConfiguration = () => {
    setModelLink(item.model);
    navigate(`/3dmodel/configurations`, { state: { itemId: item._id } });
  };

  const handleImageClick = () => {
    setModelLink(item.model);
    navigate(`/3dmodel/stl-Advance-viewer`);
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 mb-4 shadow-sm">
      {/* Compact View */}
      <div className="flex items-start">
        {/* Model image clickable */}
        <div
          className="flex-shrink-0 w-50 h-50 bg-gray-200 rounded-md overflow-hidden shadow-md cursor-pointer"
          onClick={handleImageClick}
        >
          {!imageError ? (
            <STLImageGenarator fileUrl={item.model} />
          ) : (
            <img
              src={placeholderImage}
              alt="3D model preview"
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          )}
        </div>

        <div className="flex-grow ml-4">
          {/* Display the extracted file name */}
          <h3 className="text-lg font-semibold">{fileName.split(".")[0]}</h3>
          <button
            onClick={handleEditConfiguration}
            className="mt-2 mb-2 flex items-center text-blue-500 text-sm border border-blue-500 hover:border-blue-700 pl-2 pr-2 pt-1 pb-1 rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 3.487c.604-.603 1.583-.603 2.187 0l1.464 1.464c.604.604.604 1.583 0 2.187L6.873 20.779a4.5 4.5 0 01-1.897 1.124l-3.34.895a.75.75 0 01-.923-.923l.895-3.34a4.5 4.5 0 011.124-1.897L16.862 3.487z"
              />
            </svg>
            Edit Configuration
          </button>
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

// Prop Validation
CartItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    model: PropTypes.string.isRequired,
    material: PropTypes.string.isRequired,
    dimensions: PropTypes.string,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
  quantities: PropTypes.objectOf(PropTypes.number).isRequired,
  expandedItems: PropTypes.objectOf(PropTypes.bool).isRequired,
  selectedItems: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleExpandItem: PropTypes.func.isRequired,
  handleQuantityChange: PropTypes.func.isRequired,
  toggleSelectItem: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
};

export default CartItem;
