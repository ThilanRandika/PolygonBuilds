import { useState } from "react";
import AdminCustomizationForm from "./AdminCustomizationForm "
import CustomizationsPreview from "./CustomizationsPreview"

function Customize() {
  const [selectedProcess, setSelectedProcess] = useState("FDM"); // Maintain selected process
  const [refreshPreview, setRefreshPreview] = useState(false); // State to trigger refresh

  return (
    <div className="flex gap-5">

      <div className="flex-1">
        <AdminCustomizationForm 
          selectedProcess={selectedProcess} 
          setSelectedProcess={setSelectedProcess} 
          onCustomizationChange={() => setRefreshPreview((prev) => !prev)} // Toggle refresh state
        />
      </div>

      <div className="flex-1">
        <CustomizationsPreview 
          selectedProcess={selectedProcess}
          refreshPreview={refreshPreview} // Pass the state for refresh
        />
      </div>

    </div>
  )
}

export default Customize