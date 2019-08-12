import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { AuthService } from 'ng2-ui-auth';
import { Router } from '@angular/router';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.qa';
import { map } from 'rxjs/operators';

export enum LanguageType {
  English = 'en',
  Arabic = 'ar',
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  public showInvalidCredentialsError = false;
  public showLoginFormError = false;
  public enterResponse: boolean = false;
  public showCPEmail: boolean = true;
  public fpForm: FormGroup;
  public OTPForm: FormGroup;
  public cpForm: FormGroup;
  public showOTPError: Boolean = false;
  public showOTPFormError: Boolean = false;
  public resetPasswordForm: FormGroup;
  public otpId: String;
  public currentLanguage: LanguageType;
  public showPasswordChange: Boolean = false;
  public showRequestError: Boolean = false;
  public otpExpired: Boolean = false;
  public isPasswordResetSent: boolean = false;

  constructor(private http: HttpClient, private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.fpForm = fb.group(
      {
        email: ['', Validators.compose([Validators.required, Validators.email])]
      });

    this.cpForm = fb.group({
      password: ['', Validators.compose([Validators.required, this.passwordMatcher.bind(this)])],
      confirmPassword: ['', Validators.compose([Validators.required, this.passwordMatcher.bind(this)])]
    });

    this.OTPForm = fb.group(
      {
        otp1: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]{1}')])],
        otp2: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]{1}')])],
        otp3: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]{1}')])],
        otp4: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]{1}')])],
        otp5: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]{1}')])],
        otp6: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]{1}')])]
      }
    );

    this.OTPForm.valueChanges.subscribe((val) => {
      this.showOTPError = false;
      this.showOTPFormError = false;
    });
  }

  ngOnInit(): void { }

  public proceedToNextOTPField(event): void {
    if (event.target.value.length > 1) {
      event.preventDefault();
    }
    const nextSibling = event.srcElement.nextElementSibling;
    if (nextSibling) {
      nextSibling.focus();
    }
  }

  public requestOTP(): void {
    if (this.fpForm.valid) {
      const request: any = {
        data: {
          type: 'otps',
          attributes: {
            email: this.fpForm.get('email').value
          }
        }
      };

      let headers = new HttpHeaders();
      headers = headers.append('Accept-Language', LanguageType.English);
      this.http.post<any>(`${environment.baseUrl}/users/password`, request, { headers: headers }).pipe(map(x => x['data'])).subscribe(
        (result: any) => {
          this.otpId = result.id;
          this.showCPEmail = false;
          this.isPasswordResetSent = true;
          this.showRequestError = false;
        }, () => {
          this.showRequestError = true;
        }
      );
    } else {
      this.fpForm.get('email').markAsTouched();
      this.fpForm.get('email').markAsDirty();
    }
  }

  private passwordMatcher(control: FormControl): { [s: string]: boolean } {
    if (
      this.cpForm &&
      (control.value !== this.cpForm.controls.password.value)
    ) {
      return { passwordNotMatch: true };
    }
    return null;
  }

  public token: string;
  public userId: number | string;
  public onPasswordChange(): void {
    const passwordReset: any = {
      data: {
        attributes: {
          'user-id': this.userId,
          'new-password': this.cpForm.get('password').value,
          'token': this.token
        },
        type: 'otps'
      }
    };
    this.http.patch(`${environment.baseUrl}/users/password`, passwordReset).subscribe((result: any) => {
      this.router.navigateByUrl('auth/login');
    }, (error) => { });
  }

  public verifyOTP(): void {
    if (this.OTPForm.valid) {
      let otp = '';
      otp += this.OTPForm.get('otp1').value;
      otp += this.OTPForm.get('otp2').value;
      otp += this.OTPForm.get('otp3').value;
      otp += this.OTPForm.get('otp4').value;
      otp += this.OTPForm.get('otp5').value;
      otp += this.OTPForm.get('otp6').value;
      const verifyOTP = {
        data: {
          attributes: {
            email: this.fpForm.get('email').value,
            pin: otp
          },
          type: 'otps',
          id: this.otpId
        }
      };

      let headers = new HttpHeaders();
      headers = headers.append('Accept-Language', 'en');

      this.http.put(`${environment.baseUrl}/users/password/`, verifyOTP, { headers: headers }).pipe(map(x => x['data'])).subscribe(
        (result: any) => {
          if (result) {
            this.token = result.attributes.token;
            this.userId = result.attributes['user-id'];

            this.showPasswordChange = true;
            this.showOTPError = false;
            this.showOTPFormError = false;
            this.otpExpired = false;
            this.showCPEmail = false;

          }
        },
        (error) => {
          this.showOTPError = true;
          this.otpExpired = false;
          this.showPasswordChange = false;
        });
    } else {
      this.showOTPFormError = true;
      this.otpExpired = false;
      this.showOTPError = false;
    }
  }
}
