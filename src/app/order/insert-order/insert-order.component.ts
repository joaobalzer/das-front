import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { CustomerService } from 'src/app/customer/services';
import { ProductService } from 'src/app/product/services/product.service';
import { Customer } from 'src/app/shared/models';
import { OrderItem } from 'src/app/shared/models/order-item.model';
import { Order } from 'src/app/shared/models/order.model';
import { Product } from 'src/app/shared/models/product.model';
import { OrderService } from '../services/order.service';


@Component({
  selector: 'app-insert-order',
  templateUrl: './insert-order.component.html',
  styleUrls: ['./insert-order.component.css']
})
export class InsertOrderComponent implements OnInit {
  @ViewChild('formOrder') formOrder!: NgForm;
  order!: Order;
  allProducts: Product[] = [];
  products!: Product[];

  page = 1;
  pageSize = 4;
  collectionSize!: number;

  today = this.calendar.getToday();
  datePicker: NgbDateStruct = this.today;

  timePicker!: NgbTimeStruct;
  spinners: boolean = false;

  cpfNotFound: boolean = false;


  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private customerService: CustomerService,
    private router: Router,
    private calendar: NgbCalendar,
  ) { }


  ngOnInit(): void {
    this.order = new Order();
    this.order.items = [];
    this.order.date = new Date();
    this.dateToTimePicker();
    this.listAllProducts();
  }


  insert(): void {
    if (this.orderIsValid()) {
      this.datetimePickerToDate();
      this.order.items = this.order.items!.filter(item => item.quantity! > 0);
      this.orderService.insert(this.order).subscribe({
        next: () => this.router.navigate(["/orders"]),
        error: (err: Error) => console.error('Failed to create order: ' + err)
      })
    }
  }


  searchCPF(Cpf: string) {
    this.customerService.findByCPF(Cpf.replace(/\D/g, '')).subscribe({
      next: (returnedCustomer) => this.loadCustomer(returnedCustomer!),
      error: (error: Error) => this.treatCustomerLoadingError(error)
    });
  }


  loadCustomer(returnedCustomer: Customer): void {
    if (returnedCustomer) {
      this.cpfNotFound = false;
      this.order.customer = returnedCustomer;
    }
    else {
      this.cpfNotFound = true;
      this.order.customer = undefined;
    }
  }


  treatCustomerLoadingError(error: Error): void {
    console.log(error);
    this.cpfNotFound = true;
    this.order.customer = undefined;
  }


  listAllProducts(): void {
    this.productService.listAll().subscribe(
      (returnedProducts: Product[]) => {
        this.loadProducts(returnedProducts);
        this.collectionSize = this.allProducts.length;
        this.refreshProducts();
      }
    );
  }


  loadProducts(returnedProducts: Product[]) {
    if (returnedProducts == null) {
      this.allProducts = [];
    }
    else {
      this.allProducts = returnedProducts;
    }
  }


  refreshProducts(): void {
    this.products = this.allProducts
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }


  removeOne($event: any, orderItem: OrderItem): void {
    $event.preventDefault();
    this.order.items!.forEach((item) => {
      if (orderItem.product?.id === item.product?.id && item.quantity != null && item.quantity > 0) {
        item.quantity = item.quantity - 1;
      }
    })
  }


  addOne($event: any, orderItem: OrderItem): void {
    $event.preventDefault();
    this.order.items!.forEach((obj) => {
      if (obj.quantity != null && orderItem.product?.id === obj.product?.id) {
        obj.quantity = obj.quantity + 1;
      }
    })
  }


  removeItem($event: any, orderItem: OrderItem): void {
    $event.preventDefault();
    this.order.items!.forEach((obj, index, objs) => {
      if (orderItem.product?.id === obj.product?.id) {
        objs.splice(index, 1);
      }
    })
  }


  addProduct($event: any, product: Product, qtd: string): void {
    $event.preventDefault();
    let quantityIncrement = parseInt(qtd);
    if (this.quantityIsWithinLimits(quantityIncrement)) {
      this.incrementQuantity(product, quantityIncrement);
    }
  }


  incrementQuantity(product: Product, quantityIncrement: number): void {
    let index = this.order.items!.findIndex((item) => item.product?.id == product.id);
    if (index != -1 && this.order?.items) {
      this.order.items[index].quantity! += quantityIncrement;
    }
    else {
      this.order.items!.push(new OrderItem(product, quantityIncrement));
    }
  }


  quantityIsWithinLimits(quantity: number): boolean {
    return quantity > 0 && quantity <= 1000;
  }


  toggleTimeSpinners(): void {
    this.spinners = !this.spinners;
  }


  closeCpfAlert(): void {
    this.cpfNotFound = false;
  }


  orderIsValid(): boolean {
    let hasProducts = this.order.items!
      .filter(item => item.quantity! > 0).length > 0 ? true : false;
    return Boolean(this.order.customer) && hasProducts;
  }


  private dateToTimePicker(): void {
    this.timePicker = {
      hour: this.order.date!.getHours(),
      minute: this.order.date!.getMinutes(),
      second: this.order.date!.getSeconds()
    };
  }


  private datetimePickerToDate(): void {
    this.order.date?.setUTCFullYear(this.datePicker.year, this.datePicker.month - 1, this.datePicker.day);
    this.order.date?.setUTCHours(this.timePicker.hour, this.timePicker.minute, this.timePicker.second);
  }

}