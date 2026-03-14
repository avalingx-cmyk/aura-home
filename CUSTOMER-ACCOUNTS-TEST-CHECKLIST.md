# Aura-Home Customer Accounts Test Checklist

**Version:** 1.0  
**Feature:** Customer Accounts & Authentication  
**Test Date:** _______________  
**Tester:** _______________  

---

## 📋 Pre-Test Setup

### Environment Checklist
- [ ] Vercel deployment successful (no build errors)
- [ ] Supabase project configured
- [ ] Supabase URL and keys in `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `NEXT_PUBLIC_APP_URL` set (e.g., `https://your-domain.vercel.app`)
- [ ] `NEXT_PUBLIC_ADMIN_EMAIL` configured (for admin checks)
- [ ] Email service configured in Supabase (SMTP or Resend)
- [ ] Test email address ready for magic link testing

### Test Accounts
- **Test Email:** _______________ (e.g., test@example.com)
- **Secondary Email:** _______________ (for multi-user testing)

### Browser/Device Setup
- Primary Device: _______________ (e.g., "MacBook Pro / Chrome 122")
- Secondary Device: _______________ (e.g., "iPhone 15 / Safari iOS 17")
- Email Client: _______________ (e.g., "Gmail")

---

## 🔴 CRITICAL - Authentication (Must Pass All)

### 1. Magic Link Login

**Test Steps:**
1. Navigate to `/auth/login`
2. Enter test email address
3. Click "Send Magic Link"
4. Check email inbox for magic link
5. Click magic link in email
6. Verify redirect to `/account`

**Expected Results:**
- [ ] Login form displays correctly
- [ ] Email validation works (rejects invalid emails)
- [ ] "Send Magic Link" button shows loading state
- [ ] Success message appears after sending
- [ ] Email received within 60 seconds
- [ ] Magic link works when clicked
- [ ] Redirects to `/account` automatically
- [ ] No console errors

**Test Cases:**
- [ ] Valid email format (test@example.com)
- [ ] Invalid email format (test@invalid) — should show error
- [ ] New email (not in system) — should create account
- [ ] Existing email — should log in

**Email Content Verification:**
- [ ] Email subject line clear (e.g., "Sign in to Aura Home")
- [ ] Magic link button/URL present
- [ ] Expiration time mentioned (if applicable)
- [ ] Sender name recognizable

---

### 2. Auth Callback Handling

**Test Steps:**
1. Click magic link from email
2. Observe `/auth/callback` page
3. Wait for redirect

**Expected Results:**
- [ ] Loading state displays immediately
- [ ] No Suspense boundary errors
- [ ] No "useSearchParams" errors in console
- [ ] Redirects to `/account` within 3 seconds
- [ ] Session persists after redirect

**Error Scenarios:**
- [ ] Expired magic link — shows error message
- [ ] Invalid/expired token — shows error message
- [ ] "Try Again" button redirects to `/auth/login`

---

### 3. Sign Out

**Test Steps:**
1. While logged in, go to `/account`
2. Click "Sign out" button
3. Verify redirect

**Expected Results:**
- [ ] Sign out button visible in account layout
- [ ] Clicking signs out immediately
- [ ] Redirects to home page (`/`)
- [ ] Session cleared (can't access `/account` directly)
- [ ] Can log in again with same email

---

### 4. Auth Protection

**Test Steps:**
1. Sign out (or use incognito mode)
2. Try to access `/account` directly
3. Try to access `/account/orders` directly
4. Try to access `/account/profile` directly

**Expected Results:**
- [ ] All protected routes redirect to `/auth/login`
- [ ] No flash of protected content before redirect
- [ ] No errors in console

---

## 🟡 Account Dashboard

### 5. Account Overview Page (`/account`)

**Test Steps:**
1. Log in with test email
2. Navigate to `/account`
3. Review dashboard content

**Expected Results:**
- [ ] Sidebar navigation visible (Overview, Orders, Profile)
- [ ] User email displayed in header
- [ ] "Sign out" button visible
- [ ] Order stats display (5 categories)
- [ ] Recent orders section shows last 5 orders
- [ ] Stats numbers accurate
- [ ] No loading spinner stuck

**Empty State (No Orders):**
- [ ] "No orders yet" message displays
- [ ] "Browse Products" button visible
- [ ] Button links to `/products`

**With Orders:**
- [ ] Recent orders show order number
- [ ] Order date formatted correctly
- [ ] Order total displays (LKR format)
- [ ] Status badges show correct colors
- [ ] Clicking order navigates to details

---

### 6. Account Sidebar Navigation

**Test Steps:**
1. On `/account`, click each sidebar item
2. Verify navigation

**Expected Results:**
- [ ] "Overview" → `/account`
- [ ] "Orders" → `/account/orders`
- [ ] "Profile" → `/account/profile`
- [ ] Active tab highlighted (wood background)
- [ ] Inactive tabs have hover state
- [ ] Account info card shows:
  - Email address
  - Member since date

---

## 🟡 Order History

### 7. Order History Page (`/account/orders`)

**Test Steps:**
1. Navigate to `/account/orders`
2. Review order list
3. Test status filters

**Expected Results:**
- [ ] Page title "Order History" displays
- [ ] Order list shows all customer's orders
- [ ] Orders sorted by date (newest first)
- [ ] Each order card shows:
  - Order number
  - Order date
  - Item count
  - Payment method (COD/KOKO)
  - Total amount
  - Status badge
  - "View details" icon

**Status Filters:**
- [ ] "All" filter shows all orders
- [ ] "Pending" filter shows only pending orders
- [ ] "Processing" filter shows only processing orders
- [ ] "Shipped" filter shows only shipped orders
- [ ] "Delivered" filter shows only delivered orders
- [ ] "Cancelled" filter shows only cancelled orders
- [ ] Filter counts accurate (e.g., "Pending (2)")
- [ ] Active filter highlighted

**Empty States:**
- [ ] "No orders found" when filter has no results
- [ ] "Start Shopping" button when no orders at all

---

### 8. Order Detail Page (`/account/orders/[id]`)

**Test Steps:**
1. Click "View details" on any order
2. Review order information

**Expected Results:**
- [ ] "Back to Orders" button works
- [ ] Order number displays in header
- [ ] Order date/time formatted correctly
- [ ] Order status badge visible with correct color
- [ ] Payment status badge visible
- [ ] Payment method shown (COD/KOKO)

**Order Items Section:**
- [ ] All items listed
- [ ] Product names correct
- [ ] Quantities correct
- [ ] Prices correct (LKR format)
- [ ] Item totals calculated correctly

**Order Summary:**
- [ ] Subtotal correct
- [ ] Shipping fee correct
- [ ] Total = Subtotal + Shipping
- [ ] All amounts in LKR format

**Shipping Information:**
- [ ] Customer name displayed
- [ ] Phone number displayed
- [ ] Full address displayed
- [ ] City displayed
- [ ] Delivery zone (if set)

**Delivery Information:**
- [ ] Delivery date (if set) — formatted correctly
- [ ] Time slot (if set) — displayed
- [ ] Section hidden if no delivery info

**Customer Notes:**
- [ ] Notes section visible if notes exist
- [ ] Section hidden if no notes

---

## 🟡 Profile Management

### 9. Profile Page (`/account/profile`)

**Test Steps:**
1. Navigate to `/account/profile`
2. Review form fields
3. Update profile information
4. Save changes

**Expected Results:**
- [ ] Page title "Profile Settings" displays
- [ ] Form sections visible:
  - Personal Information
  - Account Information
- [ ] First Name field editable
- [ ] Last Name field editable
- [ ] Phone field editable
- [ ] Email field read-only (disabled)
- [ ] "Member Since" date displays
- [ ] User ID displays (mono font)

**Form Validation:**
- [ ] Phone format hint visible (07X XXX XXXX)
- [ ] Can save with empty first/last name
- [ ] Can save with phone number
- [ ] Can save without phone number

**Save Functionality:**
- [ ] "Save Changes" button shows loading state
- [ ] Success message appears after save
- [ ] Profile updates persist (refresh page to verify)
- [ ] Error message if save fails
- [ ] Can update multiple times

**Success Message:**
- [ ] Green background
- [ ] Message: "Profile updated successfully!"
- [ ] Auto-dismisses or manually dismissible

**Error Message:**
- [ ] Red background
- [ ] Clear error text
- [ ] Can retry after fixing issue

---

## 📊 Order Filtering by Customer

### 10. Customer Order Isolation

**Test Steps:**
1. Log in as Customer A
2. View order history
3. Note order count
4. Log out
5. Log in as Customer B (different email)
6. View order history

**Expected Results:**
- [ ] Customer A sees only their own orders
- [ ] Customer B sees only their own orders
- [ ] Orders are NOT shared between accounts
- [ ] Order detail pages also filtered
- [ ] Cannot access another customer's order by ID

**Security Test:**
- [ ] Try to access order via URL with different customer's order ID
- [ ] Should show "Order not found" or redirect
- [ ] Orders truly filtered by `shipping_email`

---

## 🌐 Browser Compatibility

### 11. Cross-Browser Testing

Test on multiple browsers:

| Browser | Version | Login | Dashboard | Orders | Profile | Notes |
|---------|---------|-------|-----------|--------|---------|-------|
| Chrome | _______ | ⬜ | ⬜ | ⬜ | ⬜ | |
| Firefox | _______ | ⬜ | ⬜ | ⬜ | ⬜ | |
| Safari | _______ | ⬜ | ⬜ | ⬜ | ⬜ | |
| Edge | _______ | ⬜ | ⬜ | ⬜ | ⬜ | |

**Mobile Browsers:**

| Browser | Version | Login | Dashboard | Orders | Profile | Notes |
|---------|---------|-------|-----------|--------|---------|-------|
| Safari iOS | _______ | ⬜ | ⬜ | ⬜ | ⬜ | |
| Chrome Android | _______ | ⬜ | ⬜ | ⬜ | ⬜ | |

**Minimum Supported:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 📱 Responsive Design

### 12. Mobile Responsiveness

**Test Devices:**
- [ ] iPhone (375px width)
- [ ] iPad (768px width)
- [ ] Desktop (1920px width)

**Expected Results:**
- [ ] Login form responsive on mobile
- [ ] Account layout adapts (sidebar becomes collapsible or top nav)
- [ ] Order cards stack on mobile
- [ ] Order details readable on small screens
- [ ] Profile form fields stack on mobile
- [ ] Buttons accessible (min 44px touch target)
- [ ] No horizontal scroll
- [ ] Text readable without zooming

---

## 🔐 Security & Edge Cases

### 13. Security Testing

**Session Management:**
- [ ] Session persists across page refreshes
- [ ] Session expires after logout
- [ ] Multiple tabs share same session
- [ ] Session works across subdomains (if applicable)

**Email Privacy:**
- [ ] Cannot view another customer's email via API
- [ ] Profile only shows own data
- [ ] Orders API filters by authenticated user

**Input Validation:**
- [ ] XSS attempt in profile fields (e.g., `<script>alert('xss')</script>`) — should save as text, not execute
- [ ] SQL injection attempt in phone field — should be rejected/sanitized
- [ ] Long text in name fields (500+ chars) — should handle gracefully

**Rate Limiting:**
- [ ] Cannot spam magic link requests (if rate limited)
- [ ] Error message if rate limited

---

### 14. Error Scenarios

**Network Issues:**
- [ ] Slow network — login still works (eventually)
- [ ] Network drop during save — shows error, can retry
- [ ] Offline — shows appropriate error message

**API Errors:**
- [ ] Supabase down — shows user-friendly error
- [ ] Invalid API response — handled gracefully
- [ ] 404 on order detail — shows "Order not found"

**Edge Cases:**
- [ ] Very long email address
- [ ] Special characters in name (unicode, emoji)
- [ ] Phone number with/without spaces
- [ ] Order with 0 items (if possible)
- [ ] Order with very large total (LKR 1,000,000+)

---

## 📈 Performance

### 15. Performance Benchmarks

| Metric | Target | Actual | Pass/Fail |
|--------|--------|--------|-----------|
| Login page load | < 2s | _______ | ⬜ |
| Magic link email delivery | < 60s | _______ | ⬜ |
| Auth callback redirect | < 3s | _______ | ⬜ |
| Account dashboard load | < 2s | _______ | ⬜ |
| Order history load | < 2s | _______ | ⬜ |
| Profile save | < 2s | _______ | ⬜ |
| Memory usage (idle) | < 100MB | _______ | ⬜ |

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
- Network: 

**Console Errors:**
```
[paste console errors here]
```

**Screenshots/Recordings:**


**Workaround (if any):**
```

---

## ✅ Test Results Summary

### Authentication
| Feature | Status | Tested On | Notes |
|---------|--------|-----------|-------|
| Magic Link Login | ⬜ | | |
| Auth Callback | ⬜ | | |
| Sign Out | ⬜ | | |
| Auth Protection | ⬜ | | |

### Account Dashboard
| Feature | Status | Tested On | Notes |
|---------|--------|-----------|-------|
| Overview Page | ⬜ | | |
| Sidebar Navigation | ⬜ | | |
| Order Stats | ⬜ | | |
| Recent Orders | ⬜ | | |

### Order History
| Feature | Status | Tested On | Notes |
|---------|--------|-----------|-------|
| Order List | ⬜ | | |
| Status Filters | ⬜ | | |
| Order Details | ⬜ | | |
| Customer Isolation | ⬜ | | |

### Profile Management
| Feature | Status | Tested On | Notes |
|---------|--------|-----------|-------|
| Profile Form | ⬜ | | |
| Save Changes | ⬜ | | |
| Form Validation | ⬜ | | |

### Security & Performance
| Feature | Status | Tested On | Notes |
|---------|--------|-----------|-------|
| Session Management | ⬜ | | |
| Input Validation | ⬜ | | |
| Error Handling | ⬜ | | |
| Performance | ⬜ | | |
| Browser Compatibility | ⬜ | | |
| Mobile Responsiveness | ⬜ | | |

---

## 🎯 Final Assessment

### Test Summary
- **Total Tests Run:** _______ / 60
- **Tests Passed:** _______
- **Tests Failed:** _______
- **Tests Skipped:** _______
- **Pass Rate:** _______ %

### Critical Issues Found
| # | Issue | Severity | Status |
|---|-------|----------|--------|
| 1 | | Critical / High / Med / Low | Open / Fixed |
| 2 | | | |
| 3 | | | |

---

## 🎯 Sign-Off

### Tester Checklist
- [ ] All authentication flows tested
- [ ] All account pages tested
- [ ] Order filtering verified (customer isolation)
- [ ] Profile CRUD tested
- [ ] Error scenarios tested
- [ ] Browser compatibility tested
- [ ] Mobile responsiveness tested
- [ ] Security tests passed
- [ ] Performance benchmarks met

### Release Recommendation

**Test completed:** _______________ (date)

**All critical features working:** YES / NO

**Ready for production:** YES / NO / WITH CONDITIONS

**Conditions/Notes:**
```
[List any blockers or required fixes before production]
```

**Tester Signature:** _______________

**Date:** _______________

---

**Test Checklist Version:** 1.0  
**Last Updated:** 2026-03-14
