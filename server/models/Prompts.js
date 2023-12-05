class Prompts {
    constructor(data) {
        this.created = new Date();
        this.storyName = data.storyName;
        this.prompt = data.prompt;
        this.twyneId = data.DatetwyneId;
        this.mediaType = data.mediaType;        
    }
};

export default Prompts;