import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit {
  expandMenu: any;
  user: any;
  menu: any[] = [];
  adminMenu:any[]= [];
  admin:any;
  userMenu:any[] =[];
  toggleClass : boolean = true;
  basePath = '';
  reportShown:boolean =false;

  // showMenu: string;
  isShown: boolean = false ;
  // @Output() collapsedEvent = new EventEmitter<boolean>();
  public isMenuCollapsed = true;
  constructor(private _router: Router, private authService: AuthService) {
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.basePath = this._router.url.split('/')[1];
        this.basePath = this.basePath.split('?')[0];
      }
    });
    this.user = authService.getUserDetails();
    // this.menu = [
    //   {
    //     menu: 'Home',
    //     path: '/',
    //     basePath: 'home',
    //     icon: 'fa-home',
    //     auth: true,
    //   },
    //   {
    //     menu: 'Create',
    //     // path: '/create report',
    //     // basePath: 'dashboard',
    //     icon: 'fa-pencil',
    //     auth: true,
    //     children:[
    //       {
    //         menu: 'Create Report',
    //         path: '/create report',
    //         basePath: 'dashboard',
    //         icon: 'fa-chart-bar',
    //         auth: true,
    //       },
    //     ]
    //   },
    //   {
    //     menu: 'Managed',
    //     // path: '/create report',
    //     // basePath: 'dashboard',
    //     icon: 'fa-table',
    //     auth: true,
    //     children:[
    //       {
    //         menu: 'Reports',
    //         path: '/reports',
    //         basePath: 'reports',
    //         icon: 'fa-chart-pie',
    //         auth: true,
    //       },
    //       {
    //         menu: 'SQL Queries',
    //         path: '/saved-queries',
    //         basePath: 'saved-queries',
    //         icon: 'fa-database',
    //         auth: true,
    //       },
    //       {
    //         menu: 'Uploaded Files',
    //         path: '/upload',
    //         basePath: 'upload',
    //         icon: 'fa-upload',
    //         auth:
    //           true ||
    //           (['write', 'read+write'].includes(this.user?.accessType)
    //             ? true
    //             : false),
    //       },
    //       {
    //         menu: 'User Management',
    //         path: '/user-management',
    //         basePath: 'user-management',
    //         icon: 'fa-users',
    //         auth: true || (this.user?.isAdmin ? true : false),
    //       },

    //     ]},

    //   {
    //     menu: 'Summary',
    //     path: '/summary',
    //     basePath: 'summary',
    //     icon: 'fa-clipboard',
    //     auth: true,
    //   },

    // ];
    this.adminMenu = [
      {
        menu: 'Home',
        path: '/',
        basePath: 'home',
        icon: 'fa-home',
        auth: true,
      },
      {
        menu: 'Create',
        // path: '/create report',
        // basePath: 'dashboard',
        icon: 'fa-pencil',
        auth: true,
        children:[
          {
            menu: 'Report',
            path: '/create report',
            basePath: 'dashboard',
            icon: 'fa-chart-bar',
            auth: true,
          },
        ]
      },
      {
        menu: 'Managed',
        // path: '/create report',
        // basePath: 'dashboard',
        icon: 'fa-table',
        auth: true,
        children:[
          {
            menu: 'Reports',
            path: '/reports',
            basePath: 'reports',
            icon: 'fa-chart-pie',
            auth: true,
          },
          {
            menu: 'SQL Queries',
            path: '/saved-queries',
            basePath: 'saved-queries',
            icon: 'fa-database',
            auth: true,
          },
          {
            menu: 'Uploaded Files',
            path: '/upload',
            basePath: 'upload',
            icon: 'fa-upload',
            auth:
              true ||
              (['write', 'read+write'].includes(this.user?.accessType)
                ? true
                : false),
          },
          {
            menu: 'User Management',
            path: '/user-management',
            basePath: 'user-management',
            icon: 'fa-users',
            auth: true || (this.user?.isAdmin ? true : false),
          },

        ]},

      {
        menu: 'Summary',
        path: '/summary',
        basePath: 'summary',
        icon: 'fa-clipboard',
        auth: true,
      },

    ];
    this.userMenu = [
      {
        menu: 'Home',
        path: '/',
        basePath: 'home',
        icon: 'fa-home',
        auth: true,
      },
      {
        menu: 'Create',
        // path: '/create report',
        // basePath: 'dashboard',
        icon: 'fa-pencil',
        auth: true,
        children:[
          {
            menu: 'Report',
            path: '/create report',
            basePath: 'dashboard',
            icon: 'fa-chart-bar',
            auth: true,
          },
        ]
      },
      {
        menu: 'Managed',
        // path: '/create report',
        // basePath: 'dashboard',
        icon: 'fa-table',
        auth: true,
        children:[
          {
            menu: 'Reports',
            path: '/reports',
            basePath: 'reports',
            icon: 'fa-chart-pie',
            auth: true,
          },
          {
            menu: 'SQL Queries',
            path: '/saved-queries',
            basePath: 'saved-queries',
            icon: 'fa-database',
            auth: true,
          },
          {
            menu: 'Uploaded Files',
            path: '/upload',
            basePath: 'upload',
            icon: 'fa-upload',
            auth:
              true ||
              (['write', 'read+write'].includes(this.user?.accessType)
                ? true
                : false),
          },
          {
            menu: 'My Pivot Table',
            path: '/mypivot',
            basePath: 'mypivottable',
            icon: 'fa-file-excel',
            auth: true
          }
        ]},
      {
        menu: 'Summary',
        path: '/summary',
        basePath: 'summary',
        icon: 'fa-clipboard',
        auth: true,
      },

    ];

    //Check user role and assign routes accordingly
    // if(this.user.user.role === 1){ //Admin
    //   this.menu = this.adminMenu;
    // } else if(this.user.role === 2){ //User
    //   this.menu = this.userMenu;
    // }
    if(this.user.role === 'admin'){
      this.menu=this.adminMenu;
    }else
      this.menu=this.userMenu
    }

  ngOnInit(): void {


  }


toggleShow(menu_:any) {
  // this.menu.forEach((menuItem)=>{
  //   console.log(menuItem.menu,"menu")
  if(menu_ ==='Managed'){
    this.isShown = !this.isShown
    console.log(this.isShown,"shown")
  }
  if(menu_ === 'Create')
    this.reportShown =!this.reportShown

  // })
}
}

