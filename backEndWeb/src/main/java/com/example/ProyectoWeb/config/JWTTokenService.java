package com.example.ProyectoWeb.config;

import java.security.Key;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;


import com.fasterxml.jackson.databind.ObjectMapper;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JWTTokenService {
// @Value("${jwt.secret}")
    // private String secret = "DES6123";

    // @Value("${jwt.expiration}")
    private long jwtExpiration = 99999999;
    private Key jwtKey = Keys.secretKeyFor(SignatureAlgorithm.HS512);; // You need to set this key appropriately

    // Se genera token con tipo de usuario (Arrendador o Arrendatario)
    public String generarToken(int id, String userType) {

        ObjectMapper objectMapper = new ObjectMapper();
        String userID = "";
        try {
            userID = objectMapper.writeValueAsString(id);  // Convertir el ID del usuario a string
        } catch (Exception e) {
            e.printStackTrace();
        }

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);  // Establecer fecha de expiración

        Collection<? extends GrantedAuthority> authorities = new ArrayList<>();  // Autoridades del usuario (puedes agregar roles aquí)

        return Jwts.builder()
                .setSubject(userID)  // Establecer el sujeto (ID del usuario)
                .setIssuedAt(now)  // Fecha de emisión
                .setExpiration(expiryDate)  // Fecha de expiración
                .claim("userType", userType)  // Agregar tipo de usuario (Arrendador o Arrendatario)
                .claim("authorities", authorities.stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.toList()))  // Agregar las autoridades (roles)
                .signWith(jwtKey, SignatureAlgorithm.HS512)  // Firmar el JWT con la clave secreta
                .compact();  // Generar el token
    }

    public String getUserId(String jwtToken){
        System.out.println("\nsubject: "+decodificarToken(jwtToken).getSubject());
        return decodificarToken(jwtToken).getSubject();
    }
    public Date getFechaExpiracion(String jwtToken){
        return decodificarToken(jwtToken).getExpiration();
    }
    // Se obtiene el tipo de usuario del token
    public String getUserType(String jwtToken) {
        return decodificarToken(jwtToken).get("userType", String.class);  // Obtener el valor de 'userType' del token
    }

    public Claims decodificarToken(String jwtToken) {
        // byte[] secretBytes = secret.getBytes();
        // Key jwtKey = new SecretKeySpec(secretBytes, SignatureAlgorithm.HS512.getJcaName());

        return Jwts.parserBuilder()
                            .setSigningKey(jwtKey)
                            .build()
                            .parseClaimsJws(jwtToken)
                            .getBody();
    }
    public boolean validarToken(String token)
    {
        try
        {
            decodificarToken(token);
            return true;
        }catch(Exception e)
        {
            return false;
        }
    }
}
