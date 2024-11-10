package com.example.ProyectoWeb.prueba.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.ProyectoWeb.service.ServicioRegistro;
import com.example.ProyectoWeb.dto.RegistroDTO;
import com.example.ProyectoWeb.exception.CamposInvalidosException;
import com.example.ProyectoWeb.exception.CorreoRegistradoException;
import com.example.ProyectoWeb.model.Usuario;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/crear-cuenta")
public class ControladorRegistro {
    
    @Autowired
    private ServicioRegistro servicioRegistro;
    
    @PostMapping(consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> registrarUsuario(@RequestBody RegistroDTO registroDTO) {
        try {

            String usuario = servicioRegistro.registerUser(registroDTO);
            return ResponseEntity.ok(usuario);

        } catch (CorreoRegistradoException e) {

            // Crear un objeto JSON para el mensaje de error
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            
        } catch(CamposInvalidosException e)
        {
            // Crear un objeto JSON para el mensaje de error
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);

        } catch (Exception e) {
            // Crear un objeto JSON para un error genérico
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Hubo un problema con el registro. Por favor, inténtelo de nuevo más tarde.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
