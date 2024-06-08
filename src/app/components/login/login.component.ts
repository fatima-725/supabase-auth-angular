import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SupaService } from '../../service/supa.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    // private authService: AuthService,
    private router: Router,
    private auth: SupaService,
    private messageService: MessageService
  ) {}

  get email() {
    return this.loginForm.controls.email;
  }

  get password() {
    return this.loginForm.controls.password;
  }

  // loginUser() {
  //   const { email, password } = this.loginForm.value;
  //   this.authService.getUserByEmail(email as string).subscribe(
  //     (response) => {
  //       if (response.length > 0 && response[0].password === password) {
  //         sessionStorage.setItem('email', email as string);
  //         this.router.navigate(['/home']);
  //       } else {
  //         this.messageService.add({
  //           severity: 'error',
  //           summary: 'Error',
  //           detail: 'Email or password is incorrect',
  //         });
  //       }
  //     },
  //     (error) => {
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'Error',
  //         detail: 'Something went wrong',
  //       });
  //     }
  //   );
  // }
  public onSubmit() {
    if (this.loginForm.valid) {
      this.auth
        .signIn(
          this.loginForm.value.email as string,
          this.loginForm.value.password as string
        )
        .then((res: any) => {
          console.log(res);
          if (res.data.user.role === 'authenticated') {
            console.log('authenticated');
            this.router.navigate(['/home']);
          }
        });
    }
  }
}
