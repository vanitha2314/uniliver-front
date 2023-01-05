import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { SideNavComponent } from './layout/side-nav/side-nav.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { HomeComponent } from 'src/app/modules/main/home/home.component';
import { MyPivotTableComponent } from './my-pivot-table/my-pivot-table.component';
import { PivotResultComponent } from './pivot-result/pivot-result.component';
@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    SideNavComponent,
    HomeComponent,
    MyPivotTableComponent,
    PivotResultComponent
  ],
  imports: [CommonModule, MainRoutingModule, SharedModule,],

})
export class MainModule {}
