import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Modal } from 'bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { fadeIn } from 'src/app/animations/animations';
import { AuthService } from 'src/app/services/auth.service';
import { SavedQueryService } from 'src/app/services/saved-query.service';
import { ReportsService } from 'src/app/services/reports.service';
import { ActivatedRoute,Router } from '@angular/router';
@Component({
  selector: 'app-saved-queries',
  templateUrl: './saved-queries.component.html',
  styleUrls: ['./saved-queries.component.scss'],
  animations: [fadeIn],
})
export class SavedQueriesComponent implements OnInit {
  queries: any[];
  user: any;
  users: any[] = [];
  shareForm: FormGroup;
  selectedQuery: any;
  type:any;
  tabs: any = [
      { key: 'savedByMe', value: 'Saved By Me' },
      { key: 'sharedWithMe', value: 'Shared With Me' },
  ];
  selectedTab: string = 'savedByMe';

  constructor(
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private router: Router,
    private toast: ToastrService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private savedQueryService: SavedQueryService
  ) {}

  shareModal: Modal;
  @ViewChild('shareModalRef') shareModalRef: ElementRef;

  ngOnInit(): void {
    this.user = this.authService.getUserDetails();
    this.getAllQueries();
    this.createShareForm();
    this.route.params.subscribe((params) => {
      this.selectedTab = params['tab'];
    });
  }
  getAllQueries() {
    if (this.user?.id && this.selectedTab) {
      this.spinner.show();
      this.savedQueryService.getAllSavedQueries(this.user.id,this.selectedTab).subscribe(
        (res) => {
          this.spinner.hide();
          if(res?.status === 200 && res.data?.length){
            this.queries=res.data;
          }
          // if (res?.data?.length) {
          //   this.queries = res.data;
          //   console.log(this.queries,"queriessssss")
          // }
        },
        (err) => {
          this.spinner.hide();
          console.error(err);
        }
      );
    }
  }

  copyToClipboard(query: string) {
    navigator.clipboard.writeText(query);
    this.toast.success('Query Copied to clipboard!');
  }

  getAllUser() {
    this.spinner.show();
    this.savedQueryService.getAllUsers(this.user?.id).subscribe(
      (res) => {
        this.spinner.hide();
        if (res?.status === 200 && res?.data) {
          this.users = res.data;
        }
      },
      (err) => {
        this.spinner.hide();
        console.error(err);
      }
    );
  }

  onShare(query: any) {
    this.selectedQuery = query;
    this.getAllUser();
    this.shareModal = new Modal(this.shareModalRef.nativeElement, {});
    this.shareModal.show();
    this.createShareForm();
    
  }

  onShareSubmit() {
    if (this.shareForm.valid) {
      const data = this.shareForm.value;
      this.spinner.show();
      this.savedQueryService.shareQuery(this.selectedQuery.id, data).subscribe(
        (res) => {
          this.spinner.hide();
          this.shareModal.hide();
          this.toast.success('Successfully Shared Query');
        },
        (err) => {
          this.spinner.hide();
          this.toast.error('Something went wrong');
        }
      );
    }
  }

  createShareForm() {
    this.shareForm = this.fb.group({
      users: [[], [Validators.required, Validators.maxLength]],
    });
  }
  onTabChange(tab: string) {
    if (this.selectedTab !== tab) {
      this.selectedTab = tab;
      this.router.navigate(['saved-queries', tab]);
      this.getAllQueries();
    }
}
}
