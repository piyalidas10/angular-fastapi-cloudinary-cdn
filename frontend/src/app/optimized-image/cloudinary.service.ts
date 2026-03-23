import { Injectable } from '@angular/core';
import axios from 'axios';
import imageCompression from 'browser-image-compression';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {

  // ✅ Compress Image
  async compressImage(file: File): Promise<File> {

    // Skip small files
    if (file.size < 1 * 1024 * 1024) {
      return file;
    }

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true
    };

    return await imageCompression(file, options);
  }

  // ✅ Upload with Progress
  async uploadImageWithProgress(
    file: File,
    onProgress: (progress: number) => void
  ): Promise<any> {

    // 1️⃣ Compress
    const compressedFile = await this.compressImage(file);

    const publicId = `img_${Date.now()}`;

    // 2️⃣ Get signature from backend
    const signRes = await axios.post('http://localhost:8000/api/sign-upload', {
      public_id: publicId
    });

    const {
      timestamp,
      signature,
      api_key,
      cloud_name,
      folder
    } = signRes.data;

    // 3️⃣ Upload directly to Cloudinary
    const formData = new FormData();
    formData.append('file', compressedFile);
    formData.append('api_key', api_key);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('public_id', publicId);
    formData.append('folder', folder);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;

    const response = await axios.post(uploadUrl, formData, {
      onUploadProgress: (event: any) => {
        const percent = Math.round(
          (event.loaded * 100) / (event.total || 1)
        );
        onProgress(percent);
      }
    });

    return response.data;
  }
}