"use server";

import { Users } from "@/model/user-modal";
import { dbConnect } from "@/service/mongo";
import { Buffer } from "buffer";
import mongoose from "mongoose";

// ✅ Deeply sanitize any object before passing to Client Components
function sanitize(obj) {
  if (obj === null || obj === undefined) return obj;

  // Primitive values are safe
  if (typeof obj !== "object") return obj;

  // Convert ObjectId to string
  if (obj?._bsontype === "ObjectID" || obj?.constructor?.name === "ObjectId") {
    return obj.toString();
  }

  // Convert Date to ISO string
  if (obj instanceof Date) {
    return obj.toISOString();
  }

  // Remove Buffers (optional: you can also do obj.toString("base64") if needed)
  if (Buffer.isBuffer(obj)) {
    return undefined;
  }

  // Sanitize arrays
  if (Array.isArray(obj)) {
    return obj.map(sanitize);
  }

  // Sanitize objects recursively
  const newObj = {};
  for (const key in obj) {
    const value = obj[key];

    if (typeof value === "function") continue; // skip methods like valueOf, toJSON
    const sanitized = sanitize(value);
    if (sanitized !== undefined) {
      newObj[key] = sanitized;
    }
  }

  return newObj;
}

export async function getUserById(userId) {
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(userId)) return null;

  const user = await Users.findById(userId).lean();

  if (!user) return null;

  // 🧼 Remove sensitive info
  delete user.password;

  // ✅ Deep sanitize the whole user object
  return sanitize(user);
}
