# Node.js Version Configuration - Vercel Schema Resolution

## Executive Summary

The `vercel.json` file validation error occurred because **`nodeVersion` is NOT a valid property** in the Vercel schema. Vercel officially does NOT support specifying Node.js version directly in `vercel.json`. Instead, the correct approach is to define the Node.js version in your `package.json` using the `engines.node` field.

---

## Problem Identified

### Invalid Configuration (BEFORE)
```json
{
  "nodeVersion": "18.x",
  "buildCommand": "pnpm run build"
}
```

**Error**: Schema validation failure - `nodeVersion` property not recognized in Vercel OpenAPI schema.

**Root Cause**: This property does not exist in the official Vercel configuration schema at `https://openapi.vercel.sh/vercel.json`.

---

## Correct Configuration (AFTER)

### Step 1: Remove from vercel.json
The `nodeVersion` property has been removed from `vercel.json` entirely.

**Current vercel.json**:
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "pnpm run build",
  "devCommand": "pnpm run dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "env": { ... }
}
```

### Step 2: Add to package.json
The Node.js version is now specified in `package.json` under the `engines` field.

**Current package.json**:
```json
{
  "name": "jse-dumart-bookshop",
  "version": "0.1.0",
  "engines": {
    "node": "22.x",
    "pnpm": ">=9.0.0"
  },
  "scripts": { ... },
  "dependencies": { ... }
}
```

---

## Vercel Schema Specification

### Official Supported Properties in vercel.json

The Vercel JSON schema (at `https://openapi.vercel.sh/vercel.json`) officially supports these top-level properties:

1. **buildCommand** - `string | null` - Override the build command
2. **devCommand** - `string | null` - Override the development command
3. **installCommand** - `string | null` - Override the install command
4. **framework** - `string | null` - Set framework (e.g., "nextjs")
5. **env** - `Object` - Environment variables
6. **build** - `Object` - Build configuration
7. **functions** - `Object` - Per-function configuration
8. **regions** - `Array` - Deployment regions
9. **headers** - `Array` - HTTP response headers
10. **redirects** - `Array` - HTTP redirects
11. **rewrites** - `Array` - HTTP rewrites
12. **cleanUrls** - `boolean` - Remove file extensions from URLs
13. **crons** - `Array` - Scheduled cron jobs
14. **images** - `Object` - Image optimization configuration
15. **outputDirectory** - `string` - Output directory path
16. **ignoreCommand** - `string | null` - Ignore build condition
17. **public** - `string` - Public directory
18. **bunVersion** - `string` - Bun runtime version (alternative to Node.js)
19. **fluid** - `boolean | null` - Enable Fluid compute
20. **trailingSlash** - `boolean` - Add trailing slashes
21. **bulkRedirectsPath** - `string` - Path to bulk redirects
22. **functionFailoverRegions** - `Array` - Failover regions for functions
23. **$schema** - `string` - JSON schema reference (for validation)

**⚠️ IMPORTANT: `nodeVersion` is NOT in this list and is NOT supported in vercel.json**

---

## Correct Way to Set Node.js Version

### Method 1: Via package.json engines Field (RECOMMENDED)

```json
{
  "engines": {
    "node": "22.x"
  }
}
```

**Advantages**:
- Official Vercel-approved method
- Works with schema validation
- Version specified at project root
- Compatible with npm, yarn, pnpm
- Applies to local development and deployment

**Valid Node.js Version Values**:

| Version String | Deployed Version | Availability |
|---|---|---|
| `24.x` | Latest 24.x | ✓ Available (Default) |
| `22.x` | Latest 22.x | ✓ Available |
| `20.x` | Latest 20.x | ✓ Available |
| `^24.0.0` | Latest 24.x | ✓ Available |
| `^22.0.0` | Latest 22.x | ✓ Available |
| `^20.0.0` | Latest 20.x | ✓ Available |
| `>=20.0.0` | Latest 24.x | ✓ Available (satisfies all) |

### Method 2: Via Vercel Dashboard (Project Settings)

1. Navigate to your project in Vercel dashboard
2. Go to **Settings** → **Build & Deployment**
3. Locate the **Node.js Version** section
4. Select desired version from dropdown (20.x, 22.x, or 24.x)
5. Save changes

**Important**: This method sets the default, but `engines.node` in package.json takes precedence.

### Method 3: Combination Approach (BEST PRACTICE)

Use both methods for maximum clarity:

1. **In package.json**:
```json
{
  "engines": {
    "node": "22.x",
    "pnpm": ">=9.0.0"
  }
}
```

2. **In Vercel Dashboard Settings**: Set to same version (22.x)

**Benefit**: Explicit specification in both places ensures consistency across local development and production deployments.

---

## Available Node.js Versions on Vercel

### Current Default
**Node.js 24.x** (as of 2026)

### All Available Versions
- **24.x** - Latest LTS (DEFAULT)
- **22.x** - Older LTS
- **20.x** - Legacy LTS

### Version Management
- Vercel automatically manages **minor and patch versions**
- Only **major versions** are selectable (e.g., 24.x, not 24.3.1)
- Security updates are automatically applied

### Version Verification

**To verify your deployment's Node.js version**:

1. **During Build**:
   - Add to your build command: `node -v`
   - Check build logs in Vercel dashboard

2. **Example in package.json scripts**:
```json
{
  "scripts": {
    "check-node": "node -v",
    "build": "node -v && next build"
  }
}
```

3. **In API Endpoint**:
```typescript
export async function GET() {
  return Response.json({
    nodeVersion: process.version,
    env: process.env.NODE_ENV
  })
}
```

---

## Our Configuration: JSEdumart Bookshop

### Current Settings

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

**Rationale for 22.x**:
- Stable LTS version
- Good balance between new features and stability
- Compatible with Next.js 16.1.6
- Fully supported on Vercel
- Recommended for production use

**Upgrade Path** (if needed):
- Can upgrade to 24.x in future
- Update `"node": "24.x"` in package.json
- Redeploy on Vercel
- Dashboard setting updates automatically

---

## Schema Validation & Best Practices

### Enabling Schema Validation

To enable IDE autocomplete and schema validation for `vercel.json`:

**Add to top of vercel.json**:
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "pnpm run build"
}
```

**IDE Support**:
- VS Code: Provides autocomplete and validation
- WebStorm: Provides validation and suggestions
- Any editor supporting JSON Schema

### Common Mistakes to Avoid

❌ **WRONG** - Specifying in vercel.json:
```json
{
  "nodeVersion": "22.x"  // ❌ NOT VALID
}
```

❌ **WRONG** - Invalid version numbers:
```json
{
  "engines": {
    "node": "22.3.1"  // ❌ Too specific (only major.x allowed)
  }
}
```

❌ **WRONG** - Conflicting specifications:
```json
{
  "nodeVersion": "20.x",
  "engines": { "node": "22.x" }  // Both specified - confusing
}
```

✅ **CORRECT** - Using package.json:
```json
{
  "engines": {
    "node": "22.x"
  }
}
```

✅ **CORRECT** - Using semver ranges:
```json
{
  "engines": {
    "node": "^22.0.0"  // Maps to latest 22.x
  }
}
```

---

## Migration Guide

If you had `nodeVersion` in `vercel.json`:

### Step 1: Remove from vercel.json
```diff
{
  "buildCommand": "pnpm run build",
- "nodeVersion": "22.x",
  "framework": "nextjs"
}
```

### Step 2: Add to package.json
```diff
{
+ "engines": {
+   "node": "22.x"
+ },
  "scripts": { ... }
}
```

### Step 3: Test Locally
```bash
# Verify local Node version matches
node -v  # Should be 22.x

# Run build locally
pnpm run build
```

### Step 4: Deploy to Vercel
```bash
git add .
git commit -m "fix: Move Node.js version from vercel.json to package.json"
git push
```

### Step 5: Verify Deployment
1. Check Vercel deployment logs
2. Look for Node version in build output
3. Verify build succeeds
4. Test deployed application

---

## Troubleshooting

### Issue: "Failed to validate vercel.json"

**Cause**: Unknown property in vercel.json (likely `nodeVersion`)

**Solution**:
```bash
# Remove the property
git remove nodeVersion from vercel.json

# Verify against schema
curl https://openapi.vercel.sh/vercel.json | grep -i nodeVersion
# Should return nothing if property doesn't exist
```

### Issue: Wrong Node version deployed

**Cause**: `engines.node` in package.json doesn't match expected version

**Solution**:
```json
{
  "engines": {
    "node": "22.x"  // ← Verify this is what you want
  }
}
```

### Issue: Local and production Node versions differ

**Cause**: Local machine has different version than specified

**Solution**:
```bash
# Install correct version (using nvm or similar)
nvm install 22
nvm use 22

# Verify
node -v  # Should be v22.x.x

# Rebuild
pnpm run build
```

---

## References

- **Vercel Configuration**: https://vercel.com/docs/project-configuration/vercel-json
- **Node.js Versions**: https://vercel.com/docs/functions/runtimes/node-js/node-js-versions
- **JSON Schema**: https://openapi.vercel.sh/vercel.json
- **Next.js Support**: https://nextjs.org/docs/deployment/vercel

---

## Summary

| Aspect | Before | After |
|--------|--------|-------|
| Location | vercel.json | package.json |
| Property | `nodeVersion` | `engines.node` |
| Value | `18.x` | `22.x` |
| Valid | ✗ Invalid | ✓ Valid |
| Schema | Not recognized | Official standard |
| Status | FIXED | ✓ Compliant |

The configuration is now fully compliant with Vercel's official schema and best practices.
