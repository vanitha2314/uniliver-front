import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class UploadedFileService {
  constructor(private httpService: HttpService) {}

  getAllUserFiles(userId: string | number) {
    return this.httpService.get<any>(`/adls/listFiles/${userId}`);
  }

}
