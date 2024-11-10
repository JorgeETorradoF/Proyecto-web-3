package com.example.ProyectoWeb.service;

import com.example.ProyectoWeb.dto.LoginDTO;
import com.example.ProyectoWeb.dto.RespuestaLoginDTO;
import com.example.ProyectoWeb.exception.CorreoNoExistenteException;
import com.example.ProyectoWeb.model.Arrendadores;
import com.example.ProyectoWeb.model.Arrendatarios;
import com.example.ProyectoWeb.model.Usuario;
import com.example.ProyectoWeb.repository.RepositorioArrendadores;
import com.example.ProyectoWeb.repository.RepositorioArrendatarios;
import com.example.ProyectoWeb.config.JWTTokenService;  // Asegúrate de que tengas este servicio

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ServicioLogin {

    @Autowired
    private RepositorioArrendadores repositorioArrendadores;

    @Autowired
    private RepositorioArrendatarios repositorioArrendatarios;

    @Autowired
    private JWTTokenService jwtTokenService;  // El servicio que genera el token JWT

    public boolean contraseñaValida(String contraseña) {
        return !contraseña.isEmpty();
    }

    public boolean emailValido(String email) {
        String EMAIL_PATTERN = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
        return email != null && email.matches(EMAIL_PATTERN);
    }

    public RespuestaLoginDTO loginUser(LoginDTO loginDTO) throws CorreoNoExistenteException {
        RespuestaLoginDTO respuesta = new RespuestaLoginDTO(0, false);

        if (contraseñaValida(loginDTO.getContraseña()) && emailValido(loginDTO.getCorreo())) {
            boolean existeCorreoArrendador = repositorioArrendadores.existsByCorreo(loginDTO.getCorreo());
            boolean existeCorreoArrendatario = repositorioArrendatarios.existsByCorreo(loginDTO.getCorreo());

            if (existeCorreoArrendador) {
                Arrendadores arrendador = repositorioArrendadores.findByCorreo(loginDTO.getCorreo());
                if (arrendador.getContraseña().equals(loginDTO.getContraseña())) {
                    respuesta.setId(arrendador.getId());
                    respuesta.setArrendador(true);
                }
            } else if (existeCorreoArrendatario) {
                Arrendatarios arrendatario = repositorioArrendatarios.findByCorreo(loginDTO.getCorreo());
                if (arrendatario.getContraseña().equals(loginDTO.getContraseña())) {
                    respuesta.setId(arrendatario.getId());
                    respuesta.setArrendador(false);
                }
            } else {
                throw new CorreoNoExistenteException("Correo no existente");
            }
        }

        return respuesta;
    }
}
