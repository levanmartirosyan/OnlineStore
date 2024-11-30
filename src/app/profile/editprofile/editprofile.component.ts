import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { ToolsService } from '../../services/tools.service';

@Component({
  selector: 'app-editprofile',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './editprofile.component.html',
  styleUrl: './editprofile.component.scss',
})
export class EditprofileComponent implements OnInit {
  constructor(
    public apiService: ApiService,
    public router: Router,
    public tools: ToolsService
  ) {}

  ngOnInit(): void {
    this.getBrands();
    this.getCategories();
  }

  public activeCategory: string = '';

  public personalInfo: FormGroup = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    age: new FormControl('', [
      Validators.minLength(1),
      Validators.maxLength(2),
    ]),
    address: new FormControl(''),
    phone: new FormControl(''),
    zipcode: new FormControl(''),
    avatar: new FormControl(''),
    gender: new FormControl(''),
  });

  changePersonalInfo() {
    const getToken = sessionStorage.getItem('userToken');
    const userData = new HttpHeaders({
      accept: 'application/json',
      Authorization: `Bearer ${getToken}`,
    });
    this.apiService
      .changePersonalInfo(userData, this.personalInfo.value)
      .subscribe({
        next: (data: any) => {
          setTimeout(() => {
            window.location.reload();
            this.tools.showSuccess('პირადი ინფორმაცია შეცვლილია', 'წარმატება!');
          }, 100);
        },
        error: (error) => {
          this.tools.showError(error.error.error, 'შეცდომა!');
        },
      });
  }

  public newPassword: FormGroup = new FormGroup({
    oldPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  changePassword() {
    const getToken = sessionStorage.getItem('userToken');
    const userData = new HttpHeaders({
      accept: 'application/json',
      Authorization: `Bearer ${getToken}`,
    });
    this.apiService.changePassword(userData, this.newPassword.value).subscribe({
      next: (data: any) => {
        setTimeout(() => {
          this.router.navigate(['/']);
          window.location.reload();
          this.tools.showSuccess('პაროლი შეცვლილია', 'წარმატება!');
        }, 2000);
      },
      error: (error) => {
        this.tools.showError(error.error.error, 'შეცდომა!');
      },
    });
  }

  public confirmationWindow: boolean = false;
  public confirmation: boolean = false;

  approveDelete() {
    this.confirmation = true;
    this.confirmationWindow = false;
    this.deleteUserAcc();
  }

  cancelDelete() {
    this.confirmation = false;
    this.confirmationWindow = false;
  }

  deleteUserAcc() {
    this.confirmationWindow = true;
    if (this.confirmation) {
      const getToken = sessionStorage.getItem('userToken');
      const userData = new HttpHeaders({
        accept: 'application/json',
        Authorization: `Bearer ${getToken}`,
      });
      this.apiService.deleteAccount(userData).subscribe({
        next: (data: any) => {
          sessionStorage.removeItem('userToken');
          sessionStorage.removeItem('userRefreshToken');
          sessionStorage.removeItem('userProfileData');
          this.tools.showWarning('ანგარიში წაშლილია', 'ყურადღება!');
          this.router.navigate(['/']);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        },
        error: (error) => {
          this.tools.showError(error.error.error, 'შეცდომა!');
        },
      });
    }
  }

  public emailVerification: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  verifyEmail() {}

  public brands: any;

  getBrands() {
    this.apiService.getProductBrand().subscribe({
      next: (data: any) => {
        this.brands = data;
      },
      error: (error) => {},
    });
  }

  public categories: any;

  getCategories() {
    this.apiService.getCategories().subscribe({
      next: (data: any) => {
        this.categories = data;
      },
      error: (error) => {},
    });
  }

  public productAdd: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    brand: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    stock: new FormControl('', Validators.required),
    images: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    warranty: new FormControl('', Validators.required),
    thumbnail: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  addProductToStore() {
    const getToken = sessionStorage.getItem('userToken');
    const userData = new HttpHeaders({
      accept: 'application/json',
      Authorization: `Bearer ${getToken}`,
      'Content-Type': 'application/json',
    });
    this.apiService
      .addProductsToshop(userData, this.productAdd.value)
      .subscribe({
        next: (data: any) => {
          this.tools.showSuccess('პროდუქტი წარმატებით დაემატა', 'წარმატება!');
        },
        error: (error) => {
          this.tools.showError('error.error.error', 'შეცდომა!');
        },
      });
  }
}
