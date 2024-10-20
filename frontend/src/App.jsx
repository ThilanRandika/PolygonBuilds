import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

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
