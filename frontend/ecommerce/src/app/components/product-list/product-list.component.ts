import { Component } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../common/cart-item';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent {
  products: Product[] = [];
  currentCategoryId: any = 1;
  searchMode = false;

  constructor(
    private service: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }
  handleListProducts() {
    let hasCategoryId = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      this.currentCategoryId = this.route.snapshot.paramMap.get('id');
    } else {
      this.currentCategoryId = 1;
    }

    this.service.getProductList(this.currentCategoryId).subscribe((data) => {
      this.products = data;
    });
  }
  handleSearchProducts() {
    const theKeyword: any = this.route.snapshot.paramMap.get('keyword');

    this.service.searchProducts(theKeyword).subscribe((data) => {
      this.products = data;
    });
  }

  //add to cart
  addToCart(theProduct: Product) {
    const theCartItem = new CartItem(theProduct);
    this.cartService.addToCart(theCartItem);
  }
}
