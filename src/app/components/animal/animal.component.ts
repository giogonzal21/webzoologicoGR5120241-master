import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable, take } from 'rxjs';
import { AnimalService } from '../../services/animal.service';
import { FormBuilder } from '@angular/forms';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-animal',
  templateUrl: './animal.component.html',
  styleUrl: './animal.component.css'
})
export class AnimalComponent {

  titlePage: string = 'Animalitos';
  animalList: any = [];
  animalForm: any = this.formBuilder.group({
    nombre: '',
    edad: 0,
    tipo: '',
    fecha: Date
  })
  editableAnimal: boolean = false;
  idAnimal: any;
  user = 'Usuario';


  constructor(private animalService: AnimalService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService) {


  }
  ngOnInit() {
    this.getAllAnimals();
  }


  getAllAnimals() {
    this.animalService.getAllAnimalsData().subscribe(
      (data: {}) => {
        this.animalList = data
      }
    );
  }

  newAnimalEntry() {
    this.animalService.newAnimal(localStorage.getItem('accessToken'), this.animalForm.value).subscribe(
      () => {
        //Redirigiendo a la ruta actual /animal y recargando la ventana
        this.router.navigate(['/animal']).then(() => {
          this.newMessage('Registro exitoso');
        })
      }
    );
  }


  newMessage(messageText: string) {
    this.toastr.success('Clic aquÃ­ para actualizar la lista', messageText)
      .onTap
      .pipe(take(1))
      .subscribe(() => window.location.reload());
  }

  updateAnimalEntry() {
    //Removiendo valores vacios del formulario de actualizaciÃ³n
    for (let key in this.animalForm.value) {
      if (this.animalForm.value[key] === '') {
        this.animalForm.removeControl(key);
      }
    }
    this.animalService.updateAnimal(localStorage.getItem('accessToken'), this.idAnimal, this.animalForm.value).subscribe(
      () => {
        //Enviando mensaje de confirmaciÃ³n
        this.newMessage("Animal editado");
      }
    );
  }

  toggleEditAnimal(id: any) {
    this.idAnimal = id;
    console.log(this.idAnimal)
    this.animalService.getOneAnimal(localStorage.getItem('accessToken'), id).subscribe(
      data => {
        this.animalForm.setValue({
          nombre: data.nombre,
          edad: data.edad,
          tipo: data.tipo,
          fecha: this.getValidDate(data.fecha)
        });
      }
    );
    this.editableAnimal = !this.editableAnimal;
  }

  getValidDate(fecha: Date) {
    const fechaFinal: Date = new Date(fecha);
    //separado los datos
    var dd = fechaFinal.getDate() + 1;//fue necesario porque siempre daba un dÃ­a antes
    var mm = fechaFinal.getMonth() + 1; //porque Enero es 0
    var yyyy = fechaFinal.getFullYear();
    var mes = '';
    var dia = '';

    //Como algunos meses tienen 31 dÃ­as dd puede dar 32
    if (dd == 32) {
      dd = 1;
      mm++;
    }
    //TransformaciÃ³n de fecha cuando el dÃ­a o mes son menores a 10
    //se le coloca un cero al inicio
    //DÃ­a
    if (dd < 10) {
      dia += `0${dd}`;
    } else {
      dia += `${dd}`;
    }
    //Mes
    if (mm < 10) {
      mes += `0${mm}`;
    } else {
      mes += `${mm}`;
    }
    //formatDate para colocar la fecha en un formato aceptado por el calendario
    //GMT-0500 es para Colombia
    var finalDate = formatDate(new Date(yyyy + '-' + mes + '-' + dia + ' GMT-0500'), 'yyyy-MM-dd', "en-US");
    return finalDate;
  }

  deleteAnimalEntry(id: any) {
    console.log(id)
    this.animalService.deleteAnimal(localStorage.getItem('accessToken'), id).subscribe(
      () => {
        //Enviando mensaje de confirmaciÃ³n
        this.newMessage("Animal eliminado");
      }
    );
  }
}
