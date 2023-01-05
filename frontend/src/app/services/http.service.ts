import { HttpClient, HttpEvent, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class HttpService {
  private apiBaseUrl: string;
  // apiBaseUrl1: string;

  constructor(private http: HttpClient) {
    this.apiBaseUrl = environment.apiUrl;
    //this.apiBaseUrl1 = environment.apiUrl1;

    // this.apiBaseUrl = "http://localhost:3000"
  }

  get<T>(url: string, httpParams?: HttpParams): Observable<T> {
    if (httpParams != null) {
      return this.http.get<T>(this.apiBaseUrl + url, { params: httpParams });
    } else {
      return this.http.get<T>(this.apiBaseUrl + url);
    }
  }
  // gets<T>(url: string, httpParams?: HttpParams): Observable<T> {
  //   if (httpParams != null) {
  //     return this.http.get<T>(this.apiBaseUrl1 + url, { params: httpParams });
  //   } else {
  //     return this.http.get<T>(this.apiBaseUrl1 + url);
  //   }
  // }
// customPost<T>(url: string, data:T, httpOptions?: any):Observable<any>{
//   return this.http.post<T> (url , data, httpOptions);
// }

  post<T>(url: string, data: T, httpOptions?: any): Observable<any> {
    return this.http.post<T>(this.apiBaseUrl + url, data, httpOptions);
    // return this.http.post<T>(this.apiBaseUrl + url, data, httpOptions);
  }
// posts<T>(url: string, data: T, httpOptions?: any): Observable<any> {
//     return this.http.post<T>(this.apiBaseUrl1 + url, data, httpOptions);
//     // return this.http.post<T>(this.apiBaseUrl + url, data, httpOptions);
//   }
  postVoid<T>(url: string, data: T): Observable<void> {
    return this.http.post<void>(this.apiBaseUrl + url, data);
  }

  put<T>(url: string, data: any): Observable<T> {
    return this.http.put<T>(this.apiBaseUrl + url, data);
  }

  patch<T>(url: string, data: any): Observable<T> {
    return this.http.patch<T>(this.apiBaseUrl + url, data);
  }

  delete<T>(url: string, httpParams?: HttpParams): Observable<T> {
    if (httpParams != null) {
      return this.http.delete<T>(this.apiBaseUrl + url, { params: httpParams });
    } else {
      return this.http.delete<T>(this.apiBaseUrl + url);
    }
  }
}
