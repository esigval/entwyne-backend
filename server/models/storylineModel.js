class Storyline {
    constructor(templateDocument) {
        this.created = new Date();
        this.storyName = "Test Story";
        this.storyline = templateDocument.storyTemplate.map(item => ({
            prompt: item.defaultPrompt || item.prompt,
            order: item.defaultOrder || item.order,
            mediaType: item.mediaType,
            length: item.lengthDefault || item.length,
            contentType: item.contentType,
            storybeat: item.storybeat,
            twyneId: item.twyneId,
            shotDescription: item.shotDescription,
            promptTitle: item.promptTitle
        }));
    }
};

export default Storyline;