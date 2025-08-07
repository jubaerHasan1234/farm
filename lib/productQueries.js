"use server";

import { Products } from "@/model/product-model";
import { dbConnect } from "@/service/mongo";
import { Buffer } from "buffer"; // ensures Buffer is recognized in all environments

// 🔧 Deeply sanitize Mongo/Mongoose objects for client use
function sanitize(obj) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map(sanitize);
  }

  // Handle ObjectId
  if (obj?._bsontype === "ObjectID" || obj?.constructor?.name === "ObjectId") {
    return obj.toString();
  }

  // Handle Date
  if (obj instanceof Date) {
    return obj.toISOString();
  }

  // Handle Buffer
  if (Buffer.isBuffer(obj)) {
    return undefined; // or return obj.toString("base64") if needed
  }

  const result = {};
  for (const key in obj) {
    const value = obj[key];
    if (typeof value === "function") continue; // Skip methods like valueOf, toJSON
    const sanitizedValue = sanitize(value);
    if (sanitizedValue !== undefined) {
      result[key] = sanitizedValue;
    }
  }

  return result;
}

export async function getProductById(id) {
  await dbConnect();

  if (!id) return null;

  const product = await Products.findById(id).lean();

  if (!product) return null;

  return sanitize(product);
}
