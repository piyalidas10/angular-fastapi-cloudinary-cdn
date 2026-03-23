import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges
} from '@angular/core';

@Component({
  selector: 'app-optimized-image',
  standalone: true,
  imports: [],
  templateUrl: './optimized-image.component.html',
  styleUrls: ['./optimized-image.component.scss']
})
export class OptimizedImageComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  @Input() publicId!: string;   // Cloudinary public_id
  @Input() imageUrl!: string;    // optional direct URL (overrides publicId)
  @Input() width: number = 400;
  @Input() height: number = 300;
  @Input() alt: string = 'image';

  @ViewChild('imgRef') imgRef!: ElementRef;

  // 🔥 IMPORTANT → replace with your actual Cloudinary cloud name
  cloudName = 'your_cloud_name';

  mainUrl: string = '';
  blurUrl: string = '';

  isLoaded: boolean = false;
  hasError: boolean = false;
  isInView: boolean = false;

  private observer!: IntersectionObserver;

  // ✅ Initialize URLs
  ngOnInit() {
    if (this.publicId) {
      this.generateUrl();
    }
  }

  // ✅ Handle dynamic publicId changes (VERY IMPORTANT)
  ngOnChanges(changes: SimpleChanges) {
    if (changes['imageUrl'] && changes['publicId'] && this.publicId) {
      this.generateUrl();
      this.resetState();
    }
  }

  // 🔥 Generate Cloudinary URLs
  generateUrl() {
    if (!this.imageUrl) return;

    // ✅ Blur (based on imageUrl)
    this.blurUrl = this.imageUrl.replace(
      '/upload/',
      '/upload/w_50,q_10,e_blur:1000/'
    );

    // ✅ Optimized main image
    this.mainUrl = this.imageUrl.replace(
      '/upload/',
      `/upload/f_auto,q_auto,w_${this.width},h_${this.height},c_fill/`
    );

    console.log('Main URL:', this.mainUrl);
    console.log('Blur URL:', this.blurUrl);
  }

  // 👀 Lazy loading with IntersectionObserver
  ngAfterViewInit() {
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          this.isInView = true;
          this.observer.disconnect();
        }
      },
      {
        threshold: 0.1
      }
    );

    if (this.imgRef) {
      this.observer.observe(this.imgRef.nativeElement);
    }
  }

  // 📱 Responsive srcset
  getSrcSet(): string {
    if (!this.imageUrl) return '';

    return `
      ${this.imageUrl.replace('/upload/', '/upload/w_300/')} 300w,
      ${this.imageUrl.replace('/upload/', '/upload/w_600/')} 600w,
      ${this.imageUrl.replace('/upload/', '/upload/w_900/')} 900w
    `;
  }

  // ✅ Load success
  onLoad() {
    this.isLoaded = true;
  }

  // ❌ Load error
  onError() {
    this.hasError = true;
  }

  // 🔄 Reset state when image changes
  private resetState() {
    this.isLoaded = false;
    this.hasError = false;
    this.isInView = false;
  }

  // 🧹 Cleanup
  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}