import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-authorization',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './authorization.component.html',
  styleUrl: './authorization.component.scss',
})
export class AuthorizationComponent implements OnInit {
  switchAuth: any = 'auth';
  constructor(public apiService: ApiService) {}
  ngOnInit(): void {}

  public singInUp: boolean = false;
  @Output() sendCloseCommand: EventEmitter<boolean> = new EventEmitter();
  @Output() sendUserData: EventEmitter<any> = new EventEmitter();

  sendAnswerFromAuth(): void {
    this.sendCloseCommand.emit(false);
  }
  public authorization: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  public accessToken: any;
  public refreshToken: any;

  authorize() {
    console.log(this.authorization);
    this.apiService.authorization(this.authorization.value).subscribe({
      next: (data: any) => {
        console.log(data);
        sessionStorage.setItem('userToken', data.access_token);
        sessionStorage.setItem('userRefreshToken', data.refresh_token);
        // this.accessToken = data.access_token;
        // this.refreshToken = data.refresh_token;
        // this.sendUserInfo();
        this.sendAnswerFromAuth();
        setTimeout(() => {
          window.location.reload();
        }, 300);
      },
      error: (error) => {
        console.log(error.error);
      },
    });
  }

  public registration: FormGroup = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    age: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(2),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    address: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    zipcode: new FormControl('', Validators.required),
    avatar: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required),
  });

  public userId: any;

  register() {
    this.apiService.registration(this.registration.value).subscribe({
      next: (data: any) => {
        console.log(data);
        this.userId = data._id;
        this.sendAnswerFromAuth();
      },
      error: (error) => {
        console.log(error.error);
      },
    });
  }

  public toggleRecovery: boolean = false;

  recoveryToggle() {
    this.toggleRecovery = !this.toggleRecovery;
  }

  public recovery: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  passRecovery() {
    this.apiService.recovery(this.recovery.value).subscribe({
      next: (data: any) => {
        console.log(data);
        this.sendAnswerFromAuth();
      },
      error: (error) => {
        console.log(error.error);
      },
    });
  }
}
