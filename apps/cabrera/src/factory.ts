import { FactoryAuthOlula } from "#/auth/factory.ts";
import { MenuUsuarioElementosCabrera } from "./contextos/menu.ts";
import { procesarElementosCabrera } from "./contextos/procesarMenuUsuario.ts";

import { CabeceraCabrera } from "./componentes/CabeceraCabrera";
import { FactoryAlmacenLegacy } from "./contextos/almacen/factory.ts";
import { FactoryComunLegacy } from "./contextos/comun/factory.ts";
import { FactoryVentasLegacy } from "./contextos/ventas/factory.ts";


class FactoryComponentesCabrera {
    static cabecera = CabeceraCabrera;
    // static cabecera_menu_usuario = MenuUsuarioCabrera;
    static menu_usuario_elementos = MenuUsuarioElementosCabrera;
    static menu_usuario_procesar_elementos = procesarElementosCabrera;
}


export class FactoryLegacy {
    Ventas = FactoryVentasLegacy;
    Almacen = FactoryAlmacenLegacy;
    Auth = FactoryAuthOlula;
    Comun = FactoryComunLegacy;
    Componentes = FactoryComponentesCabrera;
}

export default FactoryLegacy;