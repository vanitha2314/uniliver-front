import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportsService } from 'src/app/services/reports.service';
import { MainService } from 'src/app/services/main.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-pivot-result',
  templateUrl: './pivot-result.component.html',
  styleUrls: ['./pivot-result.component.scss'],
})
export class PivotResultComponent implements OnInit {
  data: any;
  alphabet: any;
  rowdata = [];
  userData = null;
  offset = 0;
  limit = 100;
  column_name: any;
  totalPage: number;
  currentPage: number = 0;
  tableName: any;
  constructor(
    public routeActivate: ActivatedRoute,
    public route: Router,
    public reportService: ReportsService,
    public spinner: NgxSpinnerService,
    public mainservice: MainService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.userData = this.authService.getUserDetails().givenName;
    this.routeActivate.queryParams.subscribe((res) => {
      this.data = res;
      // this.column_name = Object.keys(this.rowdata[0]);
      // console.log(Object.values(this.rowdata[0]));
      this.tableName = res.name;
      if (this.tableName !== undefined) {
        this.getPivotresult(this.offset, this.limit);
      }
    });

    // const alpha = Array.from(Array(26)).map((e, i) => i + 65);
    // this.alphabet = alpha.map((x) => String.fromCharCode(x));
    // console.log(this.alphabet);
  }
  back() {
    this.route.navigate(['/mypivot']);
  }
  getvalue(i: any) {
    return Object.values(i);
  }
  // 'pivottables/RRSupplyPlanningFinal.csv'
  getPivotresult(offset: number, limit: number) {
    this.spinner.show();
    this.reportService
      .getPivotRequestDeatils(
        this.userData + '/' + this.tableName,
        offset,
        limit
      )
      .subscribe(
        (res: any) => {
          this.spinner.hide();
          if (res.status === 200) {
            this.dataModification(res.data);
            //  this.rowdata =  res.data;
            this.totalPage = res.totalPage;
            this.currentPage = offset;
            // this.column_name = this.rowdata[0];
            // this.rowdata.splice(0, 1);
            // this.column_name = Object.keys(this.rowdata[0]);
            // console.log(Object.values(this.rowdata[0]));
          }
        },
        (error) => {
          console.log('getPivotResult Error', error);
          this.spinner.hide();
          this.mainservice.openDialog(
            'Your pivot table creation is still In-progress. Please check back after a while'
          );

          this.back();
        }
      );
  }
  // onLimitChange(){

  // }
  onSelectPage(offset: number) {
    this.getPivotresult(offset, this.limit);
  }

  dataModification(res: any) {
    let headingIndex: Array<any> = [];
    res[0].forEach((el: any, index: number) => {
      if (el === '') {
        headingIndex.push(index);
      }
    });
    this.rowdata = res;
    this.column_name = this.rowdata[0];
    this.column_name.splice(headingIndex[0], headingIndex.length);
    this.rowdata.splice(0, 1);

    if (headingIndex.length > 0) {
      this.rowdata.forEach((el: Array<any>) => {
        el.splice(headingIndex[0], headingIndex.length);
      });
    }
  }
}
