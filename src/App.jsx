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
const MyProfile = lazyWithDelay(() => import("./components/MyProfile"));

const Spinner = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

const billingData = {
  name: "Alice Johnson",
  address: "456 Elm Street",
  city: "Los Angeles",
  postalCode: "90001",
  country: "USA",
  email: "alice.johnson@example.com",
  phone: "+1 234 567 890"
};

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
          <Route
            path="/my-profile"
            element={
              <Suspense fallback={<Spinner />}>
                <MyProfile billingInfo={billingData} />
              </Suspense>
            }
          />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
