import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  constructor(private httpService: HttpService) {}

  createUser(user: any): Observable<any> {
    return this.httpService.post<any>('/userManagement/create', user);
  }

  updateUser(id: any, user: any): Observable<any> {
    return this.httpService.put<any>('/userManagement/update/' + id, user);
  }

  updateUserStatus(id: any, status: any, user: any): Observable<any> {
    return this.httpService.put<any>(
      `/userManagement/status/${id}/${status}`,
      user
    );
  }

  deleteUser(id: any): Observable<any> {
    return this.httpService.delete<any>('/userManagement/delete/' + id);
  }

  getUserManagement(): Observable<any> {
    return this.httpService.get<any>('/userManagement');
  }

  forgotPassword(data: any): Observable<any> {
    return this.httpService.post<any>('/userManagement/forgotPassword', data);
  }

  resetPassword(id: any, data: any): Observable<any> {
    return this.httpService.post<any>(
      `/userManagement/resetPassword/${id}`,
      data
    );
  }
}
