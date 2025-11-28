import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { NgIf } from '@angular/common';
import { SendOtpRequest, SetPasswordRequest } from '../../Shared/Models/company.model';

@Component({
  selector: 'app-setpassword',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './setpassword.component.html',
  styleUrl: './setpassword.component.css'
})
export class SetpasswordComponent {
  isLoading = false;
  msgError = '';
  success = '';
  otpCode = '';
  currentLang: 'en' | 'ar' = 'en';

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  passwordValidator = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';
    if (!value) return null;

    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasDigit = /\d/.test(value);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
    const englishOnly = /^[ -~]+$/.test(value);

    const valid = value.length >= 8 &&
                  value.length <= 16 &&
                  hasUppercase &&
                  hasLowercase &&
                  hasDigit &&
                  hasSpecial &&
                  englishOnly;

    return valid ? null : { password: true }; 
  };

  passwordsMatch = (group: AbstractControl): ValidationErrors | null => {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  };

  setPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    otp: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16),
      this.passwordValidator   
    ]),
    confirmPassword: new FormControl('', [Validators.required])
  }, { validators: this.passwordsMatch });

  ngOnInit(): void {
    this.otpCode = this.activatedRoute.snapshot.queryParamMap.get('otpCode') || '';
    if (this.otpCode) {
      this.setPasswordForm.patchValue({ otp: this.otpCode });
    }
    console.log(this.otpCode)
  }

  private translateErrorMessage(errorMessage: string): string {
    const errorTranslations: { [key: string]: { en: string; ar: string } } = {
      'Invalid Email or expired OTP.': {
        en: 'Invalid Email or expired OTP.',
        ar: 'البريد الإلكتروني غير صالح أو انتهت صلاحية الرمز.'
      },
      'Email not found': {
        en: 'Email not found',
        ar: 'البريد الإلكتروني غير موجود'
      },
      'User not found': {
        en: 'User not found',
        ar: 'المستخدم غير موجود'
      },
      'OTP is invalid': {
        en: 'OTP is invalid',
        ar: 'الرمز غير صالح'
      },
      'OTP has expired': {
        en: 'OTP has expired',
        ar: 'انتهت صلاحية الرمز'
      },
      'Password does not meet requirements': {
        en: 'Password does not meet requirements',
        ar: 'كلمة المرور لا تستوفي المتطلبات'
      },
      'Passwords do not match': {
        en: 'Passwords do not match',
        ar: 'كلمات المرور غير متطابقة'
      },
      'Network error': {
        en: 'Network error - please check your connection',
        ar: 'خطأ في الشبكة - يرجى التحقق من الاتصال'
      },
      'Server error': {
        en: 'Server error - please try again later',
        ar: 'خطأ في الخادم - يرجى المحاولة لاحقاً'
      },
      'Bad request': {
        en: 'Invalid request data',
        ar: 'بيانات الطلب غير صالحة'
      },
      'Unauthorized': {
        en: 'Unauthorized access',
        ar: 'وصول غير مصرح'
      }
    };

    const translation = errorTranslations[errorMessage];
    if (translation) {
      return translation[this.currentLang];
    }

    return errorMessage;
  }

  async submitForm() {
    this.setPasswordForm.markAllAsTouched();

    if (this.setPasswordForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.msgError = '';
    this.success = '';

    try {
      const payload: SetPasswordRequest = {
        email: this.setPasswordForm.get('email')?.value?.trim() || "",
        otp: this.setPasswordForm.get('otp')?.value?.trim() || "",
        password: this.setPasswordForm.get('password')?.value || "",
        confirmPassword: this.setPasswordForm.get('confirmPassword')?.value || ""
      };

      console.log("Sending to API:", payload);

      const res: any = await this.authService.setPassword(payload).toPromise();

      this.success = this.labels[this.currentLang].success;
      setTimeout(() => this.router.navigate(['/login']), 1500);

    } catch (err: any) {
      console.log('API Error:', err);

      this.msgError = '';

      // استخراج الرسالة الأصلية من الخطأ
      let originalMessage = '';
      
      if (err.error?.message) {
        originalMessage = err.error.message;
      }
      else if (err.error?.errors && Array.isArray(err.error.errors)) {
        originalMessage = err.error.errors.join(' | ');
      }
      else if (err.error?.errorMessage) {
        originalMessage = err.error.errorMessage;
      }
      else if (err.error?.title) {
        originalMessage = err.error.title;
      }
      else if (err.message) {
        originalMessage = err.message;
      }
      else {
        originalMessage = 'An error occurred';
      }

      // ترجمة الرسالة
      this.msgError = this.translateErrorMessage(originalMessage);

    } finally {
      this.isLoading = false;
    }
  }

  // دالة إعادة إرسال OTP
  async resendOTP() {
    const email = this.setPasswordForm.get('email')?.value?.trim();
    
    if (!email) {
      this.msgError = this.currentLang === 'en' 
        ? 'Email is required to resend OTP' 
        : 'البريد الإلكتروني مطلوب لإعادة إرسال الرمز';
      return;
    }

    this.isLoading = true;
    this.msgError = '';

    try {
      const otpRequest: SendOtpRequest = {
      email: email}
      await this.authService.resendOtp(otpRequest).toPromise();
      
      const successMsg = this.currentLang === 'en' 
        ? 'OTP sent successfully' 
        : 'تم إرسال الرمز بنجاح';
      this.success = successMsg;
      
      setTimeout(() => {
        this.success = '';
      }, 3000);

    } catch (err: any) {
      console.log('Resend OTP error:', err);
      
      let errorMsg = '';
      if (err?.error?.message) {
        errorMsg = this.translateErrorMessage(err.error.message);
      } else {
        errorMsg = this.currentLang === 'en' 
          ? 'Failed to resend OTP' 
          : 'فشل إعادة إرسال الرمز';
      }
      this.msgError = errorMsg;
    } finally {
      this.isLoading = false;
    }
  }

  toggleLanguage() {
    this.currentLang = this.currentLang === 'en' ? 'ar' : 'en';
    this.msgError = '';
    this.success = '';
  }

  labels = {
    en: {
      title: 'Set Password',
      email: 'Email Address',
      emailRequired: 'Email is required',
      emailInvalid: 'Enter a valid email',
      newPassword: 'New Password',
      enterNewPassword: 'Enter new password',
      passwordRequired: 'Password is required',
      validPassword: 'Password should be 8-16 chars, contain uppercase, lowercase, digit, special char, and English only.',
      confirmPassword: 'Confirm Password',
      confirm: 'Confirm your password',
      confirmPasswordRequired: 'Confirm password is required',
      matchPassword: 'Passwords do not match',
      submit: 'Submit',
      submiting: 'Submitting...',
      success: 'Password updated successfully!',
      msgError: "An error occurred",
      resendOTP: 'Resend OTP Code',
      processing: 'Processing...'
    },
    ar: {
      title: 'تعيين كلمة المرور',
      email: 'البريد الإلكتروني',
      emailRequired: 'البريد الإلكتروني مطلوب',
      emailInvalid: 'أدخل بريد إلكتروني صحيح',
      newPassword: 'كلمة المرور الجديدة',
      enterNewPassword: 'أدخل كلمة المرور الجديدة',
      passwordRequired: 'كلمة المرور مطلوبة',
      validPassword: 'كلمة المرور يجب أن تكون 8-16 حرف، تحتوي على حرف كبير وصغير ورقم ورمز خاص، وباللغة الإنجليزية فقط.',
      confirmPassword: 'تأكيد كلمة المرور',
      confirm: 'أكد كلمة المرور',
      confirmPasswordRequired: 'تأكيد كلمة المرور مطلوب',
      matchPassword: 'كلمات المرور غير متطابقة',
      submit: 'إرسال',
      submiting: 'جاري الإرسال...',
      success: 'تم تحديث كلمة المرور بنجاح!',
      msgError: 'حدث خطأ',
      resendOTP: 'إعادة إرسال الرمز',
      processing: 'جاري المعالجة...'
    }
  };
}