import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SFComponent, SFSchema, SFUISchemaItem } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NzMessageService } from 'ng-zorro-antd/message';

@UntilDestroy()
@Component({
  selector: 'app-ticket-ticket-edit',
  templateUrl: './ticket-edit.component.html',
})
export class TicketTicketEditComponent implements OnInit {

  @ViewChild('sf', { static: false }) sf!: SFComponent;

  id!: number | string;
  title!: string;
  subTitle!: string;
  formData!: any;
  schema: SFSchema = {
    properties: {
      first_name: {
        title: 'First name',
        type: 'string',
      },
      last_name: {
        title: 'Last name',
        type: 'string',
      },
      email: {
        type: 'string',
        title: 'Email',
        format: 'email',
      },
      password: {
        type: 'string',
        title: 'Password',
        ui: {
          type: 'password'
        }
      },
      country_code: {
        type: 'string',
        title: 'Country code',
      },
      cellphone: {
        type: 'string',
        title: 'Phone number',
      },
    },
    required: ['first_name', 'last_name', 'email', 'country_code', 'cellphone', 'password'],
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
    console.log('wtf');

    if (this.id === 'new') {
      this.title = 'New Ticket';
    } else {
      this.title = `Edit Ticket`;
      this.subTitle = `ID: ${this.id}`;
      this.fetchTicketById(this.id);
    }
  }

  submit(value: any): void {
    if (this.id === 'new') {
      this.http.post(`/admin/tickets`, { data: value })
        .subscribe(res => {
          this.msgSrv.success('Created successfully !');
          this.router.navigateByUrl(`/ticket/list`);
        });
    } else {
      this.http.put(`/admin/tickets/${this.id}`, { data: value })
        .subscribe(res => {
          this.msgSrv.success('Updated successfully !');
          this.router.navigateByUrl(`/ticket/list`);
        });
    }
  }

  fetchTicketById(id: number | string): void {
    this.http.get(`/admin/tickets/${id}`)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.formData = res.data;
        this.schema.properties!.email.readOnly = true;

        const passwordUi: SFUISchemaItem = this.schema.properties!.password.ui as SFUISchemaItem;
        passwordUi.hidden = true;
        this.sf.refreshSchema();
      });
  }
}
