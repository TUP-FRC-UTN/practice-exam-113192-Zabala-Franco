import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../product';
import { ApiService } from '../api-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.css'
})
export class CreateOrderComponent {

  orderForm = new FormGroup({
    costumerName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),

    products: new FormArray([], [Validators.required])
  });

  get productsFormArray() {
    return this.orderForm.get('products') as FormArray;
  }

    // Lista de productos disponibles
    products: Product[] = [];

    // Variables para calcular totales
    total = 0;
    hasDiscount = false;
    selectedProducts: Product[] = [];
  
    constructor(
      private apiService: ApiService,
      private router: Router
    )
    {

    }

      // Método que se ejecuta al iniciar el componente
  ngOnInit(): void {
    // Cargamos la lista de productos
    this.loadProducts();
    this.updateSelectedProducts();
  }

  updateSelectedProducts() {
    const products = this.productsArray.controls;
    this.selectedProducts = products.map(control => {
      const productId = control.get('productId')?.value;
      const product = this.products.find(p => p.id.toString() === productId);
      return {
        id: product?.id || '',
        name: product?.name || '',
        quantity: control.get('quantity')?.value,
        price: control.get('price')?.value,
        stock: product?.stock
      };
    }) as Product[];
  }


  addProduct(): void {
    // Crear un grupo de formulario para el nuevo producto
    const productForm: FormGroup = new FormGroup({
      price: new FormControl(0),
      productId: new FormControl(''),
      quantity: new FormControl(1),
      stock: new FormControl(0)
    });
    this.productsFormArray.push(productForm);

  }

  removeProduct(index: number){
    this.productsFormArray.removeAt(index);
  }

   // Getter para acceder fácilmente al array de productos en el template
   get productsArray(): FormArray {
    return this.orderForm.get('products') as FormArray;
  }
  // Carga la lista de productos desde la API
  private loadProducts(): void {
    this.apiService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: () => {

      }
    });
  }
  

}
