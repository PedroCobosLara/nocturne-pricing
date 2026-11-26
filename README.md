# Nocturne Pricing

Calculadora de precios y márgenes que uso en **Nocturne Souls**, mi marca de ropa. Le indico lo que me cuesta cada prenda y qué margen quiero, y me dice a cuánto tengo que venderla.

🔗 **Demo:** https://pedrocoboslara.github.io/nocturne-pricing

<!-- Añade aquí una captura: ![Captura de Nocturne Pricing](captura.png) -->

## Qué hace

- Tiene en cuenta producción, envío, embalaje, comisiones de la pasarela de pago, comisión de Shopify e IVA.
- Calcula el **precio recomendado** (redondeado a ,90) y el **precio mínimo** para no perder dinero.
- Muestra cómo se reparte el precio: costes, comisiones, IVA y beneficio.
- Modo claro y oscuro con transición suave, fondo de estrellas, animaciones de entrada y diseño responsive (respeta la opción de reducir movimiento del sistema).

## Cómo calcula el precio

El cliente paga `base × (1 + IVA)`. Las comisiones se aplican sobre ese total, y el beneficio es lo que queda de la base tras restar comisiones y costes. Si queremos que el beneficio sea `margen × base`, la base es:

```
base = (costes + parte fija) / (1 − margen − (1 + IVA) × % comisiones)
```

## Tecnologías

HTML, CSS y JavaScript, sin librerías externas.

## Cómo usarlo

Abre `index.html` en el navegador. Para publicarlo: en GitHub, **Settings → Pages**, rama `main` y carpeta `/ (root)`.

## Nota

Los valores iniciales son de ejemplo. Todos los porcentajes se pueden editar para ajustarlos a cada plan de comisiones.
