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

//FormGroups utilizados para todos los campos y sus respectivas validaciones

  FormPedidoCa = new FormGroup({
    Calle: new FormControl(null, [Validators.required, Validators.maxLength(35)]),
    Numero: new FormControl(null, [Validators.pattern("[0-9]{1,5}"), Validators.required]),
    Ciudad: new FormControl("Córdoba"),
    Referencia: new FormControl(null,[Validators.maxLength(240)]),
    FormaPago: new FormControl("Efectivo"),
    OpcionRecepcion: new FormControl("Lo antes posible"),})

  FormPedidoCaEfectivo = new FormGroup({
    Monto: new FormControl(null, [Validators.required,Validators.pattern("[0-9]{1,9}")]),
    MontoAPagar: new FormControl()
  })

  FormPedidoCaTarjeta = new FormGroup({
    Tarjeta: new FormControl("Mastercard"),
    NroTarjeta: new FormControl(null, [Validators.required, Validators.pattern("[0-9]{16}")]),
    NombreTitular: new FormControl(null,[Validators.required, Validators.maxLength(50)]),
    ApellidoTitular: new FormControl(null,[Validators.required, Validators.maxLength(50)]),
    FechaVencimiento: new FormControl(null,[Validators.required, 
      Validators.pattern("(0[1-9]|1[012])[-/](20[2][2-9]|20[3-5][0-9])")]),
    Cvc: new FormControl(null,[Validators.required,Validators.pattern("[0-9]{3,4}")]),
  })

  FormPedidoCaRecepcion = new FormGroup({
    FechaRecepcion: new FormControl(null,[Validators.required, Validators.pattern("((0[1-9]|[12][0-9]|3[01])[\/.](0[13578]|1[02]))|((0[1-9]|[12][0-9]|30)[\/.](0[469]|11))|((0[1-9]|1[0-9]|2[0-8])[\/.](02))|(29[\/.](02))")]),
    Hora: new FormControl(null, [Validators.required]),
  })

  //Variables hardcodeadas utilizadas para la implementacion de la story

  EstadoCarrito = "Lleno";

  Opciones = [{ Nombre: "Efectivo" }, { Nombre: "Tarjeta de credito" }];
  OpcionesRecepcion = [{ Nombre: "Lo antes posible"}, { Nombre: "Elegir fecha y hora"}];
  
  Ciudades = [{ Nombre: "Alta Gracia" }, { Nombre: "Arroyito" }, { Nombre: "Bell Ville" }, { Nombre: "Córdoba" },
  { Nombre: "Cosquín" }, { Nombre: "Jesús María" }, { Nombre: "Marcos Juárez" }, { Nombre: "Río Cuarto" }, { Nombre: "Río Tercero" },
  { Nombre: "San Francisco" }, { Nombre: "Villa Carlos Paz" }, { Nombre: "Villa María" }, { Nombre: "Villa Nueva" }];

  Pedido = [{Nombre:"McCombo doble cuarto de libra", Imagen:"../../../assets/DobleCuartoDeLibra.png", Precio:"1200"}, 
  { Nombre: "McCombo cuarto de libra", Imagen:"../../../assets/CuartoDeLibra.png", Precio: "900"}, 
  {Nombre: "Sundae dulce de leche", Imagen:"../../../assets/SundaeDdl.png", Precio:"500"}];

  Tarjetas = [{Nombre:"Mastercard"}, {Nombre:"VISA"}]

  constructor() {}

  ngOnInit() {  }

  //Funcion que calcula el monto a pagar en base a pedidos hardcodeados
  calcularMonto(){
    let MontoPagar = 0
    if (this.EstadoCarrito == "Lleno"){
      for(let i = 0; i<this.Pedido.length; i++){
        MontoPagar += parseInt(this.Pedido[i].Precio)
      }
    }
    return MontoPagar
  }

  //Funcion que devuelve true si el monto es menor que el monto a pagar
  validarMonto(){
    let Monto: string;
    if(this.FormPedidoCaEfectivo.controls.Monto.value == null){
      Monto = "0";
    }
    else{
      Monto = this.FormPedidoCaEfectivo.controls.Monto.value;
    }
    
    let MontoAPagar = this.calcularMonto();
    return !(parseInt(Monto) >= MontoAPagar)
  }
  
  //Funcion que devuelve true en caso de que alguno de los formularios sea invalido
  //o de que el carrito esté vacio
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
    return(BoolPago || BoolRecepcion || this.FormPedidoCa.invalid || this.EstadoCarrito == "Vacio")
  }
  
  //Funcion que alterna el estado del carrito
  alternarCarrito(){
    this.EstadoCarrito == "Lleno" ? this.EstadoCarrito = "Vacio" : this.EstadoCarrito = "Lleno";
  }
  
  //Funcion que despliega la alerta para confirmar la realizacion del pedido
  //y que limpia los campos luego de la confirmacion
  grabar(){
    Swal.fire({
      title: "¿Está seguro de que desea realizar el pedido?",
      text: "",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar.",
      confirmButtonText: "Si, estoy seguro."
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "Pedido realizado con éxito",
          "",
          "success"
        )
        this.FormPedidoCa.reset({Ciudad: "Córdoba", FormaPago: "Efectivo", OpcionRecepcion: "Lo antes posible"} );
        this.FormPedidoCaEfectivo.reset();
        this.FormPedidoCaTarjeta.reset({Tarjeta: "Mastercard"});
        this.FormPedidoCaRecepcion.reset();
      }
    })
  }

  //Funcion que despliega la alerta para confirmar la cancelacion del pedido
  //y que limpia los campos luego de la cancelacion
  cancelar(){
    Swal.fire({
      title: "¿Está seguro de que desea cancelar el pedido?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "No cancelar.",
      confirmButtonText: "Si, estoy seguro."
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "Pedido cancelado",
          ""
        )
        this.FormPedidoCa.reset({Ciudad: "Córdoba", FormaPago: "Efectivo", OpcionRecepcion: "Lo antes posible"} );
        this.FormPedidoCaEfectivo.reset();
        this.FormPedidoCaTarjeta.reset({Tarjeta: "Mastercard"});
        this.FormPedidoCaRecepcion.reset();
      }
    })
  }
}

