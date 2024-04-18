import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { SliderComponent } from './components/slider/slider.component';

const routes: Routes = [
  { path: 'products', component: ProductListComponent },
  { path: 'category', component: ProductListComponent },
  { path: 'category/:id', component: ProductListComponent },
  { path: 'search/:keyword', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'cart-details', component: CartDetailsComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: '', component: SliderComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
