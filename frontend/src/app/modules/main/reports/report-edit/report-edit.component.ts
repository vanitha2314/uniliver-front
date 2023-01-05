import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { fadeIn } from 'src/app/animations/animations';
import { ReportsService } from 'src/app/services/reports.service';
@Component({
  selector: 'app-report-edit',
  templateUrl: './report-edit.component.html',
  styleUrls: ['./report-edit.component.scss'],
  animations: [fadeIn],
})
export class ReportEditComponent implements OnInit {
  reportId: string;
  type: string;
  reportData: any;
  constructor(
    private title: Title,
    private route: ActivatedRoute,
    private reportService: ReportsService
  ) {
    this.title.setTitle('Reports');
    this.route.params.subscribe((params) => {
      this.reportId = params['id'];
      this.type = params['type'];
    });
  }
  ngOnInit() {}
}
