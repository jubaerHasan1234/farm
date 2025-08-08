## Getting Started

First, run the development server:

```bash
npm run dev

```

## 1. User Authentication

- **Access Token** and **Refresh Token** functionality.

- **"Continue with Google"** social for both registration and login.
- Implement **Parallel Routing** and **Intercepting Routing** so that clicking on login or registration opens a modal, while reloading shows them as separate pages.
- Implement a **Password Reset** feature using `forget-password.html`
- Users can request a password reset email.

---

## 2. Home Page (`index.html`)

- **Search Functionality**:
- Users can search for products by keyword and/or category.
- Search results should be displayed in `products.html`.
- **Search Results UX Improvements**:
- Display the last searched keyword in `products.html`.
- Allow user to search again from the same page
- **Shop by Category**:
- Clicking on a category navigates to `products.html`.

- The selected category is pre-selected in the filter.
- Products are shown based on the selected category.
- **Featured Product Category**:

- Show products with the highest number of purchases.
- If there are no purchases, show the top 8 latest products by creation date.
- Allow "Add to Cart", "Favorite Toggle", and view product details (via detail page or modal using parallel/intercepting routing).
- **"See All"** link will display all products.

---

## 3. Product Details Page (`details.html`)

- Show:
- Product Gallery, Category, Features (e.g., Organic, Fresh), Name, Farmer Name, Total Rating, Average Rating, Description, Quantity, etc.
- Features:
- Toggle Add to Cart, Toggle Favorites.
- "Buy Now" navigates directly to `paymentProcess.html`.
- Stock management of all products.
- **Tabs**: Description, Reviews, Farmer Information.
- **Reviews**:
- Display existing reviews.
- Users can only write a review if they have purchased the product.
- One review per user.
- Reviews from logged in users will be displayed first.
- Users can edit/delete their reviews.
- "Load More" loads 5 more reviews at once.
- **Related Products**: Related items

---

## 4. Payment Process Page (`paymentProcess.html`)

- Display:
- Selected products and cart products.
- Delivery address, subtotal, delivery fee, service fee, total.
- Fake payment simulation with user information form.
- On submission:
- Show `success.html` page with order details and payment summary.
- Send a **PDF invoice** to the user's email.
- "Edit order details" button:
- Opens a modal to edit quantity or delivery address.

---

## 5. Success page (`success.html`)

- Download invoice as PDF (company info, order info, customer info, product details).
- Navigates to `View all orders'' `bookings.html``.

---

## 6. Bookings page (`bookings.html`)

- Show all past and current orders for the logged-in user.
- Features:
- Download invoice.
- Write review for purchased product.
- Cancel order.
- Role-based:
- **Farmer**: View all orders for their products, update status (pending, confirmed, shipped, delivered, canceled).
- **User**: View order status, download invoices, review, reorder.
- Reorder flow should be user-friendly.

---

## 7. Navbar

- Common for all pages.
- If **not logged in**: Show login and signup buttons.
- If logged in as **Farmer**: Show `Home`, `Add Products`, `Manage Products`, `About`, `Logout`.
- If logged in as **User**: `Home`, `Products`, `Farmer`, `My Orders`, `About`, `Logout`
- User profile picture and name when logged in

---

## 8. Product Management

- **Add Product**:
- Only farmers can access.
- Use `create.html` template.
- Submit to create a new product
- **Manage Products**:
- Farmers can edit, publish/unpublish, delete, search, filter products.
- Use `manageList.html` template

---

## 9. Farmer Page

- Accessible to all users (anonymous, farmer, normal user).
- Information of all registered farmers

---

## 10. Cart and Favorites Page

- Create both pages to match the theme and design system of the application
- Add to Navbar.
- Features:
- Favorite Toggle, Purchase, Add to Cart from Favorites.

---

## 11. General Requirements

- Handle Status: Loading, Error, Not Found.
- Proper Form Validation.
- **SEO Friendly**:
- Home Page and Product Details should have proper Meta Title, Description and Image.
- Product Details should dynamically generate Meta Tags based on the product
- Social Media Sharing Display Correct Information
  """
