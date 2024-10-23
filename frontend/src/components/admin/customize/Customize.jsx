import AdminCustomizationForm from "./AdminCustomizationForm "
import SelectionOptions from "../../customer/ModelRendering/SelectionOptions"

function Customize() {
  return (
    <div className="flex gap-5">
      <div className="flex-1">
        <AdminCustomizationForm></AdminCustomizationForm>
      </div>
      <div className="flex-1">
        {/* <SelectionOptions></SelectionOptions> */}
      </div>
    </div>
  )
}

export default Customize