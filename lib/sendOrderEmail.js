import nodemailer from "nodemailer";

export async function sendOrderEmail({ to, pdfBuffer }) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Fresh Farm Co." <${process.env.EMAIL_USER}>`,
    to,
    subject: "Order Confirmation",
    text: "Thank you for your order! See attached invoice.",
    attachments: [
      {
        filename: "order-summary.pdf",
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
}
