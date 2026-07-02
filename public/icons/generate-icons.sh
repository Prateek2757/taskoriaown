#!/bin/bash

LOGO_PATH="../taskorialogonew.png"
SIZES=(72 96 128 144 152 192 384 512)

for size in "${SIZES[@]}"
do
    magick "$LOGO_PATH" \
        -resize ${size}x${size} \
        "icon-${size}x${size}.png"

    echo "Generated icon-${size}x${size}.png"
done

echo "Done!"