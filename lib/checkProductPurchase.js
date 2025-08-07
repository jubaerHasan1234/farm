// "use server";
// import { Orders } from "@/model/orders-model";
// import { dbConnect } from "@/service/mongo";
// import mongoose from "mongoose";

// export async function checkProductPurchase(userId, productId) {
//   try {
//     await dbConnect();

//     if (
//       !mongoose.Types.ObjectId.isValid(userId) ||
//       !mongoose.Types.ObjectId.isValid(productId)
//     ) {
//       console.error("Invalid userId or productId provided.");
//       return false;
//     }

//     const order = await Orders.findOne({
//       user: userId,
//       "orderItems.productId": productId,
//     }).lean();

//     return !!order;
//   } catch (error) {
//     console.error("Error in checkProductPurchase:", error);

//     return false;
//   }
// }
