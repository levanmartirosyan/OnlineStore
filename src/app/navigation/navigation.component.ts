import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthorizationComponent } from './authorization/authorization.component';
import { ApiService } from '../services/api.service';
import { HttpHeaders } from '@angular/common/http';
import { ToolsService } from '../services/tools.service';
import { CategoriesComponent } from './categories/categories.component';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    AuthorizationComponent,
    CategoriesComponent,
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent implements OnInit {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    public apiService: ApiService,
    public tools: ToolsService,
    public router: Router
  ) {}
  ngOnInit(): void {
    this.showCategories();
    this.getUserInfo();
    this.getCartForQuantity();
    this.syncCartLength();
  }
  public burgerToggle: boolean = false;
  public authorizationToggle: boolean = false;
  public userProfile: any = null;
  public userDataFromStorage: any;
  public mobileNavigation: any;

  toggleBurger() {
    this.burgerToggle = !this.burgerToggle;
  }

  toggleAuthorization() {
    this.authorizationToggle = true;
  }

  getAnswerFromAuth(value: boolean): void {
    this.authorizationToggle = value;
  }

  getAnswerFromCategories(value: boolean): void {
    this.burgerToggle = value;
  }

  getUserInfo() {
    const checkAccessToken = sessionStorage.getItem('userToken');
    const checkRefreshToken = sessionStorage.getItem('userRefreshToken');
    if (checkAccessToken && checkRefreshToken) {
      const getToken = sessionStorage.getItem('userToken');
      const userData = new HttpHeaders({
        accept: 'application/json',
        Authorization: `Bearer ${getToken}`,
      });
      this.apiService.getUser(userData).subscribe({
        next: (data: any) => {
          console.log(data);
          sessionStorage.setItem('userProfileData', JSON.stringify(data));
          const storedData = sessionStorage.getItem('userProfileData');
          if (storedData) {
            this.userProfile = JSON.parse(storedData);
            this.tools.transferData.next(JSON.parse(storedData));
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }

  public cartLength: any;

  getCartForQuantity() {
    const getToken = sessionStorage.getItem('userToken');
    if (!getToken) {
      console.log('User not logged in.');
      return;
    }
    const userData = new HttpHeaders({
      accept: 'application/json',
      Authorization: `Bearer ${getToken}`,
      'Content-Type': 'application/json',
    });
    this.apiService.getCartProducts(userData).subscribe({
      next: (data: any) => {
        console.log(data);
        this.cartLength = data.total.quantity;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  syncCartLength() {
    return this.cartLength;
  }
  reloadPage() {
    window.location.reload();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;

    const topElement = this.el.nativeElement.querySelector('.top');
    const bottomElement = this.el.nativeElement.querySelector('.bottom');

    if (scrollPosition > 100) {
      this.renderer.setStyle(topElement, 'display', 'none');

      this.renderer.setStyle(bottomElement, 'background-color', '#ffffff');
      this.renderer.setStyle(
        bottomElement,
        'transition',
        'background-color 0.5s ease'
      );
    } else {
      this.renderer.setStyle(topElement, 'display', 'flex');

      this.renderer.setStyle(bottomElement, 'background-color', '');
    }
  }

  public categories: any;

  showCategories() {
    this.apiService.getCategories().subscribe((data: any) => {
      this.categories = data;
    });
  }

  sendBrand(data: any) {
    this.tools.transferData.next(data);
    this.toggleBurger();
    this.router.navigate([`/products`]);
  }
}
