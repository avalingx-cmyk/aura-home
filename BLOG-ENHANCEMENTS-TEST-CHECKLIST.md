# Blog Enhancements — Test Checklist

**Version:** 1.0  
**Feature:** Blog Enhancements (Search, RSS, Reading Time, TOC, Related Posts)  
**Test Date:** _______________  
**Tester:** _______________  
**Status:** Ready for QA Testing

---

## 📋 Pre-Test Setup

### Environment Checklist
- [ ] Database migration `007_add_blog_and_comments.sql` applied
- [ ] At least 5 blog posts created (for search/related posts testing)
- [ ] Posts have categories assigned
- [ ] Posts have tags assigned
- [ ] Posts have content with H2/H3 headings (for TOC testing)
- [ ] Posts have varying lengths (for reading time testing)
- [ ] Packages installed (`next-seo`, `next-sitemap`)
- [ ] Build succeeds (`npm run build`)
- [ ] Vercel deployment successful

---

## 🔍 1. Search Functionality

### Search Page Access
- [ ] Navigate to `/blog/search`
- [ ] Page loads without errors
- [ ] Search input visible
- [ ] Search button visible
- [ ] Placeholder text: "Search articles..."
- [ ] Header: "Search Blog"

### Search Execution
- [ ] Enter search query (e.g., "furniture")
- [ ] Press Enter or click search button
- [ ] URL updates to `/blog/search?q=furniture`
- [ ] Results count displays (e.g., "Found 3 results")
- [ ] Results display in grid

### Search Results Display
- [ ] Post cards display correctly
- [ ] Cover images load (if set)
- [ ] Post titles visible
- [ ] Post excerpts visible
- [ ] Categories badges display
- [ ] Published date visible
- [ ] View count visible
- [ ] "Read More" link visible
- [ ] Click post → Navigates to `/blog/[slug]`

### Search Features
- [ ] Search is case-insensitive
- [ ] Search works with partial words
- [ ] Search works with multiple words
- [ ] Search in title works
- [ ] Search in excerpt works
- [ ] Search in content works

### Empty State
- [ ] Search for non-existent term
- [ ] Shows "No results found" message
- [ ] Shows "Browse All Posts" button
- [ ] Click button → Navigates to `/blog`

### Edge Cases
- [ ] Empty search query → Shows all posts or prompt
- [ ] Very long query (100+ chars) → Handled gracefully
- [ ] Special characters in query → Sanitized
- [ ] XSS attempt in query → Not executed

### Performance
- [ ] Search results load in < 2 seconds
- [ ] No console errors
- [ ] No network errors

---

## 📡 2. RSS Feed

### Feed Access
- [ ] Navigate to `/api/blog/rss`
- [ ] XML displays correctly
- [ ] No errors in browser
- [ ] Content-Type is `application/xml`

### XML Structure
- [ ] Valid XML declaration: `<?xml version="1.0" encoding="UTF-8"?>`
- [ ] RSS version: 2.0
- [ ] Channel element present
- [ ] Channel title: "Aura Home Blog"
- [ ] Channel link present
- [ ] Channel description present
- [ ] Language set: "en-us"
- [ ] Last build date present
- [ ] Atom self-link present

### Feed Items
- [ ] Contains latest 20 posts (or less if fewer exist)
- [ ] Posts sorted by date (newest first)
- [ ] Each item has:
  - [ ] Title (matches post title)
  - [ ] Link (points to `/blog/[slug]`)
  - [ ] GUID (matches link)
  - [ ] Description (excerpt or title)
  - [ ] Pub date (formatted correctly)
  - [ ] Author (if available)

### RSS Reader Integration
- [ ] Copy RSS URL
- [ ] Add to Feedly (or other RSS reader)
- [ ] Feed subscribes successfully
- [ ] Posts appear in reader
- [ ] Click post → Opens correct URL
- [ ] New posts appear after publishing

### Caching
- [ ] Check response headers
- [ ] Cache-Control present
- [ ] Max-age: 3600 (1 hour)

---

## ⏱️ 3. Reading Time Estimate

### Display Location
- [ ] Navigate to any blog post
- [ ] Reading time displays near author/date
- [ ] Format: "X min read"

### Calculation Accuracy
- [ ] Short post (~200 words) → Shows "1 min read"
- [ ] Medium post (~600 words) → Shows "3 min read"
- [ ] Long post (~1000 words) → Shows "5 min read"
- [ ] Very long post (~2000 words) → Shows "10 min read"

### Edge Cases
- [ ] Very short post (<100 words) → Shows "1 min read" (minimum)
- [ ] Post with lots of HTML → Strips tags correctly
- [ ] Post with code blocks → Counts words correctly
- [ ] Post with images → Doesn't count image alt text

### UI/UX
- [ ] Reading time visible on all devices
- [ ] Reading time doesn't break layout
- [ ] Reading time updates if content changes

---

## 📑 4. Table of Contents

### TOC Generation
- [ ] Navigate to post with H2/H3 headings
- [ ] TOC displays (sidebar or top of content)
- [ ] H2 headings included
- [ ] H3 headings included
- [ ] H1 headings excluded (if any)
- [ ] Hierarchical structure correct (H3 indented under H2)

### TOC Items
- [ ] Each TOC item shows heading text
- [ ] Text matches heading exactly
- [ ] No HTML tags in TOC text
- [ ] Long headings truncate or wrap correctly

### Navigation
- [ ] Click TOC item → Scrolls to section
- [ ] Scroll is smooth (not instant jump)
- [ ] URL updates with hash (e.g., `#heading-text`)
- [ ] Direct link with hash works (e.g., `/blog/post#heading`)
- [ ] Heading IDs are unique
- [ ] Heading IDs are URL-safe (no special chars)

### Edge Cases
- [ ] Post with no headings → TOC hidden or shows "On this page"
- [ ] Post with 1 heading → TOC shows single item
- [ ] Post with 20+ headings → TOC scrollable or collapsible
- [ ] Duplicate heading text → IDs are unique (e.g., `heading`, `heading-1`)

### Responsive
- [ ] Desktop → TOC visible in sidebar
- [ ] Tablet → TOC adapts layout
- [ ] Mobile → TOC collapsible or at top

---

## 🔗 5. Related Posts

### Display Location
- [ ] Navigate to blog post detail
- [ ] Scroll to bottom of post
- [ ] "Related Posts" section visible
- [ ] Section has heading

### Related Posts Logic
- [ ] Shows up to 3 related posts
- [ ] Related by shared categories
- [ ] Related by shared tags
- [ ] Current post excluded from results
- [ ] Posts with more matches appear first

### Related Posts Display
- [ ] Post cards display correctly
- [ ] Cover images load (if set)
- [ ] Post titles visible
- [ ] Post excerpts or dates visible
- [ ] Click post → Navigates to `/blog/[slug]`

### Edge Cases
- [ ] Post with no categories/tags → No related posts or shows recent
- [ ] Post with unique categories/tags → Shows recent posts instead
- [ ] Only 1-2 posts in database → Shows available posts
- [ ] All posts already shown → Shows "No related posts"

### UI/UX
- [ ] Section doesn't break layout
- [ ] Cards responsive on mobile
- [ ] Click anywhere on card → Navigates to post

---

## 📧 6. Newsletter Signup (If Implemented)

### Form Display
- [ ] Newsletter form visible (sidebar or bottom)
- [ ] Heading: "Subscribe to our newsletter"
- [ ] Email input field
- [ ] Subscribe button
- [ ] Privacy notice (if applicable)

### Form Validation
- [ ] Empty email → Shows error
- [ ] Invalid email → Shows error
- [ ] Valid email → Form submits

### Subscription Flow
- [ ] Enter valid email
- [ ] Click Subscribe
- [ ] Success message displays
- [ ] Email added to database
- [ ] Confirmation email sent (if implemented)

### Edge Cases
- [ ] Duplicate email → Shows "Already subscribed" or accepts
- [ ] Very long email → Handled gracefully
- [ ] XSS attempt in email → Sanitized

---

## 🌐 Cross-Browser Testing

### Desktop Browsers

| Browser | Version | Search | RSS | Reading Time | TOC | Related | Notes |
|---------|---------|--------|-----|--------------|-----|---------|-------|
| Chrome | _______ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | |
| Firefox | _______ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | |
| Safari | _______ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | |
| Edge | _______ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | |

### Mobile Browsers

| Browser | Version | Search | RSS | Reading Time | TOC | Related | Notes |
|---------|---------|--------|-----|--------------|-----|---------|-------|
| Safari iOS | _______ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | |
| Chrome Android | _______ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | |

---

## 📱 Responsive Testing

### Search Page
- [ ] Desktop (1920px) — Grid 3 columns
- [ ] Tablet (768px) — Grid 2 columns
- [ ] Mobile (375px) — Grid 1 column
- [ ] Search bar responsive
- [ ] No horizontal scroll

### Post Detail (TOC & Related)
- [ ] Desktop — TOC in sidebar
- [ ] Tablet — TOC adapts
- [ ] Mobile — TOC collapsible or top
- [ ] Related posts responsive (1-3 columns)

---

## ⚡ Performance Testing

| Metric | Target | Actual | Pass/Fail |
|--------|--------|--------|-----------|
| Search results load | < 2s | _______ | ⬜ |
| RSS feed load | < 1s | _______ | ⬜ |
| TOC generation | < 100ms | _______ | ⬜ |
| Related posts load | < 500ms | _______ | ⬜ |

**Lighthouse Scores:**
- [ ] Performance: > 90
- [ ] Accessibility: > 90
- [ ] Best Practices: > 90
- [ ] SEO: > 95

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

### Search Functionality
| Feature | Status | Tested On | Notes |
|---------|--------|-----------|-------|
| Search Page | ⬜ | | |
| Search Execution | ⬜ | | |
| Results Display | ⬜ | | |
| Empty State | ⬜ | | |
| Edge Cases | ⬜ | | |

### RSS Feed
| Feature | Status | Tested On | Notes |
|---------|--------|-----------|-------|
| XML Structure | ⬜ | | |
| Feed Items | ⬜ | | |
| RSS Reader | ⬜ | | |
| Caching | ⬜ | | |

### Reading Time
| Feature | Status | Tested On | Notes |
|---------|--------|-----------|-------|
| Display | ⬜ | | |
| Calculation | ⬜ | | |
| Edge Cases | ⬜ | | |

### Table of Contents
| Feature | Status | Tested On | Notes |
|---------|--------|-----------|-------|
| Generation | ⬜ | | |
| Navigation | ⬜ | | |
| Responsive | ⬜ | | |

### Related Posts
| Feature | Status | Tested On | Notes |
|---------|--------|-----------|-------|
| Display | ⬜ | | |
| Logic | ⬜ | | |
| Edge Cases | ⬜ | | |

### Newsletter (If Implemented)
| Feature | Status | Tested On | Notes |
|---------|--------|-----------|-------|
| Form Display | ⬜ | | |
| Validation | ⬜ | | |
| Subscription | ⬜ | | |

---

## 🎯 Final Assessment

### Test Summary
- **Total Tests Run:** _______ / 100+
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
- [ ] Search functionality tested
- [ ] RSS feed validated
- [ ] Reading time accurate
- [ ] Table of contents works
- [ ] Related posts display correctly
- [ ] Cross-browser tested
- [ ] Responsive tested
- [ ] Performance benchmarks met

### Release Recommendation

**Test completed:** _______________ (date)

**All critical tests passed:** YES / NO

**Ready for production:** YES / NO / WITH CONDITIONS

**Conditions/Notes:**
```
[List any blockers or required fixes]
```

**Tester Signature:** _______________

**Date:** _______________

---

**Test Checklist Version:** 1.0  
**Last Updated:** 2026-03-15  
**Feature:** Blog Enhancements  
**PR:** `feat/blog-enhancements`
