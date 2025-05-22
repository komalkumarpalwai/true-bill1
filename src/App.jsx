import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import React, { Suspense } from "react";
import Container from "react-bootstrap/Container";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

// Utility to lazy load with artificial delay (1–1.5 sec)
const lazyWithDelay = (importFunc, delay = 1000) => {
  return React.lazy(() =>
    Promise.all([
      importFunc(),
      new Promise(resolve => setTimeout(resolve, delay + Math.random() * 500)),
    ]).then(([moduleExports]) => moduleExports)
  );
};

// Lazy-loaded components
const InvoiceForm = lazyWithDelay(() => import("./components/InvoiceForm"));
const Register = lazyWithDelay(() => import("./components/Register"));

const Spinner = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

const App = () => {
  return (
    <Router>
      <Navbar />
      <Container className="mt-4">
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<Spinner />}>
                <InvoiceForm />
              </Suspense>
            }
          />
          <Route
            path="/home"
            element={
              <Suspense fallback={<Spinner />}>
                <InvoiceForm />
              </Suspense>
            }
          />
          <Route
            path="/login"
            element={
              <Suspense fallback={<Spinner />}>
                <Register />
              </Suspense>
            }
          />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
