import {Component, ElementRef, ViewChild} from '@angular/core';
import {FileService} from './file.service';
import {NgForm} from '@angular/forms';
import {HttpEventType} from '@angular/common/http';
import {Router} from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AngularCli';
  @ViewChild('fileUpload', {static: false})
  fileUpload: ElementRef;
  signButton = false;
  files = [];

  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;

  constructor(private fileService: FileService,
              ) {
  }
  onPhotoSelection() {
    const fileUpload = this.fileUpload.nativeElement;
    fileUpload.onchange = () => {
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        if (this.fileService.fileCheck(file)) {
          this.files.push({data: file, inProgress: false, progress: 0}); } else {
        }
      }
      this.uploadFiles();
    };
    fileUpload.click();
  }

  private fileProgress(file) {
    this.fileData = file.data;
    this.preview();
  }

  private preview() {
    // Show preview
    const mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
    };
  }


  private uploadFiles() {
    this.fileUpload.nativeElement.value = '';
    this.files.forEach(file => {
      this.fileProgress(file);
    });
  }

  onPreviewEvent(f: NgForm) {
    this.onSubmit();
  }

  private onSubmit() {
    this.fileUploadProgress = '0%';
    if ( this.fileData ) {
      this.fileService.pushFileToStorage(this.fileData).subscribe(events => {
        if (events.type === HttpEventType.UploadProgress) {
          this.fileUploadProgress = Math.round(events.loaded / events.total * 100) + '%';
        } else if (events.type === HttpEventType.Response) {
          this.fileUploadProgress = '';
        }
      }, error => {
        this.fileUploadProgress = '';
      }, () => {
        this.enableSign();
      });
    } else {

    }
  }

  private enableSign() {
    this.signButton = true;
  }
}
