import React, { useState, useEffect, useCallback } from "react";
import InvoiceModal from "./InvoiceModal";
import { FaSearch, FaTimes, FaPlus, FaPrint } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
];

const InvoiceForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [dateOfIssue, setDateOfIssue] = useState("");
  const [billTo, setBillTo] = useState("");
  const [billToAddress, setBillToAddress] = useState("");
  const [billFrom, setBillFrom] = useState("");
  const [billFromAddress, setBillFromAddress] = useState("");
  const [total, setTotal] = useState("0.00");
  const [subTotal, setSubTotal] = useState("0.00");
  const [taxRate, setTaxRate] = useState("0");
  const [taxAmount, setTaxAmount] = useState("0.00");
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [userLogo, setUserLogo] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [addManually, setAddManually] = useState(false);
  const [manualProduct, setManualProduct] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "1"
  });
  const [notes, setNotes] = useState("Thank you for your business!");
  const [terms, setTerms] = useState("Payment due within 30 days");

  // Generate invoice number and set current date on component mount
  useEffect(() => {
    const generateInvoiceNumber = () => {
      const timestamp = Date.now();
      const randomNum = Math.floor(Math.random() * 1000);
      return `INV-${timestamp}-${randomNum}`;
    };

    setInvoiceNumber(generateInvoiceNumber());
    setDateOfIssue(new Date().toISOString().split('T')[0]);
  }, []);

  // Load profile data and products from localStorage
  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem("billingInfo"));
    if (savedProfile) {
      setBillFrom(savedProfile.company || "");
      setBillFromAddress(
        `${savedProfile.address || ""}\n${savedProfile.city || ""}, ${
          savedProfile.postalCode || ""
        }\n${savedProfile.country || ""}`
      );
      setUserLogo(localStorage.getItem("userLogo") || "");
    }

    const savedProducts = JSON.parse(localStorage.getItem("automobileProducts")) || [];
    setProducts(savedProducts);
    setFilteredProducts(savedProducts);
  }, []);

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const handleCalculateTotal = useCallback(() => {
    const newSubTotal = items.reduce(
      (acc, item) => acc + (parseFloat(item.price || 0) * parseInt(item.quantity || 0)),
      0
    ).toFixed(2);
    
    const newTaxAmount = (newSubTotal * (parseFloat(taxRate) / 100 || 0)).toFixed(2);
    const newTotal = (parseFloat(newSubTotal) + parseFloat(newTaxAmount)).toFixed(2);

    setSubTotal(newSubTotal);
    setTaxAmount(newTaxAmount);
    setTotal(newTotal);
  }, [items, taxRate]);

  useEffect(() => {
    handleCalculateTotal();
  }, [handleCalculateTotal]);

  const handleRowDel = (item) => {
    setItems(items.filter((i) => i.id !== item.id));
  };

  const handleAddItem = () => {
    setShowProductSearch(true);
    setAddManually(false);
    setSearchTerm("");
  };

  const handleAddManually = () => {
    setShowProductSearch(false);
    setAddManually(true);
  };

  const handleAddProductToInvoice = (product) => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        productId: product.id,
        name: product.name,
        description: product.description || "",
        price: product.price,
        quantity: 1,
      },
    ]);
    setShowProductSearch(false);
    setSearchTerm("");
  };

  const handleAddManualProduct = () => {
    if (!manualProduct.name.trim()) {
      toast.error('Product name is required');
      return;
    }

    if (!manualProduct.price || isNaN(parseFloat(manualProduct.price))) {
      toast.error('Valid price is required');
      return;
    }

    setItems([
      ...items,
      {
        id: Date.now().toString(),
        name: manualProduct.name.trim(),
        description: manualProduct.description.trim(),
        price: parseFloat(manualProduct.price).toFixed(2),
        quantity: parseInt(manualProduct.quantity) || 1,
      },
    ]);
    setManualProduct({
      name: "",
      description: "",
      price: "",
      quantity: "1"
    });
    setAddManually(false);
  };

  const handleManualProductChange = (e) => {
    const { name, value } = e.target;
    setManualProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (id, field, value) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const saveInvoiceToHistory = (invoiceData) => {
    try {
      const currentHistory = JSON.parse(localStorage.getItem("invoiceHistory") || "[]");
      const updatedHistory = [invoiceData, ...currentHistory];
      localStorage.setItem("invoiceHistory", JSON.stringify(updatedHistory));
      return true;
    } catch (error) {
      console.error("Error saving invoice to history:", error);
      toast.error("Failed to save invoice to history");
      return false;
    }
  };

  const openModal = (e) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error('Please add at least one item to the invoice');
      return;
    }

    const invoiceData = {
      invoiceNumber,
      dateOfIssue,
      billFrom,
      billFromAddress,
      billTo,
      billToAddress,
      items: items.map(item => ({
        ...item,
        price: parseFloat(item.price).toFixed(2)
      })),
      total,
      subTotal,
      taxRate,
      taxAmount,
      currency: currency.symbol,
      companyLogo: userLogo,
      notes,
      terms,
      createdAt: new Date().toISOString()
    };

    if (saveInvoiceToHistory(invoiceData)) {
      setIsOpen(true);
    }
  };

  const closeModal = () => setIsOpen(false);

  const handleCurrencyChange = (e) => {
    const selectedCurrency = CURRENCIES.find((c) => c.code === e.target.value);
    setCurrency(selectedCurrency || CURRENCIES[0]);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <form onSubmit={openModal}>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row">
              <div className="flex-1 flex items-start">
                {userLogo && (
                  <img 
                    src={userLogo} 
                    alt="Company Logo" 
                    className="w-16 h-16 object-contain mr-4"
                  />
                )}
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">INVOICE</h1>
                  <div className="text-gray-600">#{invoiceNumber}</div>
                  <div className="mt-3">
                    <div className="font-bold">{billFrom || "Your Company"}</div>
                    {billFromAddress ? (
                      billFromAddress.split("\n").map((line, i) => (
                        <div key={i}>{line}</div>
                      ))
                    ) : (
                      <>
                        <div>Your Address</div>
                        <div>City, State ZIP</div>
                        <div>Country</div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-0 flex flex-col items-end">
                <input
                  type="date"
                  value={dateOfIssue}
                  onChange={(e) => setDateOfIssue(e.target.value)}
                  className="mb-2 p-2 border rounded w-full md:w-auto"
                />
                <select
                  value={currency.code}
                  onChange={handleCurrencyChange}
                  className="mb-3 p-2 border rounded w-full md:w-auto"
                >
                  {CURRENCIES.map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code} ({curr.symbol})
                    </option>
                  ))}
                </select>
                <div className="text-xl font-bold">
                  Balance Due: {currency.symbol}{total}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <h5 className="font-bold mb-3">Bill to:</h5>
              <input
                type="text"
                value={billTo}
                onChange={(e) => setBillTo(e.target.value)}
                className="w-full p-2 mb-2 border rounded"
                placeholder="Client Name"
              />
              <textarea
                rows={3}
                value={billToAddress}
                onChange={(e) => setBillToAddress(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Client Address"
              />
            </div>

            {/* Add Item Options */}
            <div className="flex gap-2 mb-4">
              <button 
                type="button"
                onClick={handleAddItem}
                className="flex items-center px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
              >
                <FaSearch className="mr-2" /> Add from Products
              </button>
              <button 
                type="button"
                onClick={handleAddManually}
                className="flex items-center px-4 py-2 border border-gray-500 text-gray-500 rounded hover:bg-gray-50"
              >
                <FaPlus className="mr-2" /> Add Manually
              </button>
            </div>

            {/* Product Search */}
            {showProductSearch && (
              <div className="mb-6">
                <div className="flex border rounded overflow-hidden">
                  <div className="p-2 bg-gray-100 flex items-center">
                    <FaSearch className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 p-2 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowProductSearch(false);
                      setSearchTerm("");
                    }}
                    className="p-2 bg-gray-100 hover:bg-gray-200"
                  >
                    <FaTimes className="text-gray-500" />
                  </button>
                </div>
                {searchTerm && (
                  <div className="mt-2 border rounded max-h-60 overflow-y-auto">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          className="p-3 border-b hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleAddProductToInvoice(product)}
                        >
                          <div className="font-bold">{product.name}</div>
                          {product.description && (
                            <div className="text-sm text-gray-500">
                              {product.description}
                            </div>
                          )}
                          <div className="font-bold mt-1">
                            {currency.symbol}
                            {parseFloat(product.price).toFixed(2)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-center text-gray-500">
                        No products found
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Manual Product Form */}
            {addManually && (
              <div className="mb-6 bg-gray-50 p-4 rounded">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-5">
                    <label className="block mb-1">Product Name*</label>
                    <input
                      type="text"
                      name="name"
                      value={manualProduct.name}
                      onChange={handleManualProductChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block mb-1">Price*</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 border border-r-0 rounded-l bg-gray-100">
                        {currency.symbol}
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        name="price"
                        value={manualProduct.price}
                        onChange={handleManualProductChange}
                        className="flex-1 p-2 border rounded-r"
                        required
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      name="quantity"
                      value={manualProduct.quantity}
                      onChange={handleManualProductChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1">Total</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 border border-r-0 rounded-l bg-gray-100">
                        {currency.symbol}
                      </span>
                      <input
                        type="text"
                        value={(
                          (parseFloat(manualProduct.price) || 0) * 
                          (parseInt(manualProduct.quantity) || 1)
                        ).toFixed(2)}
                        readOnly
                        className="flex-1 p-2 border rounded-r bg-gray-50"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-12">
                    <label className="block mb-1">Description</label>
                    <textarea
                      rows={2}
                      name="description"
                      value={manualProduct.description}
                      onChange={handleManualProductChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="md:col-span-12 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setAddManually(false)}
                      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddManualProduct}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Add Product
                    </button>
                  </div>
                </div>
              </div>
            )}

            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left border">Item</th>
                  <th className="p-3 text-left border">Quantity</th>
                  <th className="p-3 text-left border">Rate</th>
                  <th className="p-3 text-left border">Amount</th>
                  <th className="p-3 text-left border"></th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500 border">
                      No items added yet
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-3 border">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) =>
                            handleItemChange(item.id, "name", e.target.value)
                          }
                          className="w-full p-2 mb-1 border rounded"
                        />
                        <textarea
                          rows={2}
                          value={item.description}
                          onChange={(e) =>
                            handleItemChange(item.id, "description", e.target.value)
                          }
                          className="w-full p-2 border rounded text-sm"
                        />
                      </td>
                      <td className="p-3 border">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(item.id, "quantity", e.target.value)
                          }
                          className="w-full p-2 border rounded"
                        />
                      </td>
                      <td className="p-3 border">
                        <div className="flex">
                          <span className="inline-flex items-center px-3 border border-r-0 rounded-l bg-gray-100">
                            {currency.symbol}
                          </span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.price}
                            onChange={(e) =>
                              handleItemChange(item.id, "price", e.target.value)
                            }
                            className="flex-1 p-2 border rounded-r"
                          />
                        </div>
                      </td>
                      <td className="p-3 border">
                        <div className="flex">
                          <span className="inline-flex items-center px-3 border border-r-0 rounded-l bg-gray-100">
                            {currency.symbol}
                          </span>
                          <input
                            type="text"
                            value={(item.price * item.quantity).toFixed(2)}
                            readOnly
                            className="flex-1 p-2 border rounded-r bg-gray-50"
                          />
                        </div>
                      </td>
                      <td className="p-3 border text-center">
                        <button
                          type="button"
                          onClick={() => handleRowDel(item)}
                          className="p-2 text-red-500 hover:text-red-700"
                          aria-label="Delete item"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block mb-1">Notes</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Thank you for your business!"
                />
                <label className="block mb-1 mt-4">Terms & Conditions</label>
                <textarea
                  rows={3}
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Payment due within 30 days"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{currency.symbol}{subTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({taxRate}%):</span>
                  <span>{currency.symbol}{taxAmount}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total:</span>
                  <span>{currency.symbol}{total}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                type="submit" 
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Preview Invoice
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <InvoiceModal
            isOpen={isOpen}
            closeModal={closeModal}
            data={{
              invoiceNumber,
              dateOfIssue,
              billFrom,
              billFromAddress,
              billTo,
              billToAddress,
              items,
              total,
              subTotal,
              taxRate,
              taxAmount,
              currency: currency.symbol,
              companyLogo: userLogo,
              notes,
              terms,
              printButton: (
                <button 
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <FaPrint className="mr-2" /> Print Invoice
                </button>
              )
            }}
          />
        )}
      </form>
    </div>
  );
};

export default InvoiceForm;