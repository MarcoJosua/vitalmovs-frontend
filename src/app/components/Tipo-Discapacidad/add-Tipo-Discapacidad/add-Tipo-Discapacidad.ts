import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoDiscapacidadService } from '../../../services/tipo-discapacidad.service';

@Component({
  selector: 'app-add-tipo-discapacidad',
  templateUrl: './add-tipo-discapacidad.html',
  styleUrls: ['./add-tipo-discapacidad.css']
})
export class AddTipoDiscapacidadComponent implements OnInit {
  form: FormGroup;
  id: number | null = null;

  constructor(
    private fb: FormBuilder,
    private tipoDiscapacidadService: TipoDiscapacidadService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      this.id = Number(paramId);
      this.tipoDiscapacidadService.listAll().subscribe(tipos => {
        const tipo = tipos.find(t => t.id === this.id);
        if (tipo) {
          this.form.patchValue(tipo);
        }
      });
    }
  }

  guardar(): void {
    if (this.form.invalid) return;

    if (this.id) {
      this.tipoDiscapacidadService.update({ id: this.id, ...this.form.value }).subscribe({
        next: () => this.router.navigate(['/tipos-discapacidad']),
        error: (err) => console.error('Error al actualizar', err)
      });
    } else {
      this.tipoDiscapacidadService.add(this.form.value).subscribe({
        next: () => this.router.navigate(['/tipos-discapacidad']),
        error: (err) => console.error('Error al crear', err)
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/tipos-discapacidad']);
  }
}
