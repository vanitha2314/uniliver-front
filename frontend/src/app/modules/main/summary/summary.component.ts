import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SummaryService } from 'src/app/services/summary.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { MainService } from 'src/app/services/main.service';
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  summaryList:any
  summaryId: any;
  user: any;
  roles:any;
  userList:any;
  listUser:any;
  constructor(
    private title: Title,
    private summaryService: SummaryService,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private mainService: MainService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUserDetails();
    this.roles = JSON.parse(localStorage.getItem('id_data') as string);
    if (this.roles?.roles[0] === 'NA_UPI_D&A_All_Users') {
      this.roles="CD,SupplyChain";
    }
    this.getSummary();
  }

  getSummary() {
    if (this.user?.id) {
      this.spinner.show();
      this.summaryService.getSummaryList(this.user.id,this.roles).subscribe(
        (res) => {
          this.spinner.hide();
          if (res?.status === 200 && res?.data) {
            
            this.summaryList = (res.data)
            }
          
        },
        (err) => {
          this.spinner.hide();
          console.error(err);
        }
      );
    }
  }
}
