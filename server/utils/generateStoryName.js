const adjectives = ['Amazing', 'Mystical', 'Incredible', 'Magical'];
const nouns = ['Adventure', 'Journey', 'Tale', 'Story'];

const generateStoryName = () => {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${adjective} ${noun}`;
};

export default generateStoryName;
