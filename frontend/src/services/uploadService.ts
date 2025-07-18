import { HttpService } from "@/services/httpService";
import { COOKIE_NAMES } from "@/utils/cookiesUtils";

class UploadService {
  private request = new HttpService();

  async uploadImage(file: File, cookieName: COOKIE_NAMES) {
    return this.request.upload<{ url: string; phash: string }>(
      "/static/upload",
      file,
      cookieName
    );
  }
}

const uploadService = new UploadService();
export default uploadService;
