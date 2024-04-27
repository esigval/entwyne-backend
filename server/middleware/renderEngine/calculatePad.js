const calculatePad = (scale, twyneOrientation) => {
    // Remove 'scale=' from the start of the scale parameter
    scale = scale.startsWith('scale=') ? scale.substring(6) : scale;

    let [width, height] = scale.split(':').map(Number);

    // Validate the extracted width and height
    if (isNaN(width) || isNaN(height)) {
        throw new Error(`Invalid scale: ${scale}`);
    }

    // Validate the orientation parameter
    if (twyneOrientation !== 'horizontal' && twyneOrientation !== 'vertical') {
        throw new Error(`Invalid twyneOrientation: ${twyneOrientation}`);
    }

    // Calculate height based on a 16:9 aspect ratio if height is -2
    if (height === -2) {
        height = Math.ceil((9 / 16) * width);
    }

    // Assume the desired aspect ratio is 16:9 for both orientations
    const desiredAspectRatio = 16 / 9;
    let targetWidth, targetHeight;

    if (twyneOrientation === 'horizontal') {
        // Maintain the original width, adjust height to fit 16:9 aspect ratio
        targetWidth = width;
        targetHeight = Math.ceil(targetWidth / desiredAspectRatio);
    } else {
        // Maintain the original height, adjust width to fit 16:9 aspect ratio
        targetHeight = height;
        targetWidth = Math.ceil(targetHeight * desiredAspectRatio);
    }

    // Adjust pad dimensions to be at least as large as the original dimensions
    const padWidth = Math.max(width, targetWidth) + 1; // Add 1 to the width
    const padHeight = Math.max(height, targetHeight) + 1; // Add 1 to the height

    // Calculate padding offsets to center the original video
    const padX = Math.ceil((padWidth - width) / 2) + 1;
    const padY = Math.ceil((padHeight - height) / 2) + 1;

    return `pad=${padWidth}:${padHeight}:${padX}:${padY}`;
}

export default calculatePad;