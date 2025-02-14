package com.example.calificaciones.service;

import com.example.calificaciones.model.Alumno;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class AlumnoService {
    @Value("${app.datafile}")
    private String archivoJson;
    
    private ObjectMapper objectMapper = new ObjectMapper();
    private int idActual = 1;

    private List<Alumno> cargarAlumnosDesdeArchivo() {
        try {
            File file = new File(archivoJson);
            if (!file.exists()) {
                return new ArrayList<>();
            }
            return objectMapper.readValue(file, new TypeReference<List<Alumno>>() {});
        } catch (IOException e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    private void guardarAlumnosEnArchivo(List<Alumno> alumnos) {
        try {
            objectMapper.writeValue(new File(archivoJson), alumnos);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public List<Alumno> obtenerTodos() {
        return cargarAlumnosDesdeArchivo();
    }

    public Alumno obtenerPorId(int id) {
        return cargarAlumnosDesdeArchivo().stream()
                .filter(a -> a.getId() == id)
                .findFirst()
                .orElse(null);
    }

    public Alumno agregarAlumno(Alumno alumno) {
        List<Alumno> alumnos = cargarAlumnosDesdeArchivo();
        alumno.setId(idActual);
        alumnos.add(alumno);
        idActual++;
        guardarAlumnosEnArchivo(alumnos);
        return alumno;
    }

    public void actualizarNota(int id, double nuevaNota) {
        List<Alumno> alumnos = cargarAlumnosDesdeArchivo();
        for (Alumno alumno : alumnos) {
            if (alumno.getId() == id) {
                alumno.setNota(nuevaNota);
                break;
            }
        }
        guardarAlumnosEnArchivo(alumnos);
    }

    public void eliminarAlumno(int id) {
        List<Alumno> alumnos = cargarAlumnosDesdeArchivo();
        alumnos.removeIf(a -> a.getId() == id);
        guardarAlumnosEnArchivo(alumnos);
    }
}
