package com.example.ProyectoWeb.prueba.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.ProyectoWeb.dto.PropiedadDTO;
import com.example.ProyectoWeb.exception.PropNoEncontradaException;
import com.example.ProyectoWeb.exception.ContratoNoExistenteException;
import com.example.ProyectoWeb.model.Contratos;
import com.example.ProyectoWeb.model.Propiedades;
import com.example.ProyectoWeb.service.ServicioContratos;
import com.example.ProyectoWeb.service.ServicioPropiedad;


import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Controller
@RequestMapping("/api/arrendador/{id}")
public class ControladorArrendador {

    @Autowired
    private ServicioPropiedad servicioPropiedad;
    @Autowired
    private ServicioContratos servicioContratos;

    private static final Logger logger = LoggerFactory.getLogger(ControladorArrendador.class);

    // Directorio raíz para guardar imágenes
    private static final String UPLOAD_DIRECTORY = System.getProperty("user.dir") + "/uploads/";
    


    @PostMapping(value = "/registrar-propiedad", consumes = "multipart/form-data", produces = "application/json")
    public ResponseEntity<?> registrarPropiedad(
            @RequestPart("propiedadDTO") PropiedadDTO propiedadDTO,
            @RequestPart("imagen") MultipartFile imagen,
            @PathVariable("id") int id) {
        logger.info("Iniciando registro de propiedad para el arrendador con ID: {}", id);
        propiedadDTO.setIdArrendador(id);
        propiedadDTO.setEstado("activo");

        try {
            // Verifica si la imagen no está vacía
            if (!imagen.isEmpty()) {
                String directorioArrendador = UPLOAD_DIRECTORY + "arrendador_" + id;
                File directorio = new File(directorioArrendador);

                if (!directorio.exists()) {
                    directorio.mkdirs();
                }

                String nombreImagen = System.currentTimeMillis() + "_" + imagen.getOriginalFilename();
                Path rutaImagen = Paths.get(directorioArrendador, nombreImagen);
                Files.copy(imagen.getInputStream(), rutaImagen, StandardCopyOption.REPLACE_EXISTING);
                propiedadDTO.setUrlImagen("/api/arrendador/imagenes/" + nombreImagen);
            }

            // Guardar la propiedad
            return ResponseEntity.ok(servicioPropiedad.savePropiedad(propiedadDTO));

        } catch (IOException e) {
            logger.error("Error al guardar la imagen para el arrendador con ID: {}. Detalles: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al guardar la imagen: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Error al registrar la propiedad para el arrendador con ID: {}. Detalles: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al registrar la propiedad: " + e.getMessage());
        }
    }


    // Método para servir imágenes guardadas
    @GetMapping("/imagenes/{nombreImagen}")
    @ResponseBody
    public ResponseEntity<byte[]> obtenerImagen(@PathVariable("id") String id,@PathVariable("nombreImagen") String nombreImagen) {
        try {
            Path rutaImagen = Paths.get(UPLOAD_DIRECTORY + "arrendador_" + id, nombreImagen);
            byte[] imagen = Files.readAllBytes(rutaImagen);
            return ResponseEntity.ok(imagen);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // Obtener todas las propiedades de un arrendador
    @GetMapping("/propiedades")
    public @ResponseBody Iterable<Propiedades> getAllProperties(@PathVariable int id) {
        try {
            return servicioPropiedad.getPropiedades(id);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error: ", e);
        }
    }

    // Modificar propiedad existente
    @PutMapping("/modificar-propiedad/{propId}")
    public ResponseEntity<?> modificarPropiedad(
            @PathVariable("id") int id,
            @PathVariable("propId") int propId,
            @RequestBody PropiedadDTO propiedadDTO,
            Model model) {

        model.addAttribute("id", id);
        model.addAttribute("propId", propId);
        propiedadDTO.setIdArrendador(id);

        try {
            // Log para validar los datos recibidos
            logger.info("Recibiendo propiedad para editar. ID Arrendador: {}, ID Propiedad: {}, Datos: {}",
                    id, propId, propiedadDTO);

            // Llamada al servicio para modificar la propiedad
            return ResponseEntity.ok(servicioPropiedad.modifyPropiedad(propiedadDTO, propId));
        } catch (Exception e) {
            // Log de error con el mensaje
            logger.error("Error al modificar la propiedad: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error al modificar la propiedad: " + e.getMessage());
        }
    }


    // Mostrar detalle de una propiedad
    @GetMapping("/propiedad/{propiedadId}")
    public ResponseEntity<?> mostrarDetallePropiedad(@PathVariable("id") int id, @PathVariable("propiedadId") int propiedadId, Model model) {
        try {
            return ResponseEntity.ok(servicioPropiedad.getPropiedad(propiedadId, id));
        } catch (PropNoEncontradaException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al obtener la propiedad: " + e.getMessage());
        }
    }

    // Obtener contratos del arrendador
    @GetMapping("/mis-contratos")
    public @ResponseBody Iterable<Contratos> getContratos(@PathVariable("id") int id, Model model) {
        model.addAttribute("id", id);
        return servicioContratos.getContratosArrendador(id);
    }

    // Aceptar contrato
    @PutMapping("/aceptar-contrato/{contratoId}")
    public ResponseEntity<?> aceptarContrato(@PathVariable("id") int id, @PathVariable("contratoId") int contratoId) {
        try {
            Contratos contratoAceptado = servicioContratos.aceptarContrato(contratoId);
            return ResponseEntity.ok(contratoAceptado);
        } catch (ContratoNoExistenteException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Error al aceptar el contrato: " + e.getMessage());
        }
    }

    // Rechazar contrato
    @PutMapping("/rechazar-contrato/{contratoId}")
    public ResponseEntity<?> rechazarContrato(@PathVariable("id") int id, @PathVariable("contratoId") int contratoId) {
        try {
            Contratos contratoRechazado = servicioContratos.rechazarContrato(contratoId);
            return ResponseEntity.ok(contratoRechazado);
        } catch (ContratoNoExistenteException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Error al rechazar el contrato: " + e.getMessage());
        }
    }
}
