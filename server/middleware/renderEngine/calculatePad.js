function calculatePad(absoluteScale, targetWidth, targetHeight, clipOrientation) {
    console.log(`absoluteScale: ${absoluteScale}`);
    console.log(`Target Width: ${targetWidth}, Target Height: ${targetHeight}`);
    console.log(`Clip Orientation: ${clipOrientation}`);
    // Extract the dimensions from absoluteScale
    const dimensions = absoluteScale.match(/scale[:=]\s*(\d+)\s*:\s*(\d+)/i);
if (!dimensions) {
    throw new Error(`Failed to parse dimensions from absoluteScale: ${absoluteScale}`);
}
const width = parseInt(dimensions[1], 10);
const height = parseInt(dimensions[2], 10);

    console.log(`Extracted Width: ${width}, Extracted Height: ${height}`);

    // Calculate padding based on the target dimensions
    let padX = 0, padY = 0;
    if (clipOrientation === 'horizontal') {
        // Calculate vertical padding for horizontal clips
        padY = (height < targetHeight) ? Math.round((targetHeight - height) / 2) : 0;
    } else {
        // Calculate horizontal padding for vertical clips
        padX = (width < targetWidth) ? Math.round((targetWidth - width) / 2) : 0;
    }

    console.log(`Calculated padX: ${padX}, padY: ${padY}`);

    return `pad=${width + 2 * padX}:${height + 2 * padY}:${padX}:${padY}`;
}

export default calculatePad;