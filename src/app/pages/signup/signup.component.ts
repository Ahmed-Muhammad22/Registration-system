import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  isLoading: boolean = false;
  msgError: string = '';
  success: string = '';

  logoFile: File | null = null;
  previewUrl: string | null = null;
  companyId: number | null = null;

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  registerForm: FormGroup = new FormGroup({
    nameAr: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    nameEn: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    phoneNumber: new FormControl(null, [Validators.required,Validators.pattern(/^01[0125][0-9]{8}$/)]),
    websiteUrl: new FormControl(null, [Validators.required, Validators.pattern(/^(https?:\/\/)?([\da-z\u00A0-\uFFFF.-]+)\.([a-z.]{2,})([\/\w \.-]*)*\/?$/)]),
  });

  // choose and preview image
  onLogoSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.logoFile = file;

      const reader = new FileReader();
      reader.onload = () => this.previewUrl = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  uploadLogo(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.logoFile || !this.companyId) return resolve();

      this.authService.uploadLogo(this.companyId, this.logoFile).subscribe({
        next: (res) => {
          console.log('Logo uploaded successfully', res);
          resolve();
        },
        error: (err) => {
          console.log('Upload failed', err);
          reject(err);
        }
      });
    });
  }

  async submitForm() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.msgError = '';
    this.success = '';

    const body = this.registerForm.value;

    try {
      const res: any = await this.authService.getSignup(body).toPromise();

      this.success = res.message || 'Account created successfully!';
      this.companyId = res.companyId;

      // upload logo after registration
      if (this.logoFile) {
        await this.uploadLogo();
      }

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500);

    } catch (err: any) {
      this.msgError = err.error?.message || 'Check the data and try again';
    } finally {
      this.isLoading = false;
    }
  }
  currentLang: 'en' | 'ar' = 'en';

  //form texts
 labels = {
  en: {
    title: 'Signup',
  
    nameEn: 'Company Name (English)',
    enterNameEn: 'Enter company name in English',
    nameEnRequired: 'Company name in English is required',
    nameEnMin: 'Company name in English must be at least 3 characters',
    nameEnMax: 'Company name in English must not exceed 20 characters',

    nameAr: 'Company Name (Arabic)',
    enterNameAr: 'Enter company name in Arabic',
    nameArRequired: 'Company name in Arabic is required',
    nameArMin: 'Company name in Arabic must be at least 3 characters',
    nameArMax: 'Company name in Arabic must not exceed 20 characters',

    email: 'Email Address',
    enterEmail: 'Enter your email',
    emailRequired: 'Email is required',
    emailInvalid: 'Enter a valid email address',

    phoneNumber: 'Phone Number',
    enterPhone: 'Enter your phone number',
    phoneRequired: 'Phone number is required',
    phoneInvalid: 'Enter a valid phone number',

    websiteUrl: 'Website URL',
    enterWebsite:"Website URL is required",
    websiteInvalid: 'Enter a valid URL',

    logo: 'Company Logo',
    companyLogo: 'Company Logo',
    uploadLogo: 'Upload company logo',
    logoRequired: 'Company logo is required',
    logoSelected: 'Selected file:',

    signup: 'Create Account',
    creating: 'Creating...',

    haveAccount: 'Already have an account?',
    login: 'Login',

    successCreated: 'Company account created successfully!',
    errorOccurred: 'An error occurred. Please try again.',

    msgError: 'Error',
    success: 'Success',

    langBtn: 'عربي'
  },

  ar: {
    title: 'تسجيل شركة',
    registerNow: 'إنشاء حساب شركة',

    nameEn: 'اسم الشركة بالإنجليزية',
    enterNameEn: 'أدخل اسم الشركة بالإنجليزية',
    nameEnRequired: 'اسم الشركة بالإنجليزية مطلوب',
    nameEnMin: 'اسم الشركة بالإنجليزية يجب ألا يقل عن 3 أحرف',
    nameEnMax: 'اسم الشركة بالإنجليزية يجب ألا يتجاوز 20 حرفًا',

    nameAr: 'اسم الشركة بالعربية',
    enterNameAr: 'أدخل اسم الشركة بالعربية',
    nameArRequired: 'اسم الشركة بالعربية مطلوب',
    nameArMin: 'اسم الشركة بالعربية يجب ألا يقل عن 3 أحرف',
    nameArMax: 'اسم الشركة بالعربية يجب ألا يتجاوز 20 حرفًا',

    email: 'البريد الإلكتروني',
    enterEmail: 'أدخل بريدك الإلكتروني',
    emailRequired: 'البريد الإلكتروني مطلوب',
    emailInvalid: 'أدخل بريد إلكتروني صحيح',

    phoneNumber: 'رقم الهاتف',
    enterPhone: 'أدخل رقم الهاتف',
    phoneRequired: 'رقم الهاتف مطلوب',
    phoneInvalid: 'أدخل رقم هاتف صحيح',

    websiteUrl: 'رابط الموقع الإلكتروني ',
    enterWebsite:"رابط الوقع مطلوب",
    websiteInvalid: 'أدخل رابط الموقع صحيح',

    logo: 'شعار الشركة',
    companyLogo: 'شعار الشركة',
    uploadLogo: 'ارفع شعار الشركة',
    logoRequired: 'شعار الشركة مطلوب',
    logoSelected: 'تم اختيار الملف:',

    signup: 'إنشاء الحساب',
    creating: 'جاري الإنشاء...',

    haveAccount: 'لديك حساب بالفعل؟',
    login: 'تسجيل الدخول',

    successCreated: 'تم إنشاء حساب الشركة بنجاح!',
    errorOccurred: 'حدث خطأ، حاول مرة أخرى.',

    msgError: 'خطأ',
    success: 'نجاح',

    langBtn: 'EN'
  }
};

//change language
toggleLanguage() {
  this.currentLang = this.currentLang === 'en' ? 'ar' : 'en';
}
}
