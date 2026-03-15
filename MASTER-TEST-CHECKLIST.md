# Aura-Home Master Test Checklist

**Version:** 1.0  
**Last Updated:** 2026-03-15  
**Project:** Aura Home (aurahomelk.com)  
**Status:** Phase 1-5 Complete, Ready for Full Testing

---

## 📋 Test Categories

### ✅ Completed Features (Ready for Testing)
1. Product Catalog & Categories
2. Shopping Cart & Checkout
3. Admin Panel (Products, Categories, Orders)
4. Customer Accounts (Auth, Profile, Orders, Wishlist)
5. Delivery Zones & Time Slots
6. WhatsApp Notifications

### 🔴 Pending Features (Future Testing)
7. Blog + SEO
8. n8n + Groq AI Integration
9. Driver Management

---

## 🔴 CRITICAL — Core E-commerce Flow

### 1. Product Browsing

**Test Cases:**
- [ ] Homepage loads correctly
- [ ] Product catalog displays all products
- [ ] Category filtering works
- [ ] Search functionality works
- [ ] Product detail page shows all info
- [ ] Product images load from Cloudinary
- [ ] Sale prices display correctly (with discount %)
- [ ] Out of stock products show correctly
- [ ] Featured products highlighted

**Browser Testing:**
- [ ] Chrome (Desktop)
- [ ] Firefox (Desktop)
- [ ] Safari (Desktop)
- [ ] Chrome (Mobile)
- [ ] Safari iOS (Mobile)

---

### 2. Shopping Cart

**Test Cases:**
- [ ] Add to cart from product page
- [ ] Add to cart from product listing
- [ ] Cart drawer opens/closes
- [ ] Cart badge shows correct count
- [ ] Quantity controls work (+/-)
- [ ] Remove item from cart
- [ ] Cart persists on page refresh (localStorage)
- [ ] Cart persists across sessions
- [ ] Empty cart shows correct message
- [ ] Cart total calculates correctly
- [ ] Sale prices used in total

**Edge Cases:**
- [ ] Add same product multiple times
- [ ] Add product with quantity > stock
- [ ] Cart with 50+ items
- [ ] Very long product names

---

### 3. Checkout Flow

**Test Cases:**
- [ ] Checkout redirects if cart empty
- [ ] Step 1: Shipping form displays
- [ ] Step 2: Payment selection displays
- [ ] Can navigate back from payment to shipping
- [ ] Form validation works (all required fields)
- [ ] Phone number validation (Sri Lankan format)
- [ ] Email validation
- [ ] City dropdown populates
- [ ] Delivery zone dropdown populates
- [ ] Delivery fee displays when zone selected
- [ ] Delivery date picker shows next 7 days
- [ ] Time slot dropdown has 4 options
- [ ] WhatsApp opt-in checkbox works
- [ ] Order notes field works
- [ ] COD payment option works
- [ ] Koko payment option works
- [ ] Order summary shows correct totals
- [ ] Order confirmation page displays
- [ ] Order number generated
- [ ] Cart cleared after order

**Validation Tests:**
- [ ] Submit with empty required fields — shows errors
- [ ] Submit with invalid phone — shows error
- [ ] Submit with invalid email — shows error
- [ ] Submit without selecting zone — shows error
- [ ] Submit without date — shows error
- [ ] Submit without time slot — shows error

**Delivery Zone Tests:**
- [ ] Vavuniya selected — LKR 100 fee
- [ ] Colombo selected — LKR 600 fee
- [ ] Other Areas selected — LKR 750 fee
- [ ] Fee updates when zone changes
- [ ] Total updates with fee

**WhatsApp Opt-in Tests:**
- [ ] Checkbox unchecked by default
- [ ] Can check checkbox
- [ ] Opt-in saved with order
- [ ] Opt-in visible in admin order details

---

## 🟡 Admin Panel Testing

### 4. Admin Authentication

**Test Cases:**
- [ ] Admin routes accessible
- [ ] Admin sidebar displays
- [ ] Admin header displays
- [ ] Can navigate between admin sections

---

### 5. Product Management

**Test Cases:**
- [ ] Product list displays all products
- [ ] Product search works
- [ ] Product table sortable
- [ ] Create new product
- [ ] Edit existing product
- [ ] Delete product
- [ ] Upload product images (Cloudinary)
- [ ] Set sale prices
- [ ] Manage stock quantities
- [ ] Toggle featured status
- [ ] Toggle active/inactive status
- [ ] Assign categories

**Form Validation:**
- [ ] Required fields validated
- [ ] Price validation (positive numbers)
- [ ] Stock validation (non-negative)
- [ ] Slug auto-generates from name
- [ ] Image upload shows preview

---

### 6. Category Management

**Test Cases:**
- [ ] Category list displays
- [ ] Create new category
- [ ] Edit category
- [ ] Delete category
- [ ] Upload category images
- [ ] Category slug auto-generates
- [ ] Parent category selection (if applicable)

---

### 7. Order Management

**Test Cases:**
- [ ] Order list displays all orders
- [ ] Order stats dashboard shows correct counts
- [ ] Filter orders by status
- [ ] Search orders by number
- [ ] View order details
- [ ] Update order status
- [ ] Status update prompts WhatsApp notification
- [ ] WhatsApp link opens correctly
- [ ] Order items display correctly
- [ ] Customer info displays
- [ ] Delivery info displays
- [ ] Payment status visible

**Status Update Tests:**
- [ ] Pending → Confirmed
- [ ] Confirmed → Processing
- [ ] Processing → Shipped
- [ ] Shipped → Delivered
- [ ] Any status → Cancelled
- [ ] WhatsApp notification sent for each update

**Order Detail Tests:**
- [ ] Order number visible
- [ ] Customer name visible
- [ ] Phone number visible
- [ ] Address visible
- [ ] City visible
- [ ] Delivery zone visible
- [ ] Delivery date visible
- [ ] Time slot visible
- [ ] Items list with quantities
- [ ] Subtotal correct
- [ ] Shipping fee correct
- [ ] Total correct
- [ ] Payment method visible
- [ ] Payment status visible
- [ ] Customer notes visible

---

## 🟢 Customer Account Testing

### 8. Authentication

**Test Cases:**
- [ ] Navigate to /auth/login
- [ ] Enter email address
- [ ] Request magic link
- [ ] Magic link email received
- [ ] Click magic link
- [ ] Redirects to /account
- [ ] Session persists on refresh
- [ ] Sign out works
- [ ] Redirects to login when accessing /account while logged out

**Email Tests:**
- [ ] New email (not in system) — creates account
- [ ] Existing email — logs in
- [ ] Invalid email format — shows error
- [ ] Magic link expires (if applicable)

---

### 9. Account Dashboard

**Test Cases:**
- [ ] Overview page loads
- [ ] Order stats display (total, pending, processing, shipped, delivered)
- [ ] Recent orders list shows
- [ ] Sidebar navigation works
- [ ] Account info card displays
- [ ] Sign out button works

---

### 10. Order History

**Test Cases:**
- [ ] Order history page loads
- [ ] All customer orders visible
- [ ] Orders filtered by customer email (not other customers' orders)
- [ ] Status filter tabs work (All, Pending, Processing, Shipped, Delivered, Cancelled)
- [ ] Filter counts accurate
- [ ] Order cards show correct info
- [ ] Click order → navigates to detail
- [ ] Empty state shows when no orders

**Security Tests:**
- [ ] Customer A cannot see Customer B's orders
- [ ] Cannot access order by guessing ID (if not owned)
- [ ] Order detail also filtered by customer

---

### 11. Order Detail

**Test Cases:**
- [ ] Order detail page loads
- [ ] Order number visible
- [ ] Order date visible
- [ ] Status badge visible
- [ ] Payment status visible
- [ ] Order items list
- [ ] Product names correct
- [ ] Quantities correct
- [ ] Prices correct
- [ ] Subtotal correct
- [ ] Shipping fee correct
- [ ] Total correct
- [ ] Shipping info visible
- [ ] Delivery date visible
- [ ] Time slot visible
- [ ] Customer notes visible
- [ ] Back to orders button works

---

### 12. Profile Management

**Test Cases:**
- [ ] Profile page loads
- [ ] First name field editable
- [ ] Last name field editable
- [ ] Phone field editable
- [ ] Email field read-only
- [ ] Save changes works
- [ ] Success message displays
- [ ] Changes persist on refresh
- [ ] Member since date displays
- [ ] User ID displays

**Validation Tests:**
- [ ] Save with empty name — works
- [ ] Save with phone — works
- [ ] Save without phone — works
- [ ] Invalid phone format — shows error (if validated)

---

### 13. Wishlist

**Test Cases:**
- [ ] Wishlist page loads
- [ ] Empty state shows when no items
- [ ] "Browse Products" button works
- [ ] Add product to wishlist (from product page)
- [ ] Add product to wishlist (from product listing)
- [ ] Wishlist button shows filled heart when added
- [ ] Remove from wishlist
- [ ] Wishlist items display correctly
- [ ] Product images load
- [ ] Prices display correctly
- [ ] Discount badges show (if on sale)
- [ ] Add to cart from wishlist
- [ ] View product from wishlist
- [ ] Remove from wishlist (trash icon)
- [ ] Item count displays
- [ ] Added date displays

**Guest User Tests:**
- [ ] Guest can add to wishlist (localStorage)
- [ ] Guest wishlist persists on refresh
- [ ] Guest wishlist migrates on login (if implemented)

**Authenticated User Tests:**
- [ ] Authenticated user wishlist saved to Supabase
- [ ] Wishlist accessible across devices
- [ ] Wishlist persists after logout/login

---

## 🚚 Delivery & Notifications Testing

### 14. Delivery Zones

**Test Cases:**
- [ ] Zone dropdown populates with 18 zones
- [ ] Vavuniya shows LKR 100
- [ ] Colombo shows LKR 600
- [ ] Other Areas shows LKR 750
- [ ] Estimated days display
- [ ] Fee included in order total
- [ ] Zone saved with order
- [ ] Zone visible in admin order details
- [ ] Zone visible in customer order details

**Zone Pricing Verification:**
- [ ] Vavuniya — LKR 100 (1 day)
- [ ] Vavuniya Suburbs — LKR 200 (1 day)
- [ ] Kilinochchi — LKR 300 (2 days)
- [ ] Jaffna — LKR 350 (2 days)
- [ ] Trincomalee — LKR 400 (2 days)
- [ ] Batticaloa — LKR 450 (3 days)
- [ ] Kandy — LKR 500 (3 days)
- [ ] Colombo — LKR 600 (3 days)
- [ ] Galle — LKR 650 (3 days)
- [ ] Matara — LKR 700 (3 days)
- [ ] Other Areas — LKR 750 (4 days)

---

### 15. Delivery Date & Time

**Test Cases:**
- [ ] Date dropdown shows next 7 days
- [ ] Dates formatted correctly (Mon, Mar 16)
- [ ] No past dates available
- [ ] Time slot dropdown has 4 options
- [ ] Time slots: 9AM-12PM, 12PM-3PM, 3PM-6PM, 6PM-9PM
- [ ] Date saved with order
- [ ] Time slot saved with order
- [ ] Both visible in admin order details
- [ ] Both visible in customer order details

---

### 16. WhatsApp Notifications

**Test Cases:**
- [ ] Opt-in checkbox displays at checkout
- [ ] Checkbox unchecked by default
- [ ] Can check checkbox
- [ ] Opt-in saved with order
- [ ] Admin updates order status
- [ ] WhatsApp prompt appears
- [ ] "Open WhatsApp?" dialog shows
- [ ] Click OK → WhatsApp opens
- [ ] Message pre-filled correctly
- [ ] Customer phone formatted correctly (+94)
- [ ] Message includes order number
- [ ] Message includes status
- [ ] Message includes customer name
- [ ] Can send message manually

**Message Template Tests:**
- [ ] Pending message correct
- [ ] Confirmed message correct
- [ ] Processing message correct
- [ ] Shipped message correct
- [ ] Delivered message correct
- [ ] Cancelled message correct

**Opt-in Compliance Tests:**
- [ ] Customer didn't opt-in → no WhatsApp prompt
- [ ] Customer opted-in → WhatsApp prompt shows
- [ ] Admin can still manually send if needed

---

## 🔐 Security Testing

### 17. Authentication & Authorization

**Test Cases:**
- [ ] Cannot access /account without login
- [ ] Cannot access /account/orders without login
- [ ] Cannot access /account/wishlist without login
- [ ] Cannot access /account/profile without login
- [ ] Cannot view another customer's orders
- [ ] Cannot view another customer's wishlist
- [ ] API endpoints check authentication
- [ ] RLS policies enforce data isolation

---

### 18. Input Validation & XSS Prevention

**Test Cases:**
- [ ] XSS attempt in name field — saved as text, not executed
- [ ] XSS attempt in notes — saved as text
- [ ] SQL injection attempt in phone — rejected/sanitized
- [ ] Very long input (1000+ chars) — handled gracefully
- [ ] Special characters in names — saved correctly
- [ ] Unicode/emoji — saved correctly

---

## 📱 Responsive Design Testing

### 19. Mobile Responsiveness

**Test Devices:**
- [ ] iPhone (375px width)
- [ ] iPad (768px width)
- [ ] Desktop (1920px width)

**Test Pages:**
- [ ] Homepage responsive
- [ ] Product listing responsive
- [ ] Product detail responsive
- [ ] Cart drawer responsive
- [ ] Checkout responsive
- [ ] Admin panel responsive
- [ ] Account pages responsive

**Mobile-Specific Tests:**
- [ ] Touch targets min 44px
- [ ] No horizontal scroll
- [ ] Text readable without zoom
- [ ] Forms usable on mobile
- [ ] Images scale correctly

---

## ⚡ Performance Testing

### 20. Performance Benchmarks

| Metric | Target | Actual | Pass/Fail |
|--------|--------|--------|-----------|
| Homepage load | < 3s | _______ | ⬜ |
| Product listing load | < 3s | _______ | ⬜ |
| Product detail load | < 2s | _______ | ⬜ |
| Add to cart | < 1s | _______ | ⬜ |
| Checkout load | < 2s | _______ | ⬜ |
| Order placement | < 5s | _______ | ⬜ |
| Admin orders load | < 3s | _______ | ⬜ |
| Account dashboard load | < 2s | _______ | ⬜ |

**Lighthouse Scores:**
- [ ] Performance: > 90
- [ ] Accessibility: > 90
- [ ] Best Practices: > 90
- [ ] SEO: > 90

---

## 🐛 Bug Report Template

```markdown
**Bug Title:** [Brief description]

**Severity:** Critical / High / Medium / Low

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Behavior:**


**Actual Behavior:**


**Environment:**
- Device: 
- Browser: 
- OS: 
- URL: 

**Console Errors:**
```
[paste console errors here]
```

**Screenshots/Recordings:**


**Workaround (if any):**
```

---

## ✅ Final Sign-Off

### Test Summary
- **Total Tests:** _______ / 200+
- **Passed:** _______
- **Failed:** _______
- **Blocked:** _______
- **Pass Rate:** _______ %

### Critical Issues
| # | Issue | Severity | Status |
|---|-------|----------|--------|
| 1 | | Critical | Open / Fixed |
| 2 | | | |
| 3 | | | |

### Release Recommendation

**Testing completed:** _______________ (date)

**All critical tests passed:** YES / NO

**Ready for production:** YES / NO / WITH CONDITIONS

**Conditions/Notes:**
```
[List any blockers or required fixes]
```

**Tester:** _______________

**Date:** _______________

---

**Test Checklist Version:** 1.0  
**Last Updated:** 2026-03-15
