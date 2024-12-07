import Header from './header/Header'
import Footer from './footer/Footer'
import FileUpload from './ModelRendering/FileUpload'
import Cart from './cart/Cart'
import { Route, Routes } from 'react-router-dom'
import CreateOrder from './order/CreateOrder'
import STLAdvanceViewer from './ModelRendering/STLAdvanceViewer'

function CustomerUI() {
  return (
    <div>
      <Header />
            <Routes>
              <Route path="/" element={<FileUpload />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/createOrder" element={<CreateOrder />} />
              <Route path="/stl-Advance-viewer" element={<STLAdvanceViewer />} />
            </Routes>
      <Footer />
    </div>
  )
}

export default CustomerUI