import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToolsService } from '../../services/tools.service';

@Component({
  selector: 'app-laptopsection',
  standalone: true,
  imports: [],
  templateUrl: './laptopsection.component.html',
  styleUrl: './laptopsection.component.scss',
})
export class LaptopsectionComponent implements OnInit {
  @ViewChild('productContainer') productContainer!: ElementRef;
  constructor(
    public apiService: ApiService,
    public router: Router,
    public tools: ToolsService
  ) {}

  ngOnInit(): void {
    this.showProductCards();
    this.getCartForCheck();
  }

  public products: any;
  public checkCart: any;

  showProductCards() {
    this.apiService.getLaptops().subscribe((data: any) => {
      this.products = data.products;
    });
  }

  createCart(id: any) {
    const getToken = sessionStorage.getItem('userToken');
    if (!getToken) {
      this.tools.showWarning('ჯერ გაიარეთ ავტორიზაცია', 'ყურადღება!');
      return;
    }
    const userData = new HttpHeaders({
      accept: 'application/json',
      'Content-Type': 'application/json',
    });
    const body = JSON.stringify({
      id: id,
      quantity: 1,
    });
    this.apiService.addCreateProductsCart(userData, body).subscribe({
      next: (data: any) => {
        this.tools.triggerNavRefresh();
        this.tools.showSuccess('პროდუქტი კალათაში დაემატა', 'წარმატება!');
      },
      error: (error) => {
        this.tools.showError(error.error.error, 'შეცდომა!');
      },
    });
  }

  addToCart(id: any) {
    const getToken = sessionStorage.getItem('userToken');
    if (!getToken) {
      this.tools.showWarning('ჯერ გაიარეთ ავტორიზაცია', 'ყურადღება!');
      return;
    }
    const userData = new HttpHeaders({
      accept: 'application/json',
      'Content-Type': 'application/json',
    });
    const body = JSON.stringify({
      id: id,
      quantity: 1,
    });
    this.apiService.addProductsToCart(userData, body).subscribe({
      next: (data: any) => {
        this.tools.triggerNavRefresh();
        this.tools.showSuccess('პროდუქტი კალათაში დაემატა', 'წარმატება!');
      },
      error: (error) => {
        this.tools.showError(error.error.error, 'შეცდომა!');
      },
    });
  }

  getCartForCheck() {
    this.tools.transferData.subscribe((data: any) => {
      this.checkCart = data.cartID;
    });
  }

  goToDetails(card: any) {
    this.router.navigate([`products/details/${card.title}`], {
      queryParams: {
        data: JSON.stringify(card),
      },
    });
  }

  scrollLeft() {
    const container = this.productContainer.nativeElement;
    container.scrollBy({
      left: -400,
      behavior: 'smooth',
    });
  }

  scrollRight() {
    const container = this.productContainer.nativeElement;
    container.scrollBy({
      left: 400,
      behavior: 'smooth',
    });
  }
}
