# UpTune Favicon Created! 🎵❤️

I've created a custom favicon for your wedding music app that combines:
- Musical notes (representing the music aspect)
- A heart accent (representing love/weddings)
- Your brand's purple-to-pink gradient
- Clean, modern design that works at all sizes

## Files Created:

1. **`/src/app/icon.svg`** - Small 32x32 version for Next.js App Router
2. **`/public/icon.svg`** - Large 512x512 version for high-res displays
3. Updated `layout.tsx` with proper favicon metadata

## Design Features:

- **Gradient**: Purple (#9333ea) to Pink (#ec4899) matching your brand
- **Icon**: Connected musical notes with a heart symbol
- **Style**: Clean, modern, works well at small sizes
- **Shadow**: Subtle drop shadow for depth

## To Generate PNG Versions:

If you want PNG versions, you can:

1. **Online Tool** (Easiest):
   - Go to: https://realfavicongenerator.net/
   - Upload `/public/icon.svg`
   - Download the generated package

2. **Using ImageMagick** (if installed):
   ```bash
   # Install ImageMagick first if needed
   brew install imagemagick

   # Generate different sizes
   convert public/icon.svg -resize 192x192 public/icon-192.png
   convert public/icon.svg -resize 512x512 public/icon-512.png
   convert public/icon.svg -resize 180x180 public/apple-icon.png
   convert public/icon.svg -resize 16x16 public/favicon-16x16.png
   convert public/icon.svg -resize 32x32 public/favicon-32x32.png
   ```

3. **Manual Alternative**:
   - Open `/public/icon.svg` in a browser
   - Use browser dev tools to save as PNG
   - Or use any graphics app like Preview on Mac

## Next Steps:

1. The SVG favicon will work immediately in modern browsers
2. For maximum compatibility, generate PNG versions
3. Consider creating a favicon.ico for legacy browser support

The favicon will appear after you deploy to production!