import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminAdminListComponent } from './admin-list/admin-list.component';

const COMPONENTS: Type<void>[] = [
  AdminAdminListComponent];

@NgModule({
  imports: [
    SharedModule,
    AdminRoutingModule
  ],
  declarations: COMPONENTS,
})
export class AdminModule { }
