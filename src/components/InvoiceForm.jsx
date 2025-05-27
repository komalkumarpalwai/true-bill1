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
  const [companyLogo, setCompanyLogo] = useState("");
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
    }

    const savedProducts = JSON.parse(localStorage.getItem("automobileProducts")) || [];
    setProducts(savedProducts);
    setFilteredProducts(savedProducts);
    
    // Set company logo from the first product if available
    if (savedProducts.length > 0 && savedProducts[0].companyLogo) {
      setCompanyLogo(savedProducts[0].companyLogo);
    }
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
        image: product.image // Include product image
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
        image: "" // No image for manual products
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
        price: parseFloat(item.price).toFixed(2),
        image: item.image || null
      })),
      total,
      subTotal,
      taxRate,
      taxAmount,
      currency: currency.symbol,
      companyLogo,
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
    <div className="max-w-7xl mx-auto p-4 md:p-6 mt-24">
      <ToastContainer position="top-right" autoClose={3000} />
      <form onSubmit={openModal}>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          {/* Invoice Header */}
          <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex items-start space-x-6">
                {companyLogo && (
                  <div className="w-20 h-20 rounded-lg bg-white border border-gray-200 p-1 flex items-center justify-center shadow-sm">
                    <img 
                      src={companyLogo} 
                      alt="Company Logo" 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">INVOICE</h1>
                  <div className="text-gray-500 font-medium">#{invoiceNumber}</div>
                  <div className="mt-3 text-gray-600">
                    <div className="font-semibold text-gray-800">{billFrom || "Your Company"}</div>
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

              <div className="mt-6 md:mt-0 flex flex-col items-end space-y-3">
                <div className="w-full md:w-48">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={dateOfIssue}
                    onChange={(e) => setDateOfIssue(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="w-full md:w-48">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <select
                    value={currency.code}
                    onChange={handleCurrencyChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {CURRENCIES.map((curr) => (
                      <option key={curr.code} value={curr.code}>
                        {curr.code} ({curr.symbol})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-xl font-bold bg-blue-50 px-4 py-2 rounded-md">
                  Balance Due: {currency.symbol}{total}
                </div>
              </div>
            </div>
          </div>

          {/* Bill To Section */}
          <div className="p-8 border-b border-gray-200">
            <div className="mb-6">
              <h5 className="text-lg font-semibold text-gray-800 mb-3">Bill to:</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                  <input
                    type="text"
                    value={billTo}
                    onChange={(e) => setBillTo(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Client Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Address</label>
                  <textarea
                    rows={3}
                    value={billToAddress}
                    onChange={(e) => setBillToAddress(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Client Address"
                  />
                </div>
              </div>
            </div>

            {/* Add Item Options */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button 
                type="button"
                onClick={handleAddItem}
                className="flex items-center px-4 py-2.5 bg-white border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <FaSearch className="mr-2" /> Add from Products
              </button>
              <button 
                type="button"
                onClick={handleAddManually}
                className="flex items-center px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaPlus className="mr-2" /> Add Manually
              </button>
            </div>

            {/* Product Search */}
            {showProductSearch && (
              <div className="mb-8 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                  <div className="p-3 text-gray-500">
                    <FaSearch />
                  </div>
                  <input
                    type="text"
                    placeholder="Search products by name or description..."
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
                    className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  >
                    <FaTimes />
                  </button>
                </div>
                {searchTerm && (
                  <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden bg-white max-h-80 overflow-y-auto">
                    {filteredProducts.length > 0 ? (
                      <ul className="divide-y divide-gray-200">
                        {filteredProducts.map((product) => (
                          <li
                            key={product.id}
                            className="p-4 hover:bg-blue-50 cursor-pointer transition-colors"
                            onClick={() => handleAddProductToInvoice(product)}
                          >
                            <div className="flex items-start">
                              {product.image && (
                                <div className="w-16 h-16 mr-4 rounded-md overflow-hidden border border-gray-200">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="font-semibold text-gray-800">{product.name}</div>
                                {product.description && (
                                  <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                                    {product.description}
                                  </div>
                                )}
                                <div className="font-bold text-blue-600 mt-2">
                                  {currency.symbol}
                                  {parseFloat(product.price).toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-6 text-center text-gray-500">
                        <div className="text-lg mb-2">No products found</div>
                        <div className="text-sm">Try a different search term</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Manual Product Form */}
            {addManually && (
              <div className="mb-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Product Manually</h3>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name*</label>
                    <input
                      type="text"
                      name="name"
                      value={manualProduct.name}
                      onChange={handleManualProductChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price*</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 border border-r-0 rounded-l-lg bg-gray-100 text-gray-600">
                        {currency.symbol}
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        name="price"
                        value={manualProduct.price}
                        onChange={handleManualProductChange}
                        className="flex-1 p-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      name="quantity"
                      value={manualProduct.quantity}
                      onChange={handleManualProductChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 border border-r-0 rounded-l-lg bg-gray-100 text-gray-600">
                        {currency.symbol}
                      </span>
                      <input
                        type="text"
                        value={(
                          (parseFloat(manualProduct.price) || 0) * 
                          (parseInt(manualProduct.quantity) || 1)
                        ).toFixed(2)}
                        readOnly
                        className="flex-1 p-3 border border-gray-300 rounded-r-lg bg-gray-50"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-12">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      rows={2}
                      name="description"
                      value={manualProduct.description}
                      onChange={handleManualProductChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-12 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setAddManually(false)}
                      className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddManualProduct}
                      className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add Product
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Item</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Quantity</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Rate</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Amount</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-gray-500 border-b border-gray-200">
                        <div className="flex flex-col items-center justify-center py-8">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          <div className="text-lg">No items added yet</div>
                          <div className="text-sm mt-1">Add items using the buttons above</div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-4 border-b border-gray-200">
                          <div className="flex items-start space-x-3">
                            {item.image && (
                              <div className="w-12 h-12 rounded-md overflow-hidden border border-gray-200 flex-shrink-0">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) =>
                                  handleItemChange(item.id, "name", e.target.value)
                                }
                                className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                              <textarea
                                rows={2}
                                value={item.description}
                                onChange={(e) =>
                                  handleItemChange(item.id, "description", e.target.value)
                                }
                                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-4 border-b border-gray-200">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleItemChange(item.id, "quantity", e.target.value)
                            }
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </td>
                        <td className="p-4 border-b border-gray-200">
                          <div className="flex">
                            <span className="inline-flex items-center px-3 border border-r-0 rounded-l-md bg-gray-100 text-gray-600">
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
                              className="flex-1 p-2 border border-gray-300 rounded-r-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </td>
                        <td className="p-4 border-b border-gray-200">
                          <div className="flex">
                            <span className="inline-flex items-center px-3 border border-r-0 rounded-l-md bg-gray-100 text-gray-600">
                              {currency.symbol}
                            </span>
                            <input
                              type="text"
                              value={(item.price * item.quantity).toFixed(2)}
                              readOnly
                              className="flex-1 p-2 border border-gray-300 rounded-r-md bg-gray-50"
                            />
                          </div>
                        </td>
                        <td className="p-4 border-b border-gray-200 text-center">
                          <button
                            type="button"
                            onClick={() => handleRowDel(item)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
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
            </div>

            {/* Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Thank you for your business!"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions</label>
                  <textarea
                    rows={3}
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Payment due within 30 days"
                  />
                </div>
              </div>
              <div>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">{currency.symbol}{subTotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-gray-600">
                        Tax (<input
                          type="number"
                          min="0"
                          max="100"
                          value={taxRate}
                          onChange={(e) => setTaxRate(e.target.value)}
                          className="w-12 p-1 border border-gray-300 rounded text-center"
                        />%):
                      </div>
                      <span className="font-medium">{currency.symbol}{taxAmount}</span>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>{currency.symbol}{total}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-8">
              <button 
                type="submit" 
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md"
              >
                Preview Invoice
              </button>
            </div>
          </div>
        </div>

        {/* Invoice Modal */}
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
              companyLogo,
              notes,
              terms,
              printButton: (
                <button 
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
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