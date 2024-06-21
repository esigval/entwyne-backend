function calculatePad(absoluteScale, targetWidth, targetHeight, clipOrientation) {
    const dimensions = absoluteScale.match(/scale[:=]\s*(\d+)\s*:\s*(\d+)/i);
    if (!dimensions) {
        throw new Error(`Failed to parse dimensions from absoluteScale: ${absoluteScale}`);
    }
    const width = parseInt(dimensions[1], 10);
    const height = parseInt(dimensions[2], 10);

    // console.log(`Parsed dimensions: width=${width}, height=${height}`);

    let finalWidth, finalHeight;

    if (clipOrientation === 'horizontal') {
        finalWidth = targetWidth;
        finalHeight = Math.round((height / width) * targetWidth);
        if (finalHeight > targetHeight) {
            finalHeight = targetHeight;
            finalWidth = Math.round((width / height) * targetHeight);
        }
    } else {
        finalHeight = targetHeight;
        finalWidth = Math.round((width / height) * targetHeight);
        if (finalWidth > targetWidth) {
            finalWidth = targetWidth;
            finalHeight = Math.round((height / width) * targetWidth);
        }
    }

    // console.log(`Adjusted dimensions: finalWidth=${finalWidth}, finalHeight=${finalHeight}`);

    const padX = (finalWidth < targetWidth) ? Math.round((targetWidth - finalWidth) / 2) : 0;
    const padY = (finalHeight < targetHeight) ? Math.round((targetHeight - finalHeight) / 2) : 0;

    // console.log(`Calculated padding: padX=${padX}, padY=${padY}`);

    // Ensure padded dimensions are never smaller than the input dimensions
    const paddedWidth = Math.max(finalWidth + 2 * padX, width);
    const paddedHeight = Math.max(finalHeight + 2 * padY, height);

    return `pad=${paddedWidth}:${paddedHeight}:${padX}:${padY}`;
}

export default calculatePad;
