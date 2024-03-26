import path from 'path';

export function removeExtensionFromKey(keyWithExtension) {
    const parts = keyWithExtension.split('/');
    const lastPartWithoutExtension = path.parse(parts[parts.length - 1]).name; // Get the name without extension
    parts[parts.length - 1] = lastPartWithoutExtension;
    return parts.join('/');
}
