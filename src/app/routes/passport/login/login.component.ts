import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { StartupService } from '@core';
import { DA_SERVICE_TOKEN, ITokenModel, ITokenService, SocialService } from '@delon/auth';
import { SettingsService } from '@delon/theme';
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
    public http: HttpClient,
    private settingsService: SettingsService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private startupSrv: StartupService,
  ) {
  }

  ngOnInit(): void {
  }

  submit(): void {
    this.http
      .post('/auth_admin/sign_in?_allow_anonymous=true', {
        email: this.form.value.email,
        password: this.form.value.password,
      }, { observe: 'response' })
      .subscribe((res: HttpResponse<any>) => {
        const credentials = JSON.stringify({
          accessToken: res.headers.get('access-token') || '',
          tokenType: res.headers.get('token-type') || '',
          expiry: res.headers.get('expiry') || '',
          client: res.headers.get('client') || '',
          uid: res.headers.get('uid') || '',
        });

        const token: ITokenModel = {
          token: credentials,
          // expired: +new Date() + 1000 * 60 * 5
          expired: parseInt(res.headers.get('expiry') || '0', 10) * 1000,
        };
        this.tokenService.set(token);

        // Get the StartupService content, we always believe that the application information will generally be affected by the scope of authorization of the current user
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
