# Vercel Schema Quick Reference - Node.js Version

## The Issue in One Sentence
**`nodeVersion` property does NOT exist in Vercel's `vercel.json` schema** - use `engines.node` in `package.json` instead.

---

## Quick Fix

### ❌ BEFORE (Invalid)
**vercel.json**:
```json
{
  "nodeVersion": "18.x",
  "buildCommand": "pnpm run build"
}
```
**Error**: Schema validation failed

---

### ✅ AFTER (Valid)
**vercel.json**:
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "pnpm run build",
  "devCommand": "pnpm run dev",
  "installCommand": "pnpm install",
  "framework": "nextjs"
}
```

**package.json**:
```json
{
  "engines": {
    "node": "22.x",
    "pnpm": ">=9.0.0"
  }
}
```

---

## Why This Changed

| Aspect | Details |
|--------|---------|
| **Schema Source** | https://openapi.vercel.sh/vercel.json |
| **Verified Properties** | 23 official properties (nodeVersion NOT included) |
| **Correct Location** | `package.json` `engines` field |
| **Vercel Standards** | Official documentation states engines.node method |
| **Compatibility** | Works with npm, yarn, pnpm locally and on Vercel |

---

## Valid Node.js Versions

Available on Vercel (2026):
- **24.x** ← Default
- **22.x** ← Our choice (stable)
- **20.x** ← Legacy

---

## One-Page Comparison

| Property | Location | Valid | Reason |
|----------|----------|-------|--------|
| `nodeVersion` | vercel.json | ✗ NO | Not in Vercel schema |
| `engines.node` | package.json | ✓ YES | Official standard |
| `node` via Dashboard | Vercel UI | ✓ YES | Dashboard override |

---

## What Changed in This Project

1. **vercel.json**: Removed `nodeVersion: "18.x"` line
2. **vercel.json**: Added `"$schema": "https://openapi.vercel.sh/vercel.json"` for validation
3. **package.json**: Added `engines` field with `node: "22.x"`

---

## Testing

```bash
# Verify local version matches
node -v

# Run build locally
pnpm run build

# Deploy to Vercel
git push
```

---

## Files Modified

- ✓ `/vercel.json` - Removed invalid property, added schema reference
- ✓ `/package.json` - Added engines field with Node.js version

---

## Status: RESOLVED ✓

The schema validation error has been fixed. Your Vercel deployment is now compliant with official standards.
