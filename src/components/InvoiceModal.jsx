import React, { useState, useRef } from "react";
import { Modal, Button, Table, Form, Alert } from "react-bootstrap";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const InvoiceModal = ({ isOpen, closeModal, data }) => {
  const [phone, setPhone] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const invoiceRef = useRef(null);

  if (!data) return null;

  const {
    invoiceNumber,
    dateOfIssue,
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
    companyLogo
  } = data;

  const generatePdf = async () => {
    const element = invoiceRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${invoiceNumber}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  // ✅ Modified function to send text-based billing details only
  const sendBillingDetailsViaWhatsApp = () => {
    if (!phone.trim()) {
      alert("Please enter a valid phone number.");
      return;
    }

    const formattedPhone = phone.replace(/[^+\d]/g, "");

    let message = `📄 *Invoice #${invoiceNumber}* (${dateOfIssue})\n\n`;

    message += `👨‍💼 *From:* ${billFrom}\n📧 ${billFromEmail}\n🏢 ${billFromAddress}\n\n`;
    message += `👤 *To:* ${billTo}\n📧 ${billToEmail}\n🏠 ${billToAddress}\n\n`;

    message += `🧾 *Items:*\n`;
    items.forEach((item, index) => {
      message += `  ${index + 1}. ${item.name || "-"} - ${currency}${item.price} x ${item.quantity} = ${currency}${(item.price * item.quantity).toFixed(2)}\n`;
    });

    message += `\n💰 *Sub Total:* ${currency}${subTotal}\n`;
    message += `🧾 *Tax (${taxRate}%):* ${currency}${taxAmount}\n`;
    message += `🎁 *Discount (${discountRate}%):* ${currency}${discountAmount}\n`;
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
      }}
      size="lg"
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Invoice Preview</Modal.Title>
      </Modal.Header>

      <Modal.Body
        ref={invoiceRef}
        style={{ maxHeight: "70vh", overflowY: "auto" }}
      >
        <div className="d-flex justify-content-between align-items-start mb-4">
          {companyLogo && (
            <div className="mb-3" style={{ width: "150px" }}>
              <img
                src={companyLogo}
                alt="Company Logo"
                className="img-fluid"
                style={{ maxHeight: "80px" }}
              />
            </div>
          )}
          <div className="text-end">
            <h2 className="text-primary mb-1">INVOICE</h2>
            <div className="d-flex flex-column">
              <span className="text-muted">Invoice #: {invoiceNumber}</span>
              <span className="text-muted">Date: {dateOfIssue}</span>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card border-0 bg-light p-3">
              <h5 className="card-title">Bill From</h5>
              <div className="card-text">
                <p className="mb-1"><strong>{billFrom}</strong></p>
                <p className="mb-1">{billFromEmail}</p>
                <p className="mb-0">{billFromAddress}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card border-0 bg-light p-3">
              <h5 className="card-title">Bill To</h5>
              <div className="card-text">
                <p className="mb-1"><strong>{billTo}</strong></p>
                <p className="mb-1">{billToEmail}</p>
                <p className="mb-0">{billToAddress}</p>
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
            {items.map(({ id, name, description, price, quantity }, index) => {
              const totalPrice = (
                parseFloat(price || 0) * parseInt(quantity || 0)
              ).toFixed(2);
              return (
                <tr key={id}>
                  <td>{index + 1}</td>
                  <td>{name || "-"}</td>
                  <td>{description || "-"}</td>
                  <td className="text-end">
                    {currency} {parseFloat(price).toFixed(2)}
                  </td>
                  <td className="text-center">{quantity}</td>
                  <td className="text-end">
                    {currency} {totalPrice}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>

        <div className="row justify-content-end">
          <div className="col-md-5">
            <div className="table-responsive">
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <td className="fw-bold">Sub Total:</td>
                    <td className="text-end">
                      {currency} {subTotal}
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Tax ({taxRate}%):</td>
                    <td className="text-end">
                      {currency} {taxAmount}
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Discount ({discountRate}%):</td>
                    <td className="text-end">
                      {currency} {discountAmount}
                    </td>
                  </tr>
                  <tr className="table-active">
                    <td className="fw-bold">Total:</td>
                    <td className="text-end fw-bold">
                      {currency} {total}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {notes && (
          <div className="mt-4 p-3 bg-light rounded">
            <h6 className="fw-bold">Additional Notes:</h6>
            <p className="mb-0">{notes}</p>
          </div>
        )}

        <div className="mt-5 pt-3 border-top text-center text-muted small">
          <p className="mb-1">Thank you for your business!</p>
          <p className="mb-0">
            This is a computer generated invoice and does not require signature
          </p>
        </div>
      </Modal.Body>

      <Modal.Footer className="d-flex flex-column align-items-stretch">
        <Form.Group controlId="whatsappPhone" className="mb-3">
          <Form.Label>Phone number to send WhatsApp message:</Form.Label>
          <Form.Control
            type="tel"
            placeholder="e.g. +1234567890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="py-2"
          />
        </Form.Group>

        {alertVisible && (
          <Alert
            variant="info"
            onClose={() => setAlertVisible(false)}
            dismissible
            className="mb-3"
          >
            WhatsApp message sent with billing details.
          </Alert>
        )}

        <div className="d-flex justify-content-between align-items-center">
          <Button variant="outline-secondary" onClick={closeModal}>
            Close
          </Button>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" onClick={printInvoice}>
              <i className="bi bi-printer me-2"></i>Print
            </Button>
            <Button variant="primary" onClick={generatePdf}>
              <i className="bi bi-download me-2"></i>Download PDF
            </Button>
            <Button variant="success" onClick={sendBillingDetailsViaWhatsApp}>
              <i className="bi bi-whatsapp me-2"></i>Send via WhatsApp
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default InvoiceModal;
