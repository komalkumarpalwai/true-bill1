import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import { BiCloudDownload } from "react-icons/bi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const GenerateInvoicePdf = () => {
  return html2canvas(document.querySelector("#invoiceCapture")).then((canvas) => {
    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: [612, 792],
    });
    pdf.internal.scaleFactor = 1;
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("invoice-001.pdf");
  });
};

const InvoiceModal = ({
  showModal,
  closeModal,
  info,
  currency,
  total,
  items,
  taxAmount,
  discountAmount,
  subTotal,
}) => {
  const [phoneNumber, setPhoneNumber] = useState(info.phoneNumber || "");

  const handleDownload = () => {
    GenerateInvoicePdf();
  };

  const handleWhatsAppSend = async () => {
    // Generate and download the PDF
    await GenerateInvoicePdf();

    // Alert user about manual attachment
    alert(
      "Please manually attach the downloaded PDF in WhatsApp after you are redirected."
    );

    // Prepare WhatsApp URL with prefilled message
    const message = encodeURIComponent(
      `Hello, please find your invoice attached.\nTotal amount due: ${currency} ${total}`
    );

    // Clean phone number input
    let cleanedNumber = phoneNumber.trim();
    if (!cleanedNumber.startsWith("+")) {
      cleanedNumber = "+" + cleanedNumber;
    }

    // Open WhatsApp web
    window.open(`https://wa.me/${cleanedNumber}?text=${message}`, "_blank");
  };

  return (
    <div>
      <Modal show={showModal} onHide={closeModal} size="lg" centered>
        <div id="invoiceCapture">
          <div className="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4">
            <div className="w-100">
              <h4 className="fw-bold my-2">
                {info.billFrom || "John Uberbacher"}
              </h4>
              <h6 className="fw-bold text-secondary mb-1">
                Invoice Number: {info.invoiceNumber || ""}
              </h6>
            </div>
            <div className="text-end ms-4">
              <h6 className="fw-bold mt-1 mb-2">Amount&nbsp;Due:</h6>
              <h5 className="fw-bold text-secondary">
                {currency} {total}
              </h5>
            </div>
          </div>
          <div className="p-4">
            <Row className="mb-4">
              <Col md={4}>
                <div className="fw-bold">Billed From:</div>
                <div>{info.billFrom || ""}</div>
                <div>{info.billFromAddress || ""}</div>
                <div>{info.billFromEmail || ""}</div>
              </Col>
              <Col md={4}>
                <div className="fw-bold">Billed to:</div>
                <div>{info.billTo || ""}</div>
                <div>{info.billToAddress || ""}</div>
                <div>{info.billToEmail || ""}</div>
              </Col>
              <Col md={4}>
                <div className="fw-bold mt-2">Date Of Issue:</div>
                <div>{info.dateOfIssue || ""}</div>
              </Col>
            </Row>
            <Table className="mb-0">
              <thead>
                <tr>
                  <th>QTY</th>
                  <th>DESCRIPTION</th>
                  <th className="text-end">PRICE</th>
                  <th className="text-end">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => {
                  return (
                    <tr id={i} key={i}>
                      <td style={{ width: "70px" }}>{item.quantity}</td>
                      <td>
                        {item.name} - {item.description}
                      </td>
                      <td className="text-end" style={{ width: "100px" }}>
                        {currency} {item.price}
                      </td>
                      <td className="text-end" style={{ width: "100px" }}>
                        {currency} {item.price * item.quantity}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <Table>
              <tbody>
                <tr>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>
                <tr className="text-end">
                  <td></td>
                  <td className="fw-bold" style={{ width: "100px" }}>
                    SUBTOTAL
                  </td>
                  <td className="text-end" style={{ width: "100px" }}>
                    {currency} {subTotal}
                  </td>
                </tr>
                {taxAmount != 0.0 && (
                  <tr className="text-end">
                    <td></td>
                    <td className="fw-bold" style={{ width: "100px" }}>
                      TAX
                    </td>
                    <td className="text-end" style={{ width: "100px" }}>
                      {currency} {taxAmount}
                    </td>
                  </tr>
                )}
                {discountAmount != 0.0 && (
                  <tr className="text-end">
                    <td></td>
                    <td className="fw-bold" style={{ width: "100px" }}>
                      DISCOUNT
                    </td>
                    <td className="text-end" style={{ width: "100px" }}>
                      {currency} {discountAmount}
                    </td>
                  </tr>
                )}
                <tr className="text-end">
                  <td></td>
                  <td className="fw-bold" style={{ width: "100px" }}>
                    TOTAL
                  </td>
                  <td className="text-end" style={{ width: "100px" }}>
                    {currency} {total}
                  </td>
                </tr>
              </tbody>
            </Table>
            {info.notes && (
              <div className="bg-light py-3 px-4 rounded">{info.notes}</div>
            )}
          </div>
        </div>
        <div className="pb-4 px-4">
          <Row>
            <Col md={6}>
              {/* Phone number input with example placeholder */}
              <input
                type="tel"
                className="form-control"
                placeholder="Enter phone number e.g. +1234567890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </Col>
            <Col md={6}>
              <Button
                variant="outline-primary"
                className="d-block w-100 mt-3 mt-md-0"
                onClick={handleDownload}
              >
                <BiCloudDownload
                  style={{ width: "16px", height: "16px", marginTop: "-3px" }}
                  className="me-2"
                />
                Download Copy
              </Button>

              <Button
                variant="outline-success"
                className="d-block w-100 mt-3"
                onClick={handleWhatsAppSend}
              >
                {/* WhatsApp Icon SVG or use react-icons */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-whatsapp me-2"
                  viewBox="0 0 16 16"
                  style={{ marginTop: "-3px" }}
                >
                  <path d="M13.601 2.326a7.65 7.65 0 0 0-11.01 0 7.73 7.73 0 0 0-2.34 5.477c0 1.32.35 2.606 1.01 3.75L.17 14.93a.494.494 0 0 0 .64.61l3.746-1.53a7.78 7.78 0 0 0 3.71 1.01c4.253 0 7.707-3.523 7.707-7.867 0-2.11-.832-4.096-2.385-5.61zM8 13.508a5.448 5.448 0 0 1-2.8-.79l-.198-.118-2.22.904.747-2.164-.13-.224A5.45 5.45 0 1 1 8 13.508zm2.425-3.12c-.123-.062-.726-.358-.838-.399-.112-.04-.193-.06-.274.062-.08.123-.31.399-.38.48-.07.08-.14.09-.263.03-.123-.062-.52-.192-.99-.61-.366-.327-.614-.73-.686-.854-.07-.124-.008-.19.054-.252.056-.057.124-.146.186-.22.062-.074.083-.123.124-.206.04-.08.02-.15-.01-.21-.03-.062-.273-.66-.374-.9-.098-.237-.198-.206-.273-.21-.07-.004-.15-.005-.228-.005-.078 0-.206.03-.314.15-.11.123-.42.41-.42 1 0 .59.43 1.162.49 1.243.06.08.85 1.298 2.06 1.82 1.44.62 1.44.414 1.7.39.26-.023.85-.35.97-.69.123-.343.123-.635.086-.7-.034-.06-.11-.095-.234-.157z" />
                </svg>
                Send via WhatsApp
              </Button>
            </Col>
          </Row>
        </div>
      </Modal>
    </div>
  );
};

export default InvoiceModal;
