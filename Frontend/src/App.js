// import logo from './logo.svg';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { Upload_data } from './components/Upload_data';
import { Home } from './components/Home';
import { Signup } from './components/Signup';
import { Login } from './components/Login';
 
function App() {
  return (
    <div className="App">
      {/* reference: https://www.w3schools.com/react/react_router.asp */}
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="signup" element={<Signup />} />
            <Route path="login" element={<Login />} />
            <Route path="home" element={<Home />} />
            <Route path="upload_data" element={<Upload_data />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
 
export default App;