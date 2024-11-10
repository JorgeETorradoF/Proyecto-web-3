package com.example.ProyectoWeb.prueba.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.ProyectoWeb.model.Arrendadores;
import com.example.ProyectoWeb.model.Arrendatarios;
import com.example.ProyectoWeb.model.Propiedades;
import com.example.ProyectoWeb.service.ServicioPropiedad;
import com.example.ProyectoWeb.service.ServicioUsuarios;

@Controller
@RequestMapping("/api")
public class ControladorGetAll {

    @Autowired
    private ServicioPropiedad servicioPropiedades;  // Se asume que existe un servicio llamado ServicioPropiedades
    @Autowired
    private ServicioUsuarios servicioUsuarios;

    @GetMapping("/get-propiedades")
    public @ResponseBody Iterable<Propiedades> getAllPropiedades() {
        return servicioPropiedades.getAllPropiedades();  // Se asume que este método existe en el servicio
    }
    @GetMapping("/get-arrendadores")
    public @ResponseBody Iterable<Arrendadores> getAllArrendadores() {
        return servicioUsuarios.getAllArrendadores();  // Se asume que este método existe en el servicio
    }
    @GetMapping("/get-arrendatarios")
    public @ResponseBody Iterable<Arrendatarios> getAllArrendatarios() {
        return servicioUsuarios.getAllArrendatarios();  // Se asume que este método existe en el servicio
    }
}

