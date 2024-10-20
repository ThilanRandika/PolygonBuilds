import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import CustomerUI from './components/customer/CustomerUI';
import AdminUI from './components/admin/AdminUI';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route>
            <Route path="/*" element={<CustomerUI/>}></Route>
            <Route path="/admin/*" element={<AdminUI/>}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
