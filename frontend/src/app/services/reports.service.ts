import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  public pivotFileData= {} as {containerName:string,filePath:string};
  public onPivotFileDataChange$ = new BehaviorSubject<{containerName:string,filePath:string}>(this.pivotFileData);
  constructor(private httpService: HttpService) {}

  getTableList(): Observable<any> {
    return this.httpService.get<any>('/sql/tables');
  }
  dataSourceList(id : number) : Observable<any>{
    console.log('getUserReports called', id);
    return this.httpService.get<any>(`/datasource/list/${id}`);
  }
  getSQLQueryData(data: any): Observable<any> {
    return this.httpService.post<any>('/sql/getData', data);
  }

  createReport(data: any): Observable<any> {
    return this.httpService.post<any>('/reports', data);
  }

  getUserReports(id: any, tab: string): Observable<any> {
    // console.log('getUserReports called', id, tab);
    return this.httpService.get<any>(`/reports/${id}/${tab}`);
  }
  deletePermanentlyUserReports(id: any): Observable<any> {
    return this.httpService.delete<any>(`/reports/deletePermanently/${id}`);
  }

  deleteUserReports(id: any): Observable<any> {
    return this.httpService.delete<any>(`/reports/${id}`);
  }
  deletePivot(data:any):Observable<any>{
    return this.httpService.post<any>(`/adls/deletePivot`,data)
  }

  restoreUserReports(userId: any, reportId: any): Observable<any> {
    return this.httpService.put<any>(
      `/reports/restore/${userId}/${reportId}`,
      {}
    );
  }
  scheduleReport(userId: any, reportId: string, data: any): Observable<any> {
    return this.httpService.post<any>(
      `/reports/schedule/${userId}/${reportId}`,
      data
    );
  }

  getAllUsers(id: any): Observable<any> {
    return this.httpService.get<any>(`/reports/users/${id}`);
  }

  shareReport(id: any, data: any): Observable<any> {
    return this.httpService.post<any>(`/reports/share/${id}`, data);
  }
  sharePivot(data:any):Observable<any>{
    return this.httpService.post<any>( `/adls/sharePivot`,data)
  }

  getReportById(id: any): Observable<any> {
    return this.httpService.get<any>(`/reports/${id}`);
  }

  updateReport(userId: string, reportId: string, data: any): Observable<any> {
    return this.httpService.put<any>(`/reports/${userId}/${reportId}`, data);
  }
  getChartData(source: string, data: any): Observable<any> {
    return this.httpService.post<any>(`/sql/getReportData/${source}`, data);
  }
  getAdlsContainerList(data:any): Observable<any> {
    return this.httpService.post<any>('/adls/containers/list',data);
  }
  getAdlsData(container: string, data: any): Observable<any> {
    return this.httpService.post<any>(`/adls/getData/${container}`, data);
  }
  uploadFiles(userId: string, data: any): Observable<any> {
    return this.httpService.post<any>(`/adls/uploadFile/${userId}`, data);
  }
  downloadAdlsFile(container: any, data: any): Promise<any> {
    return this.httpService.post<any>(`/adls/downloadFile/${container}`, data,{responseType:'text'})
    .toPromise();
  }
  getPivotData(userId: any, data: any): Observable<any> {
    return this.httpService.post<any>(`/adls/createPivotRequest/${userId}`, data);
  }
  savePivotData(userId: any,userName:string, data: any): Observable<any> {
    return this.httpService.post<any>(`/adls/savePivot/${userId}/${userName}`, data);
  }
savePivotDataInSql(body: any){
  return this.httpService.post<any>(`/sql/saveSqlPiovt`, body);
}

  createAdlsPivotFilter(data:any): Observable<any> {
    return this.httpService.post<any>(`/adls/pivotFilter`,data);
// let url =  `localhost:3000/adls/pivotFilter`;
    // return this.httpService.customPost<any>(url, data);
  }
  createSqlPivotFilter(data:any):Observable<any>{
    return this.httpService.post<any>(`/sql/pivotFilter`,data)
  }
  createSqlPivot(userId: any, data: any): Observable<any> {
    return this.httpService.post<any>(`/sql/createPivot/${userId}`, data);
  }
  getPivotRequestList(userId: any ){
    return this.httpService.get<any>(`/adls/myPivotRequests/${userId}`);
  }

  getPivotRequestDeatils(name: any, offset: number, limit: number){
    // return this.httpService.get(`/adls/myPivotResult?offset=${offset}&limit=${limit}`);
    // return this.httpService.get(`/adls/pivotResult?TableName=${id}&offset=${offset}&limit=${limit}`);
    return this.httpService.get(`/adls/myPivotResult?offset=${offset}&limit=${limit}&fileName=${name}  `);

  }
  deletePivotTable(id: any){
    return this.httpService.get(`/sql/deletePivotTable?id=${id}`);
  }
  updatePivotTable(res : any){
return this.httpService.patch(`/adls/updatePivotTable`, res);
  }

}
