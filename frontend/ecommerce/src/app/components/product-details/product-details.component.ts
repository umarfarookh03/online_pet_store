import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../common/product';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../common/cart-item';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent {
  product = new Product();

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  handleProductDetails() {
    const theProductId: any = this.route.snapshot.paramMap.get('id');

    this.productService.getProduct(theProductId).subscribe((data) => {
      this.product = data;
    });
  }
  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });
  }
  addToCart() {
    const theCartItem = new CartItem(this.product);
    this.cartService.addToCart(theCartItem);
  }
}
