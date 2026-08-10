/* =========================================================
   JR CONNECTION
   SISTEMA DE VENTAS / CAJA
   SCRIPT.JS
========================================================= */


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const STORAGE_TURNO = "jr_turno_actual";
const STORAGE_HISTORIAL = "jr_historial_turnos";


/* =========================================================
   ESTADO
========================================================= */

let turnoActual =
    JSON.parse(localStorage.getItem(STORAGE_TURNO)) || null;

let historialTurnos =
    JSON.parse(localStorage.getItem(STORAGE_HISTORIAL)) || [];


/* =========================================================
   ELEMENTOS
========================================================= */

const $ = (id) => document.getElementById(id);


/* =========================================================
   FECHA
========================================================= */

function mostrarFecha() {

    const fecha = new Date();

    const elemento = $("fechaActual");

    if (!elemento) return;

    elemento.textContent =
        fecha.toLocaleDateString("es-NI", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

}


/* =========================================================
   FORMATO DE DINERO
========================================================= */

function dinero(valor) {

    return Number(valor || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

}


/* =========================================================
   FECHA / HORA
========================================================= */

function fechaCompleta() {

    return new Date().toLocaleString("es-NI", {
        dateStyle: "short",
        timeStyle: "medium"
    });

}


function horaActual() {

    return new Date().toLocaleTimeString("es-NI", {
        hour: "2-digit",
        minute: "2-digit"
    });

}


function fechaISO() {

    const fecha = new Date();

    const año = fecha.getFullYear();

    const mes =
        String(fecha.getMonth() + 1).padStart(2, "0");

    const dia =
        String(fecha.getDate()).padStart(2, "0");

    return `${año}-${mes}-${dia}`;

}


/* =========================================================
   GUARDADO
========================================================= */

function guardarDatos() {

    localStorage.setItem(
        STORAGE_TURNO,
        JSON.stringify(turnoActual)
    );

    localStorage.setItem(
        STORAGE_HISTORIAL,
        JSON.stringify(historialTurnos)
    );

}


/* =========================================================
   TOAST
========================================================= */

function mostrarToast(mensaje, tipo = "success") {

    const container = $("toastContainer");

    if (!container) {

        alert(mensaje);

        return;

    }

    const toast = document.createElement("div");

    toast.className = `toast ${tipo}`;

    toast.innerHTML = `

        <div class="toastMessage">
            ${mensaje}
        </div>

    `;

    container.appendChild(toast);

    setTimeout(() => {

        toast.style.opacity = "0";

        toast.style.transform = "translateX(20px)";

        setTimeout(() => {

            toast.remove();

        }, 250);

    }, 3000);

}


/* =========================================================
   ESTADO DEL TURNO
========================================================= */

function turnoAbierto() {

    return turnoActual !== null;

}


/* =========================================================
   ACTUALIZAR ESTADO VISUAL DEL TURNO
========================================================= */

function actualizarEstadoTurno() {

    const abierto = turnoAbierto();


    const sidebarEstado =
        $("sidebarTurnoEstado");

    const sidebarDot =
        $("sidebarStatusDot");

    const turnStatusText =
        $("turnStatusText");

    const turnStatusDot =
        $("turnStatusDot");

    const btnAbrir =
        $("btnAbrirTurno");

    const btnCerrar =
        $("btnCerrarTurno");

    const alerta =
        $("turnoAlert");

    const btnAbrirDashboard =
        $("btnAbrirTurnoDashboard");

    const ventaWarning =
        $("ventaTurnoWarning");

    const gastoWarning =
        $("gastoTurnoWarning");


    if (abierto) {

        if (sidebarEstado)
            sidebarEstado.textContent = "Abierto";


        if (sidebarDot)
            sidebarDot.classList.add("open");


        if (turnStatusText)
            turnStatusText.textContent = "Abierto";


        if (turnStatusDot)
            turnStatusDot.classList.add("open");


        if (btnAbrir)
            btnAbrir.classList.add("hidden");


        if (btnCerrar)
            btnCerrar.classList.remove("hidden");


        if (alerta)
            alerta.classList.add("hidden");


        if (ventaWarning)
            ventaWarning.classList.add("hidden");


        if (gastoWarning)
            gastoWarning.classList.add("hidden");

    }

    else {

        if (sidebarEstado)
            sidebarEstado.textContent = "Sin turno";


        if (sidebarDot)
            sidebarDot.classList.remove("open");


        if (turnStatusText)
            turnStatusText.textContent = "Cerrado";


        if (turnStatusDot)
            turnStatusDot.classList.remove("open");


        if (btnAbrir)
            btnAbrir.classList.remove("hidden");


        if (btnCerrar)
            btnCerrar.classList.add("hidden");


        if (alerta)
            alerta.classList.remove("hidden");


        if (ventaWarning)
            ventaWarning.classList.remove("hidden");


        if (gastoWarning)
            gastoWarning.classList.remove("hidden");

    }


    actualizarDatosTurno();

}


/* =========================================================
   INFORMACIÓN DEL TURNO EN DASHBOARD
========================================================= */

function actualizarDatosTurno() {

    const dashboardTurno =
        $("dashboardTurno");

    const horaApertura =
        $("horaApertura");

    const fondoInicial =
        $("fondoInicial");


    if (!turnoActual) {

        if (dashboardTurno)
            dashboardTurno.textContent = "Sin turno";

        if (horaApertura)
            horaApertura.textContent = "—";

        if (fondoInicial)
            fondoInicial.textContent = "0.00";

        return;

    }


    if (dashboardTurno) {

        dashboardTurno.textContent =
            `Turno #${turnoActual.numero}`;

    }


    if (horaApertura) {

        horaApertura.textContent =
            turnoActual.horaApertura;

    }


    if (fondoInicial) {

        fondoInicial.textContent =
            dinero(turnoActual.fondoInicial);

    }

}


/* =========================================================
   ABRIR MODAL
========================================================= */

function abrirModal(id) {

    const modal = $(id);

    if (!modal) return;

    modal.classList.remove("hidden");

    document.body.style.overflow = "hidden";

}


function cerrarModal(id) {

    const modal = $(id);

    if (!modal) return;

    modal.classList.add("hidden");

    document.body.style.overflow = "";

}


/* =========================================================
   ABRIR TURNO
========================================================= */

function abrirModalTurno() {

    if (turnoActual) {

        mostrarToast(
            "Ya existe un turno abierto.",
            "warning"
        );

        return;

    }

    $("inputFondoInicial").value = "";

    $("inputResponsable").value = "";

    abrirModal("modalAbrirTurno");

    setTimeout(() => {

        $("inputFondoInicial").focus();

    }, 100);

}


/* =========================================================
   CONFIRMAR APERTURA
========================================================= */

function confirmarAbrirTurno() {

    if (turnoActual) {

        mostrarToast(
            "Ya existe un turno abierto.",
            "warning"
        );

        return;

    }


    const fondo =
        Number($("inputFondoInicial").value) || 0;

    const responsable =
        $("inputResponsable").value.trim();


    if (fondo < 0) {

        mostrarToast(
            "El fondo inicial no puede ser negativo.",
            "error"
        );

        return;

    }


    if (!responsable) {

        mostrarToast(
            "Ingresa el nombre del responsable.",
            "error"
        );

        $("inputResponsable").focus();

        return;

    }


    const ultimoTurno =
        historialTurnos.length > 0
            ? historialTurnos[historialTurnos.length - 1]
            : null;


    let numero = 1;


    if (ultimoTurno) {

        numero =
            Number(ultimoTurno.numero || 0) + 1;

    }


    turnoActual = {

        id: Date.now(),

        numero: numero,

        fecha: fechaISO(),

        fechaApertura: fechaCompleta(),

        horaApertura: horaActual(),

        responsable: responsable,

        fondoInicial: fondo,

        movimientos: []

    };


    guardarDatos();

    cerrarModal("modalAbrirTurno");

    actualizarTodo();

    mostrarToast(
        `Turno #${numero} abierto correctamente.`
    );

}


/* =========================================================
   OBTENER MOVIMIENTOS DEL TURNO
========================================================= */

function obtenerMovimientos() {

    if (!turnoActual)
        return [];

    return turnoActual.movimientos || [];

}


/* =========================================================
   OBTENER SOLO MOVIMIENTOS ACTIVOS
========================================================= */

function movimientosActivos() {

    return obtenerMovimientos().filter(
        movimiento =>
            movimiento.estado !== "ANULADA"
    );

}


/* =========================================================
   CALCULAR TOTALES
========================================================= */

function calcularTotales() {

    let ventas = 0;

    let efectivo = 0;

    let transferencias = 0;

    let cambios = 0;

    let gastos = 0;

    let cantidadVentas = 0;

    let cantidadGastos = 0;


    movimientosActivos().forEach(movimiento => {

        if (movimiento.tipo === "VENTA") {

            ventas += Number(movimiento.precio);

            efectivo +=
                Number(movimiento.efectivo);

            transferencias +=
                Number(movimiento.transferencia);

            cambios +=
                Number(movimiento.cambio);

            cantidadVentas++;

        }


        if (movimiento.tipo === "GASTO") {

            gastos += Number(movimiento.monto);

            cantidadGastos++;

        }

    });


    /*
        IMPORTANTE:

        La caja física NO es:

        ventas - gastos

        porque las transferencias y los cambios
        no representan efectivo físico.

        Por eso:

        Caja =
        Fondo inicial
        + efectivo recibido
        - gastos
    */


    const fondoInicial =
        turnoActual
            ? Number(turnoActual.fondoInicial)
            : 0;


    const caja =
        fondoInicial
        + efectivo
        - gastos;


    return {

        ventas,

        efectivo,

        transferencias,

        cambios,

        gastos,

        caja,

        cantidadVentas,

        cantidadGastos,

        cantidadMovimientos:
            cantidadVentas + cantidadGastos

    };

}


/* =========================================================
   ACTUALIZAR DASHBOARD
========================================================= */

function actualizarDashboard() {

    const totales =
        calcularTotales();


    $("ventasTotal").textContent =
        dinero(totales.ventas);


    $("efectivoTotal").textContent =
        dinero(totales.efectivo);


    $("transferenciaTotal").textContent =
        dinero(totales.transferencias);


    $("cambioTotal").textContent =
        dinero(totales.cambios);


    $("gastosTotal").textContent =
        dinero(totales.gastos);


    $("cajaTotal").textContent =
        dinero(totales.caja);


    $("cantidadVentas").textContent =
        totales.cantidadVentas;


    $("cantidadGastos").textContent =
        totales.cantidadGastos;


    $("cantidadMovimientos").textContent =
        totales.cantidadMovimientos;


    $("ventasTablaTotal").textContent =
        dinero(totales.ventas);


    $("gastosTablaTotal").textContent =
        dinero(totales.gastos);


    actualizarDatosTurno();

}


/* =========================================================
   CALCULAR PAGO DE VENTA
========================================================= */

function calcularPago() {

    const precioVenta =
        Number($("precio").value) || 0;

    const ef =
        Number($("efectivo").value) || 0;

    const tr =
        Number($("transferencia").value) || 0;

    const ca =
        Number($("cambio").value) || 0;


    const recibido =
        ef + tr + ca;


    $("totalRecibido").textContent =
        dinero(recibido);


    const resumenPrecio =
        $("precioResumen");

    if (resumenPrecio) {

        resumenPrecio.textContent =
            dinero(precioVenta);

    }


    const estado =
        $("estadoPago");


    if (!estado)
        return;


    if (precioVenta <= 0) {

        estado.textContent =
            "Esperando datos...";

        estado.className =
            "paymentStatus";

        return;

    }


    const diferencia =
        recibido - precioVenta;


    const tolerancia = 0.009;


    if (Math.abs(diferencia) <= tolerancia) {

        estado.textContent =
            "✓ Pago completo";

        estado.className =
            "paymentStatus correcto";

    }

    else if (diferencia < 0) {

        estado.textContent =
            `Faltan $${dinero(Math.abs(diferencia))}`;

        estado.className =
            "paymentStatus faltante";

    }

    else {

        estado.textContent =
            `Excedente $${dinero(diferencia)}`;

        estado.className =
            "paymentStatus correcto";

    }

}


/* =========================================================
   VALIDAR TURNO
========================================================= */

function validarTurno() {

    if (!turnoActual) {

        mostrarToast(
            "Debes abrir un turno antes de registrar movimientos.",
            "warning"
        );

        abrirModalTurno();

        return false;

    }

    return true;

}


/* =========================================================
   REGISTRAR VENTA
========================================================= */

function registrarVenta() {

    if (!validarTurno())
        return;


    const nombreProducto =
        $("producto").value.trim();

    const detalle =
        $("descripcion").value.trim();

    const precioVenta =
        Number($("precio").value) || 0;

    const ef =
        Number($("efectivo").value) || 0;

    const tr =
        Number($("transferencia").value) || 0;

    const ca =
        Number($("cambio").value) || 0;


    if (!nombreProducto) {

        mostrarToast(
            "Ingresa el nombre del producto.",
            "error"
        );

        $("producto").focus();

        return;

    }


    if (precioVenta <= 0) {

        mostrarToast(
            "Ingresa un precio válido.",
            "error"
        );

        $("precio").focus();

        return;

    }


    const recibido =
        ef + tr + ca;


    if (Math.abs(recibido - precioVenta) > 0.009) {

        mostrarToast(
            "El pago no coincide con el precio de venta.",
            "error"
        );

        return;

    }


    if (ef < 0 || tr < 0 || ca < 0) {

        mostrarToast(
            "Los valores de pago no pueden ser negativos.",
            "error"
        );

        return;

    }


    const venta = {

        id: Date.now(),

        tipo: "VENTA",

        estado: "ACTIVA",

        fecha: fechaISO(),

        fechaCompleta: fechaCompleta(),

        hora: horaActual(),

        producto: nombreProducto,

        descripcion: detalle,

        precio: precioVenta,

        efectivo: ef,

        transferencia: tr,

        cambio: ca

    };


    turnoActual.movimientos.push(venta);


    guardarDatos();

    actualizarTodo();

    limpiarVenta();


    mostrarToast(
        "Venta registrada correctamente."
    );

}


/* =========================================================
   LIMPIAR VENTA
========================================================= */

function limpiarVenta() {

    $("producto").value = "";

    $("descripcion").value = "";

    $("precio").value = "";

    $("efectivo").value = "";

    $("transferencia").value = "";

    $("cambio").value = "";


    $("totalRecibido").textContent =
        "0.00";


    if ($("precioResumen")) {

        $("precioResumen").textContent =
            "0.00";

    }


    $("estadoPago").textContent =
        "Esperando datos...";


    $("estadoPago").className =
        "paymentStatus";


}


/* =========================================================
   REGISTRAR GASTO
========================================================= */

function registrarGasto() {

    if (!validarTurno())
        return;


    const monto =
        Number($("montoGasto").value) || 0;

    const motivo =
        $("motivoGasto").value.trim();


    if (monto <= 0) {

        mostrarToast(
            "Ingresa un monto válido.",
            "error"
        );

        $("montoGasto").focus();

        return;

    }


    if (!motivo) {

        mostrarToast(
            "Ingresa el motivo del gasto.",
            "error"
        );

        $("motivoGasto").focus();

        return;

    }


    const gasto = {

        id: Date.now(),

        tipo: "GASTO",

        estado: "ACTIVA",

        fecha: fechaISO(),

        fechaCompleta: fechaCompleta(),

        hora: horaActual(),

        monto: monto,

        motivo: motivo

    };


    turnoActual.movimientos.push(gasto);


    guardarDatos();

    actualizarTodo();

    limpiarGasto();


    mostrarToast(
        "Gasto registrado correctamente."
    );

}


/* =========================================================
   LIMPIAR GASTO
========================================================= */

function limpiarGasto() {

    $("montoGasto").value = "";

    $("motivoGasto").value = "";

}


/* =========================================================
   PINTAR VENTAS
========================================================= */

function pintarVentas() {

    const tabla =
        $("tablaVentas");


    if (!tabla)
        return;


    tabla.innerHTML = "";


    const ventas =
        obtenerMovimientos()
            .filter(
                movimiento =>
                    movimiento.tipo === "VENTA"
            )
            .slice()
            .reverse();


    $("contadorVentas").textContent =
        ventas.filter(
            venta =>
                venta.estado !== "ANULADA"
        ).length;


    if (ventas.length === 0) {

        tabla.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="emptyState"
                >

                    <strong>
                        No hay ventas registradas
                    </strong>

                    <span>
                        Las ventas del turno aparecerán aquí.
                    </span>

                </td>

            </tr>

        `;

        return;

    }


    ventas.forEach(venta => {

        const fila =
            document.createElement("tr");


        if (venta.estado === "ANULADA") {

            fila.classList.add(
                "movementCancelled"
            );

        }


        const estado =
            venta.estado === "ANULADA"

                ? `<span class="badge badgeAnulada">
                    ✕ Anulada
                   </span>`

                : `<span class="badge badgeVenta">
                    ✓ Activa
                   </span>`;


        const boton =

            venta.estado === "ANULADA"

                ? ""

                : `

                    <button
                        class="tableAction"
                        title="Anular venta"
                        onclick="anularMovimiento(${venta.id})"
                    >

                        ✕

                    </button>

                `;


        fila.innerHTML = `

            <td>

                ${venta.hora || "—"}

            </td>


            <td>

                <strong>
                    ${escapeHTML(venta.producto)}
                </strong>

            </td>


            <td>

                <small>
                    ${escapeHTML(
                        venta.descripcion || "Sin descripción"
                    )}
                </small>

            </td>


            <td>

                <div>
                    💵 $${dinero(venta.efectivo)}
                </div>

                <div>
                    🏦 $${dinero(venta.transferencia)}
                </div>

                <div>
                    ⇄ $${dinero(venta.cambio)}
                </div>

            </td>


            <td>

                <strong>
                    $${dinero(venta.precio)}
                </strong>

            </td>


            <td>

                ${estado}

            </td>


            <td>

                ${boton}

            </td>

        `;


        tabla.appendChild(fila);

    });

}


/* =========================================================
   PINTAR GASTOS
========================================================= */

function pintarGastos() {

    const tabla =
        $("tablaGastos");


    if (!tabla)
        return;


    tabla.innerHTML = "";


    const gastos =
        obtenerMovimientos()
            .filter(
                movimiento =>
                    movimiento.tipo === "GASTO"
            )
            .slice()
            .reverse();


    $("contadorGastos").textContent =
        gastos.filter(
            gasto =>
                gasto.estado !== "ANULADA"
        ).length;


    if (gastos.length === 0) {

        tabla.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="emptyState"
                >

                    <strong>
                        No hay gastos registrados
                    </strong>

                    <span>
                        Las salidas del turno aparecerán aquí.
                    </span>

                </td>

            </tr>

        `;

        return;

    }


    gastos.forEach(gasto => {

        const fila =
            document.createElement("tr");


        if (gasto.estado === "ANULADA") {

            fila.classList.add(
                "movementCancelled"
            );

        }


        const estado =

            gasto.estado === "ANULADA"

                ? `<span class="badge badgeAnulada">
                    ✕ Anulado
                   </span>`

                : `<span class="badge badgeGasto">
                    ✓ Activo
                   </span>`;


        const boton =

            gasto.estado === "ANULADA"

                ? ""

                : `

                    <button
                        class="tableAction"
                        title="Anular gasto"
                        onclick="anularMovimiento(${gasto.id})"
                    >

                        ✕

                    </button>

                `;


        fila.innerHTML = `

            <td>

                ${gasto.hora || "—"}

            </td>


            <td>

                <strong>
                    ${escapeHTML(gasto.motivo)}
                </strong>

            </td>


            <td>

                <strong class="textDanger">

                    -$${dinero(gasto.monto)}

                </strong>

            </td>


            <td>

                ${estado}

            </td>


            <td>

                ${boton}

            </td>

        `;


        tabla.appendChild(fila);

    });

}


/* =========================================================
   ESCAPAR HTML
========================================================= */

function escapeHTML(texto) {

    const div =
        document.createElement("div");

    div.textContent =
        texto ?? "";

    return div.innerHTML;

}


/* =========================================================
   ANULAR MOVIMIENTO
========================================================= */

function anularMovimiento(id) {

    if (!turnoActual)
        return;


    const movimiento =
        turnoActual.movimientos.find(
            item => item.id === id
        );


    if (!movimiento)
        return;


    if (movimiento.estado === "ANULADA") {

        mostrarToast(
            "Este movimiento ya está anulado.",
            "warning"
        );

        return;

    }


    const nombre =

        movimiento.tipo === "VENTA"

            ? movimiento.producto

            : movimiento.motivo;


    const monto =

        movimiento.tipo === "VENTA"

            ? movimiento.precio

            : movimiento.monto;


    const confirmar = confirm(

        `¿Deseas ANULAR este movimiento?\n\n` +

        `${nombre}\n` +

        `Monto: $${dinero(monto)}\n\n` +

        `El registro permanecerá en el historial ` +
        `pero dejará de afectar los totales.`

    );


    if (!confirmar)
        return;


    movimiento.estado =
        "ANULADA";


    movimiento.fechaAnulacion =
        fechaCompleta();


    guardarDatos();

    actualizarTodo();


    mostrarToast(
        "Movimiento anulado correctamente.",
        "warning"
    );

}


/* =========================================================
   PREPARAR CIERRE
========================================================= */

function prepararCierreTurno() {

    if (!turnoActual) {

        mostrarToast(
            "No hay ningún turno abierto.",
            "warning"
        );

        return;

    }


    const totales =
        calcularTotales();


    $("cierreFondo").textContent =
        dinero(turnoActual.fondoInicial);


    $("cierreVentas").textContent =
        dinero(totales.ventas);


    $("cierreGastos").textContent =
        dinero(totales.gastos);


    $("cierreEfectivo").textContent =
        dinero(totales.efectivo);


    $("cierreCajaEsperada").textContent =
        dinero(totales.caja);


    $("inputCajaFisica").value = "";

    $("notaCierre").value = "";


    actualizarDiferencia();


    abrirModal("modalCerrarTurno");

}


/* =========================================================
   DIFERENCIA DE CAJA
========================================================= */

function actualizarDiferencia() {

    if (!turnoActual)
        return;


    const efectivoContado =
        Number($("inputCajaFisica").value) || 0;


    const totales =
        calcularTotales();


    const diferencia =
        efectivoContado - totales.caja;


    $("diferenciaMonto").textContent =
        dinero(Math.abs(diferencia));


    const box =
        $("diferenciaCaja");


    const texto =
        $("diferenciaTexto");


    box.classList.remove(
        "success",
        "warning",
        "danger"
    );


    if (
        $("inputCajaFisica").value === ""
    ) {

        $("diferenciaMonto").textContent =
            "0.00";

        texto.textContent =
            "Ingresa el efectivo contado.";

        return;

    }


    if (Math.abs(diferencia) < 0.009) {

        box.classList.add("success");

        texto.textContent =
            "✓ La caja coincide exactamente.";

        return;

    }


    if (diferencia > 0) {

        box.classList.add("warning");

        texto.textContent =
            `Hay un sobrante de $${dinero(diferencia)}.`;

        return;

    }


    box.classList.add("danger");

    texto.textContent =
        `Hay un faltante de $${dinero(Math.abs(diferencia))}.`;

}


/* =========================================================
   CONFIRMAR CIERRE
========================================================= */

function confirmarCerrarTurno() {

    if (!turnoActual) {

        mostrarToast(
            "No existe un turno abierto.",
            "warning"
        );

        return;

    }


    const efectivoContado =
        Number($("inputCajaFisica").value);


    if (
        $("inputCajaFisica").value === ""
        ||
        Number.isNaN(efectivoContado)
    ) {

        mostrarToast(
            "Debes ingresar el efectivo contado.",
            "error"
        );

        $("inputCajaFisica").focus();

        return;

    }


    const totales =
        calcularTotales();


    const diferencia =
        efectivoContado - totales.caja;


    const nota =
        $("notaCierre").value.trim();


    const confirmar = confirm(

        `¿Confirmar cierre del turno?\n\n` +

        `Caja esperada: $${dinero(totales.caja)}\n` +

        `Caja contada: $${dinero(efectivoContado)}\n` +

        `Diferencia: $${dinero(Math.abs(diferencia))}\n\n` +

        `Esta operación cerrará el turno.`

    );


    if (!confirmar)
        return;


    const cierre = {

        id: turnoActual.id,

        numero: turnoActual.numero,

        fecha: turnoActual.fecha,

        fechaApertura:
            turnoActual.fechaApertura,

        fechaCierre:
            fechaCompleta(),

        horaApertura:
            turnoActual.horaApertura,

        horaCierre:
            horaActual(),

        responsable:
            turnoActual.responsable,

        fondoInicial:
            turnoActual.fondoInicial,

        movimientos:
            JSON.parse(
                JSON.stringify(
                    turnoActual.movimientos
                )
            ),

        totales: {

            ventas:
                totales.ventas,

            efectivo:
                totales.efectivo,

            transferencias:
                totales.transferencias,

            cambios:
                totales.cambios,

            gastos:
                totales.gastos,

            cajaEsperada:
                totales.caja,

            cajaFisica:
                efectivoContado,

            diferencia:
                diferencia,

            cantidadVentas:
                totales.cantidadVentas,

            cantidadGastos:
                totales.cantidadGastos

        },

        nota: nota

    };


    historialTurnos.push(cierre);


    turnoActual = null;


    guardarDatos();

    cerrarModal("modalCerrarTurno");

    actualizarTodo();

    pintarHistorialTurnos();


    mostrarToast(
        "Turno cerrado y guardado en el historial."
    );


    mostrarSeccion("turnosSection");

}


/* =========================================================
   HISTORIAL DE TURNOS
========================================================= */

function pintarHistorialTurnos() {

    const tabla =
        $("tablaTurnos");


    if (!tabla)
        return;


    tabla.innerHTML = "";


    if (historialTurnos.length === 0) {

        tabla.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="emptyState"
                >

                    <strong>
                        No hay turnos cerrados
                    </strong>

                    <span>
                        Los cierres aparecerán aquí.
                    </span>

                </td>

            </tr>

        `;

        return;

    }


    historialTurnos
        .slice()
        .reverse()
        .forEach(turno => {

            const fila =
                document.createElement("tr");


            const diferencia =
                Number(
                    turno.totales.diferencia
                );


            let diferenciaHTML;


            if (
                Math.abs(diferencia) < 0.009
            ) {

                diferenciaHTML = `

                    <span class="badge badgeVenta">
                        ✓ Cuadra
                    </span>

                `;

            }

            else if (diferencia > 0) {

                diferenciaHTML = `

                    <span class="badge">
                        +$${dinero(diferencia)}
                    </span>

                `;

            }

            else {

                diferenciaHTML = `

                    <span class="badge badgeAnulada">
                        -$${dinero(Math.abs(diferencia))}
                    </span>

                `;

            }


            fila.innerHTML = `

                <td>

                    ${turno.fecha}

                </td>


                <td>

                    <strong>
                        #${turno.numero}
                    </strong>

                </td>


                <td>

                    $${dinero(
                        turno.totales.ventas
                    )}

                </td>


                <td class="textDanger">

                    -$${dinero(
                        turno.totales.gastos
                    )}

                </td>


                <td>

                    $${dinero(
                        turno.totales.efectivo
                    )}

                </td>


                <td>

                    $${dinero(
                        turno.totales.transferencias
                    )}

                </td>


                <td>

                    <strong>

                        $${dinero(
                            turno.totales.cajaFisica
                        )}

                    </strong>

                </td>


                <td>

                    <button
                        class="tableAction"
                        title="Ver detalle"
                        onclick="verDetalleTurno(${turno.id})"
                    >

                        👁

                    </button>

                </td>

            `;


            tabla.appendChild(fila);

        });

}


/* =========================================================
   DETALLE DE TURNO
========================================================= */

function verDetalleTurno(id) {

    const turno =
        historialTurnos.find(
            item => item.id === id
        );


    if (!turno)
        return;


    $("detalleTitulo").textContent =
        `Turno #${turno.numero}`;


    $("detalleContenido").innerHTML = `

        <div class="closeSummary">

            <div>

                <span>
                    Responsable
                </span>

                <strong>
                    ${escapeHTML(turno.responsable)}
                </strong>

            </div>


            <div>

                <span>
                    Fecha
                </span>

                <strong>
                    ${turno.fecha}
                </strong>

            </div>


            <div>

                <span>
                    Apertura
                </span>

                <strong>
                    ${turno.horaApertura}
                </strong>

            </div>


            <div>

                <span>
                    Cierre
                </span>

                <strong>
                    ${turno.horaCierre}
                </strong>

            </div>


            <div>

                <span>
                    Ventas
                </span>

                <strong>
                    $${dinero(
                        turno.totales.ventas
                    )}
                </strong>

            </div>


            <div>

                <span>
                    Gastos
                </span>

                <strong class="negative">
                    -$${dinero(
                        turno.totales.gastos
                    )}
                </strong>

            </div>


            <div>

                <span>
                    Caja esperada
                </span>

                <strong>
                    $${dinero(
                        turno.totales.cajaEsperada
                    )}
                </strong>

            </div>


            <div>

                <span>
                    Caja contada
                </span>

                <strong>
                    $${dinero(
                        turno.totales.cajaFisica
                    )}
                </strong>

            </div>

        </div>


        <div class="differenceBox">

            <span>
                Diferencia de caja
            </span>

            <strong>
                $${dinero(
                    Math.abs(
                        turno.totales.diferencia
                    )
                )}
            </strong>

            <small>

                ${
                    Math.abs(
                        turno.totales.diferencia
                    ) < 0.009

                    ? "✓ Caja cuadrada"

                    : turno.totales.diferencia > 0

                        ? "Sobrante"

                        : "Faltante"
                }

            </small>

        </div>


        ${
            turno.nota

            ? `

                <div class="inputGroup">

                    <label>
                        Nota del cierre
                    </label>

                    <textarea readonly>${escapeHTML(
                        turno.nota
                    )}</textarea>

                </div>

            `

            : ""
        }

    `;


    abrirModal("modalDetalle");

}


/* =========================================================
   NAVEGACIÓN
========================================================= */

function mostrarSeccion(id) {

    document
        .querySelectorAll(".pageSection")
        .forEach(seccion => {

            seccion.classList.remove(
                "activeSection"
            );

        });


    const seccion =
        $(id);


    if (!seccion)
        return;


    seccion.classList.add(
        "activeSection"
    );


    document
        .querySelectorAll(".navItem")
        .forEach(boton => {

            boton.classList.remove(
                "active"
            );


            if (
                boton.dataset.section === id
            ) {

                boton.classList.add(
                    "active"
                );

            }

        });


    const titulos = {

        dashboardSection:
            "Dashboard",

        ventaSection:
            "Nueva venta",

        gastoSection:
            "Gasto administrativo",

        movimientosSection:
            "Movimientos",

        turnosSection:
            "Historial de turnos"

    };


    $("pageTitle").textContent =
        titulos[id] || "JR Connection";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    const sidebar =
        document.querySelector(".sidebar");


    if (sidebar) {

        sidebar.classList.remove(
            "mobileOpen"
        );

    }

}


/* =========================================================
   ACORDEONES
========================================================= */

function configurarAcordeon(
    botonId,
    panelId
) {

    const boton = $(botonId);

    const panel = $(panelId);


    if (!boton || !panel)
        return;


    boton.addEventListener(
        "click",
        () => {

            const abierto =
                panel.classList.contains(
                    "open"
                );


            panel.classList.toggle(
                "open",
                !abierto
            );


            boton.classList.toggle(
                "open",
                !abierto
            );

        }
    );

}


/* =========================================================
   EVENTOS
========================================================= */

function configurarEventos() {


    /* ---------------------------------------------
       NAVEGACIÓN
    --------------------------------------------- */

    document
        .querySelectorAll(".navItem")
        .forEach(boton => {

            boton.addEventListener(
                "click",
                () => {

                    mostrarSeccion(
                        boton.dataset.section
                    );

                }
            );

        });


    /* ---------------------------------------------
       ABRIR TURNO
    --------------------------------------------- */

    $("btnAbrirTurno")
        ?.addEventListener(
            "click",
            abrirModalTurno
        );


    $("btnAbrirTurnoDashboard")
        ?.addEventListener(
            "click",
            abrirModalTurno
        );


    $("confirmarAbrirTurno")
        ?.addEventListener(
            "click",
            confirmarAbrirTurno
        );


    $("cerrarModalAbrir")
        ?.addEventListener(
            "click",
            () =>
                cerrarModal(
                    "modalAbrirTurno"
                )
        );


    $("cancelarAbrirTurno")
        ?.addEventListener(
            "click",
            () =>
                cerrarModal(
                    "modalAbrirTurno"
                )
        );


    /* ---------------------------------------------
       CERRAR TURNO
    --------------------------------------------- */

    $("btnCerrarTurno")
        ?.addEventListener(
            "click",
            prepararCierreTurno
        );


    $("confirmarCerrarTurno")
        ?.addEventListener(
            "click",
            confirmarCerrarTurno
        );


    $("cerrarModalCerrar")
        ?.addEventListener(
            "click",
            () =>
                cerrarModal(
                    "modalCerrarTurno"
                )
        );


    $("cancelarCerrarTurno")
        ?.addEventListener(
            "click",
            () =>
                cerrarModal(
                    "modalCerrarTurno"
                )
        );


    $("inputCajaFisica")
        ?.addEventListener(
            "input",
            actualizarDiferencia
        );


    /* ---------------------------------------------
       VENTA
    --------------------------------------------- */

    $("btnVenta")
        ?.addEventListener(
            "click",
            registrarVenta
        );


    $("btnCancelarVenta")
        ?.addEventListener(
            "click",
            limpiarVenta
        );


    $("precio")
        ?.addEventListener(
            "input",
            calcularPago
        );


    $("efectivo")
        ?.addEventListener(
            "input",
            calcularPago
        );


    $("transferencia")
        ?.addEventListener(
            "input",
            calcularPago
        );


    $("cambio")
        ?.addEventListener(
            "input",
            calcularPago
        );


    /* ---------------------------------------------
       GASTOS
    --------------------------------------------- */

    $("btnGasto")
        ?.addEventListener(
            "click",
            registrarGasto
        );


    $("btnCancelarGasto")
        ?.addEventListener(
            "click",
            limpiarGasto
        );


    /* ---------------------------------------------
       DETALLE
    --------------------------------------------- */

    $("cerrarModalDetalle")
        ?.addEventListener(
            "click",
            () =>
                cerrarModal(
                    "modalDetalle"
                )
        );


    $("cerrarDetalle")
        ?.addEventListener(
            "click",
            () =>
                cerrarModal(
                    "modalDetalle"
                )
        );


    /* ---------------------------------------------
       ACORDEONES
    --------------------------------------------- */

    configurarAcordeon(
        "ventasAccordion",
        "panelVentas"
    );


    configurarAcordeon(
        "gastosAccordion",
        "panelGastos"
    );


    /* ---------------------------------------------
       MENÚ MÓVIL
    --------------------------------------------- */

    $("mobileMenu")
        ?.addEventListener(
            "click",
            () => {

                const sidebar =
                    document.querySelector(
                        ".sidebar"
                    );


                sidebar?.classList.toggle(
                    "mobileOpen"
                );

            }
        );


    /* ---------------------------------------------
       CERRAR MODALES HACIENDO CLICK AFUERA
    --------------------------------------------- */

    document
        .querySelectorAll(".modalOverlay")
        .forEach(modal => {

            modal.addEventListener(
                "click",
                event => {

                    if (
                        event.target === modal
                    ) {

                        cerrarModal(
                            modal.id
                        );

                    }

                }
            );

        });


    /* ---------------------------------------------
       TECLA ESC
    --------------------------------------------- */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape")
                return;


            document
                .querySelectorAll(
                    ".modalOverlay:not(.hidden)"
                )
                .forEach(modal => {

                    cerrarModal(
                        modal.id
                    );

                });

        }
    );


    /* ---------------------------------------------
       ENTER EN CAMPOS
    --------------------------------------------- */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key !== "Enter"
                ||
                event.target.tagName === "TEXTAREA"
            ) {

                return;

            }


            if (
                event.target.id ===
                "inputResponsable"
            ) {

                confirmarAbrirTurno();

            }


            if (
                event.target.id ===
                "motivoGasto"
            ) {

                registrarGasto();

            }

        }
    );

}


/* =========================================================
   ACTUALIZAR TODO
========================================================= */

function actualizarTodo() {

    mostrarFecha();

    actualizarEstadoTurno();

    actualizarDashboard();

    pintarVentas();

    pintarGastos();

    pintarHistorialTurnos();

    calcularPago();

}


/* =========================================================
   INICIALIZACIÓN
========================================================= */

function iniciar() {

    configurarEventos();

    actualizarTodo();

}


/* =========================================================
   INICIAR
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    iniciar
);