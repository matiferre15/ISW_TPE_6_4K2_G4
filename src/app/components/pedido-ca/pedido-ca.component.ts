import { Component, OnInit, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  host: {
    '(document:click)': 'onClick($event)',
  },
  selector: 'app-pedido-ca',
  templateUrl: './pedido-ca.component.html',
  styleUrls: ['./pedido-ca.component.css'],
})
export class PedidoCaComponent implements OnInit {
  
  FormPedidoCa = new FormGroup({
    Calle: new FormControl(null, [Validators.required, Validators.maxLength(35)]),
    Numero: new FormControl(null, [Validators.pattern('[0-9]{1,5}'), Validators.required]),
    Ciudad: new FormControl(null, [Validators.required, Validators.maxLength(35)]),
    Referencia: new FormControl(null),
    FormaPago: new FormControl(null),
    Monto: new FormControl(null),
    NroTarjeta: new FormControl(null),
    NombreTitular: new FormControl(null),
    ApellidoTitular: new FormControl(null),
    FechaVencimiento: new FormControl(null),
    Cvc: new FormControl(null),
  });

  EstadoCarrito: string = "Lleno";

  Opciones = [{ Nombre: 'Efectivo' }, { Nombre: 'Tarjeta de credito' }];
  


  constructor() {}

  ngOnInit() {}





  alternarCarrito(){
    this.EstadoCarrito == "Lleno" ? this.EstadoCarrito = "Vacio" : this.EstadoCarrito = "Lleno";
    
  }
}

