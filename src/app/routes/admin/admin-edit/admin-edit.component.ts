import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SFComponent, SFSchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NzMessageService } from 'ng-zorro-antd/message';

@UntilDestroy()
@Component({
  selector: 'app-admin-admin-edit',
  templateUrl: './admin-edit.component.html',
})
export class AdminAdminEditComponent implements OnInit {

  @ViewChild('sf', { static: false }) sf!: SFComponent;

  id!: number | string;
  title!: string;
  subTitle!: string;
  formData!: any;
  schema: SFSchema = {
    properties: {
      first_name: {
        title: '名前',
        type: 'string',
      },
      last_name: {
        title: '苗字',
        type: 'string',
      },
      email: {
        type: 'string',
        title: 'メール',
        format: 'email',
      },
      mobile_phone: {
        type: 'string',
        title: 'Phone',
      },
      status: {
        type: 'boolean',
        title: '有効',
        default: 'true',
      },
      tenant_id: {
        type: 'string',
        title: '組織',
        enum: [
          { label: 'Tenant 1', value: '1' },
          { label: 'Tenant 2', value: '2' },
          { label: 'Tenant 3', value: '3' },
          { label: 'Tenant 4', value: '4' },
          { label: 'Tenant 5', value: '5' },
        ],
        default: '1',
      },
      role_id: {
        type: 'string',
        title: '役割',
        enum: [
          { label: 'CCP Admin', value: '1' },
          { label: 'Tenant Admin', value: '2' },
        ],
        default: '1',
      },
    },
    required: ['first_name', 'last_name', 'email'],
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
      this.title = 'New Admin';
      // this.http.get(`/user/${this.record.id}`).subscribe(res => (this.i = res));
    } else {
      this.title = `Edit Admin`;
      this.subTitle = `ID: ${this.id}`;
      this.fetchAdminById(this.id);
    }
  }

  submit(value: any): void {
    if (this.id === 'new') {
      this.http.post(`/admins`, value)
        .subscribe(res => {
          this.msgSrv.success('Success');
        });
    } else {
      this.http.put(`/admins/${this.id}`, value)
        .subscribe(res => {
          this.msgSrv.success('Success');
        });
    }
  }

  fetchAdminById(id: number | string): void {
    this.http.get(`/admins/${id}`)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.formData = res.data.attributes;
        console.log(this.formData);

        // this.http.get('/apps').subscribe(res => {
        //   this.schema.properties.app.enum = res;
        // this.sf.refreshSchema();
        // });
      });
  }
}
