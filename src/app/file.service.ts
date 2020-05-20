import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'})
export class FileService {



  constructor(private https: HttpClient) { }

  fileCheck(file: File): boolean {
    console.log('file size: ' + file.size)
    if (file.size > 2097152) {
      return false;
    }
    return true;
  }

  pushFileToStorage(file: File): Observable<HttpEvent<{}>> {
    console.log('pushFileToStorage');
    const data: FormData = new FormData();
    data.append('file', file);

    const newRequest = new HttpRequest('POST', environment.backend + '/upload', data, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.https.request(newRequest);
  }
  deleteFileFromStorage(eventId) {
    this.https.delete(environment.backend + '/events/' + eventId + '/deletefile').
    subscribe((data) => {});
  }
}
