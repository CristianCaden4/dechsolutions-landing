# Dech Solutions · Brief de rediseño con scroll

> **Autoría:** escrito a partir del pedido del usuario (2026-10-01). Las respuestas
> marcadas como *decisión autoral* no fueron entrevistadas: se tomaron dentro del
> margen que dio el pedido ("que destaque", "efectos impresionantes", "hero muy
> tecnológico") y se trabajan en la rama `rediseno-scroll` para poder revertirlas.

## Las ocho preguntas

1. **Vibe.** Usuario: "que se vea demasiado impresionante", "muy tecnológico", "efectos futuristas", "moderna", "mantén el estilo que ya tiene".
   Referencias: la landing de Axion Studio que pegó (shader con vidrio acanalado, nav en píldora, botones con texto que rueda, hero anclado abajo).
   *Decisión autoral:* el estilo de Dech manda (negro #0A0A0A, cian #64CEFB, azul #2E9BD6, Inter, secciones claras intercaladas). De la referencia se toman las técnicas, no la paleta naranja/gris.
2. **Recorrido.** Usuario: "lo importante es mostrar todo lo que hace el negocio". Se respeta el orden y el contenido actual: Hero, Problema, Soluciones, Productos, Metodología, Industrias, Diagnóstico, Casos, Contacto.
3. **Curva de energía.** *Decisión autoral:* alta en el hero, máxima en el Problema, baja (respira) en Soluciones, media-alta en Productos, calma en Metodología, media en Industrias, activa (el visitante juega) en Diagnóstico, media en Casos, calma resuelta en Contacto.
4. **Sentimiento y el momento a recordar.** Ver curva abajo. Pico: el Problema.
5. **Algo que ningún otro sitio hace.** *Decisión autoral:* el desorden de la empresa se ordena solo mientras bajas. Las etiquetas de "Operación fragmentada" y cientos de partículas en caos se ensamblan en la retícula de puntos de la marca y se convierten en "Operación conectada".
6. **Distancia de premium-minimal.** *Decisión autoral:* premium-tecnológico. Oscuro, preciso, con micro-tipografía mono para detalles técnicos. Nada maximalista ni retro.
7. **¿Un mundo continuo o escenas?** *Decisión autoral:* escenas distintas. Cada sección se comporta diferente; el hilo continuo es la luz cian del shader (abre y cierra la página) y la retícula de puntos.
8. **Assets.** Logo SVG (tres chevrones), paleta, textos. Sin fotos ni video propio; el video actual del hero es temporal y sin licencia clara (TODO en el código). *Decisión:* mundo 100% generado por código (WebGL + canvas + HTML). Cero assets descargados, cero licencias.

## Curva de sentimiento

| Acto | Emoción | Qué la causa en pantalla |
|---|---|---|
| 1 Hero | Asombro, "esto no es una plantilla" | Luz cian líquida detrás de vidrio acanalado que sigue al cursor; el titular sube palabra por palabra; capas que se separan al mover el mouse y al bajar |
| 2 Problema | Reconocimiento → tensión → alivio (PICO) | Sus propios problemas (Excel, procesos manuales...) flotando en caos rojo; al bajar, todo colapsa en un núcleo y renace como sistema conectado en la retícula cian |
| 3 Soluciones | Claridad | El titular se enciende palabra por palabra al leerlo; tarjetas que responden al cursor |
| 4 Productos | Deseo, tangibilidad | PYME Core y LexCore como ventanas de producto reales que se apilan una sobre otra |
| 5 Metodología | Confianza | Una pista de circuito se dibuja paso a paso y enciende cada etapa |
| 6 Industrias | Pertenencia, "trabajan con empresas como la mía" | Las industrias viajan en horizontal; la del centro cobra protagonismo |
| 7 Diagnóstico | Agencia | El visitante elige, un escáner barre el panel y la recomendación se escribe sola |
| 8 Casos | Prueba | Cada caso barre de "Antes: Excel" a "Después: sistema" con el scroll |
| 9 Contacto | Resolución, invitación | La luz del hero vuelve, quieta, alrededor del formulario |

**El pico:** "Es la página donde bajas y ves cómo el caos de una empresa se ordena solo." Vive en el acto 2 y tiene el mayor espacio de scroll (≈3.2 pantallas). El acto anterior (hero) se cierra encogiéndose, el siguiente (Soluciones) es claro y quieto.

**Frase para contarle a alguien:** "Es el sitio donde el desorden de tu empresa se arma solo mientras haces scroll."

**Silencios intencionales:** el final del acto 2 (el sistema conectado late con pulsos de datos sin texto nuevo durante ~0.4 pantallas) es una pausa a propósito, no scroll muerto.
