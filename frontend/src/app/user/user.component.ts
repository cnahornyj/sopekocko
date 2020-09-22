import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  signupForm: FormGroup;
  loading: boolean;
  errorMsg: string;

  constructor(private formBuilder: FormBuilder,
              private auth: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required]
    });
  }

  onSignup() {
    this.loading = true;
    const email = this.signupForm.get('email').value;
    const password = this.signupForm.get('password').value;
    this.auth.createUser(email, password).then(
      (response: { message: string }) => {
        console.log(response.message);
        this.auth.loginUser(email, password).then(
          () => {
            this.loading = false;
            this.router.navigate(['/user']);
          }
        ).catch(
          (error) => {
            this.loading = false;
            console.error(error);
            this.errorMsg = error.message;
          }
        );
      }
    ).catch((error) => {
        this.loading = false;
        console.error(error);
        if (error.status === 401){
          this.errorMsg = "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre, un caractère spécial et minimum 10 caractères";
        } else if (error.status === 400) {
          this.errorMsg = `L'email est déjà associé à un compte`;
        } else {
          this.errorMsg = error.message;
        }
    });
  }

}