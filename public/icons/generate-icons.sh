#!/bin/bash

# This script generates placeholder icons
# Replace with your actual logo to generate real icons

SIZES=(72 96 128 144 152 192 384 512)
COLOR="#4F46E5"  # Indigo color

for size in "${SIZES[@]}"; do
  # Create a simple SVG icon
  cat > "icon-${size}x${size}.svg" << SVGEOF
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="${COLOR}"/>
  <text x="50%" y="50%" font-size="$((size/3))" fill="white" text-anchor="middle" dy=".35em">SL</text>
</svg>
SVGEOF

  echo "Generated icon-${size}x${size}.svg"
  
  # If you have ImageMagick or rsvg-convert, uncomment below to convert to PNG:
  # convert "icon-${size}x${size}.svg" "icon-${size}x${size}.png"
  # OR
  # rsvg-convert -w ${size} -h ${size} "icon-${size}x${size}.svg" -o "icon-${size}x${size}.png"
done

echo ""
echo "SVG icons generated! To convert to PNG, install ImageMagick or rsvg-convert and run:"
echo "  for svg in *.svg; do convert \$svg \${svg%.svg}.png; done"
