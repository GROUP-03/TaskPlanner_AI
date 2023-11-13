// import logo from './logo.svg';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { Signup } from './components/Signup';
import { Login } from './components/Login';

function App() {
  return (
    <div className="App">
      {/* reference: https://www.w3schools.com/react/react_router.asp */}
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Signup />} />
            <Route path="signup" element={<Signup />} />
            <Route path="login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;