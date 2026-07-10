import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoDiscapacidadService } from '../../../services/tipo-discapacidad-services';


@Component({
  selector: 'app-add-tipo-discapacidad',
  templateUrl: './add-tipo-discapacidad.html',
  standalone: false,
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
    this.tipoDiscapacidadService.listAll().subscribe({
      next: (tipos) => {
        console.log('tipos:', tipos);
        console.log('buscando id:', this.id);
        
        const tipo = tipos.find(t => Number(t.id) === Number(this.id));
        console.log('tipo encontrado:', tipo);
        if (tipo) {
          this.form.patchValue(tipo);
        }
      },
      error: (err) => console.error('Error al cargar tipo', err)
    });
  }
}

  guardar(): void {
    if (this.form.invalid) return;

    if (this.id) {
      this.tipoDiscapacidadService.update({ id: this.id, ...this.form.value }).subscribe({
        next: () => this.router.navigate(['/tipo-discapacidad/list-tipos']), 
        error: (err) => console.error('Error al actualizar', err)
      });
    } else {
      this.tipoDiscapacidadService.add(this.form.value).subscribe({
        next: () => this.router.navigate(['/tipo-discapacidad/list-tipos']), 
        error: (err) => console.error('Error al crear', err)
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/tipo-discapacidad/list-tipos']); 
  }
}
