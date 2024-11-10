package com.example.ProyectoWeb.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JWTAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JWTTokenService jwtTokenService;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    private static final String HEADER = "Authorization";
    private static final String PREFIX = "Bearer ";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException 
    {
        String token = getJWT(request);
        if (token != null && jwtTokenService.validarToken(token))
        {
            String id = jwtTokenService.getUserId(token);
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(id);
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails,null, userDetails.getAuthorities());
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }
        filterChain.doFilter(request, response);
    }
            
    private String getJWT(HttpServletRequest request) {
        String authHeader = request.getHeader(HEADER);
        System.out.println("\nHeader: " + authHeader);
        if(authHeader != null && authHeader.startsWith(PREFIX))
        {
            return authHeader.replace(PREFIX, "");
        }
        return null;    
    }
    
}
