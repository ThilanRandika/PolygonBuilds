import AdminCustomizationForm from "./AdminCustomizationForm "
import CustomizationsPreview from "./CustomizationsPreview"

function Customize() {
  return (
    <div className="flex gap-5">
      <div className="flex-1">
        <AdminCustomizationForm></AdminCustomizationForm>
      </div>
      <div className="flex-1">
        <CustomizationsPreview></CustomizationsPreview>
      </div>
    </div>
  )
}

export default Customize