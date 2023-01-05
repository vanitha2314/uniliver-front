import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class SavedQueryService {
  constructor(private httpService: HttpService) {}

  createSavedQuery(userId: string | number, data: any) {
    return this.httpService.post<any>(`/sql/saveQuery/${userId}`, data);
  }

  getAllSavedQueries(userId: string | number,tab:string) {
    return this.httpService.get<any>(`/sql/getQuery/${userId}/${tab}`);
  }

  getSavedQueriesById(id: string | number, userId: string | number) {
    return this.httpService.get<any>(`/sql/getQuery/${userId}?id=${id}`);
  }

  getAllUsers(id: any): Observable<any> {
    return this.httpService.get<any>(`/reports/users/${id}`);
  }

  shareQuery(id: any, data: any): Observable<any> {
    return this.httpService.post<any>(`/sql/shareQuery/${id}`, data);
  }
}
