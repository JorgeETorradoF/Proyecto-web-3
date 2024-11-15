package com.example.ProyectoWeb.prueba.controllers;

import com.example.ProyectoWeb.service.ServicioCalificacion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/calificaciones")
public class ControladorCalificacion extends ControladorUsuarioTemplate{

    @Autowired
    private ServicioCalificacion servicioCalificacion;

    @PostMapping("/arrendador/{id}")
    public ResponseEntity<?> calificarArrendador(@PathVariable Integer id,@RequestParam Double calificacion,@RequestHeader("Authorization") String token)  {

        if (!super.isAuthenticated() || !super.isArrendatario(token)) 
        {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(NOAUTENTICADOMSG);
        }

        int userId = super.getUserID(token);

        if (userId == -1) 
        {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(TOKENINVALIDOMSG);
        }

        try {
            return ResponseEntity.ok(servicioCalificacion.calificarArrendador(id, calificacion));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //se califica arrendatario
    @PostMapping("/arrendatario/{id}")
    public ResponseEntity<?> calificarArrendatario(@PathVariable Integer id,@RequestParam Float calificacion,@RequestHeader("Authorization") String token)  {
        //solo arrendadores pueden calificar al arrendatario
        if (!super.isAuthenticated() || !super.isArrendador(token)) 
        {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(NOAUTENTICADOMSG);
        }

        int userId = super.getUserID(token);
        
        if (userId == -1) 
        {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(TOKENINVALIDOMSG);
        }
            
            try {
                return ResponseEntity.ok(servicioCalificacion.calificarArrendatario(id, calificacion));
            } catch (RuntimeException e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        }
    }
