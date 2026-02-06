import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  selectedFile: File | null = null;
  isDragging = false;
  errorMessage: string = '';

  // Accepted file types with size limits (in bytes)
  private acceptedTypes = {
    'image/jpeg': { maxSize: 10 * 1024 * 1024, name: 'JPG' }, // 10 MB
    'image/jpg': { maxSize: 10 * 1024 * 1024, name: 'JPG' },
    'image/gif': { maxSize: 10 * 1024 * 1024, name: 'GIF' }, // 10 MB
    'image/tiff': { maxSize: 10 * 1024 * 1024, name: 'TIFF' }, // 10 MB
    'image/svg+xml': { maxSize: 10 * 1024 * 1024, name: 'SVG' }, // 10 MB
    'application/postscript': { maxSize: 10 * 1024 * 1024, name: 'PS' }, // 10 MB
    'application/pdf': { maxSize: 30 * 1024 * 1024, name: 'PDF' } // 30 MB
  };

  private validateFile(file: File): boolean {
    this.errorMessage = '';

    // Check if file type is accepted
    const fileConfig = this.acceptedTypes[file.type as keyof typeof this.acceptedTypes];
    
    if (!fileConfig) {
      this.errorMessage = `File type not accepted. Please upload: JPG, GIF, TIFF, SVG, PS, or PDF files.`;
      return false;
    }

    // Check file size
    if (file.size > fileConfig.maxSize) {
      const maxSizeMB = fileConfig.maxSize / (1024 * 1024);
      this.errorMessage = `${fileConfig.name} files must be less than ${maxSizeMB} MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)} MB.`;
      return false;
    }

    return true;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (this.validateFile(file)) {
        this.selectedFile = file;
      } else {
        this.selectedFile = null;
      }
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (this.validateFile(file)) {
        this.selectedFile = file;
      } else {
        this.selectedFile = null;
        // Reset the input
        input.value = '';
      }
    }
  }

  onSend(): void {
    if (this.selectedFile) {
      console.log('Sending file:', this.selectedFile.name);
      
      // Here you would typically upload the file to your backend
      // Example:
      // const formData = new FormData();
      // formData.append('file', this.selectedFile);
      // this.http.post('your-api-endpoint', formData).subscribe(...)
      
      // For now, just logging
      alert(`File "${this.selectedFile.name}" ready to send!`);
    } else {
      alert('Please select a file first');
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.errorMessage = '';
  }
}
