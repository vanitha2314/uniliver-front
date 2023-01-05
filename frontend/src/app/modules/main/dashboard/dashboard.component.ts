import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { SavedQueryService } from 'src/app/services/saved-query.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  query: string;
  user: any;
  constructor(
    private title: Title,
    private authService: AuthService,
    private savedQueryService: SavedQueryService,
    private route: ActivatedRoute
  ) {
    this.user = this.authService.getUserDetails();
    this.title.setTitle('Dashboard');
    this.route.queryParams.subscribe((qParams) => {
      const query = qParams['query'];
      if (query && this.user?.id) {
        this.getQueryById(query);
      }
    });
  }

  getQueryById(id: any) {
    this.savedQueryService.getSavedQueriesById(id, this.user.id).subscribe(
      (res) => {
        if (res?.data?.length && res.data[0]?.query) {
          this.query = res.data[0].query;
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  ngOnInit() {}
}
