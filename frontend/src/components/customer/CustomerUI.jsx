import Header from './header/Header'
import Footer from './footer/Footer'
import Cart from './cart/Cart'
import { Route, Routes } from 'react-router-dom'
import Orders from './order/orders/Orders'
import FileUpload from './fileUpload/FileUpload'
import ModelConfiguration from './ModelRendering/3Dprinting/ModelConfigurations/ModelConfiguration'
import STLAdvanceViewer from './ModelRendering/3Dprinting/modelAnalysis/STLAdvanceViewer'
import ThreeDModel from './ModelRendering/3Dprinting/ThreeDModel'

function CustomerUI() {
  return (
    <div>
      <Header />
            <Routes>
              <Route path="/" element={<FileUpload />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/3dmodel/*" element={<ThreeDModel />} />
              <Route path="/orders" element={<Orders />} />
            </Routes>
      <Footer />
    </div>
  )
}

export default CustomerUI