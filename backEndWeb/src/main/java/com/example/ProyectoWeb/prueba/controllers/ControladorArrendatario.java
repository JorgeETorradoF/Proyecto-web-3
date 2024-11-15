package com.example.ProyectoWeb.prueba.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.ProyectoWeb.dto.ContratoDTO;
import com.example.ProyectoWeb.service.ServicioContratos;


@Controller
@RequestMapping("/api/arrendatario")
public class ControladorArrendatario extends ControladorUsuarioTemplate{

    @Autowired
    private ServicioContratos servicioContratos;

    @PostMapping(value = "/solicitar-arriendo/{idPropiedad}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> solicitarArriendo(@PathVariable("idPropiedad") int idPropiedad, @RequestBody ContratoDTO contratoDTO, @RequestHeader("Authorization") String token)
    {
        int id = super.getUserID(token);
        if (id == -1) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(FALTAAUTORIZACIONMSG);
        }
         try {
            // se guarda
            return ResponseEntity.ok(servicioContratos.saveContrato(contratoDTO, id, idPropiedad));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al solicitar el arriendo: " + e.getMessage());
        }
    }
    @GetMapping("/mis-contratos")
    public @ResponseBody ResponseEntity<?> getContratos(@RequestHeader("Authorization") String token)
    {
        int id = super.getUserID(token);
        if (id == -1) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(FALTAAUTORIZACIONMSG);
        }
        return ResponseEntity.ok(servicioContratos.getContratosArrendatario(id));

    }
}
