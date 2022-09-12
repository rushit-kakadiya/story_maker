 
  export class Gallery {
    title
    privacy
    hashtag
    latestUploadsUrl
    url
    sharing
    moderated
    finePrint
    totalUploads
  
    constructor(galleryJson) {
      this.title = galleryJson.title;
      this.privacy = galleryJson.privacyLevel;
      this.hashtag = galleryJson.hashtag;
      if (galleryJson._links != null) {
        if (galleryJson._links["web:self"] != null) {
          this.url = galleryJson._links["web:self"].href;
        }
        if (galleryJson._links.latestUploads != null) {
          this.latestUploadsUrl = galleryJson._links.latestUploads.href;
        }
      }
      this.sharing = galleryJson.socialSharing;
      this.moderated = galleryJson.moderated;
      this.finePrint = galleryJson.finePrint;
      this.totalUploads = galleryJson.totalUploads;
    }
  }
  