import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-setpassword',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './setpassword.component.html',
  styleUrl: './setpassword.component.css'
})
export class SetpasswordComponent {
 isLoading: boolean = false;
  msgError: string = '';
  success: string = '';
  otpCode: string = "";
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute) 
  setPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    otp: new FormControl(this.otpCode, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required])
  }, 
  {validators: [this.passwordsMatch]}
  );

  ngOnInit(): void {
  this.otpCode = this.activatedRoute.snapshot.queryParamMap.get("otpCode")!
  console.log(this.otpCode)
  
  // أضف كده
  if (this.otpCode) {
    this.setPasswordForm.patchValue({
      otp: this.otpCode
    });
  }
}
  passwordsMatch(group: AbstractControl) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

 async submitForm() {
  console.log('submitForm called!'); 
  console.log('Form valid?', this.setPasswordForm.valid);
  
  if (this.setPasswordForm.invalid) {
    console.log('Form is invalid');
    console.log('Form errors:', this.setPasswordForm.errors);
    console.log('Controls:', {
      email: this.setPasswordForm.get('email')?.errors,
      otp: this.setPasswordForm.get('otp')?.errors,
      password: this.setPasswordForm.get('password')?.errors,
      confirmPassword: this.setPasswordForm.get('confirmPassword')?.errors
    });
    this.setPasswordForm.markAllAsTouched();
    return;
  }

  console.log('Form is valid, proceeding...');
  this.isLoading = true;
  this.msgError = '';
  this.success = '';

  const emailValue = this.setPasswordForm.get('email')?.value || '';
  const otpValue = this.setPasswordForm.get('otp')?.value || '';
  const passwordValue = this.setPasswordForm.get('password')?.value || '';
  const confirmPasswordValue = this.setPasswordForm.get('confirmPassword')?.value || '';

  const request: any = {
    email: emailValue,
    otp: otpValue,
    password: passwordValue,
    confirmPassword: confirmPasswordValue
  };

  console.log('Sending request:', request);

  try {
    console.log('Calling API...');
    const res: any = await this.authService.setPassword(request).toPromise();
    
    

    
    if (!res || res.message === 'success') {
       this.success = 'Password set successfully!';
      console.log('Success!');
      setTimeout(() => {
        console.log('Navigating to /login');
        this.router.navigate(['/login']);
      }, 500);
    } else {
      this.msgError = res.message || 'Failed to set password';
      console.log('Error message from API:', this.msgError);
    }

  } catch (err: any) {
    console.log('Full error object:', err);
    
    if (err.error?.errors && Array.isArray(err.error.errors)) {
      console.log('API Errors:', err.error.errors);
      this.msgError = err.error.errors.join('\n');
    } else {
      this.msgError = err.error?.errorMessage || err.message || 'Failed to set password';
    }
  } finally {
    this.isLoading = false;
  }
}
  currentLang: 'en' | 'ar' = 'en';

  //form texts
 labels = {
  en: {
    title: 'Set Password',

    email: 'Email Address',
    enterEmail: 'Enter your email',
    emailRequired: 'Email is required',
    emailInvalid: 'Enter a valid email address',

    validPassword:"Enter a valid password",
    passwordRequired:"Password should be required",
    passwordCharacters:"Password must be at least 8 characters.",

    newPassword:"New Password",
    enterNewPassword:"Enter new password",


    confirmPassword:"Confirm Password",
    confirm:"Confirm your password",
    confirmPasswordRequired:"Confirm Password should be required",
    matchPassword:"Passwords do not match.",



    submit: 'Submit',
    submiting: 'submiting...',


    msgError: 'An error occurred. Please try again.',
    success: 'Success',

    langBtn: 'عربي'
  },

  ar: {
    title: 'تعيين كلمة المرور',
    

    email: 'البريد الإلكتروني',
    enterEmail: 'أدخل بريدك الإلكتروني',
    emailRequired: 'البريد الإلكتروني مطلوب',
    emailInvalid: 'أدخل بريد إلكتروني صحيح',

   
    validPassword: "أدخل كلمة مرور صحيحة",
    passwordRequired: "كلمة المرور مطلوبة",
    passwordCharacters:"يجب أن تكون كلمة المرور مكوّنة من 8 أحرف على الأقل",


    confirmPasswordRequired:"يجب إدخال تأكيد كلمة المرور",
    matchPassword:"كلمات المرور غير متطابقة",

   newPassword: "كلمة المرور الجديدة",
enterNewPassword: "أدخل كلمة المرور الجديدة",

confirmPassword: "تأكيد كلمة المرور",
confirm: "أكد كلمة المرور",

    submit:  'إرسال',
    submiting: 'جاري الارسال...',


    msgError:'حدث خطأ، حاول مرة أخرى.',
    success: 'نجاح',

    langBtn: 'EN'
  }
};

//change language
toggleLanguage() {
  this.currentLang = this.currentLang === 'en' ? 'ar' : 'en';
}
}
