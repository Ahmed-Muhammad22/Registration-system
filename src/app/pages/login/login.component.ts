import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';        
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';      

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,     
    FormsModule,    
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'   
})
export class LoginComponent {
  email = '';
  password = '';
  rememberMe = false;
  showPassword = false;

  onSubmit() {
    console.log('Login attempt:', {
      email: this.email,
      password: this.password,
      rememberMe: this.rememberMe
    });
    
  }

  loginWithGoogle() {
    console.log('Login with Google');
  }

  loginWithGithub() {
    console.log('Login with GitHub');
  }
}