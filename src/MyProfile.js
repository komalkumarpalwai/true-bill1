// src/components/MyProfile.js
import React, { useEffect, useState } from "react";

const MyProfile = () => {
  // Example: fetch billing info from localStorage or use defaults
  const [billingInfo, setBillingInfo] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    const savedBilling = localStorage.getItem("billingInfo");
    if (savedBilling) {
      setBillingInfo(JSON.parse(savedBilling));
    }
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>My Profile</h2>
      <div style={{ marginBottom: 15 }}>
        <strong>Name:</strong> {billingInfo.name || "Not set"}
      </div>
      <div style={{ marginBottom: 15 }}>
        <strong>Address:</strong> {billingInfo.address || "Not set"}
      </div>
      <div style={{ marginBottom: 15 }}>
        <strong>Phone:</strong> {billingInfo.phone || "Not set"}
      </div>
      <div style={{ marginBottom: 15 }}>
        <strong>Email:</strong> {billingInfo.email || "Not set"}
      </div>
      <p>You can update your billing info in settings (if implemented) and it will be used when creating invoices.</p>
    </div>
  );
};

export default MyProfile;
