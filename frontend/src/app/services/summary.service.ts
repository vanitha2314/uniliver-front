import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {

  constructor(private httpService: HttpService) {}
  getSummaryList(id:any,role:any): Observable<any> {
    return this.httpService.get<any>(`/summary/${id}/${role}`)
  }
}
