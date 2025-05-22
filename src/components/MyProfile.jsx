import React from "react";

const MyProfile = ({ billingInfo }) => {
  // If billingInfo is missing or empty, show message
  if (!billingInfo || Object.keys(billingInfo).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white p-8 rounded shadow-md max-w-xl w-full text-center">
          <h1 className="text-2xl font-semibold mb-4">My Profile</h1>
          <p className="text-gray-600">No billing information found.</p>
        </div>
      </div>
    );
  }

  // Display billing info with invoicing context
  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="bg-white rounded-lg shadow-md max-w-3xl w-full p-8">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Billing Information</h2>
          <div className="space-y-3 text-gray-700 text-lg">
            <p><span className="font-semibold">Name:</span> {billingInfo.name || "N/A"}</p>
            <p><span className="font-semibold">Address:</span> {billingInfo.address || "N/A"}</p>
            <p><span className="font-semibold">City:</span> {billingInfo.city || "N/A"}</p>
            <p><span className="font-semibold">Postal Code:</span> {billingInfo.postalCode || "N/A"}</p>
            <p><span className="font-semibold">Country:</span> {billingInfo.country || "N/A"}</p>
            <p><span className="font-semibold">Email:</span> {billingInfo.email || "N/A"}</p>
            <p><span className="font-semibold">Phone:</span> {billingInfo.phone || "N/A"}</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Invoice Preview</h2>
          <div className="border border-gray-300 rounded p-4 text-gray-600">
            {/* Example invoicing info display */}
            <p>This billing information will be used for your invoices.</p>
            <p className="mt-2 italic text-sm text-gray-500">
              (You can update your billing info in your account settings.)
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MyProfile;
