import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { STChange, STColumn, STComponent, STData } from '@delon/abc/st';
import { _HttpClient } from '@delon/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IResponseMeta } from '@shared';

@UntilDestroy()
@Component({
  selector: 'app-admin-admin-list',
  templateUrl: './admin-list.component.html',
})
export class AdminAdminListComponent implements OnInit {

  loading = false;
  data: STData[] = [];
  meta: IResponseMeta = {
    total: 0,
    per_page: 10, // page size
    page: 1, // page index
  };

  @ViewChild('st') private readonly st!: STComponent;
  columns: STColumn[] = [
    { title: '#', index: 'id' },
    { title: '名前', index: 'first_name' },
    { title: '苗字', index: 'last_name' },
    { title: '有効', index: 'status' },
    { title: 'メール', index: 'email' },
    { title: '組織', index: 'tenant_name' },
    { title: '役割', index: 'role' },
    {
      title: '',
      buttons: [
        {
          text: '編集',
          icon: 'edit',
          click: (item: any) => {
            this.router.navigateByUrl(`/admin/${item.id}/edit`);
          },
        },
        {
          text: '削除',
          className: 'text-red',
          icon: 'delete',
          type: 'del',
          pop: {
            title: 'Are you sure ?',
            okType: 'danger',
            icon: 'check-circle',
          },
          click: (record, _modal, comp) => {
            comp!.removeRow(record);
          },
        },
      ],
    },
  ];

  constructor(private http: _HttpClient,
              private router: Router) {
  }

  ngOnInit(): void {
    this.fetchAdminList();
  }

  add(): void {
    // this.modal
    //   .createStatic(FormEditComponent, { i: { id: 0 } })
    //   .subscribe(() => this.st.reload());
  }

  fetchAdminList(): void {
    this.loading = true;
    this.http.get('/admins', {
        'page[size]': this.meta.per_page,
        'page[number]': this.meta.page,
      })
      .pipe(untilDestroyed(this))
      .subscribe((res) => {
        this.data = res.data;
        this.meta = res.meta;
        this.loading = false;
      });
  }

  onPageChange(ev: STChange): void {
    if (ev.type === 'pi') {
      this.meta.page = ev.pi;
      this.fetchAdminList();
    }
  }
}
