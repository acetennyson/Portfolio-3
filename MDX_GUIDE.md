# MDX Blog Guide

Your blog now supports **MDX** (Markdown + JSX), giving you the simplicity of Markdown with the power of React components.

## Content Format Detection

The system automatically detects three content formats:

1. **HTML** (legacy): Content starting with `<` (e.g., `<article>...`)
2. **MDX**: Markdown with optional JSX components
3. **Editor.js blocks** (legacy): JSON format with `{ blocks: [...] }`

## Basic Markdown Syntax

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*
~~Strikethrough~~

- Bullet list item
- Another item

1. Numbered list
2. Second item

[Link text](https://example.com)

![Image alt text](https://example.com/image.jpg)

> Blockquote text

`inline code`

\`\`\`javascript
// Code block
const hello = "world";
\`\`\`
```

## Custom Components

MDX allows you to use custom React components inside your content:

### EmailForm

Collect emails for campaigns, product launches, or newsletters.

```mdx
<EmailForm campaign="archive-launch" placeholder="Get notified when Archive launches" />
```

**Props:**
- `campaign` (string, required): Campaign identifier for tracking
- `placeholder` (string, optional): Input placeholder text

---

### Callout

Highlight important information with styled boxes.

```mdx
<Callout type="warning">
This is a warning message with custom styling.
</Callout>
```

**Props:**
- `type`: `"info"` | `"warning"` | `"error"` | `"success"`

**Examples:**

```mdx
<Callout type="info">
Regular information or tips.
</Callout>

<Callout type="warning">
⚠️ Important warnings or caveats.
</Callout>

<Callout type="error">
Critical errors or breaking changes.
</Callout>

<Callout type="success">
Success messages or completed features.
</Callout>
```

---

### TwoColumn & Column

Create side-by-side layouts for comparisons or multi-content sections.

```mdx
<TwoColumn>
  <Column>
    ## Left Side
    Content for the left column goes here.
  </Column>
  
  <Column>
    ## Right Side
    Content for the right column goes here.
  </Column>
</TwoColumn>
```

**Advanced styling:**

```mdx
<TwoColumn>
  <Column className="bg-blue-500/10">
    Custom styled left column
  </Column>
  
  <Column className="bg-red-500/10">
    Custom styled right column
  </Column>
</TwoColumn>
```

---

### CodeBlock

Code blocks with titles and language hints.

```mdx
<CodeBlock title="app.js" language="javascript">
const express = require('express');
const app = express();
</CodeBlock>
```

**Props:**
- `title` (string, optional): File name or description
- `language` (string, optional): Programming language for syntax highlighting
- `children`: The code content

---

### Figure

Images with captions.

```mdx
<Figure 
  src="https://example.com/screenshot.png" 
  alt="Application dashboard" 
  caption="The main dashboard showing real-time analytics"
/>
```

**Props:**
- `src` (string, required): Image URL
- `alt` (string, required): Alt text for accessibility
- `caption` (string, optional): Image caption

---

### Video

Embed videos from YouTube, Vimeo, or other platforms.

```mdx
<Video 
  src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
  title="Project Demo"
/>
```

**Props:**
- `src` (string, required): Embed URL
- `title` (string, optional): Video title

---

### Highlight

Emphasize important text in a prominent box.

```mdx
<Highlight>
🚀 Archive launches Q3 2026 — join the waiting list above!
</Highlight>
```

---

## Complete Example Post

Here's a full blog post using MDX features:

```mdx
# Archive — Building a Game Where History Is the Gameplay

What if history wasn't discovered, but chosen? Archive is a narrative investigation game where every memory can be questioned.

<Callout type="info">
This is an in-development project. Follow along with the devlog series.
</Callout>

## The Core Concept

Archive combines investigation mechanics with narrative choice systems:

<TwoColumn>
  <Column>
    ### Investigation
    - Examine artifacts
    - Question witnesses
    - Build timelines
  </Column>
  
  <Column>
    ### Consequences
    - Shape civilization
    - Unlock new eras
    - Multiple endings
  </Column>
</TwoColumn>

## Technical Implementation

The game is built with React and TypeScript:

<CodeBlock title="Game.tsx" language="typescript">
interface Artifact {
  id: string;
  era: string;
  reliability: number;
}

function analyzeArtifact(artifact: Artifact) {
  // Investigation logic
}
</CodeBlock>

<Callout type="warning">
The reliability system is still being balanced. Feedback welcome!
</Callout>

## Get Notified

Want to play Archive when it launches?

<EmailForm campaign="archive-launch" placeholder="Enter your email" />

<Highlight>
🎮 Early access starts Q3 2026
</Highlight>

## Development Video

<Video 
  src="https://www.youtube.com/embed/example" 
  title="Archive Gameplay Preview"
/>

<Figure 
  src="https://example.com/screenshot.png" 
  alt="Archive game interface" 
  caption="The investigation board where players connect artifacts"
/>

---

Thanks for reading! Questions? [Reach out on Twitter](https://twitter.com/example).
```

## Storing in Firestore

When you save a blog post in Firestore, store the MDX content as a string in the `content` field:

```javascript
{
  title: "Archive — Building a Game",
  slug: "archive-game",
  excerpt: "What if history wasn't discovered, but chosen?",
  content: "# Archive — Building a Game\n\nWhat if history...\n\n<EmailForm campaign=\"archive\" />",
  coverImage: "https://...",
  tags: ["react", "game-dev"],
  published: true,
  authorId: "...",
  createdAt: serverTimestamp()
}
```

## Migrating Existing HTML Posts

Your existing HTML posts will continue to work. The system detects HTML content automatically.

To migrate an HTML post to MDX:

1. Convert HTML to Markdown using a tool or manually
2. Replace custom HTML sections with MDX components
3. Update the `content` field in Firestore

**Before (HTML):**
```html
<div class="border-l-4 border-yellow-500 bg-yellow-900/10 p-6">
  <p>⚠️ Important note</p>
</div>
```

**After (MDX):**
```mdx
<Callout type="warning">
Important note
</Callout>
```

## Adding More Components

To add new custom components:

1. Add the component to `components/mdx/MDXComponents.tsx`
2. It's automatically available in all MDX blog posts

Example:

```typescript
// In MDXComponents.tsx
export const MDXComponents = {
  // ... existing components
  
  MyNewComponent: ({ title, children }: { title: string; children: React.ReactNode }) => {
    return (
      <div className="my-custom-style">
        <h3>{title}</h3>
        {children}
      </div>
    );
  },
};
```

Then use it in posts:

```mdx
<MyNewComponent title="Hello">
  Content goes here
</MyNewComponent>
```

## Tips

- **Keep it simple**: Use plain Markdown for 90% of content
- **Use components sparingly**: Only when you need custom behavior
- **Test locally**: Preview posts before deploying to Firestore
- **Consistent styling**: Custom components use CSS variables for theming
- **Accessibility**: All components include proper semantic HTML and ARIA attributes

## Troubleshooting

**Component not rendering?**
- Check spelling and capitalization (must match `MDXComponents.tsx`)
- Ensure you installed `next-mdx-remote`
- Check browser console for errors

**Styling looks broken?**
- Components use CSS custom properties (`var(--fg)`, `var(--bg)`, etc.)
- Ensure your theme system defines these variables

**MDX syntax errors?**
- Close all JSX tags: `<EmailForm />` not `<EmailForm>`
- Components must be capitalized: `<Callout>` not `<callout>`
- Props must be quoted: `type="warning"` not `type=warning`
