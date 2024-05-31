import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./Login";
import Register from './Register';
import Test from './Test';
import "./App.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;