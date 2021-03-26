import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SFComponent, SFSchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NzMessageService } from 'ng-zorro-antd/message';

@UntilDestroy()
@Component({
  selector: 'app-tenant-tenant-edit',
  templateUrl: './tenant-edit.component.html',
})
export class TenantTenantEditComponent implements OnInit {

  @ViewChild('sf', { static: false }) sf!: SFComponent;

  id!: number | string;
  title!: string;
  subTitle!: string;
  formData!: any;
  schema: SFSchema = {
    properties: {
      display_name: {
        title: 'Display Name',
        type: 'string',
      },
    },
    required: ['display_name'],
  };

  constructor(
    private msgSrv: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    public http: _HttpClient,
  ) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;

    if (this.id === 'new') {
      this.title = 'New Tenant';
      // this.http.get(`/user/${this.record.id}`).subscribe(res => (this.i = res));
    } else {
      this.title = `Edit Tenant`;
      this.subTitle = `ID: ${this.id}`;
      this.fetchTenantById(this.id);
    }
  }

  submit(value: any): void {
    if (this.id === 'new') {
      this.http.post(`/admin/tenants`, { data: value })
        .subscribe(res => {
          this.msgSrv.success('Created successfully !');
          this.router.navigateByUrl(`/tenant/list`);
        });
    } else {
      this.http.put(`/admin/tenants/${this.id}`, { data: value })
        .subscribe(res => {
          this.msgSrv.success('Updated successfully !');
          this.router.navigateByUrl(`/tenant/list`);
        });
    }
  }

  fetchTenantById(id: number | string): void {
    this.http.get(`/admin/tenants/${id}`)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.formData = res.data;
      });
  }
}
