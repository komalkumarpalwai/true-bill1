import React, { useState, useEffect } from "react";
import { FaEdit, FaSave, FaUserCircle, FaUndo, FaTrash, FaDownload, FaWhatsapp } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const MyProfile = () => {
  const defaultProfile = {
    name: "Komal Palwai",
    company: "Codeminds Web Services",
    address: "123 Main Street",
    city: "Hyderabad",
    postalCode: "500001",
    country: "India",
    email: "komal@example.com",
    phone: "+91 98765 43210",
  };

  const [billingInfo, setBillingInfo] = useState(() => {
    const saved = localStorage.getItem("billingInfo");
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const [editMode, setEditMode] = useState(false);
  const [userLogo, setUserLogo] = useState(() => localStorage.getItem("userLogo"));
  const [invoiceHistory, setInvoiceHistory] = useState([]);

  // Load invoice history from localStorage
  useEffect(() => {
    const loadInvoiceHistory = () => {
      try {
        const savedInvoices = localStorage.getItem("invoiceHistory");
        if (savedInvoices) {
          setInvoiceHistory(JSON.parse(savedInvoices));
        }
      } catch (error) {
        console.error("Error loading invoice history:", error);
        toast.error("Failed to load invoice history");
      }
    };
    loadInvoiceHistory();
  }, []);

  const handleChange = (field, value) => {
    setBillingInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    localStorage.setItem("billingInfo", JSON.stringify(billingInfo));
    if (userLogo) localStorage.setItem("userLogo", userLogo);
    toast.success("Profile saved successfully!");
    setEditMode(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setUserLogo(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setBillingInfo(defaultProfile);
    setUserLogo(null);
    localStorage.removeItem("billingInfo");
    localStorage.removeItem("userLogo");
    toast.info("Profile reset to default!");
  };

  const handleDeleteInvoice = (invoiceNumber) => {
    const updatedHistory = invoiceHistory.filter(
      (invoice) => invoice.invoiceNumber !== invoiceNumber
    );
    setInvoiceHistory(updatedHistory);
    localStorage.setItem("invoiceHistory", JSON.stringify(updatedHistory));
    toast.success("Invoice deleted successfully");
  };

  const handleDownloadInvoice = (invoiceData) => {
    // Create a printable version of the invoice
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${invoiceData.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 2rem; }
            .invoice-header { display: flex; justify-content: space-between; margin-bottom: 2rem; }
            .company-info { margin-bottom: 1rem; }
            .invoice-details { margin-bottom: 2rem; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 2rem; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .totals { text-align: right; margin-top: 1rem; }
            .footer { margin-top: 3rem; font-size: 0.9rem; }
          </style>
        </head>
        <body>
          <div class="invoice-header">
            <div>
              <h1>INVOICE</h1>
              <p>${invoiceData.billFrom}</p>
              ${invoiceData.billFromAddress.split("\n").map(line => `<p>${line}</p>`).join("")}
            </div>
            <div>
              <p><strong>Invoice #:</strong> ${invoiceData.invoiceNumber}</p>
              <p><strong>Date:</strong> ${new Date(invoiceData.dateOfIssue).toLocaleDateString()}</p>
            </div>
          </div>

          <div class="invoice-details">
            <div>
              <h3>Bill To:</h3>
              <p>${invoiceData.billTo}</p>
              ${invoiceData.billToAddress.split("\n").map(line => `<p>${line}</p>`).join("")}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${invoiceData.items.map(item => `
                <tr>
                  <td>${item.name}<br><small>${item.description || ""}</small></td>
                  <td>${item.quantity}</td>
                  <td>${invoiceData.currency}${parseFloat(item.price).toFixed(2)}</td>
                  <td>${invoiceData.currency}${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <div class="totals">
            <p><strong>Subtotal:</strong> ${invoiceData.currency}${invoiceData.subTotal}</p>
            <p><strong>Tax (${invoiceData.taxRate}%):</strong> ${invoiceData.currency}${invoiceData.taxAmount}</p>
            <p><strong>Total:</strong> ${invoiceData.currency}${invoiceData.total}</p>
          </div>

          <div class="footer">
            <p>${invoiceData.notes || "Thank you for your business!"}</p>
            <p>${invoiceData.terms || "Payment due within 30 days"}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
  };

  const handleShareViaWhatsApp = (invoiceData) => {
    const message = `Invoice ${invoiceData.invoiceNumber}\n` +
      `Date: ${new Date(invoiceData.dateOfIssue).toLocaleDateString()}\n` +
      `Total: ${invoiceData.currency}${invoiceData.total}\n\n` +
      `View full invoice in your browser.`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer />
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl mx-auto p-8 relative">
        {/* Logo and Upload */}
        <div className="flex items-center gap-4 mb-6">
          {userLogo ? (
            <img
              src={userLogo}
              alt="User Logo"
              className="w-16 h-16 rounded-full object-cover border"
            />
          ) : (
            <FaUserCircle size={64} className="text-gray-500" />
          )}
          {editMode && (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="text-sm"
            />
          )}
        </div>

        {/* Header and Buttons */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          {editMode ? (
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                <FaSave /> Save Changes
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                <FaUndo /> Reset
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
            >
              <FaEdit /> Edit Profile
            </button>
          )}
        </div>

        {/* Profile Info Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Billing Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
            {[
              { label: "Name", key: "name" },
              { label: "Company Name", key: "company" },
              { label: "Address", key: "address" },
              { label: "City", key: "city" },
              { label: "Postal Code", key: "postalCode" },
              { label: "Country", key: "country" },
              { label: "Email", key: "email" },
              { label: "Phone", key: "phone" },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1">{label}:</label>
                {editMode ? (
                  <input
                    type="text"
                    value={billingInfo[key] || ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-base">{billingInfo[key]}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Invoice History Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Invoice History</h2>
          {invoiceHistory.length === 0 ? (
            <div className="border border-gray-300 bg-gray-50 rounded p-4 text-gray-600">
              <p>No invoice history found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {invoiceHistory.map((invoice) => (
                <div key={invoice.invoiceNumber} className="border border-gray-300 rounded p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">Invoice #{invoice.invoiceNumber}</h3>
                      <p className="text-sm text-gray-600">
                        Date: {new Date(invoice.dateOfIssue).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Client: {invoice.billTo}
                      </p>
                      <p className="font-medium mt-1">
                        Total: {invoice.currency}{invoice.total}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownloadInvoice(invoice)}
                        className="p-2 text-blue-600 hover:text-blue-800"
                        title="Download"
                      >
                        <FaDownload />
                      </button>
                      <button
                        onClick={() => handleShareViaWhatsApp(invoice)}
                        className="p-2 text-green-600 hover:text-green-800"
                        title="Share via WhatsApp"
                      >
                        <FaWhatsapp />
                      </button>
                      <button
                        onClick={() => handleDeleteInvoice(invoice.invoiceNumber)}
                        className="p-2 text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Invoice Info */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Invoice Preview</h2>
          <div className="border border-gray-300 bg-gray-50 rounded p-4 text-gray-600">
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