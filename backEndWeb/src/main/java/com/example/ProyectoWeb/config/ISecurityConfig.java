package com.example.ProyectoWeb.config;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

public interface ISecurityConfig {

    PasswordEncoder passwordEncoder();

    AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception;

    SecurityFilterChain configure(HttpSecurity http) throws Exception;

}