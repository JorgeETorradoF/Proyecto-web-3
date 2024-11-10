package com.example.ProyectoWeb.config;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

import com.example.ProyectoWeb.model.Arrendadores;
import com.example.ProyectoWeb.model.Arrendatarios;
import com.example.ProyectoWeb.repository.RepositorioArrendadores;
import com.example.ProyectoWeb.repository.RepositorioArrendatarios;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private RepositorioArrendadores repositorioArrendadores;

    @Autowired
    private RepositorioArrendatarios repositorioArrendatarios;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Verificar en el repositorio de arrendadores
        Optional<Arrendadores> arrendador = repositorioArrendadores.findById(Integer.parseInt(username));
        if (arrendador.isPresent()) {
            return User.withUsername(arrendador.get().getCorreo())
                    .password(arrendador.get().getContraseña())
                    .authorities("ARRRENDADOR") // Asignar roles según sea necesario
                    .accountExpired(false)
                    .accountLocked(false)
                    .credentialsExpired(false)
                    .disabled(false)
                    .build();
        }

        // Verificar en el repositorio de arrendatarios
        Optional <Arrendatarios> arrendatario = repositorioArrendatarios.findById(Integer.parseInt(username));
        if (arrendatario.isPresent()) {
            return User.withUsername(arrendatario.get().getCorreo())
                    .password(arrendatario.get().getContraseña())
                    .authorities("ARRRENDATARIO") // Asignar roles según sea necesario
                    .accountExpired(false)
                    .accountLocked(false)
                    .credentialsExpired(false)
                    .disabled(false)
                    .build();
        }

        throw new UsernameNotFoundException("Usuario no encontrado: " + username);
    }
}