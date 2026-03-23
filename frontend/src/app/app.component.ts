import { Component, inject } from '@angular/core';
import { CloudinaryService } from './optimized-image/cloudinary.service';
import { OptimizedImageComponent } from './optimized-image/optimized-image.component';

@Component({
  selector: 'app-root',
  imports: [OptimizedImageComponent],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private cloudinary: CloudinaryService = inject(CloudinaryService);

  imageUrl: string | null = null;        // preview
  imagePublicId: string | null = null;   // optimized
  uploadProgress: number = 0;
  isUploading: boolean = false;

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (!file) return;

    // ✅ File validation
    if (!file.type.startsWith('image/')) {
      alert('Only image files allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Max 5MB allowed');
      return;
    }

    // ✅ instant preview (before upload finishes)
    this.imageUrl = URL.createObjectURL(file);

    this.isUploading = true;
    this.uploadProgress = 0;
    

    try {
      const res = await this.cloudinary.uploadImageWithProgress(
        file,
        (progress: number) => {
          this.uploadProgress = progress;
        }
      );

      // ✅ switch to optimized image after upload
      this.imagePublicId = res.public_id;

      this.imageUrl = res.secure_url;

    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      this.isUploading = false;
    }
  }
  
}
