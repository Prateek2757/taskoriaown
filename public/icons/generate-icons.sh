#!/bin/bash

LOGO_PATH="../taskorialogonew.png"
SIZES=(72 96 128 144 152 192 384 512)

if [ ! -f "$LOGO_PATH" ]; then
  echo "Error: Logo not found at $LOGO_PATH"
  exit 1
fi

echo "Generating icons from $LOGO_PATH..."
echo ""

for size in "${SIZES[@]}"; do
  sips -z ${size} ${size} "$LOGO_PATH" \
    --out "./icon-${size}x${size}.png" >/dev/null
  echo "Generated icon-${size}x${size}.png"
done

echo ""
echo "All icons generated successfully!"