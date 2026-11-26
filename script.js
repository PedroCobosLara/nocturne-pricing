// Nocturne Pricing: calcula el precio de venta a partir de costes, comisiones, IVA y margen.

const $ = (id) => document.getElementById(id);
const eur = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });

// Lee un campo numérico (si está vacío o mal escrito, cuenta como 0)
const num = (id) => Math.max(0, parseFloat($(id).value) || 0);

/*
  Fórmula:
  - precio con IVA  = base * (1 + iva)
  - comisiones      = precio con IVA * porcentaje + parte fija
  - beneficio       = base - comisiones - costes
  Queremos que el beneficio sea margen * base, y despejando la base queda:
  base = (costes + parte fija) / (1 - margen - (1 + iva) * porcentaje)
*/
function precioPara(margen, costes, fija, porcentaje, iva) {
  const divisor = 1 - margen - (1 + iva) * porcentaje;
  if (divisor <= 0) return null; // con esas comisiones y ese margen no hay precio posible
  return ((costes + fija) / divisor) * (1 + iva);
}

// Sube al siguiente precio acabado en ,90 (por ejemplo 27,31 € -> 27,90 €)
function redondear(precio) {
  let r = Math.ceil(precio) - 0.1;
  if (r < precio) r += 1;
  return r;
}

function calcular() {
  const costes = num("producto") + num("envio") + num("extra");
  const porcentaje = (num("pasarela") + num("shopify")) / 100;
  const fija = num("fija");
  const iva = num("iva") / 100;
  const margen = Math.min(num("margen"), 90) / 100;

  const recomendado = precioPara(margen, costes, fija, porcentaje, iva);
  const minimo = precioPara(0, costes, fija, porcentaje, iva);

  if (recomendado === null) return mostrarError();
  const precio = redondear(recomendado);

  // Reparto del precio final que paga el cliente
  const base = precio / (1 + iva);
  const partes = {
    costes,
    comisiones: precio * porcentaje + fija,
    iva: precio - base,
  };
  partes.beneficio = precio - partes.costes - partes.comisiones - partes.iva;

  mostrar(precio, minimo, partes, base);
}

function mostrar(precio, minimo, p, base) {
  $("error").hidden = true;
  const textoPrecio = eur.format(precio);
  if ($("precio").textContent !== textoPrecio) {
    $("precio").textContent = textoPrecio;
    // Reinicia la animación "pop" cada vez que cambia el precio
    $("precio").classList.remove("pop");
    void $("precio").offsetWidth;
    $("precio").classList.add("pop");
  }
  $("detalle").textContent = "Precio con IVA incluido, redondeado a ,90";
  $("minimo").textContent = eur.format(minimo);
  $("beneficio").textContent = eur.format(p.beneficio);
  $("real").textContent = (base > 0 ? (p.beneficio / base) * 100 : 0).toFixed(1).replace(".", ",") + " %";

  const filas = [
    ["Costes de producción y envío", p.costes, "var(--c-costes)"],
    ["Comisiones de cobro", p.comisiones, "var(--c-comisiones)"],
    ["IVA", p.iva, "var(--c-iva)"],
    ["Beneficio", p.beneficio, "var(--moon)"],
  ];
  $("barra").innerHTML = filas
    .map(([, valor, color]) => `<span style="width:${Math.max(valor, 0) / precio * 100}%;background:${color}"></span>`)
    .join("");
  $("leyenda").innerHTML = filas
    .map(([nombre, valor, color]) => `<li><i class="dot" style="background:${color}"></i><span>${nombre}</span><strong>${eur.format(valor)}</strong></li>`)
    .join("");
}

function mostrarError() {
  $("precio").textContent = "—";
  $("detalle").textContent = "";
  $("minimo").textContent = $("beneficio").textContent = $("real").textContent = "—";
  $("barra").innerHTML = $("leyenda").innerHTML = "";
  $("error").textContent = "Con estas comisiones y este margen no hay precio posible. Baja el margen deseado.";
  $("error").hidden = false;
}

// Recalcula cada vez que se cambia un campo
$("form").addEventListener("input", calcular);
$("form").addEventListener("submit", (e) => e.preventDefault());

// Botón de modo claro / oscuro
$("tema").addEventListener("click", () => {
  const nuevo = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  const html = document.documentElement;
  html.classList.add("theming");              // activa la transición suave de colores
  html.dataset.theme = nuevo;
  setTimeout(() => html.classList.remove("theming"), 900);
  try { localStorage.setItem("tema", nuevo); } catch (e) {}
});

// Fondo de estrellas: puntos en posiciones aleatorias que parpadean
const estrellas = document.createDocumentFragment();
for (let i = 0; i < 70; i++) {
  const s = document.createElement("i");
  const tam = Math.random() < 0.2 ? 3 : 2;
  s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;width:${tam}px;height:${tam}px;animation-delay:${Math.random() * 3}s`;
  estrellas.appendChild(s);
}
$("estrellas").appendChild(estrellas);

calcular();
