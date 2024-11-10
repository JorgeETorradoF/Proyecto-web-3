package com.example.ProyectoWeb.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;

import java.io.IOException;
import java.util.Date;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class JWTAuthorizationFilter extends OncePerRequestFilter {

    @Autowired
    JWTTokenService jwtTokenService;
    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {
        try {
            String jwtToken = obtenerToken(request);
            if (jwtToken != null) {
                Claims claims = jwtTokenService.decodificarToken(jwtToken);
                if (claims.getExpiration().after(new Date())) {
                    String username = claims.getSubject();
                    UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
                    
                    // Aquí estableces la autenticación en el contexto de seguridad
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.out.println("\nToken de username password authentication: "+authentication);
                } else {
                    throw new Exception("Token expirado");
                }
            }
            System.out.println("\nse va pal otro");
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.getWriter().write("Error de autenticación: " + e.getMessage());
        }
    }
    private String obtenerToken(HttpServletRequest request) {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        System.out.println("\nHeader value: " + header);
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7); // Elimina "Bearer " del encabezado
        }
        return null;
    }
    

}