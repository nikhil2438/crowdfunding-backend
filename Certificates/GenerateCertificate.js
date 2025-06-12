
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

function generateCertificate({ name, amount, date = new Date().toLocaleDateString() }) {
  return new Promise((resolve, reject) => {
    console.log("generateCertificate inputs:", { name, amount, date });

    const dir = path.join(__dirname, "../Certificates");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);

    const safeName = typeof name === "string" && name.trim() !== "" ? name.trim() : "Anonymous";
    const safeAmount = typeof amount === "number" && amount > 0 ? amount.toFixed(2) : "0.00";

    const fileName = path.join(dir, `${safeName.replace(/ /g, "_")}_Certificate.pdf`);
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    const stream = fs.createWriteStream(fileName);
    doc.pipe(stream);

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    
    const logoPath = path.join(__dirname, "../assets/logo.png");
    if (fs.existsSync(logoPath)) {
      const logoWidth = 100;
      const x = (pageWidth - logoWidth) / 2;
      doc.image(logoPath, x, 40, { width: logoWidth });
    }

    doc.moveDown(6);

   
    
    const borderMargin = 30;
    doc
      .lineWidth(2)
      .strokeColor("#bfa133") 
      .rect(borderMargin, borderMargin, pageWidth - borderMargin * 2, pageHeight - borderMargin * 2)
      .stroke();

    doc.moveDown(4);

    
    doc
      .font("Helvetica-Bold")
      .fontSize(24)
      .fillColor("black")
      .text("CERTIFICATE OF DONATION", { align: "center" })
      .moveDown(1.5);

    
    doc
      .font("Helvetica")
      .fontSize(12)
      .text("THIS CERTIFIES THAT", { align: "center" })
      .moveDown(1);

    
    doc
      .font("Helvetica-Oblique")
      .fontSize(26)
      .fillColor("#000")
      .text(safeName, { align: "center" })
      .moveDown(1);

    
    const lineWidth = 300;
    doc.moveTo((pageWidth - lineWidth) / 2, doc.y).lineTo((pageWidth + lineWidth) / 2, doc.y).stroke();

    
    doc
      .moveDown(1)
      .font("Helvetica")
      .fontSize(12)
      .fillColor("black")
      .text(`ON BEHALF OF MAA SIDDHESHWARI CHARITY TRUST`, { align: "center" })
      .moveDown(0.5)
      .text(`HAS DONATED ₹${safeAmount} TO THE FOLLOWING CHARITY`, { align: "center" })
      .moveDown(0.5)
      .font("Helvetica-Bold")
      .fontSize(14)
      .text("MAA SIDDHESHWARI CHARITY TRUST", { align: "center" })
      .moveDown(3);

    
    doc
      .font("Helvetica")
      .fontSize(10)
      .text("________________________", 70, doc.y)
      .text("Signature", 110, doc.y + 12);

    doc
      .font("Helvetica")
      .fontSize(10)
      .text(date, pageWidth - 160, doc.y - 12)
      .text("DATE", pageWidth - 120, doc.y + 12);

    doc.end();

    stream.on("finish", () => {
      console.log("✅ Certificate generated:", fileName);
      resolve(fileName);
    });

    stream.on("error", (err) => {
      console.error("❌ Error writing certificate:", err);
      reject(err);
    });
  });
}

module.exports = generateCertificate;
