import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { TipoDiscapacidadService } from
  '../../../services/tipo-discapacidad-services';
import { TipoDiscapacidad } from
  '../../../models/tipodiscapacidadDTO';

@Component({
  selector: 'app-add-tipo-discapacidad',
  templateUrl: './add-tipo-discapacidad.html',
  standalone: false,
  styleUrls: ['./add-tipo-discapacidad.css']
})
export class AddTipoDiscapacidadComponent
  implements OnInit {

  form: FormGroup;
  id: number | null = null;

  constructor(
    private fb: FormBuilder,
    private tipoDiscapacidadService:
      TipoDiscapacidadService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap
      .get('tipoDiscapacidadId');

    if (paramId === null) {
      return;
    }

    const idRecibido = Number(paramId);

    if (
      !Number.isInteger(idRecibido) ||
      idRecibido <= 0
    ) {
      console.error(
        'El id del tipo de discapacidad no es válido'
      );

      this.router.navigate([
        '/tipo-discapacidad/list-tipos'
      ]);

      return;
    }

    this.id = idRecibido;

    this.tipoDiscapacidadService.listAll().subscribe({
      next: (tipos: TipoDiscapacidad[]) => {
        const tipoEncontrado = tipos.find(
          tipo => Number(tipo.id) === idRecibido
        );

        if (!tipoEncontrado) {
          console.error(
            'No se encontró el tipo de discapacidad'
          );

          this.router.navigate([
            '/tipo-discapacidad/list-tipos'
          ]);

          return;
        }

        this.form.patchValue({
          nombre: tipoEncontrado.nombre,
          descripcion: tipoEncontrado.descripcion
        });
      },
      error: (err) => {
        console.error(
          'Error al cargar el tipo de discapacidad',
          err
        );
      }
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const datos = {
      nombre: String(
        this.form.get('nombre')?.value ?? ''
      ).trim(),
      descripcion: String(
        this.form.get('descripcion')?.value ?? ''
      ).trim()
    };

    if (this.id !== null) {
      this.tipoDiscapacidadService.update({
        id: this.id,
        ...datos
      }).subscribe({
        next: () => {
          this.router.navigate([
            '/tipo-discapacidad/list-tipos'
          ]);
        },
        error: (err) => {
          console.error(
            'Error al actualizar el tipo de discapacidad',
            err
          );
        }
      });

      return;
    }

    this.tipoDiscapacidadService.add(datos).subscribe({
      next: () => {
        this.router.navigate([
          '/tipo-discapacidad/list-tipos'
        ]);
      },
      error: (err) => {
        console.error(
          'Error al crear el tipo de discapacidad',
          err
        );
      }
    });
  }

  cancelar(): void {
    this.router.navigate([
      '/tipo-discapacidad/list-tipos'
    ]);
  }
}