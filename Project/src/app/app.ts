import { Component, HostListener } from '@angular/core';
import { FileUploadComponent } from './components/file-upload/file-upload.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FileUploadComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'File Upload Application';

  // Prevent default drag and drop behavior on the entire page
  @HostListener('window:dragover', ['$event'])
  onWindowDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('window:drop', ['$event'])
  onWindowDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }
}
