import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FisioterapeutaService } from '../../../services/Fisioterapeuta-service';
import { Fisioterapeuta } from '../../../models/FisioterapeutaDTO';

@Component({
  selector: 'app-list-fisioterapeuta',
  templateUrl: './list-fisioterapeuta.html',
  standalone: false,
  styleUrls: ['./list-fisioterapeuta.css']
})
export class ListFisioterapeutaComponent implements OnInit {

  fisioterapeutas: Fisioterapeuta[] = [];
  fisioterapeutasFiltrados: Fisioterapeuta[] = [];
  textoBusqueda: string = '';
  cargando: boolean = false;

  constructor(
    private fisioterapeutaService: FisioterapeutaService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.cdr.detectChanges();

    this.fisioterapeutaService.listAll().subscribe({
      next: (data) => {
        this.fisioterapeutas = [...data];
        this.fisioterapeutasFiltrados = [...data];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar fisioterapeutas', err);
        this.fisioterapeutas = [];
        this.fisioterapeutasFiltrados = [];
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  buscar(): void {
    const texto = this.textoBusqueda.toLowerCase().trim();

    if (!texto) {
      this.fisioterapeutasFiltrados = [...this.fisioterapeutas];
      this.cdr.detectChanges();
      return;
    }

    this.fisioterapeutasFiltrados = this.fisioterapeutas.filter(f =>
      f.nombre.toLowerCase().includes(texto) ||
      f.apellido.toLowerCase().includes(texto) ||
      f.especialidad.toLowerCase().includes(texto)
    );

    this.cdr.detectChanges();
  }

  verDiscapacidades(id: number): void {
    this.router.navigate(['/fisioterapeuta', id, 'discapacidad']);
  }
}