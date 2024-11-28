import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CartComponent } from './cart/cart.component';
import { ProfileComponent } from './profile/profile.component';
import { EditprofileComponent } from './profile/editprofile/editprofile.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { DetailsComponent } from './details/details.component';
import { ProductsComponent } from './products/products.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Boommer - Home' },
  { path: 'cart', component: CartComponent, title: 'Boommer - Cart' },
  { path: 'profile', component: ProfileComponent, title: 'Boommer - Profile' },
  {
    path: 'products/details/:id',
    component: DetailsComponent,
    title: 'Boommer - Details',
  },
  {
    path: 'products',
    component: ProductsComponent,
    title: 'Boommer - products',
  },
  {
    path: '**',
    component: NotfoundComponent,
    title: 'Boommer - Page Not Found',
  },
];
