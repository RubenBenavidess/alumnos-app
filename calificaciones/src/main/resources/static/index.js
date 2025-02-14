let chart = null;

// Obtener y mostrar alumnos
function obtenerAlumnos() {
    fetch("http://localhost:8080/alumnos")
        .then(response => response.json())
        .then(data => {
            refreshTable(data);
            refreshChart(data);
        })
        .catch(error => console.error("Error al obtener alumnos:", error));
}

// Modificado el formulario para usar API
document.getElementById('studentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const nombre = document.getElementById('studentName').value;
    const nota = parseFloat(document.getElementById('studentGrade').value);
    
    if(nombre && !isNaN(nota) && nota >= 0 && nota <= 10) {
        fetch("http://localhost:8080/alumnos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                nombre, 
                nota,
                calificacion: nota >= 6 ? 'Aprobado' : 'Reprobado'
            })
        })
        .then(() => {
            this.reset();
            obtenerAlumnos();
        })
        .catch(error => console.error("Error al agregar alumno:", error));
    }
});

// Función de actualización modificada
function actualizarNota(id, nuevaNota) {
    fetch(`http://localhost:8080/alumnos/${id}?nota=${nuevaNota}`, { 
        method: "PUT" 
    })
    .then(() => {
        obtenerAlumnos();
    })
    .catch(error => console.error("Error al actualizar nota:", error));
}

// Función de eliminación modificada
function eliminarAlumno(id) {
    fetch(`http://localhost:8080/alumnos/${id}`, { 
        method: "DELETE" 
    })
    .then(() => {
        obtenerAlumnos();
    })
    .catch(error => console.error("Error al eliminar alumno:", error));
}

// Tabla dinámica actualizada
function refreshTable(data) {
    const searchTerm = document.getElementById('searchName').value.toLowerCase();
    const minGrade = parseFloat(document.getElementById('minGrade').value) || 0;
    const maxGrade = parseFloat(document.getElementById('maxGrade').value) || 10;
    
    let filtered = data.filter(student => 
        student.nota >= minGrade && 
        student.nota <= maxGrade &&
        student.nombre.toLowerCase().includes(searchTerm)
    );

    const tbody = document.getElementById('studentsTable');
    tbody.innerHTML = '';
    
    filtered.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.nombre}</td>
            <td>${student.nota}</td>
            <td class="${student.calificacion === 'Aprobado' || student.calificacion === 'Sobresaliente' ? 'text-success' : 'text-danger'}">
                ${student.calificacion}
            </td>
            <td>
                <input type="number" class="form-control update-grade" 
                    data-id="${student.id}" placeholder="Nueva nota" min="0" max="10">
                <button class="btn btn-warning btn-sm mt-1" 
                        onclick="eliminarAlumno(${student.id})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Event listeners para actualización
    document.querySelectorAll('.update-grade').forEach(input => {
        input.addEventListener('change', function() {
            const id = this.dataset.id;
            const nuevaNota = parseFloat(this.value);
            if(!isNaN(nuevaNota)) {
                actualizarNota(id, nuevaNota);
            }
        });
    });
}

// Generar CSV desde API
function generateCSV() {
    fetch("http://localhost:8080/alumnos")
        .then(response => response.json())
        .then(data => {
            const csvContent = "Nombre,Nota,Calificación\n" +
                data.map(student => 
                    `${student.nombre},${student.nota},${student.calificacion}`
                ).join("\n");
            
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'calificaciones.csv';
            a.click();
        });
}

// Gráfico actualizado
function refreshChart(data) {
    const ctx = document.getElementById('gradesChart').getContext('2d');
    const ranges = [[0,5], [6,7], [8,10]];
    const counts = ranges.map(range => 
        data.filter(s => s.nota >= range[0] && s.nota <= range[1]).length
    );
    const total = data.length || 1; // Evitar división por cero
    const percentages = counts.map(count => (count / total * 100).toFixed(2));
    
    if(chart) chart.destroy();
    
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['0-5', '6-7', '8-10'],
            datasets: [{
                label: 'Porcentaje de Alumnos',
                data: percentages,
                backgroundColor: ['#ff6384', '#36a2eb', '#4bc0c0']
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Porcentaje %'
                    }
                }
            }
        }
    });
}

// Event Listeners
document.getElementById('searchName').addEventListener('input', () => obtenerAlumnos());
document.getElementById('minGrade').addEventListener('input', () => obtenerAlumnos());
document.getElementById('maxGrade').addEventListener('input', () => obtenerAlumnos());

// Inicialización
window.addEventListener("load", function() {
    obtenerAlumnos();
});