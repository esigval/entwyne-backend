const adjectives = ['Great', 'Small', 'Big', 'Shiny', 'Colorful'];
const nouns = ['Dog', 'Cat', 'House', 'Car', 'Tree'];

const generateStoryName = () => {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return String(`${adjective} ${noun}`);
};

export default generateStoryName;