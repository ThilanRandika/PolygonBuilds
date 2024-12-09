import { Route, Routes } from "react-router-dom"
import ConfigurationHeader2 from "../../header/ConfigurationHeader2"
import ModelConfiguration from "./ModelConfigurations/ModelConfiguration"
import STLAdvanceViewer from "./modelAnalysis/STLAdvanceViewer"


function ThreeDModel() {
  return (
    <div>
      <ConfigurationHeader2 />
        <Routes>
            <Route path="/configurations" element={<ModelConfiguration />} />
            <Route path="/stl-Advance-viewer" element={<STLAdvanceViewer />} />
        </Routes>
    </div>
  )
}

export default ThreeDModel