# Aura Home Blog — Complete Test Checklist

**Version:** 1.0  
**Feature:** Blog + SEO  
**Test Date:** _______________  
**Tester:** _______________  
**Status:** Ready for QA Testing

---

## 📋 Pre-Test Setup

### Environment Checklist
- [ ] Database migration `007_add_blog_and_comments.sql` applied
- [ ] Supabase tables created (posts, comments, categories, tags)
- [ ] Sample data inserted (5 categories, 7 tags)
- [ ] Packages installed (`@tiptap/*`, `next-seo`, `next-sitemap`)
- [ ] Environment variables configured:
  - `NEXT_PUBLIC_APP_URL` (for sitemap)
- [ ] Build succeeds (`npm run build`)
- [ ] Vercel deployment successful

### Test Content
- [ ] At least 3 test posts created (1 draft, 2 published)
- [ ] Posts have cover images
- [ ] Posts have categories and tags assigned
- [ ] Posts have SEO meta fields filled

---

## 🔴 CRITICAL — Admin Blog Management

### 1. Admin Blog List Page (`/admin/blog`)

**Navigation:**
- [ ] Navigate to `/admin/blog`
- [ ] Page loads without errors
- [ ] "Blog Posts" heading visible
- [ ] "New Post" button visible

**Post List:**
- [ ] Posts display in table
- [ ] Post title visible
- [ ] Post slug visible
- [ ] Status badge visible (published/draft/archived)
- [ ] Author email visible
- [ ] Published date visible
- [ ] View count visible
- [ ] Action buttons visible (View, Edit, Delete)

**Filter:**
- [ ] "All" filter shows all posts
- [ ] "Published" filter shows only published posts
- [ ] "Draft" filter shows only draft posts
- [ ] "Archived" filter shows only archived posts
- [ ] Filter counts update correctly
- [ ] Active filter highlighted

**Actions:**
- [ ] Click "View" → Opens post in new tab
- [ ] Click "Edit" → Navigates to edit page
- [ ] Click "Delete" → Confirmation dialog appears
- [ ] Confirm delete → Post deleted
- [ ] List refreshes after delete

**Empty State:**
- [ ] No posts → Shows "No posts yet" message
- [ ] "Create Post" button visible
- [ ] Click "Create Post" → Navigates to new post form

**Loading State:**
- [ ] Shows loading spinner while fetching
- [ ] "Loading posts..." message visible

---

### 2. Create New Post (`/admin/blog/new`)

**Form Fields:**
- [ ] Title field visible and editable
- [ ] Slug field auto-populates from title
- [ ] Slug field manually editable
- [ ] Excerpt field visible (textarea)
- [ ] Cover image URL field visible
- [ ] Content editor (Tiptap) loads
- [ ] SEO section visible
- [ ] Meta title field visible
- [ ] Meta description field visible
- [ ] Meta keywords field visible
- [ ] Status radio buttons (Draft/Published)

**Rich Text Editor (Tiptap):**
- [ ] Toolbar visible with all buttons
- [ ] Bold button works (B)
- [ ] Italic button works (I)
- [ ] Strikethrough button works (S)
- [ ] H2 heading button works
- [ ] H3 heading button works
- [ ] Bullet list button works
- [ ] Numbered list button works
- [ ] Quote button works
- [ ] Code block button works
- [ ] Image button works (prompts for URL)
- [ ] Link button works (prompts for URL)
- [ ] Undo button works
- [ ] Redo button works
- [ ] Editor placeholder visible
- [ ] Content persists while typing

**Validation:**
- [ ] Submit without title → Shows error
- [ ] Submit without slug → Shows error
- [ ] Submit without content → Shows error
- [ ] All required fields validated

**Save Functionality:**
- [ ] Select "Draft" status
- [ ] Click "Save Post"
- [ ] Saving state shows (spinner + "Saving...")
- [ ] Redirects to `/admin/blog` after save
- [ ] Post appears in list

**Publish Functionality:**
- [ ] Select "Published" status
- [ ] Click "Save Post"
- [ ] Redirects to `/blog/[slug]` after save
- [ ] Post publicly accessible

**Cancel:**
- [ ] Click "Cancel" → Navigates back

---

### 3. Edit Post (Future Enhancement)

*Note: Edit page not yet implemented in current PR*

- [ ] Navigate to edit from admin list
- [ ] Form pre-populates with existing data
- [ ] Changes save correctly
- [ ] Status changes work (draft ↔ published)

---

## 🟡 Public Blog Pages

### 3. Blog Listing Page (`/blog`)

**Header:**
- [ ] "Aura Home Blog" heading visible
- [ ] Subtitle/description visible
- [ ] Header styling correct

**Post Grid:**
- [ ] Posts display in grid (3 columns on desktop)
- [ ] Post cards render correctly
- [ ] Cover images load (if set)
- [ ] Images have correct aspect ratio (16:9)
- [ ] Images scale on hover
- [ ] Categories display as badges
- [ ] Post title visible (2 line max)
- [ ] Excerpt visible (3 line max)
- [ ] Published date visible
- [ ] View count visible
- [ ] "Read More" link visible

**Pagination:**
- [ ] Pagination visible (if >10 posts)
- [ ] "Previous" button works
- [ ] "Next" button works
- [ ] Page numbers display correctly
- [ ] "Previous" disabled on page 1
- [ ] "Next" disabled on last page
- [ ] Click page number → Navigates to page

**Empty State:**
- [ ] No posts → Shows "No posts yet" message
- [ ] Message centered and styled

**Responsive:**
- [ ] Desktop (1920px) — 3 columns
- [ ] Tablet (768px) — 2 columns
- [ ] Mobile (375px) — 1 column
- [ ] Images scale correctly
- [ ] Text readable on all sizes

**Performance:**
- [ ] Page loads in < 3 seconds
- [ ] Images lazy load (if implemented)
- [ ] No console errors

---

### 4. Post Detail Page (`/blog/[slug]`)

**Header:**
- [ ] Categories display at top
- [ ] Post title visible (H1)
- [ ] Author email visible
- [ ] Published date visible
- [ ] View count visible
- [ ] Header background correct

**Cover Image:**
- [ ] Cover image displays (if set)
- [ ] Image full width
- [ ] Image rounded corners
- [ ] Image shadow visible
- [ ] No cover image → No broken image icon

**Content:**
- [ ] Excerpt displays (if set)
- [ ] Full content renders correctly
- [ ] HTML formatting preserved (bold, italic, etc.)
- [ ] Images in content load
- [ ] Links in content work
- [ ] Lists render correctly
- [ ] Headings render correctly
- [ ] Blockquotes render correctly
- [ ] Code blocks render correctly
- [ ] Content readable (prose styling)

**Tags:**
- [ ] Tags section visible
- [ ] Tag icon visible
- [ ] All tags display
- [ ] Tags styled as badges

**Share:**
- [ ] Share section visible
- [ ] Share icon visible
- [ ] Twitter button visible
- [ ] LinkedIn button visible
- [ ] Facebook button visible
- [ ] Buttons clickable (can add functionality later)

**Comments Section:**
- [ ] Comments heading visible
- [ ] Comment count displays
- [ ] Comment form visible
- [ ] Textarea for comment
- [ ] "Post Comment" button visible
- [ ] Submit comment → Success message
- [ ] Comment requires approval (pending status)
- [ ] Comments list displays approved comments
- [ ] Comment author name/email visible
- [ ] Comment date visible
- [ ] Comment content visible
- [ ] No comments → Shows "No comments yet" message

**Responsive:**
- [ ] Desktop — Full width content
- [ ] Tablet — Content scaled
- [ ] Mobile — Single column
- [ ] Images responsive
- [ ] Text readable

---

## 🔐 SEO Testing

### 5. Meta Tags

**Homepage:**
- [ ] Title: "Aura Home - Quality Furniture in Sri Lanka"
- [ ] Description present
- [ ] Canonical URL set
- [ ] Open Graph tags present
- [ ] Twitter Card tags present

**Blog Listing:**
- [ ] Title: "Blog | Aura Home"
- [ ] Description present
- [ ] Canonical URL set

**Post Detail:**
- [ ] Title: "[Post Title] | Aura Home" (or meta_title if set)
- [ ] Description: meta_description or excerpt
- [ ] Keywords: meta_keywords if set
- [ ] Open Graph title
- [ ] Open Graph description
- [ ] Open Graph image (cover_image)
- [ ] Open Graph type: "article"
- [ ] Open Graph published time
- [ ] Twitter Card type: "summary_large_image"
- [ ] JSON-LD structured data present

**SEO Validation Tools:**
- [ ] Test with https://www.seositecheckup.com/
- [ ] Test with https://search.google.com/test/rich-results
- [ ] All meta tags detected
- [ ] No SEO errors

---

### 6. Sitemap & Robots.txt

**Sitemap:**
- [ ] Build generates sitemap (`npm run build`)
- [ ] `/sitemap.xml` accessible
- [ ] Sitemap includes blog posts
- [ ] Sitemap includes public pages
- [ ] Sitemap excludes admin pages
- [ ] Sitemap excludes auth pages
- [ ] Sitemap valid XML format
- [ ] Submit sitemap to Google Search Console

**Robots.txt:**
- [ ] `/robots.txt` accessible
- [ ] Allows: `/`
- [ ] Disallows: `/admin/`, `/auth/`
- [ ] References sitemap.xml

---

## 💬 Comment System

### 7. Comment Submission

**Form:**
- [ ] Textarea visible
- [ ] Placeholder text visible
- [ ] "Post Comment" button visible
- [ ] Form requires content (validation)
- [ ] Empty submit → Shows error

**Submission:**
- [ ] Write comment
- [ ] Click "Post Comment"
- [ ] Success message: "Comment submitted for approval!"
- [ ] Comment cleared from form
- [ ] Comment not immediately visible (pending approval)

**Moderation (Admin - Future):**
- [ ] Admin can view pending comments
- [ ] Admin can approve comments
- [ ] Admin can reject/spam comments
- [ ] Approved comments appear on post

**Display:**
- [ ] Approved comments visible on post
- [ ] Comment author name/email visible
- [ ] Comment date formatted correctly
- [ ] Comment content visible
- [ ] Nested replies display correctly (if implemented)

---

## 📊 Analytics & Tracking

### 8. View Counter

**Functionality:**
- [ ] View count increments on post view
- [ ] View count visible on post detail
- [ ] View count visible on blog listing (if implemented)
- [ ] Views don't increment on refresh (if caching implemented)
- [ ] Views persist in database

---

## 🔒 Security Testing

### 9. Input Validation & XSS Prevention

**Admin Form:**
- [ ] XSS attempt in title — Saved as text, not executed
- [ ] XSS attempt in content — Sanitized by Tiptap
- [ ] XSS attempt in excerpt — Saved as text
- [ ] XSS attempt in meta fields — Saved as text
- [ ] SQL injection in fields — Rejected/sanitized

**Comment Form:**
- [ ] XSS attempt in comment — Saved as text, not executed
- [ ] SQL injection attempt — Rejected/sanitized
- [ ] Very long comment (1000+ chars) — Handled gracefully

**API Endpoints:**
- [ ] Unauthorized access to admin API — Returns 401
- [ ] Invalid post slug — Returns 404
- [ ] Invalid comment data — Returns 400

---

## 📱 Responsive Design

### 9. Mobile Responsiveness

**Test Devices:**
- [ ] iPhone (375px width)
- [ ] iPad (768px width)
- [ ] Desktop (1920px width)

**Test Pages:**
- [ ] `/blog` — Listing responsive
- [ ] `/blog/[slug]` — Post detail responsive
- [ ] `/admin/blog` — Admin list responsive
- [ ] `/admin/blog/new` — Editor responsive

**Mobile-Specific:**
- [ ] Touch targets min 44px
- [ ] No horizontal scroll
- [ ] Text readable without zoom
- [ ] Images scale correctly
- [ ] Editor toolbar accessible on mobile
- [ ] Forms usable on mobile

---

## ⚡ Performance Testing

### 10. Performance Benchmarks

| Metric | Target | Actual | Pass/Fail |
|--------|--------|--------|-----------|
| Blog listing load | < 3s | _______ | ⬜ |
| Post detail load | < 2s | _______ | ⬜ |
| Admin list load | < 3s | _______ | ⬜ |
| Post create save | < 5s | _______ | ⬜ |
| Comment submit | < 3s | _______ | ⬜ |
| Image load time | < 2s | _______ | ⬜ |

**Lighthouse Scores:**
- [ ] Performance: > 90
- [ ] Accessibility: > 90
- [ ] Best Practices: > 90
- [ ] SEO: > 95

---

## 🌐 Browser Compatibility

### 11. Cross-Browser Testing

**Desktop:**

| Browser | Version | Listing | Post Detail | Admin | Editor | Notes |
|---------|---------|---------|-------------|-------|--------|-------|
| Chrome | _______ | ⬜ | ⬜ | ⬜ | ⬜ | |
| Firefox | _______ | ⬜ | ⬜ | ⬜ | ⬜ | |
| Safari | _______ | ⬜ | ⬜ | ⬜ | ⬜ | |
| Edge | _______ | ⬜ | ⬜ | ⬜ | ⬜ | |

**Mobile:**

| Browser | Version | Listing | Post Detail | Admin | Editor | Notes |
|---------|---------|---------|-------------|-------|--------|-------|
| Safari iOS | _______ | ⬜ | ⬜ | ⬜ | ⬜ | |
| Chrome Android | _______ | ⬜ | ⬜ | ⬜ | ⬜ | |

**Minimum Supported:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

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

## ✅ Test Results Summary

### Admin Features
| Feature | Status | Tested On | Notes |
|---------|--------|-----------|-------|
| Post List | ⬜ | | |
| Filters | ⬜ | | |
| Create Post | ⬜ | | |
| Rich Text Editor | ⬜ | | |
| SEO Fields | ⬜ | | |
| Delete Post | ⬜ | | |

### Public Features
| Feature | Status | Tested On | Notes |
|---------|--------|-----------|-------|
| Blog Listing | ⬜ | | |
| Pagination | ⬜ | | |
| Post Detail | ⬜ | | |
| Content Rendering | ⬜ | | |
| Comments | ⬜ | | |
| Social Share | ⬜ | | |

### SEO
| Feature | Status | Tested On | Notes |
|---------|--------|-----------|-------|
| Meta Tags | ⬜ | | |
| Open Graph | ⬜ | | |
| Twitter Cards | ⬜ | | |
| Sitemap | ⬜ | | |
| Robots.txt | ⬜ | | |

### Security & Performance
| Feature | Status | Tested On | Notes |
|---------|--------|-----------|-------|
| Input Validation | ⬜ | | |
| XSS Prevention | ⬜ | | |
| View Counter | ⬜ | | |
| Performance | ⬜ | | |
| Browser Compatibility | ⬜ | | |
| Mobile Responsiveness | ⬜ | | |

---

## 🎯 Final Assessment

### Test Summary
- **Total Tests Run:** _______ / 150+
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
- [ ] All admin features tested
- [ ] All public pages tested
- [ ] SEO validation complete
- [ ] Sitemap generated and valid
- [ ] Comments system tested
- [ ] Security tests passed
- [ ] Performance benchmarks met
- [ ] Browser compatibility tested
- [ ] Mobile responsiveness tested

### Release Recommendation

**Test completed:** _______________ (date)

**All critical tests passed:** YES / NO

**Ready for production:** YES / NO / WITH CONDITIONS

**Conditions/Notes:**
```
[List any blockers or required fixes before production]
```

**Tester Signature:** _______________

**Date:** _______________

---

**Test Checklist Version:** 1.0  
**Last Updated:** 2026-03-15  
**Feature:** Blog + SEO  
**PR:** `feat/blog-seo`
