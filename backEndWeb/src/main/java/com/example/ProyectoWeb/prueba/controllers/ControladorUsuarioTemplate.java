package com.example.ProyectoWeb.prueba.controllers;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.ProyectoWeb.config.JWTTokenService;

public class ControladorUsuarioTemplate {
    
    protected static final String FALTAAUTORIZACIONMSG = "No autorizado para realizar esta acción";
    
    @Autowired
    private JWTTokenService jwtTokenService;

    public int getUserID(String authHeader) {
       
    if (authHeader != null && authHeader.startsWith("Bearer ")) {
            
        String token = authHeader.substring(7);
            
        if (jwtTokenService.getFechaExpiracion(token).after(new Date())) {
            return Integer.parseInt(jwtTokenService.getUserId(token));
        }
    }
    return -1;
    }
}
