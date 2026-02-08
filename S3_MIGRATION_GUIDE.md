# S3 Migration Guide

This guide explains how to migrate all assets (icons, images, etc.) to AWS S3 or any CDN.

## Why Asset Configuration?

All asset paths are centralized in `js/config/assets.js` so you can:

- Change all asset URLs in one place
- Switch between local/S3/CDN instantly
- Manage different environments easily (dev/staging/prod)

## Quick Start

### 1. Upload Assets to S3

```bash
# Install AWS CLI if you haven't
# brew install awscli  # macOS
# pip install awscli   # Linux/Windows

# Configure AWS credentials
aws configure

# Upload all assets
aws s3 sync assets/ s3://your-bucket-name/assets/ --acl public-read
```

### 2. Update Asset Configuration

Edit `js/config/assets.js`:

```javascript
// BEFORE (local assets):
export const BASE_URL = "";

// AFTER (S3 assets):
export const BASE_URL = "https://your-bucket-name.s3.amazonaws.com/";

// OR CloudFront CDN:
export const BASE_URL = "https://d1234567890.cloudfront.net/";
```

### 3. Done!

All icons and images will now load from S3/CDN. No other code changes needed.

## S3 Bucket Configuration

### Make Bucket Public (for public websites)

1. Create S3 bucket
2. Uncheck "Block all public access"
3. Add bucket policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

4. Enable CORS if needed:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

## CloudFront Setup (Optional)

For better performance and HTTPS:

1. Create CloudFront distribution
2. Set S3 bucket as origin
3. Use CloudFront URL as `BASE_URL`

Benefits:

- Global CDN caching
- HTTPS by default
- Faster load times worldwide

## Asset Organization

Current assets structure:

```
assets/
├── icons/
│   ├── computer.svg
│   ├── recycle-bin.svg
│   ├── file-explorer.svg
│   ├── steam.svg
│   ├── photos.svg
│   ├── movies.svg
│   └── windows-logo.svg
└── wallpapers/
    └── (your custom wallpapers)
```

When uploaded to S3, paths will be:

```
https://your-bucket.s3.amazonaws.com/assets/icons/computer.svg
https://your-bucket.s3.amazonaws.com/assets/icons/recycle-bin.svg
...
```

## Environment Management

You can manage different environments:

### Development (local)

```javascript
export const BASE_URL = "";
```

### Staging

```javascript
export const BASE_URL = "https://staging-bucket.s3.amazonaws.com/";
```

### Production

```javascript
export const BASE_URL = "https://cdn.yourproduction.com/";
```

## Adding New Assets

When you add new icons or images:

1. Add file to `assets/` folder
2. Upload to S3: `aws s3 cp assets/icons/new-icon.svg s3://your-bucket/assets/icons/new-icon.svg --acl public-read`
3. Add to `js/config/assets.js`:

```javascript
export const ICONS = {
  // ... existing icons
  newIcon: `${BASE_URL}assets/icons/new-icon.svg`,
};
```

4. Use in your code:

```javascript
import { ICONS } from "./config/assets.js";

// In component:
icon.src = ICONS.newIcon;
```

## Cost Considerations

- S3 storage is cheap (~$0.023/GB/month)
- Data transfer out costs ~$0.09/GB
- CloudFront can reduce costs with caching
- For small projects, costs are typically <$1/month

## Troubleshooting

### Assets not loading from S3?

1. Check bucket is public
2. Verify CORS configuration
3. Check BASE_URL ends with `/`
4. Open browser console for errors

### Mixed content warnings?

- Use HTTPS for your site
- Use CloudFront for HTTPS S3 access
- Update BASE_URL to use `https://`

## Rollback

To switch back to local assets:

```javascript
export const BASE_URL = "";
```

That's it! Your app will load assets locally again.

the tooltip for desktop icons is still not appear instantly, for the mobile app, make position of  
 icons align statically (lock them), the open apps in the bottom bar when in mobile need be contained  
 inside a dropdown button, when click on the button, it open a dropdowm upward containing opening  
 apps, need to adjust default position for app top-left: computer, file exp, bin, steam, middle: work  
 experiences, educations, projects, top-right: photo, video, music
