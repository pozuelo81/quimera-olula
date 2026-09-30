import { QProveedor } from "@quimera-extension/base-almacen";
import {
  Box,
  Button,
  Column,
  Container,
  Field,
  Grid,
  Icon,
  IconButton,
  Table,
  Typography,
} from "@quimera/comps";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@quimera/thirdparty";
import Quimera, { getSchemas, useStateValue, util } from "quimera";
import { useEffect } from "react";

import { InputImagenConPortada } from "../../comps";

function dameColorLinea(articuloprov) {
  let colorLinea = "";
  console.log(articuloprov);
  if (articuloprov.porDefecto) {
    colorLinea = "#449D44";
  }

  return colorLinea;
}

function Articulo({
  initArticulo,
  referencia,
  referenciaArticulo,
  callbackChanged,
  callbackVolver,
  useStyles,
}) {
  const [
    { articulo, articulosProv, modalAddProveedor, handleErrorProveedor, nuevoProveedor },
    dispatch,
  ] = useStateValue();
  const classes = useStyles();
  useEffect(() => {
    !!initArticulo &&
      dispatch({
        type: "onInitArticulo",
        payload: {
          initArticulo,
        },
      });
    !initArticulo &&
      !!referencia &&
      dispatch({
        type: "onInitArticuloById",
        payload: {
          filterArticulo: ["referencia", "eq", referencia],
        },
      });
  }, [initArticulo, referencia]);

  useEffect(() => {
    dispatch({
      type: "onCargaArticulo",
      payload: {
        referenciaArticulo,
      },
    });
  }, [referenciaArticulo]);

  const articuloSinCambios = () =>
    JSON.stringify(articulo.data) === JSON.stringify(articulo.buffer);
  const schemaCondiciones = getSchemas().condiciones_compra;

  useEffect(() => {
    util.publishEvent(articulo.event, callbackChanged);
  }, [articulo.event.serial]);
  console.log(nuevoProveedor);

  return (
    <Quimera.Template id="Articulo">
      <Container>
        <Box mt={1}>
          <Grid container justifyContent="center" style={{ marginBottom: "10px" }}>
            <Typography
              component="span"
              variant="h5"
            >{`${articulo.buffer.referencia} / ${articulo.buffer.descripcion} / ${articulo.buffer.precioRef} €`}</Typography>
          </Grid>
          <Grid container align="center" justifyContent="space-between" style={{ gap: 8 }}>
            <Grid container size={6} justifyContent="flex-start" style={{ gap: 8 }}>
              <Grid>
                <Button
                  id="publicadoWeb"
                  text="Cambiar visible web"
                  color="secondary"
                  variant="contained"
                  startIcon={<Icon>swap_horiz</Icon>}
                />
              </Grid>
            </Grid>
            <Grid container style={{ gap: 8 }}>
              <InputImagenConPortada
                tieneFoto={articulo.buffer.tieneFoto}
                onImagenChange={(files, esPortada) => {
                  dispatch({
                    type: "onImagenAdjuntada",
                    payload: { files, esPortada, idPlanta: articulo.buffer.idPlanta },
                  });
                }}
                onVerImagen={() =>
                  dispatch({
                    type: "onVerImagenClicked",
                    payload: {},
                  })
                }
              />
            </Grid>
          </Grid>
        </Box>
        <Box pt={2}>
          <Grid container justifyContent="flex-start">
            <Grid container size={12} pb={1} justifyContent="space-between">
              <Typography variant="subtittle1">General</Typography>
              <Typography variant="subtittle1">{`Visible web: ${articulo.buffer.publicadoWeb ? "Si" : "No"
                }`}</Typography>
            </Grid>
          </Grid>
          <Grid container direction="column" justifyContent="space-between" style={{ display: "block" }}>
            <Grid container size={12} direction="row" justifyContent="space-between" style={{ gap: 20 }}>
              <Box flexGrow={1}>
                <Field.Text
                  id="articulo.buffer/descripcion"
                  fullWidth
                  field="descripcion"
                  label="Descripcion"
                  disabled
                  value={articulo.buffer.descripcion}
                />
              </Box>
              <Box flexGrow={1}>
                <Field.Text
                  id="articulo.buffer/nombre3"
                  fullWidth
                  field="nombre3"
                  label="Nombre 3"
                  disabled
                  value={articulo.buffer.nombre3}
                />
              </Box>
              <Box flexGrow={1}>
                <Field.Text
                  id="articulo.buffer/nombre4"
                  fullWidth
                  field="nombre4"
                  label="Nombre 4"
                  disabled
                  value={articulo.buffer.nombre4}
                />
              </Box>
            </Grid>
            <Grid container size={12} direction="row" justifyContent="flex-start" style={{ gap: 20 }}>
              <Box flexGrow={1}>
                <Field.Text
                  id="articulo.buffer/litraje"
                  fullWidth
                  field="litraje"
                  label="Litraje"
                  disabled
                  value={articulo.buffer.litraje}
                />
              </Box>
              <Box flexGrow={1}>
                <Field.Text
                  id="articulo.buffer/forma"
                  fullWidth
                  field="forma"
                  label="Forma"
                  disabled
                  value={articulo.buffer.forma}
                />
              </Box>
              <Box flexGrow={1}>
                <Field.Text
                  id="articulo.buffer/altura"
                  fullWidth
                  field="altura"
                  label="Altura"
                  disabled
                  value={articulo.buffer.altura}
                />
              </Box>
            </Grid>
            <Grid container size={12} direction="row" justifyContent="flex-start" style={{ gap: 20 }}>
              <Box flexGrow={1}>
                <Field.Text
                  id="articulo.buffer/perimetro"
                  fullWidth
                  field="perimetro"
                  label="Perímetro"
                  disabled
                  value={articulo.buffer.perimetro}
                />
              </Box>
              <Box flexGrow={1}>
                <Field.Text
                  id="articulo.buffer/familia"
                  fullWidth
                  field="familia"
                  label="Familia"
                  disabled
                  value={articulo.buffer.familia}
                />
              </Box>
              <Box flexGrow={1}>
                <Field.Float
                  id="articulo.buffer/precioRef"
                  fullWidth
                  field="precioRef"
                  label="Precio referencia"
                  value={articulo.buffer.precioRef}
                />
              </Box>
            </Grid>
            <Grid container size={12} direction="row" justifyContent="flex-start" style={{ gap: 20 }}>
              <Box flexGrow={1}>
                <Field.Float
                  id="articulo.buffer/precioBnp"
                  fullWidth
                  field="precioBnp"
                  label="Precio BNP"
                  value={articulo.buffer.precioBnp}
                />
              </Box>
              <Box flexGrow={1} mr={2}>
                <Field.Text
                  id="articulo.buffer/codBarrasInterno"
                  fullWidth
                  field="codBarrasInterno"
                  label="Código de barras interno"
                  disabled
                  value={articulo.buffer.codBarrasInterno}
                />
              </Box>
              <Box flexGrow={1} mr={2}>
                <Field.Text
                  id="articulo.buffer/codBarras"
                  fullWidth
                  field="codBarras"
                  label="Código de barras"
                  value={articulo.buffer.codBarras}
                />
              </Box>
            </Grid>
            <Box
              flexGrow={1}
              mt={2}
              display="flex"
              alignItems="flex-end"
              justifyContent="flex-end"
              style={{ gap: 8 }}
            >
              <Button
                id="guardarArticulo"
                text="Guardar"
                color="secondary"
                variant="contained"
                disabled={articuloSinCambios()}
                startIcon={<Icon>save_alt</Icon>}
              />
              <Button
                id="volver"
                text="Volver"
                color="primary"
                variant="contained"
                onClick={() => {
                  referenciaArticulo && callbackVolver({ data: articulo.data });
                  dispatch({ type: "onVolverClicked" });
                }}
                startIcon={<Icon>arrow_back_outlined</Icon>}
              />
            </Box>
          </Grid>
        </Box>
        <Box>
          <Grid container driection="row" className={classes.cajaStock}>
            <Grid container size={12} pb={1} justifyContent="space-between">
              <Typography variant="subtittle1">Artículos proveedor</Typography>
            </Grid>
            <Grid container size={12} direction="row" justifyContent="flex-end">
              <Box mt={1}>
                <IconButton id="addProveedor" size="medium" tooltip="Añadir proveedor">
                  <Icon fontSize="medium">add_circle_outline_outlined</Icon>
                </IconButton>
              </Box>
            </Grid>
          </Grid>
          <Box id="scrollableTablaProveedores" p={0}>
            <Table
              id="tdbProveedores"
              idField="nombreProv"
              // data={articulosProv}
              data={articulosProv.map(prov => ({ ...prov, precioRef: articulo.data.precioRef }))}
              clickMode="line"
              loader={null}
              scrollableTarget="scrollableTablaProveedores"
              bgcolorRowFunction={articuloprov => dameColorLinea(articuloprov)}
            >
              <Column.Text id="nombre" header="Nombre proveedor" pl={2} flexGrow={1} />
              <Column.Decimal
                id="precioRef"
                header="Precio referencia"
                order="precioRef"
                flexGrow={2}
                decimals={2}
              />
              <Column.Decimal
                id="costeReal"
                header="Coste real"
                order="costeReal"
                flexGrow={2}
                decimals={2}
              />
            </Table>
          </Box>
        </Box>

        {/** Dialogo añadir proveedor */}
        <Dialog
          open={modalAddProveedor}
          keepMounted
          onClose={() => dispatch({ type: "onCerrarAddProveedorConfirm", payload: {} })}
          classes={{ paper: classes.paper20Auto }}
        >
          <DialogTitle>Añadir proveedor</DialogTitle>
          <DialogContent>
            <QProveedor
              id="nuevoProveedor.codproveedor"
              label={`Proveedor`}
              disableClearable
              boxStyle={classes.referencia}
              fullWidth
            />
            {handleErrorProveedor.error && (
              <Typography variant="subtittle1" style={{ color: "red" }}>
                {handleErrorProveedor.text}
              </Typography>
            )}
            <Field.Schema
              id="nuevoProveedor.coste"
              label="Coste"
              schema={schemaCondiciones}
              fullWidth
            />
            <Field.Schema
              id="nuevoProveedor.descuento"
              label="% Dto"
              schema={schemaCondiciones}
              fullWidth
            />
            <Field.Float
              id="nuevoProveedor.costeReal"
              label="Coste real"
              value={nuevoProveedor.coste * ((100 - nuevoProveedor.descuento) / 100)}
              disabled
              fullWidth
            />
            <Field.Schema
              id="nuevoProveedor.codBarras"
              label="Código de barras"
              schema={schemaCondiciones}
              fullWidth
            />
            {nuevoProveedor.id && (
              <Field.Schema
                id="nuevoProveedor.porDefecto"
                label="Por defecto"
                schema={schemaCondiciones}
                fullWidth
                checked={nuevoProveedor.porDefecto}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button
              id="addProveedorConfirm"
              text="Confirmar"
              color="primary"
              variant="contained"
              disabled={!schemaCondiciones.isValid(nuevoProveedor)}
            />
          </DialogActions>
        </Dialog>
      </Container>
    </Quimera.Template>
  );
}

export default Articulo;
