package com.example.ProyectoWeb.service;

import com.example.ProyectoWeb.dto.RegistroDTO;
import com.example.ProyectoWeb.exception.CamposInvalidosException;
import com.example.ProyectoWeb.exception.CorreoRegistradoException;
import com.example.ProyectoWeb.model.Arrendadores;
import com.example.ProyectoWeb.model.Arrendatarios;
import com.example.ProyectoWeb.model.Usuario;
import com.example.ProyectoWeb.repository.RepositorioArrendadores;
import com.example.ProyectoWeb.repository.RepositorioArrendatarios;
import com.example.ProyectoWeb.config.JWTTokenService; 

import java.util.regex.Pattern;
import java.util.regex.Matcher;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ServicioRegistro {

    @Autowired
    private RepositorioArrendadores repositorioArrendadores;

    @Autowired
    private RepositorioArrendatarios repositorioArrendatarios;

    @Autowired
    private JWTTokenService jwtTokenService;

    // Validamos que no estén vacíos los nombres y apellidos
    public boolean nombresApellidosValidos(String nombre, String apellido) {
        return !nombre.isEmpty() && !apellido.isEmpty();
    }

    // Validamos que la contraseña no esté vacía
    public boolean contraseñaValida(String contraseña) {
        // Luego validamos lo de contraseña segura con x dígitos y mezclando símbolos y tal
        return !contraseña.isEmpty();
    }

    // Validamos el correo con regex
    public boolean emailValido(String email) {
        String EMAIL_PATTERN = 
        "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
        Pattern pattern = Pattern.compile(EMAIL_PATTERN);
        if (email == null || email.isEmpty()) {
            return false;
        }
        Matcher matcher = pattern.matcher(email);
        return matcher.matches();
    }

    // Registro de usuario
    public String registerUser(RegistroDTO registroDTO) throws CorreoRegistradoException, CamposInvalidosException {
        Usuario savedUser = null;
        String role = "";
        // Si todos los campos están llenos y son válidos se prosigue con el registro
        if(nombresApellidosValidos(registroDTO.getNombre(),registroDTO.getApellido()) && 
           contraseñaValida(registroDTO.getContraseña()) && 
           emailValido(registroDTO.getCorreo())) {
            // Revisamos que el correo no haya sido ya registrado
            boolean existeCorreo = repositorioArrendadores.existsByCorreo(registroDTO.getCorreo()) || 
                                   repositorioArrendatarios.existsByCorreo(registroDTO.getCorreo());

            // Dependiendo de si hay correo registrado o no y qué tipo de usuario será, se realiza el registro
            if (registroDTO.isArrendador() && !existeCorreo) {
                role = "ARRENDADOR";
                Arrendadores arrendador = new Arrendadores();
                arrendador.setNombre(registroDTO.getNombre());
                arrendador.setApellido(registroDTO.getApellido());
                arrendador.setCorreo(registroDTO.getCorreo());
                arrendador.setContraseña(registroDTO.getContraseña());
                arrendador.setPromedio(0.0f); // Asegurando que promedio no sea null
                arrendador.setCantiCalif(0);  // Asegurando que cantiCalif no sea null
                savedUser = repositorioArrendadores.save(arrendador);
            } else if(!registroDTO.isArrendador() && !existeCorreo) {
                role = "ARRENDATARIO";
                Arrendatarios arrendatario = new Arrendatarios();
                arrendatario.setNombre(registroDTO.getNombre());
                arrendatario.setApellido(registroDTO.getApellido());
                arrendatario.setCorreo(registroDTO.getCorreo());
                arrendatario.setContraseña(registroDTO.getContraseña());
                arrendatario.setPromedio(0.0f); // Asegurando que promedio no sea null
                arrendatario.setCantiCalif(0);  // Asegurando que cantiCalif no sea null
                savedUser = repositorioArrendatarios.save(arrendatario);
            } else {
                // Mensaje de error correo ya existe
                throw new CorreoRegistradoException("Correo ya registrado");
            }
        } else {
            // Mensaje de error: llene todos los campos
            throw new CamposInvalidosException("Por favor llene todos los campos e ingrese un correo válido");
        }
        return jwtTokenService.generarToken(savedUser.getId(), role);
    }
}
