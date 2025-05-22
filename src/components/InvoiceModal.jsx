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
  } = data;

  const generatePdf = async () => {
    const element = invoiceRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, { scale: 2 });
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

  const generatePdfAndSend = async () => {
    if (!phone.trim()) {
      alert("Please enter a valid phone number.");
      return;
    }

    await generatePdf();

    setAlertVisible(true);

    const message = encodeURIComponent(
      `Hello! Please find my invoice #${invoiceNumber} dated ${dateOfIssue}. Kindly check the attached PDF invoice.`
    );

    const formattedPhone = phone.replace(/[^+\d]/g, "");

    window.open(`https://wa.me/${formattedPhone}?text=${message}`, "_blank");
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
        {/* Invoice content same as before */}
        <div className="mb-3 d-flex justify-content-between flex-wrap">
          <div>
            <h5>
              Invoice #: <span className="fw-normal">{invoiceNumber}</span>
            </h5>
            <h6>
              Date of Issue: <span className="fw-normal">{dateOfIssue}</span>
            </h6>
          </div>
          <div className="text-end">
            <h6>
              <strong>Bill From</strong>
            </h6>
            <div>{billFrom}</div>
            <div>{billFromEmail}</div>
            <div>{billFromAddress}</div>
          </div>
          <div className="text-end">
            <h6>
              <strong>Bill To</strong>
            </h6>
            <div>{billTo}</div>
            <div>{billToEmail}</div>
            <div>{billToAddress}</div>
          </div>
        </div>

        <Table bordered responsive>
          <thead>
            <tr>
              <th>Product</th>
              <th>Description</th>
              <th style={{ width: "100px" }}>Price</th>
              <th style={{ width: "80px" }}>Qty</th>
              <th style={{ width: "100px" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map(({ id, name, description, price, quantity }) => {
              const totalPrice = (
                parseFloat(price || 0) * parseInt(quantity || 0)
              ).toFixed(2);
              return (
                <tr key={id}>
                  <td>{name || "-"}</td>
                  <td>{description || "-"}</td>
                  <td>
                    {currency} {parseFloat(price).toFixed(2)}
                  </td>
                  <td>{quantity}</td>
                  <td>
                    {currency} {totalPrice}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>

        <div
          className="d-flex justify-content-end flex-column"
          style={{ maxWidth: "300px", marginLeft: "auto" }}
        >
          <div className="d-flex justify-content-between mb-1">
            <strong>Sub Total:</strong>
            <span>
              {currency} {subTotal}
            </span>
          </div>
          <div className="d-flex justify-content-between mb-1">
            <strong>Tax ({taxRate} %):</strong>
            <span>
              {currency} {taxAmount}
            </span>
          </div>
          <div className="d-flex justify-content-between mb-1">
            <strong>Discount ({discountRate} %):</strong>
            <span>
              {currency} {discountAmount}
            </span>
          </div>
          <hr />
          <div className="d-flex justify-content-between fs-5 fw-bold">
            <span>Total:</span>
            <span>
              {currency} {total}
            </span>
          </div>
        </div>

        {notes && (
          <div className="mt-4">
            <h6>
              <strong>Additional Notes:</strong>
            </h6>
            <p>{notes}</p>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="d-flex flex-column align-items-stretch">
        <Form.Group controlId="whatsappPhone" className="mb-3">
          <Form.Label>Phone number to send WhatsApp message:</Form.Label>
          <Form.Control
            type="tel"
            placeholder="e.g. +1234567890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Form.Group>

        {alertVisible && (
          <Alert
            variant="info"
            onClose={() => setAlertVisible(false)}
            dismissible
            className="mb-3"
          >
            Please manually attach the downloaded PDF in WhatsApp after you are
            redirected.
          </Alert>
        )}

        <div className="d-flex justify-content-between">
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <div>
            <Button
              variant="primary"
              onClick={generatePdf}
              className="me-2"
            >
              Download PDF
            </Button>
            <Button variant="success" onClick={generatePdfAndSend}>
              Send via WhatsApp
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default InvoiceModal;
