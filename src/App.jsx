import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Container from "react-bootstrap/Container";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Register from "./components/Register";

import InvoiceForm from "./components/InvoiceForm";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<InvoiceForm />} />
         
          <Route path="/login" element={<Register />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
