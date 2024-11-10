package com.example.ProyectoWeb.repository;

import com.example.ProyectoWeb.model.Arrendadores;
import com.example.ProyectoWeb.model.Arrendatarios;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RepositorioArrendatarios extends CrudRepository<Arrendatarios, Integer> {
    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Arrendatarios a WHERE a.correo = :correo")
    boolean existsByCorreo(@Param("correo") String correo);

    @Query("SELECT a FROM Arrendatarios a WHERE a.correo = :correo")
    Arrendatarios findByCorreo(@Param("correo") String correo);
    @Query("SELECT a FROM Arrendatarios a WHERE a.id = :id")
    Arrendatarios findByCorreo(@Param("id") int id);
}
