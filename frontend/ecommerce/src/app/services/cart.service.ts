import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  //data available only upto session (until browser window is closed)
  //storage: Storage = sessionStorage;

  //data available even browser window is closed
  storage: Storage = localStorage;
  constructor() {
    //read cartItems from sessionStorage
    let data = JSON.parse(this.storage.getItem('cartItems'));

    if (data != null) {
      this.cartItems = data;
      this.computeCartTotals();
    }
  }

  //stores cartItems in sessionStorage
  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }
  //add to cart functionality
  addToCart(theCartItem: CartItem) {
    let alreadyExistsInCart = false;
    let existingCartItem: CartItem | undefined;

    if (this.cartItems.length > 0) {
      existingCartItem = this.cartItems.find((tempCartItem) => {
        tempCartItem.id === theCartItem.id;
      });
      alreadyExistsInCart = existingCartItem != undefined;
    }

    if (alreadyExistsInCart) {
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(theCartItem);
    }

    //compute cart totalprice and total quantity
    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPriceValue = 0;
    let totalQuantityValue = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    //persist cartItems in sessionStorage
    this.persistCartItems();
  }

  incrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity++;
    this.computeCartTotals();
  }

  remove(theCartItem: CartItem) {
    const itemIndex = this.cartItems.findIndex(
      (CartItem) => CartItem.id === theCartItem.id
    );

    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;

    if (theCartItem.quantity === 0) {
      this.remove(theCartItem);
    } else {
      this.computeCartTotals();
    }
  }
}
