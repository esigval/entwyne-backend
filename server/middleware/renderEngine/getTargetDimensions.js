function getTargetDimensions(quality, twyneOrientation) {
    // Base resolutions for different qualities
    const resolutions = {
        'SD': { width: 720, height: 480 }, // Standard definition
        'LowHD': { width: 1280, height: 720 }, // Lower HD
        'HD': { width: 1920, height: 1080 }, // Full HD
        'Proxy': { width: 720, height: 480 } // Same as SD for proxy
    };

    // Get base resolution for the specified quality
    const baseResolution = resolutions[quality];
    if (!baseResolution) {
        throw new Error('Invalid quality specified');
    }

    // Adjust dimensions based on the desired orientation
    if (twyneOrientation === 'vertical') {
        // Swap width and height for vertical orientation
        return {
            width: baseResolution.height,
            height: baseResolution.width
        };
    } else {
        // Keep width and height as is for horizontal orientation
        return baseResolution;
    }
}

export default getTargetDimensions;