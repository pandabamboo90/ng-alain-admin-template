import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { StartupService } from '@core';
import { DA_SERVICE_TOKEN, ITokenService, SocialService } from '@delon/auth';
import { _HttpClient, SettingsService } from '@delon/theme';
import { FormlyFieldConfig } from '@ngx-formly/core/lib/components/formly.field.config';

@Component({
  selector: 'passport-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  providers: [SocialService],
})
export class UserLoginComponent implements OnInit {

  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [
    // Email
    {
      key: 'email',
      type: 'input',
      templateOptions: {
        type: 'text',
        label: 'Email',
        placeholder: 'Email',
        required: true,
      },
    },
    // Password
    {
      key: 'password',
      type: 'input',
      templateOptions: {
        type: 'password',
        label: 'Password',
        required: true,
      },
    },
  ];

  constructor(
    fb: FormBuilder,
    private router: Router,
    public http: _HttpClient,
    private settingsService: SettingsService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private startupSrv: StartupService,
  ) {
  }

  ngOnInit(): void {}

  submit(): void {
    this.http
      .post('/login/account?_allow_anonymous=true', {
        userName: this.form.value.email,
        password: this.form.value.password,
      })
      .subscribe((res) => {
        this.tokenService.set(res.user);
        this.startupSrv.load().then(() => {
          let url = this.tokenService.referrer!.url || '/';
          if (url.includes('/passport')) {
            url = '/';
          }
          this.router.navigateByUrl(url);
        });
      });
  }
}
