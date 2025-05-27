import React, { useState, useRef } from "react";
import { Modal, Button, Table, Form, Alert } from "react-bootstrap";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const InvoiceModal = ({ isOpen, closeModal, data }) => {
  // Load companyLogo URL from localStorage only once on initial render
  const [companyLogo, setCompanyLogo] = useState(() => localStorage.getItem("userLogo") || "");

  const [phone, setPhone] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const invoiceRef = useRef(null);

  if (!data) return null;

  // Generate invoice number once per modal open
  // Use useRef to keep it stable during component life cycle
  const invoiceNumberRef = React.useRef(null);
  if (!invoiceNumberRef.current) {
    const timestamp = Date.now();
    const randomPart = Math.floor(Math.random() * 1000);
    invoiceNumberRef.current = `INV-${timestamp}-${randomPart}`;
  }

  // Format date to ISO (YYYY-MM-DD)
  const formattedDate = new Date(data.dateOfIssue || Date.now())
    .toISOString()
    .split("T")[0];

  const {
    billFrom,
    billFromEmail,
    billFromAddress,
    billTo,
    billToEmail,
    billToAddress,
    items,
    subTotal,
    taxRate,
    taxAmount,
    discountRate,
    discountAmount,
    total,
    notes,
    currency,
  } = data;

  const generatePdf = async () => {
    const element = invoiceRef.current;
    if (!element) return;

    try {
      // Temporarily inject formatted invoice number and date into DOM before capture
      const originalInvoiceNumberElem = element.querySelector("#invoice-number");
      const originalDateElem = element.querySelector("#invoice-date");

      if (originalInvoiceNumberElem) {
        originalInvoiceNumberElem.textContent = invoiceNumberRef.current;
      }
      if (originalDateElem) {
        originalDateElem.textContent = formattedDate;
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${invoiceNumberRef.current}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const sendBillingDetailsViaWhatsApp = () => {
    if (!phone.trim()) {
      alert("Please enter a valid phone number.");
      return;
    }

    const formattedPhone = phone.replace(/[^+\d]/g, "");

    let message = `📄 *Invoice #${invoiceNumberRef.current}* (${formattedDate})\n\n`;

    message += `👨‍💼 *From:* ${billFrom || "-"}\n`;
    if (billFromEmail) message += `📧 ${billFromEmail}\n`;
    if (billFromAddress) message += `🏢 ${billFromAddress}\n\n`;

    message += `👤 *To:* ${billTo || "-"}\n`;
    if (billToEmail) message += `📧 ${billToEmail}\n`;
    if (billToAddress) message += `🏠 ${billToAddress}\n\n`;

    message += `🧾 *Items:*\n`;
    items.forEach((item, index) => {
      message += `  ${index + 1}. ${item.name || "-"} - ${currency}${parseFloat(
        item.price
      ).toFixed(2)} x ${item.quantity} = ${currency}${(
        item.price * item.quantity
      ).toFixed(2)}\n`;
    });

    message += `\n💰 *Sub Total:* ${currency}${subTotal}\n`;
    message += `🧾 *Tax (${taxRate}%):* ${currency}${taxAmount}\n`;
    message += `🟢 *Total:* ${currency}${total}\n`;

    if (notes) {
      message += `\n📝 *Notes:* ${notes}`;
    }

    const encodedMsg = encodeURIComponent(message);
    window.open(`https://wa.me/${formattedPhone}?text=${encodedMsg}`, "_blank");
    setAlertVisible(true);
  };

  const printInvoice = () => {
    if (!invoiceRef.current) return;
    const printContents = invoiceRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  return (
    <Modal
      show={isOpen}
      onHide={() => {
        closeModal();
        setAlertVisible(false);
        setPhone("");
        invoiceNumberRef.current = null; // reset invoice number on close
      }}
      size="lg"
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            {companyLogo && (
              <img
                src={companyLogo}
                alt="Company Logo"
                style={{ maxHeight: "50px", objectFit: "contain" }}
              />
            )}
            <span>INVOICE</span>
          </div>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body
        ref={invoiceRef}
        style={{ maxHeight: "70vh", overflowY: "auto" }}
      >
        <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap">
          {/* Left blank since logo moved to header */}
          <div></div>
          <div className="text-end">
            <div>
              <span
                className="text-muted"
                style={{ display: "block" }}
                id="invoice-number"
              >
                {invoiceNumberRef.current}
              </span>
              <span className="text-muted" id="invoice-date">
                {formattedDate}
              </span>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-6 mb-3">
            <div className="card border-0 bg-light p-3">
              <h5 className="card-title">Bill From</h5>
              <div className="card-text">
                <p className="mb-1">
                  <strong>{billFrom || "-"}</strong>
                </p>
                {billFromEmail && <p className="mb-1">{billFromEmail}</p>}
                {billFromAddress && <p className="mb-0">{billFromAddress}</p>}
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="card border-0 bg-light p-3">
              <h5 className="card-title">Bill To</h5>
              <div className="card-text">
                <p className="mb-1">
                  <strong>{billTo || "-"}</strong>
                </p>
                {billToEmail && <p className="mb-1">{billToEmail}</p>}
                {billToAddress && <p className="mb-0">{billToAddress}</p>}
              </div>
            </div>
          </div>
        </div>

        <Table bordered responsive className="mb-4">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Description</th>
              <th className="text-end">Price</th>
              <th className="text-center">Qty</th>
              <th className="text-end">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map(
              (
                { id, name, description, price, quantity, image },
                index
              ) => {
                const totalPrice = (
                  parseFloat(price || 0) * parseInt(quantity || 0)
                ).toFixed(2);
                return (
                  <tr key={id || index}>
                    <td>{index + 1}</td>
                    <td className="d-flex align-items-center gap-2">
                      {image && (
                        <img
                          src={image}
                          alt={name}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                      )}
                      <span>{name || "-"}</span>
                    </td>
                    <td>{description || "-"}</td>
                    <td className="text-end">
                      {currency}
                      {parseFloat(price || 0).toFixed(2)}
                    </td>
                    <td className="text-center">{quantity || "-"}</td>
                    <td className="text-end">
                      {currency}
                      {totalPrice}
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </Table>

        <div className="d-flex justify-content-end flex-column gap-2">
          <div>
            <strong>Sub Total: </strong> {currency}
            {parseFloat(subTotal || 0).toFixed(2)}
          </div>
          <div>
            <strong>Tax ({taxRate}%): </strong> {currency}
            {parseFloat(taxAmount || 0).toFixed(2)}
          </div>
          <div>
            <strong>Discount ({discountRate}%): </strong> {currency}
            {parseFloat(discountAmount || 0).toFixed(2)}
          </div>
          <div style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
            Total: {currency}
            {parseFloat(total || 0).toFixed(2)}
          </div>
        </div>

        {notes && (
          <div className="mt-4">
            <h6>Notes:</h6>
            <p>{notes}</p>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="d-flex flex-column gap-3">
        {alertVisible && (
          <Alert
            variant="success"
            onClose={() => setAlertVisible(false)}
            dismissible
          >
            Invoice details sent via WhatsApp!
          </Alert>
        )}

        <Form
          onSubmit={(e) => {
            e.preventDefault();
            sendBillingDetailsViaWhatsApp();
          }}
          className="d-flex gap-2 w-100"
        >
          <Form.Control
            type="text"
            placeholder="Enter phone number with country code (e.g. +919876543210)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <Button type="submit" variant="success">
            Send via WhatsApp
          </Button>
        </Form>

        <div className="d-flex justify-content-between w-100">
          <Button variant="secondary" onClick={printInvoice}>
            Print Invoice
          </Button>
          <Button variant="primary" onClick={generatePdf}>
            Download PDF
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default InvoiceModal;
