import { Component, OnInit, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

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
    Ciudad: new FormControl('Córdoba'),
    Referencia: new FormControl(null,[Validators.maxLength(240)]),
    FormaPago: new FormControl('Tarjeta de credito'),
    OpcionRecepcion: new FormControl('Elegir fecha y hora'),})
  //  Monto: new FormControl(null, [Validators.required,Validators.pattern('[0-9]{1,7}')]),
  //  NroTarjeta: new FormControl(null, [Validators.required, Validators.pattern('[0-9]{16}')]),
  //  NombreTitular: new FormControl(null,[Validators.required, Validators.maxLength(50)]),
  //  ApellidoTitular: new FormControl(null,[Validators.required, Validators.maxLength(50)]),
  //  FechaVencimiento: new FormControl(null,[Validators.required, 
  //    Validators.pattern('(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}')
  //  ]),
  //  Cvc: new FormControl(null,[Validators.required,Validators.pattern('[0-9]{3,4}')]),
  //});

  FormPedidoCaEfectivo = new FormGroup({
    Monto: new FormControl(null, [Validators.required,Validators.pattern('[0-9]{1,5}')]),
    MontoAPagar: new FormControl()
  })

  FormPedidoCaTarjeta = new FormGroup({
    NroTarjeta: new FormControl(null, [Validators.required, Validators.pattern('[0-9]{16}')]),
    NombreTitular: new FormControl(null,[Validators.required, Validators.maxLength(50)]),
    ApellidoTitular: new FormControl(null,[Validators.required, Validators.maxLength(50)]),
    FechaVencimiento: new FormControl(null,[Validators.required, 
      Validators.pattern('(0[1-9]|1[012])[-/](20[2][2-9]|20[3-5][0-9])')
    ]),
    Cvc: new FormControl(null,[Validators.required,Validators.pattern('[0-9]{3,4}')]),
  })

  FormPedidoCaRecepcion = new FormGroup({
    FechaRecepcion: new FormControl(null,[Validators.required, Validators.pattern('((0[1-9]|[12][0-9]|3[01])[\/.](0[13578]|1[02]))|((0[1-9]|[12][0-9]|30)[\/.](0[469]|11))|((0[1-9]|1[0-9]|2[0-8])[\/.](02))|(29[\/.](02))')]),
    Hora: new FormControl(null, [Validators.required]),
  })

  EstadoCarrito = "Lleno";

  Opciones = [{ Nombre: "Efectivo" }, { Nombre: "Tarjeta de credito" }];
  OpcionesRecepcion = [{ Nombre: "Lo antes posible"}, { Nombre: "Elegir fecha y hora"}];
  
  Ciudades = [{ Nombre: "Alta Gracia" }, { Nombre: "Arroyito" }, { Nombre: "Bell Ville" }, { Nombre: "Córdoba" },
  { Nombre: "Cosquín" }, { Nombre: "Jesús María" }, { Nombre: "Marcos Juárez" }, { Nombre: "Río Cuarto" }, { Nombre: "Río Tercero" },
  { Nombre: "San Francisco" }, { Nombre: "Villa Carlos Paz" }, { Nombre: "Villa María" }, { Nombre: "Villa Nueva" }];

  Pedido = [{Nombre:"McCombo doble cuarto de libra", Imagen:"../../../assets/DobleCuartoDeLibra.png", Precio:"1200"}, 
  { Nombre: "McCombo cuarto de libra", Imagen:"../../../assets/CuartoDeLibra.png", Precio: "900"}, 
  {Nombre: "Sundae dulce de leche", Imagen:"../../../assets/SundaeDdl.png", Precio:"300"}];

  constructor() {}

  ngOnInit() {  }

  calcularMonto(){
    let MontoPagar = 0
    if (this.EstadoCarrito == "Lleno"){
      for(let i = 0; i<this.Pedido.length; i++){
        MontoPagar += parseInt(this.Pedido[i].Precio)
      }
    }
    return MontoPagar
  }

  validarMonto(){
    let Monto: string;
    if(this.FormPedidoCaEfectivo.controls.Monto.value == null){
      Monto = '0';
    }
    else{
      Monto = this.FormPedidoCaEfectivo.controls.Monto.value;
    }
    
    let MontoAPagar = this.calcularMonto();

    console.log(Monto, MontoAPagar)
    return !(parseInt(Monto) >= MontoAPagar)

  }
    

  obtenerEstadoValidacion(){
    let BoolPago: boolean;
    let BoolRecepcion: boolean;

    if(this.FormPedidoCa.controls.FormaPago.value == "Efectivo"){
      BoolPago = this.FormPedidoCaEfectivo.invalid || this.validarMonto();
    }
    else{
      BoolPago = this.FormPedidoCaTarjeta.invalid; 
    }

    if(this.FormPedidoCa.controls.OpcionRecepcion.value == "Elegir fecha y hora"){
      BoolRecepcion = this.FormPedidoCaRecepcion.invalid;
    }
    else{
      BoolRecepcion = false;
    }

    return(BoolPago || BoolRecepcion || this.FormPedidoCa.invalid)
  }

  alternarCarrito(){
    this.EstadoCarrito == "Lleno" ? this.EstadoCarrito = "Vacio" : this.EstadoCarrito = "Lleno";
    
  }

  grabar(){
    Swal.fire(
      'Pedido realizado con exito!',
      '',
      'success'
    )
  }
}

