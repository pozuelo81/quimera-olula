import { FactoryAlmacenOlula } from '#/almacen/factory.ts';
import { FactoryAuthOlula } from '#/auth/factory.ts';
import { FactoryCrmOlula } from '#/crm/factory.ts';
import { FactoryRrhhOlula } from '#/rrhh/factory.ts';
import { FactoryTpvOlula } from '#/tpv/factory.ts';
import { FactoryVentasOlula } from '#/ventas/factory.ts';
import { FactoryComponentesOlula } from '@olula/componentes/factory.ts';
import { AsistenteLateralOlula } from './AsistenteLateral.tsx';

// Override propio de esta app, no de la clase base compartida: así cualquier otro
// proyecto que reutilice FactoryComponentesOlula tal cual sigue sin ver el asistente
// (Plantilla.tsx no renderiza nada si Componentes.panel_asistente no está definido).
class FactoryComponentesOlulaConAsistente extends FactoryComponentesOlula {
    static panel_asistente = AsistenteLateralOlula;
}

export class FactoryOlula {
    Inicio = { menu: { "Inicio": { url: "/", icono: "inicio" } } };
    Componentes = FactoryComponentesOlulaConAsistente;
    Almacen = FactoryAlmacenOlula;
    Crm = FactoryCrmOlula;
    Ventas = FactoryVentasOlula;
    TPV = FactoryTpvOlula;
    Auth = FactoryAuthOlula;
    Rrhh = FactoryRrhhOlula
}

export default FactoryOlula;