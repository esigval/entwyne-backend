class Twyne {
    constructor({
        _id,
        associatedPromptId,
        audio,
        beatTag,
        createdAt,
        filename,
        s3FilePath,
        s3Uri,
        s3UriThumbnail,
        sentiment,
        thumbnail,
        thumbnailUrl,
        transcription,
        transcriptionUrl,
        videoUri,
        webmFilePath,
    } = {}) {
        this._id = _id;
        this.associatedPromptId = associatedPromptId;
        this.audio = audio;
        this.beatTag = beatTag;
        this.createdAt = createdAt;
        this.filename = filename;
        this.s3FilePath = s3FilePath;
        this.s3Uri = s3Uri;
        this.s3UriThumbnail = s3UriThumbnail;
        this.sentiment = sentiment;
        this.thumbnail = thumbnail;
        this.thumbnailUrl = thumbnailUrl;
        this.transcription = transcription;
        this.transcriptionUrl = transcriptionUrl;
        this.videoUri = videoUri;
        this.webmFilePath = webmFilePath;
    }
}

export default Twyne;