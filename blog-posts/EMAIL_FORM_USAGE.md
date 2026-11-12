# EmailForm Component Usage in MDX Posts

## Automatic Campaign Tracking

The `EmailForm` component automatically uses the blog post slug as the campaign identifier. When used in an MDX blog post, it will save subscriptions to Firestore with the post's slug.

## Basic Usage

Just add the component anywhere in your MDX content:

```mdx
<EmailForm />
```

This will:
- Automatically use the current post's slug as the campaign (e.g., `roblox-course-complete`)
- Use default placeholder text: "Enter your email"
- Save to Firestore `subscribers` collection with the post slug

## Custom Placeholder

```mdx
<EmailForm placeholder="Get course updates" />
```

## Custom Campaign Override

If you want to override the automatic slug tracking:

```mdx
<EmailForm campaign="special-promo" />
```

## Example in Course Posts

For the Roblox course post (`roblox-course-complete`):

```mdx
## Want course updates?

Stay notified when new modules are added or major updates are released.

<EmailForm placeholder="Subscribe for course updates" />
```

For the ML course post (`ml-course-complete`):

```mdx
## Get notified about new content

<EmailForm placeholder="Join the ML course mailing list" />
```

## Data Structure in Firestore

Each subscription creates a document in `subscribers` collection:

```javascript
{
  email: "user@example.com",
  campaign: "roblox-course-complete", // or "ml-course-complete"
  subscribedAt: Timestamp,
  confirmed: false,
  metadata: {
    userAgent: "...",
    referer: "..."
  }
}
```

## Querying Subscribers

In your admin panel or API routes:

```javascript
import { getSubscribers } from '@/firebase/firestore';

// Get all subscribers for a specific course
const robloxSubscribers = await getSubscribers('roblox-course-complete');
const mlSubscribers = await getSubscribers('ml-course-complete');

// Get all subscribers
const allSubscribers = await getSubscribers();
```

## Benefits

1. **Automatic tracking**: No need to manually specify campaign for each post
2. **Targeted communication**: Know exactly which course/content users are interested in
3. **Analytics**: Track which posts drive the most subscriptions
4. **Segmentation**: Send relevant updates only to interested subscribers
