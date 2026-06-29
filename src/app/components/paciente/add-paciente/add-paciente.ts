import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteService } from '../../../services/paciente.service';

@Component({
  selector: 'app-add-paciente',
  templateUrl: './add-paciente.html',
  styleUrls: ['./add-paciente.css']
})
export class AddPacienteComponent implements OnInit {
  form: FormGroup;
  id: number | null = null;

  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: [null, [Validators.required, Validators.min(1)]],
      sexo: ['', Validators.required],
      userId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      this.id = Number(paramId);
      this.pacienteService.listAll().subscribe(pacientes => {
        const paciente = pacientes.find(p => p.id === this.id);
        if (paciente) {
          this.form.patchValue(paciente);
        }
      });
    }
  }

  guardar(): void {
    if (this.form.invalid) return;

    if (this.id) {
      this.pacienteService.update({ id: this.id, ...this.form.value }).subscribe({
        next: () => this.router.navigate(['/pacientes']),
        error: (err) => console.error('Error al actualizar', err)
      });
    } else {
      this.pacienteService.add(this.form.value).subscribe({
        next: () => this.router.navigate(['/pacientes']),
        error: (err) => console.error('Error al crear', err)
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/pacientes']);
  }
}
