import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/shared/models/order.model';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-list-order',
  templateUrl: './list-order.component.html',
  styleUrls: ['./list-order.component.css']
})
export class ListOrderComponent implements OnInit {

  orders: Order[] = [];
  allOrders: Order[] = [];

  constructor(
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.listAll();
  }


  listAll(): void {
    this.orderService.listAll().subscribe(
      (orders: Order[]) => this.loadOrders(orders)
    )
  }


  loadOrders(orders: Order[]): void {
    if (orders == null) {
      this.allOrders = [];
    }
    else {
      this.allOrders = orders;
    }
    this.orders = this.allOrders;
  }


  remove($event: any, order: Order): void {
    $event.preventDefault();
    if (confirm('Deseja realmente remover o pedido #' + order.id + ' ?')) {
      this.orderService.remove(order.id!).subscribe(
        () => this.listAll()
      );
    }
  }


  filterByCPF(cpf: string): void {
    this.orders = this.allOrders
      .filter((order) => order.customer?.cpf == cpf.replace(/\D/g, ''));
  }


  removeFilter(): void {
    this.orders = this.allOrders;
  }
}
