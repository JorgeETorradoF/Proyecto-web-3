package com.example.ProyectoWeb.config;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.example.ProyectoWeb.model.Usuario;

@Service
public class UsuarioService {


    // @Autowired
    // UsuarioRepository usuarioRepository;
    @Autowired
	ModelMapper modelMapper;
    

    public Usuario autorizacion( Authentication authentication ) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        System.out.println("-----------------------");
        System.out.println(  authentication.getName() );
        Usuario usuario = objectMapper.readValue(authentication.getName(), Usuario.class);
        System.out.println("-----------------------"); 
        return usuario;
    }
}
