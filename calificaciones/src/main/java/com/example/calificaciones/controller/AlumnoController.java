package com.example.calificaciones.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.calificaciones.model.Alumno;
import com.example.calificaciones.service.AlumnoService;

@RestController
@RequestMapping("/alumnos")
public class AlumnoController {

    //Llamar a la clase
    private final AlumnoService alumnoService;

    private AlumnoController (AlumnoService alumnoService) {
        this.alumnoService = alumnoService;
    }

    @GetMapping
    public List<Alumno> obtenerTodos(){
        return alumnoService.obtenerTodos();
    }
    //Obtener el alumno por id
    @GetMapping("/{id}")
    public Alumno obtenerPorId(@PathVariable int id){
        return alumnoService.obtenerPorId(id);
    }

    //Agregar un nuevo alumno
    @PostMapping
    public Alumno agregarAlumno(@RequestBody Alumno alumno){
        return alumnoService.agregarAlumno(alumno);
    }

    //Actualizar la nota del alumno

    @PutMapping
    public void actualizarNota(@PathVariable int id, @RequestParam double nota){
        alumnoService.actualizarNota(id, nota);
    }

    //Eliminar alumno

    @DeleteMapping("/{id}")
    public void eliminarAlumno(@PathVariable int id){
        alumnoService.eliminarAlumno(id);
    };

}
