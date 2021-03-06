import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/shared/models/product.model';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

  @ViewChild("formProduct") formProduct!: NgForm;
  product: Product = new Product(0, "");

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) { }


  ngOnInit(): void {
    let id = +this.route.snapshot.params['id'];
    this.productService.searchById(id).subscribe({
      next: (returnedProduct: Product) => this.loadProduct(returnedProduct),
      error: (err: Error) => this.treatLoadingError(err)
    });
  }


  update(): void {
    if (this.formProduct.form.valid) {
      this.productService.update(this.product).subscribe({
        next: () => this.browseToProductsPage(),
        error: (err: Error) => console.error('Failed to update product: ' + err)
      });
    }
  }


  loadProduct(returnedProduct: Product): void {
    if (returnedProduct != null) {
      this.product = returnedProduct;
    }
    else throw Error;
  }


  treatLoadingError(err: Error): void {
    console.error('Failed to retrive product data: ' + err);
    this.browseToProductsPage();
  }


  browseToProductsPage(): void {
    this.router.navigate(['/products']);
  }

}
