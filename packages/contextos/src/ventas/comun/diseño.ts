export type ClienteVentaRegistrado = {
    id: string,
    idDireccion: string
}

export type ClienteVentaNoRegistrado = {
    nombre: string,
    idFiscal: string,
    direccion: {
        nombreVia: string,
        codPostal: string,
        ciudad: string,
        provincia: string,
        idPais: string,
    }
}