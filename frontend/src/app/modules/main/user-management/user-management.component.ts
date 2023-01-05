import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { fadeIn } from 'src/app/animations/animations';
import { UserManagementService } from 'src/app/services/user-management.service';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
  animations: [fadeIn],
})
export class UserManagementComponent implements OnInit {
  userForm: FormGroup;
  selectedUser: any;
  pagination = {
    start: 0,
    end: 10,
    currentPage: 1,
    pages: [] as any[],
    totalLength: 0,
    itemsPerPage: 10,
  };
  users: any[];
  viewMode = false;

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private title: Title,
    private spinner: NgxSpinnerService,
    private userManagementService: UserManagementService
  ) {
    this.title.setTitle('User Management');
  }

  userModal: Modal;
  @ViewChild('userModalRef') userModalRef: ElementRef;

  openModal(viewMode = false) {
    this.viewMode = viewMode;
    this.userModal = new Modal(this.userModalRef.nativeElement, {});
    this.userModal.show();
  }

  ngOnInit(): void {
    this.createUserForm();
    this.getAllUsers();
  }

  getAllUsers() {
    this.spinner.show();
    this.userManagementService.getUserManagement().subscribe(
      (res) => {
        this.spinner.hide();
        this.users = res.data;
        this.pagination.totalLength = this.users?.length;
        this.onEntriesChange();
      },
      (err) => {
        this.spinner.hide();
        console.error(err);
      }
    );
  }

  addUser(): void {
    this.selectedUser = null;
    this.userForm.reset();
    this.userForm.patchValue({ accessType: 'read', functionalityAccess: '' });
    this.userForm.enable();
    this.openModal();
  }

  onView(user: any): void {
    this.selectedUser = user;
    this.userForm.patchValue(user);
    this.userForm.disable();
    this.openModal(true);
  }

  onEdit(user: any): void {
    this.selectedUser = user;
    this.userForm.enable();
    this.userForm.patchValue(user);
    this.userForm.controls.email.disable();
    this.openModal();
  }

  onDelete(user: any) {
    Swal.fire({
      title: 'Are you sure you want to delete this user?',
      confirmButtonColor: '#0079E6',
      cancelButtonColor: '#ff4747',
      showCancelButton: true,
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.userManagementService.deleteUser(user.id).subscribe(
          (res) => {
            this.spinner.hide();
            this.toast.success('Successfully Deleted User!');
            this.getAllUsers();
          },
          (err) => {
            this.spinner.hide();
            this.toast.error('Something went wrong!');
            console.error(err);
          }
        );
      }
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.spinner.show();
      this.userManagementService.createUser(this.userForm.value).subscribe(
        (res) => {
          this.spinner.hide();
          this.toast.success('Successfully Created User!');
          this.getAllUsers();
          this.userModal.hide();
        },
        (err) => {
          this.spinner.hide();
          this.toast.error('Something went wrong!');
          console.error(err);
        }
      );
    }
    this.userForm.markAsTouched();
  }

  onEditSaveSubmit() {
    if (this.userForm.valid) {
      this.spinner.show();
      this.userManagementService
        .updateUser(this.selectedUser.id, this.userForm.value)
        .subscribe(
          (res) => {
            this.spinner.hide();
            this.toast.success('Successfully Created User!');
            this.getAllUsers();
            this.userModal.hide();
          },
          (err) => {
            this.spinner.hide();
            console.error(err);
          }
        );
    }
  }

  changeStatus(user: any) {
    this.spinner.show();
    this.userManagementService
      .updateUserStatus(
        user.id,
        user.status === 'active' ? 'inactive' : 'active',
        user
      )
      .subscribe(
        (res) => {
          this.spinner.hide();
          this.toast.success(
            `Successfully ${
              user.status === 'active' ? 'deactivated' : 'activated'
            } user`
          );
          this.getAllUsers();
        },
        (err) => {
          this.spinner.hide();
          this.toast.error('Something went wrong!');
          console.error(err);
        }
      );
  }

  // FORM RELATED FUNCTIONS
  createUserForm(user: any = {}): void {
    this.userForm = this.fb.group({
      firstName: [user?.firstName || '', Validators.required],
      lastName: [user?.lastName || '', Validators.required],
      email: [
        user?.email || '',
        [
          Validators.required,
          Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
        ],
      ],
      businessName: [user?.businessName || '', Validators.required],
      accessType: [user?.accessType || 'read', Validators.required],
      functionalityAccess: [
        user?.functionalityAccess || '',
        Validators.required,
      ],
      isAdmin: [false],
    });
  }

  // PAGINATION RELATED FUNCTIONS
  onSelectPage(page: number) {
    this.pagination.currentPage = page;
    this.pagination.start = (page - 1) * this.pagination.itemsPerPage;
    this.pagination.end = this.pagination.start + this.pagination.itemsPerPage;
  }

  onEntriesChange() {
    this.onSelectPage(1);
    this.pagination.pages = new Array(
      Math.ceil(this.pagination.totalLength / this.pagination.itemsPerPage)
    );
  }
}
