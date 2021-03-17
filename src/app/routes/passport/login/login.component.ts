import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SocialService } from '@delon/auth';
import { _HttpClient } from '@delon/theme';
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
  ) {
  }

  ngOnInit() {

  }

  submit(): void {
    // do something
  }
}
