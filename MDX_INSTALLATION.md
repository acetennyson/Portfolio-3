# MDX Installation Steps

## Installation Required

You need to install the `next-mdx-remote` package manually because PowerShell script execution is disabled on your system.

### Option 1: Using Command Prompt (Recommended)

1. Open **Command Prompt** (not PowerShell)
2. Navigate to your project:
   ```cmd
   cd "C:\Users\Ado Daniel NJ\Documents\GitHub\Portfolio-3"
   ```
3. Install the package:
   ```cmd
   npm install next-mdx-remote
   ```

### Option 2: Enable PowerShell Scripts (Advanced)

If you want to use PowerShell scripts in the future:

1. Open **PowerShell as Administrator**
2. Run:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
3. Then run:
   ```powershell
   npm install next-mdx-remote
   ```

## Verify Installation

After installation, check that it's in your `package.json`:

```json
{
  "dependencies": {
    "next-mdx-remote": "^5.0.0",
    ...
  }
}
```

## What Was Implemented

✅ **MDX rendering support** in blog posts  
✅ **8 custom components** (EmailForm, Callout, TwoColumn, Column, CodeBlock, Figure, Video, Highlight)  
✅ **Backward compatibility** with existing HTML posts  
✅ **Automatic format detection** (HTML vs MDX vs Editor.js blocks)  
✅ **Table of Contents** extraction for MDX posts  

## Files Created/Modified

**New Files:**
- `components/mdx/MDXComponents.tsx` — Reusable blog components
- `MDX_GUIDE.md` — Complete usage guide with examples
- `MDX_INSTALLATION.md` — This file

**Modified Files:**
- `app/(public)/blog/[slug]/page.tsx` — Added MDX rendering support

## Next Steps

1. Install `next-mdx-remote` using one of the methods above
2. Read `MDX_GUIDE.md` for component usage examples
3. Test with a new blog post in Firestore using MDX format
4. Optionally migrate existing HTML posts to MDX

## Test Your Installation

Create a test post in Firestore with this content:

```markdown
# Test Post

This is **MDX** content with a custom component:

<Callout type="success">
MDX is working! 🎉
</Callout>

Regular markdown continues here...
```

If you see the green callout box render correctly, MDX is working!

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify `next-mdx-remote` is in `node_modules/`
3. Restart the dev server after installation
4. Check that components are imported correctly in `page.tsx`
