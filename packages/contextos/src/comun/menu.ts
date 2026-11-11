export const menuComun = {
    // Tablas generales de Eneboo (facturacion/principal). El menú solo tiene
    // área > grupo > pantalla, así que «Tablas generales» es un grupo del área
    // Organización y cada tabla una pantalla suya ("Tablas generales/Países").
    // Sin pantallas visibles el grupo no se pinta.
    "Tablas generales": { icono: "menu_tablas_generales", area: "Organización" },
    "Tablas generales/Países": { alias: ["país", "ISO", "U.E."], url: "/comun/pais", regla: "comun.pais" },
    "Tablas generales/Provincias": { alias: ["provincia"], url: "/comun/provincia", regla: "comun.provincia" },
    "Dashboards": { icono: "grafico_barras", url: "/comun/dashboard", area: "Sistema" },
    "Asistente IA": { icono: "asistente", area: "Sistema" },
    "Asistente IA/Chat": { url: "/comun/asistente" },
    "Asistente IA/Memoria del asistente": { url: "/comun/ia-memoria", regla: "comun.ia_memoria" },
    "Asistente IA/Flujos de trabajo": { url: "/comun/ia-flujo", regla: "comun.ia_flujo" },
    "Asistente IA/Tareas programadas": { url: "/comun/ia-tarea-programada", regla: "comun.ia_tarea_programada" },
    "Asistente IA/Credenciales": { url: "/comun/credencial-externa", regla: "comun.credencial_externa" },
};
