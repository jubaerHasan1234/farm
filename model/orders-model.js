import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      required: true, // or false if optional
      trim: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
      default: "https://placehold.co/100x100/e0e0e0/000000?text=No+Image",
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "Order must contain at least one item.",
      },
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ["cash_on_delivery", "bkash", "nagad", "sslcommerz", "stripe"],
      default: "sslcommerz",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingCost: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    serviceFee: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    pdf: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Orders =
  mongoose.models.Orders || mongoose.model("Orders", orderSchema);

//   {
//     "customer": "64ffab1aef4cf29c7ae00abc",
//     "items": [
//       {
//         "product": "64ffaa8eef4cf29c7ae000dd",
//         "quantity": 3,
//         "price": 120
//       },
//       {
//         "product": "64ffaa8eef4cf29c7ae000ee",
//         "quantity": 1,
//         "price": 250
//       }
//     ],
//     "shippingAddress": {
//       "fullName": "John Doe",
//       "phone": "017XXXXXXXX",
//       "addressLine": "123 Street",
//       "city": "Dhaka",
//       "postalCode": "1207"
//     },
//     "paymentMethod": "bkash",
//     "paymentStatus": "paid",
//     "orderStatus": "confirmed",
//     "totalAmount": 610
//   }
