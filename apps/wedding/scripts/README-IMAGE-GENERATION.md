# Image Generation Guide for UpTune Wedding

This guide explains how to generate and optimize images for SEO landing pages using Google's Imagen 3 API.

## Prerequisites

1. Google Cloud Project with Vertex AI enabled
2. Authentication configured (`gcloud auth application-default login`)
3. Node.js and npm installed

## Scripts Overview

### 1. `generate-images-with-imagen.ts`
Generates high-quality images using Google's Imagen 3 API (the best available model).

### 2. `optimize-blog-images.ts`
Optimizes generated images for web use, creating multiple sizes and formats.

## Usage

### Step 1: Generate Images

```bash
cd apps/wedding
npx tsx scripts/generate-images-with-imagen.ts
```

This will:
- Generate 3 variations of each image
- Save them to `/public/images/lp/`
- Use professional wedding photography prompts
- Create images at optimal resolutions

### Step 2: Review and Select

1. Check the generated images in `/public/images/lp/`
2. Review the 3 variations for each image
3. Delete the variants you don't want to use
4. Keep the best version of each image

### Step 3: Optimize for Web

```bash
npx tsx scripts/optimize-blog-images.ts
```

This will:
- Create 3 optimized sizes (hero, content, thumbnail)
- Generate WebP versions for modern browsers
- Reduce file sizes while maintaining quality
- Save to `/public/images/lp/optimized/`

## Image Requirements

### SEO Best Practices

1. **File Names**: Use descriptive, keyword-rich names
   - Good: `wedding-playlist-maker-hero.jpg`
   - Bad: `IMG_12345.jpg`

2. **Alt Text**: Include primary keywords naturally
   - Good: `"Couple creating wedding playlist on tablet"`
   - Bad: `"Image"` or keyword stuffing

3. **File Sizes**: Keep under 500KB for fast loading
   - Hero images: Max 500KB
   - Content images: Max 300KB
   - Thumbnails: Max 100KB

### Prompt Guidelines

When adding new images to `generate-images-with-imagen.ts`:

1. **Always include**: "Professional wedding photography"
2. **Specify lighting**: "golden hour", "soft natural light", "romantic lighting"
3. **Add context**: Venue type, atmosphere, specific moments
4. **Include diversity**: Various couples, settings, styles
5. **Avoid**: Logos, text overlays, watermarks, stock photo feel

### Example Prompt Structure

```typescript
{
  name: 'descriptive-seo-filename',
  prompt: 'Professional wedding photography: [subject] [action] [setting], [lighting], [atmosphere], [style]',
  aspectRatio: '16:9' // or '1:1', '4:3', etc.
}
```

## Implementation in Pages

### Using Optimized Images

```tsx
import Image from 'next/image'

// Use picture element for WebP with fallback
<picture>
  <source 
    srcSet="/images/lp/optimized/wedding-playlist-maker-hero.webp" 
    type="image/webp" 
  />
  <Image
    src="/images/lp/optimized/wedding-playlist-maker-hero-hero.jpeg"
    alt="Couple creating their wedding playlist together"
    width={1920}
    height={1080}
    priority
    className="object-cover"
  />
</picture>
```

### Responsive Images

```tsx
// Use different sizes for different viewports
<Image
  src="/images/lp/optimized/wedding-band-cost-uk-guide-content.jpeg"
  alt="Live wedding band performing at UK venue"
  width={1200}
  height={800}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="rounded-xl"
/>
```

## Adding New Images

1. Add configuration to `imageConfigs` array in `generate-images-with-imagen.ts`
2. Run generation script
3. Review and select best variant
4. Run optimization script
5. Update landing page with optimized images
6. Commit both original and optimized versions

## Troubleshooting

### Authentication Issues
```bash
gcloud auth application-default login
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json
```

### Missing Dependencies
```bash
cd apps/wedding
npm install sharp @google-cloud/vertexai
```

### Image Quality Issues
- Regenerate with more specific prompts
- Try different aspect ratios
- Generate more variations (increase `number_of_images`)

## Cost Considerations

- Imagen 3 pricing: ~$0.02 per image
- Generate thoughtfully to control costs
- Each script run generates 3 variations per config
- Budget ~$1-2 for a full landing page set

## Next Steps

After generating and optimizing images:
1. Update all landing pages with new images
2. Add proper alt text for SEO
3. Test page load speeds
4. Monitor Core Web Vitals
5. A/B test different image variations