import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { CheckoutService } from '../../services/checkout.service';
import { CartService } from '../../services/cart.service';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { CartItem } from '../../common/cart-item';
import { Purchase } from '../../common/purchase';
import { publicDecrypt } from 'crypto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  checkoutFormGroup: FormGroup;

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  totalPrice = 0.0;
  totalQuantity = 0;

  storage: Storage = localStorage;

  constructor(
    private formBuilder: FormBuilder,
    private checkoutService: CheckoutService,
    private cartService: CartService,
    private router: Router
  ) {}

  reviewCartDetails() {
    this.cartService.totalQuantity.subscribe((data) => {
      this.totalQuantity = data;
    });

    this.cartService.totalPrice.subscribe((data) => {
      this.totalPrice = data;
    });
  }

  ngOnInit() {
    this.reviewCartDetails();
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: ['', [Validators.required, Validators.pattern('[a-zA-z]+')]],
        lastName: ['', [Validators.required, Validators.pattern('[a-zA-z]+')]],
        email: ['', [Validators.required]],
      }),
      shippingAddress: this.formBuilder.group({
        street: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        country: ['', [Validators.required]],
        zipCode: ['', [Validators.required]],
      }),
      billingAddress: this.formBuilder.group({
        street: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        country: ['', [Validators.required]],
        zipCode: ['', [Validators.required]],
      }),
    });

    this.checkoutService.getCountries().subscribe((data) => {
      this.countries = data;
      console.log(this.countries);
    });
  }

  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }
  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }
  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }
  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }
  get shippingAddressState() {
    return this.checkoutFormGroup.get('shippingAddress.state');
  }
  get shippingAddressCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }
  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }

  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }
  get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }
  get billingAddressState() {
    return this.checkoutFormGroup.get('billingAddress.state');
  }
  get billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }
  get billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }

  copyShippingAddress(event: any) {
    if (event.target.checked) {
      const shippingAddressData =
        this.checkoutFormGroup.controls?.['shippingAddress'].value;

      this.checkoutFormGroup.controls?.['billingAddress'].setValue(
        shippingAddressData
      );
      //bug fix
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls?.['billingAddress'].reset();
      //bug fix for getStates
      this.billingAddressStates = [];
    }
  }

  onSubmit() {
    console.log(this.checkoutFormGroup?.get('customer')?.value);

    console.log(this.checkoutFormGroup?.get('shippingAddress')?.value);

    console.log(this.checkoutFormGroup?.get('billingAddress')?.value);

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    //create Order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    //create cartItems
    const cartItems = this.cartService.cartItems;

    let orderItems: OrderItem[] = cartItems.map(
      (CartItem) => new OrderItem(CartItem)
    );

    //ctreate purchase
    let purchase = new Purchase();
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    //shipping Address
    purchase.shippingAddress =
      this.checkoutFormGroup.controls['shippingAddress'].value;

    const shippingState: State = JSON.parse(
      JSON.stringify(purchase.shippingAddress.state)
    );
    const shippingCountry: Country = JSON.parse(
      JSON.stringify(purchase.shippingAddress.country)
    );

    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    //billing address
    purchase.billingAddress =
      this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(
      JSON.stringify(purchase.billingAddress.state)
    );
    const billingCountry: State = JSON.parse(
      JSON.stringify(purchase.billingAddress.country)
    );
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    purchase.order = order;
    purchase.orderItems = orderItems;

    //call rest api
    this.checkoutService.placeOrder(purchase).subscribe((data) => {
      alert(
        'Order Placed Successfully: Payment Mode: COD' +
          data.orderTrackingNumber
      );
      this.resetCart();
    });
  }

  resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.checkoutFormGroup.reset();

    this.storage.clear();

    this.router.navigateByUrl('/product');
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    this.checkoutService.getStates(countryCode).subscribe((data) => {
      if (formGroupName === 'shippingAddress') {
        this.shippingAddressStates = data;
      } else {
        this.billingAddressStates = data;
      }
      //select first item by default
      formGroup?.get('state')?.setValue(data[0]);
    });
  }
}
