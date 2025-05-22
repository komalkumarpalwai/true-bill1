import React, { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import InvoiceModal from "./InvoiceModal";
import InputGroup from "react-bootstrap/InputGroup";

const PRODUCTS = [
  {
    id: "prod1",
    name: "Website Design",
    description: "Full responsive website design",
    price: 500,
  },
  {
    id: "prod2",
    name: "Logo Design",
    description: "Custom logo creation",
    price: 150,
  },
  {
    id: "prod3",
    name: "SEO Optimization",
    description: "Search engine optimization service",
    price: 300,
  },
  {
    id: "prod4",
    name: "Hosting (1 year)",
    description: "Web hosting service for 1 year",
    price: 100,
  },
];

const InvoiceForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currency, setCurrency] = useState("₹");
  const [currentDate] = useState(new Date().toLocaleDateString());
  const [invoiceNumber, setInvoiceNumber] = useState(1);
  const [dateOfIssue, setDateOfIssue] = useState("");
  const [billTo, setBillTo] = useState("");
  const [billToEmail, setBillToEmail] = useState("");
  const [billToAddress, setBillToAddress] = useState("");
  const [billFrom, setBillFrom] = useState("");
  const [billFromEmail, setBillFromEmail] = useState("");
  const [billFromAddress, setBillFromAddress] = useState("");
  const [notes, setNotes] = useState(
    "Thank you for doing business with us. Have a great day!"
  );
  const [total, setTotal] = useState("0.00");
  const [subTotal, setSubTotal] = useState("0.00");
  const [taxRate, setTaxRate] = useState("");
  const [taxAmount, setTaxAmount] = useState("0.00");
  const [discountRate, setDiscountRate] = useState("");
  const [discountAmount, setDiscountAmount] = useState("0.00");

  const [items, setItems] = useState([
    {
      id: (+new Date() + Math.floor(Math.random() * 999999)).toString(36),
      productId: "",
      name: "",
      description: "",
      price: "1.00",
      quantity: 1,
    },
  ]);

  const handleCalculateTotal = useCallback(() => {
    let newSubTotal = items
      .reduce((acc, item) => {
        return acc + parseFloat(item.price || 0) * parseInt(item.quantity || 0);
      }, 0)
      .toFixed(2);

    let newtaxAmount = (newSubTotal * (taxRate / 100 || 0)).toFixed(2);
    let newdiscountAmount = (newSubTotal * (discountRate / 100 || 0)).toFixed(2);
    let newTotal = (
      newSubTotal -
      newdiscountAmount +
      parseFloat(newtaxAmount)
    ).toFixed(2);

    setSubTotal(newSubTotal);
    setTaxAmount(newtaxAmount);
    setDiscountAmount(newdiscountAmount);
    setTotal(newTotal);
  }, [items, taxRate, discountRate]);

  useEffect(() => {
    handleCalculateTotal();
  }, [handleCalculateTotal]);

  const handleRowDel = (item) => {
    const updatedItems = items.filter((i) => i.id !== item.id);
    setItems(updatedItems);
  };

  const handleAddEvent = () => {
    const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    const newItem = {
      id,
      productId: "",
      name: "",
      price: "1.00",
      description: "",
      quantity: 1,
    };
    setItems([...items, newItem]);
  };

  const onItemizedItemEdit = (evt) => {
    const { id, name, value } = evt.target;

    const updatedItems = items.map((item) => {
      if (item.id === id) {
        if (name !== "productId") {
          return { ...item, [name]: value, productId: "" };
        }
        return { ...item, [name]: value };
      }
      return item;
    });
    setItems(updatedItems);
  };

  const onProductSelect = (itemId, selectedProductId) => {
    const product = PRODUCTS.find((p) => p.id === selectedProductId);

    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        if (product) {
          return {
            ...item,
            productId: product.id,
            name: product.name,
            description: product.description,
            price: product.price.toFixed(2),
            quantity: 1,
          };
        } else {
          return {
            ...item,
            productId: "",
            name: "",
            description: "",
            price: "1.00",
            quantity: 1,
          };
        }
      }
      return item;
    });

    setItems(updatedItems);
  };

  const handleChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const openModal = (event) => {
    event.preventDefault();
    handleCalculateTotal();
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <style>
        {`
          .form-control, .form-select {
            border: 1.5px solid #ccc !important;
            box-shadow: 0 1px 4px rgba(0,0,0,0.08);
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
          }
          .form-control:focus, .form-select:focus {
            border-color: #007bff !important;
            box-shadow: 0 0 8px rgba(0, 123, 255, 0.25);
          }
          label.fw-bold {
            font-weight: 600 !important;
            font-size: 1.05rem;
            margin-bottom: 0.5rem;
          }
          .table > thead > tr > th {
            font-weight: 600;
            background-color: #f8f9fa;
          }
          button.btn-primary {
            background-color: #007bff;
            border: none;
            font-weight: 600;
            padding: 0.5rem 1.25rem;
            transition: background-color 0.3s ease;
          }
          button.btn-primary:hover {
            background-color: #0056b3;
          }
          button.btn-danger {
            font-weight: 700;
            padding: 0 0.5rem;
          }
          .card {
            border-radius: 10px;
            box-shadow: 0 4px 10px rgb(0 0 0 / 0.08);
          }
          @media (max-width: 768px) {
            .current-date {
              display: block;
              margin-top: 4px;
            }
            .d-flex.flex-row {
              flex-direction: column !important;
            }
            .d-flex.flex-row > * {
              margin-bottom: 10px;
            }
            .table-responsive {
              overflow-x: auto;
            }
          }
        `}
      </style>

      <Form onSubmit={openModal}>
        <Row>
          <Col md={8} lg={9}>
            <Card className="p-4 p-xl-5 my-3 my-xl-4">
              <div className="d-flex flex-row align-items-start justify-content-between mb-3 flex-wrap">
                <div className="d-flex flex-column">
                  <div className="mb-2">
                    <span className="fw-bold">Current&nbsp;Date:&nbsp;</span>
                    <span className="current-date">{currentDate}</span>
                  </div>
                  <div className="d-flex flex-row align-items-center">
                    <span className="fw-bold d-block me-2">Due&nbsp;Date:</span>
                    <Form.Control
                      type="date"
                      value={dateOfIssue}
                      name="dateOfIssue"
                      onChange={handleChange(setDateOfIssue)}
                      style={{ maxWidth: "150px" }}
                      required
                    />
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center">
                  <span className="fw-bold me-2">Invoice&nbsp;Number:&nbsp;</span>
                  <Form.Control
                    type="number"
                    value={invoiceNumber}
                    name="invoiceNumber"
                    onChange={handleChange(setInvoiceNumber)}
                    min="1"
                    style={{ maxWidth: "70px" }}
                    required
                  />
                </div>
              </div>

              <Row className="mb-3">
                <Col xs={12} md={6} className="mb-3 mb-md-0">
                  <Form.Label className="fw-bold" htmlFor="billFrom">
                    Bill From
                  </Form.Label>
                  <Form.Control
                    id="billFrom"
                    type="text"
                    placeholder="Company or Person"
                    value={billFrom}
                    onChange={handleChange(setBillFrom)}
                    required
                  />
                  <Form.Control
                    className="mt-2"
                    type="email"
                    placeholder="Email"
                    value={billFromEmail}
                    onChange={handleChange(setBillFromEmail)}
                    required
                  />
                  <Form.Control
                    className="mt-2"
                    type="text"
                    placeholder="Address"
                    value={billFromAddress}
                    onChange={handleChange(setBillFromAddress)}
                    required
                  />
                </Col>
                <Col xs={12} md={6}>
                  <Form.Label className="fw-bold" htmlFor="billTo">
                    Bill To
                  </Form.Label>
                  <Form.Control
                    id="billTo"
                    type="text"
                    placeholder="Company or Person"
                    value={billTo}
                    onChange={handleChange(setBillTo)}
                    required
                  />
                  <Form.Control
                    className="mt-2"
                    type="email"
                    placeholder="Email"
                    value={billToEmail}
                    onChange={handleChange(setBillToEmail)}
                    required
                  />
                  <Form.Control
                    className="mt-2"
                    type="text"
                    placeholder="Address"
                    value={billToAddress}
                    onChange={handleChange(setBillToAddress)}
                    required
                  />
                </Col>
              </Row>

              <div className="table-responsive">
                <table className="table table-bordered mb-4">
                  <thead>
                    <tr>
                      <th style={{ width: "200px" }}>Product</th>
                      <th>Description</th>
                      <th style={{ width: "100px" }}>Price</th>
                      <th style={{ width: "80px" }}>Qty</th>
                      <th style={{ width: "80px" }}>Total</th>
                      <th style={{ width: "50px" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => {
                      const totalPrice =
                        (parseFloat(item.price || 0) * parseInt(item.quantity || 0)).toFixed(2);
                      return (
                        <tr key={item.id}>
                          <td>
                            <Form.Select
                              id={item.id}
                              value={item.productId}
                              name="productId"
                              aria-label="Select product"
                              onChange={(e) => onProductSelect(item.id, e.target.value)}
                              className="mb-2"
                              style={{ minWidth: "150px" }}
                            >
                              <option value="">-- Select Product --</option>
                              {PRODUCTS.map((product) => (
                                <option key={product.id} value={product.id}>
                                  {product.name}
                                </option>
                              ))}
                              <option value="">Manual Entry</option>
                            </Form.Select>
                            <Form.Control
                              id={item.id}
                              type="text"
                              name="name"
                              placeholder="Product name"
                              value={item.name}
                              onChange={onItemizedItemEdit}
                              required
                            />
                          </td>
                          <td>
                            <Form.Control
                              id={item.id}
                              type="text"
                              name="description"
                              placeholder="Description"
                              value={item.description}
                              onChange={onItemizedItemEdit}
                            />
                          </td>
                          <td>
                            <InputGroup>
                              <InputGroup.Text>{currency}</InputGroup.Text>
                              <Form.Control
                                id={item.id}
                                type="number"
                                min="0"
                                step="0.01"
                                name="price"
                                value={item.price}
                                onChange={onItemizedItemEdit}
                                required
                              />
                            </InputGroup>
                          </td>
                          <td>
                            <Form.Control
                              id={item.id}
                              type="number"
                              min="1"
                              step="1"
                              name="quantity"
                              value={item.quantity}
                              onChange={onItemizedItemEdit}
                              required
                            />
                          </td>
                          <td>
                            <InputGroup>
                              <InputGroup.Text>{currency}</InputGroup.Text>
                              <Form.Control
                                type="text"
                                value={totalPrice}
                                readOnly
                                plaintext
                              />
                            </InputGroup>
                          </td>
                          <td className="text-center">
                            <Button
                              variant="danger"
                              size="sm"
                              aria-label="Delete row"
                              onClick={() => handleRowDel(item)}
                            >
                              &times;
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <Button
                variant="primary"
                className="mb-3"
                onClick={handleAddEvent}
                aria-label="Add new item"
              >
                + Add Item
              </Button>

          <Row className="g-4 align-items-end mb-4 flex-wrap">

  {/* Sub Total */}
  <Col xs={12} sm={6} md={4} lg="auto">
    <Form.Label className="fw-bold text-muted small mb-1">Sub Total</Form.Label>
    <InputGroup>
      <InputGroup.Text>{currency}</InputGroup.Text>
      <Form.Control type="text" value={subTotal} readOnly className="bg-light" />
    </InputGroup>
  </Col>

  {/* Tax Rate (%) */}
  <Col xs={12} sm={6} md={4} lg="auto">
    <Form.Label className="fw-bold text-muted small mb-1">Tax Rate (%)</Form.Label>
    <Form.Control
      type="number"
      min="0"
      max="100"
      step="0.01"
      value={taxRate}
      onChange={handleChange(setTaxRate)}
      className="bg-white"
    />
  </Col>

  {/* Tax Amount */}
  <Col xs={12} sm={6} md={4} lg="auto">
    <Form.Label className="fw-bold text-muted small mb-1">Tax Amount</Form.Label>
    <InputGroup>
      <InputGroup.Text>{currency}</InputGroup.Text>
      <Form.Control type="text" value={taxAmount} readOnly className="bg-light" />
    </InputGroup>
  </Col>

  {/* Discount Rate (%) */}
  <Col xs={12} sm={6} md={4} lg="auto">
    <Form.Label className="fw-bold text-muted small mb-1">Discount Rate (%)</Form.Label>
    <Form.Control
      type="number"
      min="0"
      max="100"
      step="0.01"
      value={discountRate}
      onChange={handleChange(setDiscountRate)}
      className="bg-white"
    />
  </Col>

  {/* Discount Amount */}
  <Col xs={12} sm={6} md={4} lg="auto">
    <Form.Label className="fw-bold text-muted small mb-1">Discount Amount</Form.Label>
    <InputGroup>
      <InputGroup.Text>{currency}</InputGroup.Text>
      <Form.Control type="text" value={discountAmount} readOnly className="bg-light" />
    </InputGroup>
  </Col>

  {/* Total */}
  <Col xs={12} sm={6} md={4} lg="auto">
    <Form.Label className="fw-bold text-dark small mb-1 fs-6">Total</Form.Label>
    <InputGroup>
      <InputGroup.Text>{currency}</InputGroup.Text>
      <Form.Control
        type="text"
        value={total}
        readOnly
        className="bg-success text-white fw-bold fs-6"
      />
    </InputGroup>
  </Col>

</Row>


              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Additional Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={notes}
                  onChange={handleChange(setNotes)}
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100"
                aria-label="Preview Invoice"
              >
                Preview Invoice
              </Button>
            </Card>
          </Col>
        </Row>

        {isOpen && (
          <InvoiceModal
            isOpen={isOpen}
            closeModal={closeModal}
            data={{
              invoiceNumber,
              dateOfIssue,
              billFrom,
              billFromEmail,
              billFromAddress,
              billTo,
              billToEmail,
              billToAddress,
              items,
              total,
              subTotal,
              taxRate,
              taxAmount,
              discountRate,
              discountAmount,
              notes,
              currency,
            }}
          />
        )}
      </Form>
    </>
  );
};

export default InvoiceForm;
