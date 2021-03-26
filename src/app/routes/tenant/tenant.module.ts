import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { TenantRoutingModule } from './tenant-routing.module';
import { TenantTenantListComponent } from './tenant-list/tenant-list.component';
import { TenantTenantEditComponent } from './tenant-edit/tenant-edit.component';

const COMPONENTS: Type<void>[] = [
  TenantTenantListComponent,
  TenantTenantEditComponent];

@NgModule({
  imports: [
    SharedModule,
    TenantRoutingModule
  ],
  declarations: COMPONENTS,
})
export class TenantModule { }
