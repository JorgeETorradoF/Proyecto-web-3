import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { RegistroService } from '../../services/registro.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})

export class LoginRegisterComponent {
  isActive: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private loginService: LoginService,
    private registroService: RegistroService,
    private router: Router
  ) {}

  // Cambiar a la vista de registro
  toggleRegister(): void {
    this.isActive = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Cambiar a la vista de login
  toggleLogin(): void {
    this.isActive = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  onLoginSubmit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const email = (form[0] as HTMLInputElement).value;
    const password = (form[1] as HTMLInputElement).value;

    this.loginService.login({ correo: email, contraseña: password }).subscribe(
      (response) => {
        console.log('Inicio de sesión exitoso:', response);

        if (response.userToken) {
          // Guardar el token en localStorage
          this.loginService.saveToken(response.userToken);
          console.log('Token guardado en localStorage:', localStorage.getItem('authToken'));

          // Decodificar el token para determinar el rol del usuario
          const payload = JSON.parse(atob(response.userToken.split('.')[1]));
          const userType = payload.userType;

          // Redirigir según el rol
          if (userType === 'ARRENDADOR') {
            this.router.navigate(['/arrendador']); // Redirige al panel principal de arrendadores
          } else if (userType === 'ARRENDATARIO') {
            this.router.navigate(['/arrendatario']); // Redirige al panel principal de arrendatarios
          } else {
            console.error('Rol no reconocido en el token:', userType);
            this.errorMessage = 'Rol no reconocido. Por favor, contacte al administrador.';
          }
        } else {
          console.error('El token no está presente en la respuesta del servidor.');
          this.errorMessage = 'Error al iniciar sesión. Por favor intente de nuevo.';
        }
      },
      (error) => {
        console.error('Error en el inicio de sesión:', error);
        this.errorMessage = error.error?.error || 'Error al iniciar sesión. Por favor intente de nuevo.';
      }
    );
  }


  // Manejo del formulario de registro
  onRegisterSubmit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;

    const name = (form[0] as HTMLInputElement).value; // Obtiene el nombre
    const lastName = (form[1] as HTMLInputElement).value; // Obtiene el apellido
    const email = (form[2] as HTMLInputElement).value; // Obtiene el correo
    const password = (form[3] as HTMLInputElement).value; // Obtiene la contraseña

    // Obtener el rol del input de radio
    const role = (form.elements.namedItem('role') as HTMLInputElement)?.value === 'arrendador'; // Obtiene el rol como booleano

    this.registroService.register({
      nombre: name.trim(),
      apellido: lastName.trim(),
      correo: email.trim(),
      contraseña: password,
      arrendador: role
    }).subscribe(
      (response) => {
        console.log('Registro exitoso:', response);

        // Guardar el token después del registro si lo provee el backend
        if (response.token) {
          this.loginService.saveToken(response.token);
        }

        // Redirigir según el rol del usuario
        role
          ? this.router.navigate(['/arrendador/${response.id}'])
          : this.router.navigate(['/arrendatario/${response.id}']);
        this.successMessage = 'Registro exitoso. Redirigiendo...';
      },
      (error) => {
        console.error('Error en el registro:', error);
        this.errorMessage =
          error.error?.error || 'Error al registrar usuario. Intente nuevamente.';
      }
    );
  }
}

