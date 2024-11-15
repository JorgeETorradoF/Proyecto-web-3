package com.example.ProyectoWeb.prueba.controllers;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.example.ProyectoWeb.config.JWTTokenService;

public class ControladorUsuarioTemplate {
    
    protected static final String TOKENINVALIDOMSG = "Token inválido";

    protected static final String NOAUTENTICADOMSG = "Usuario no autenticado";
    
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
    public boolean isAuthenticated() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    return authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken);
}

}
