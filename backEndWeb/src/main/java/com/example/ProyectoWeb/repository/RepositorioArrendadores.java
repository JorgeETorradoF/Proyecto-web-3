package com.example.ProyectoWeb.repository;

import com.example.ProyectoWeb.model.Arrendadores;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RepositorioArrendadores extends CrudRepository<Arrendadores, Integer> {
    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Arrendadores a WHERE a.correo = :correo")
    boolean existsByCorreo(@Param("correo") String correo);

    @Query("SELECT a FROM Arrendadores a WHERE a.correo = :correo")
    Arrendadores findByCorreo(@Param("correo") String correo);

    @Query("SELECT a FROM Arrendadores a WHERE a.id = :id")
    Arrendadores findByCorreo(@Param("id") int id);
}
