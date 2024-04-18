package com.edubridge.ecommerce.service;

import com.edubridge.ecommerce.dto.Purchase;
import com.edubridge.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);
}