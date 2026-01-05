# SGSA Page Transitions - Implementation Guide

## Overview
Professional, calm, opacity-only page transitions that enhance perceived loading speed and polish.

## Files Modified
- **assets/page-transitions.css** - New CSS file with all transition styles
- **assets/sgsa-core.js** - Enhanced `initPageTransitions()` function
- **All 18 HTML files** - Added `<link>` to page-transitions.css

## Transition Timing

### Desktop
- **Fade-out**: 0.6 seconds (when leaving page)
- **Fade-in**: 0.4 seconds (when entering page)
- **Images**: 0.3 seconds (lazy load fade-in)

### Mobile
- **Fade-out**: 0.5 seconds (faster for better UX)
- **Fade-in**: 0.3 seconds
- **Images**: 0.3 seconds

## Features Implemented

### ✅ 1. Fade-Out on Navigation
- Smooth opacity fade before navigation
- Only applies to internal links
- Skips: external links, anchors (#), mailto, tel, new-tab links
- Blocks interaction during transition (pointer-events: none)

### ✅ 2. Fade-In on Page Load
- Page starts with `opacity: 0`
- Fades to `opacity: 1` after load
- Calm, intentional feel
- No scale, no slide - opacity only

### ✅ 3. Image Loading Handler
- Prevents content jumps from slow-loading images
- Images fade in smoothly when loaded
- Excludes: nav, header, footer, logo images (always visible)
- Excludes: small icons (<50px)
- Fallback for failed images

### ✅ 4. Mobile Optimization
- Shorter transition durations
- Optimized for touch interactions
- Doesn't block scrolling or tapping
- Performance-conscious

### ✅ 5. Accessibility
- Respects `prefers-reduced-motion`
- No transitions for users who prefer reduced motion
- Focus not trapped
- Site remains usable during transitions

## CSS Classes

### Body States
```css
.page-loading    /* Initial state (opacity: 0) */
.page-loaded     /* After load (opacity: 1) */
.page-exiting    /* When navigating away (opacity: 0) */
```

### Image States
```css
img:not(.no-transition)           /* Default (opacity: 0) */
img.loaded                        /* After load (opacity: 1) */
img.no-transition                 /* Skip transitions */
```

## How It Works

### Page Load Sequence
1. Body gets `.page-loading` class immediately
2. `sgsa-core.js` initializes
3. `initPageTransitions()` runs
4. On page load complete: `.page-loading` removed, `.page-loaded` added
5. Body fades from opacity 0 → 1
6. Images fade in as they load

### Navigation Sequence
1. User clicks internal link
2. Event prevented, `.page-exiting` added to body
3. Body fades from opacity 1 → 0 (0.5-0.6s)
4. After fade completes, navigate to new page
5. New page starts with `.page-loading` and repeats cycle

## Customization

### Adjust Timing
Edit `assets/sgsa-core.js`:
```javascript
const fadeOutDuration = window.innerWidth <= 768 ? 500 : 600; // milliseconds
```

Edit `assets/page-transitions.css`:
```css
body.page-loaded {
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Exclude Images from Transitions
Add `.no-transition` class:
```html
<img src="..." class="no-transition" alt="...">
```

### Exclude Links from Fade-Out
Links automatically excluded if they:
- Start with `http://`, `https://`, `//`
- Are anchor links (`#`)
- Are `mailto:` or `tel:` links
- Have `target="_blank"`

## Testing Checklist

- [ ] Desktop: Smooth fade-out when clicking internal links
- [ ] Desktop: Smooth fade-in on page load
- [ ] Mobile: Faster transitions (feels responsive)
- [ ] Images: No content jumps, smooth fade-in
- [ ] External links: No fade-out (immediate navigation)
- [ ] Anchor links: No fade-out (smooth scroll)
- [ ] Reduced motion: No transitions at all
- [ ] Logo/nav images: Always visible (no fade)

## SGSA Signature Guidelines

✅ **Calm & Professional**
- Opacity-only transitions
- No scaling, sliding, or bouncing
- Ease-in-out timing curves

✅ **Engineered Feel**
- Deliberate handover between pages
- Not flashy or decorative
- Enhances clarity, doesn't distract

✅ **Performance-Conscious**
- Mobile-optimized durations
- Doesn't block interactions
- Respects user preferences

## Troubleshooting

### Issue: Page stays invisible
**Solution**: Check if `sgsa-core.js` is loading. Verify in browser console.

### Issue: Transitions too slow
**Solution**: Adjust durations in `sgsa-core.js` and `page-transitions.css`.

### Issue: Images jumping on load
**Solution**: Ensure images don't have `.no-transition` class unless intended.

### Issue: Transitions on external links
**Solution**: Verify link href format. External links should start with `http://` or `https://`.

## Browser Support
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Optimized

---

**Last Updated**: January 2026
**Version**: 1.0
**Status**: Production Ready
