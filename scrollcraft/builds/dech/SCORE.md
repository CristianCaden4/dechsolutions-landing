# Dech Solutions · Gramática, gate y partitura

## Gramática: "sistema operativo" (escenas de producto)

La página se comporta como software: cada sección es un "módulo" con su propio
mecanismo, y el visitante opera una (Diagnóstico). Navegación en píldora de vidrio
con reloj vivo; el hero es un shader en vivo; el cierre devuelve la misma luz.

Por qué no las otras: *filmic one-shot* exige video continuo (no hay assets ni
encaja con software); *editorial/impreso* contradice el pedido de "futurista";
*galería* no hay obra visual que mostrar; *brutalista/maximalista* rompe el
estilo que el usuario pidió mantener; *superficie de trabajo pura* dejaría fuera
la narrativa del problema; *mundo continuo (worldflight)* descartado en el brief
(escenas distintas).

Prohibiciones de esta gramática: nada de video de fondo, nada de contadores de
sección, nada de flecha "scroll", ningún dispositivo dos veces seguidas.

## Movimiento firma

**El ensamblaje** (acto 2): ~600 partículas y las cinco etiquetas de
"Operación fragmentada" se mueven en caos rojo; con el scroll colapsan hacia un
núcleo con el logo, las partículas se asientan en la retícula de puntos de la
marca en una onda que sale del centro, y nacen las cuatro etiquetas de
"Operación conectada" unidas por líneas con pulsos de datos. Código propio en
`components/ProblemSection.js`.

## Gate de huellas

Registro vacío al inicio: no hay filas contra las que comparar. Pasa.

## Partitura

| Acto | Sentimiento | Dispositivo | Por qué este |
|---|---|---|---|
| 1 Hero | Asombro | `live-shader` + `parallax` de 4 planos + salida con `clip-path` | Lo tecnológico se demuestra, no se dice: la luz responde al visitante |
| 2 Problema (PICO) | Tensión → alivio | `pin` + ensamblaje (firma) | El cambio de estado es el mensaje del negocio |
| 3 Soluciones | Claridad | `kinetic` (texto que se enciende) + rejilla bento con foco de cursor | Pausa clara después del pico |
| 4 Productos | Deseo | `stack` (ventanas pegajosas que se apilan) | Dos productos tangibles, uno tras otro |
| 5 Metodología | Confianza | `draw` (pista de circuito trazada por scroll) | Un proceso paso a paso es literalmente una línea |
| 6 Industrias | Pertenencia | `pan` horizontal fijado | Lateral se lee como "opciones" |
| 7 Diagnóstico | Agencia | `interactive` (escáner + texto que se escribe) | El visitante opera el sistema |
| 8 Casos | Prueba | `reveal` (barrido antes/después) | Un barrido es un cambio de estado |
| 9 Contacto | Resolución | `live-shader` en calma (bookend) | La luz del inicio cierra el recorrido |

Familias distintas: 8. Ninguna repetida en actos contiguos. Un solo `pin` de
caos/ensamblaje; el `pan` y el `stack` usan sticky pero con mecánicas distintas
y no son contiguos al pico.

Longitud aproximada: ~17 pantallas en escritorio, 9 actos (fuera de la banda 6-7 actos / 13.6-13.8vh).

## Ronda 2 (feedback: "los puntos entre textos se ven muy IA", "animaciones aún más impactantes")

- Fuera los separadores `·` y el prefijo `//`: los servicios del hero pasan a un selector que se decodifica, las etiquetas usan los chevrones del logo, el Diagnóstico usa insignias.
- Intro de encendido (chevrones → línea de luz → apertura), una vez por sesión, se salta con scroll/tecla/clic.
- Salida del hero: la cámara atraviesa el chevrón central y el titular se parte en dos.
- Titular del hero letra por letra desde el desenfoque; títulos de sección palabra por palabra.
- Cintas cruzadas entre Soluciones y Productos, empujadas por el scroll y que se inclinan con la velocidad.
- Onda expansiva en el instante en que el sistema se conecta (refuerza el pico).
- Industrias como carrusel 3D, ventanas de producto que se inclinan hacia el puntero, cursor con botones magnéticos.
- Cierre: la firma "Dech Solutions" gigante sube letra por letra al final.

## Ronda 3 (feedback: "el hero genera lag", "navbar interactivo", "más animaciones sin afectar el rendimiento")

Medido con build de producción en Chrome, 1440x900, CPU normal y CPU x4 (equipo lento).
Causas encontradas con trazas de Chrome, y su corrección:
- Chevrones de vidrio con `backdrop-filter` sobre un canvas animado: se redifuminaban cada cuadro. Ahora el shader los dibuja como lentes en la misma pasada.
- Shader: ruido evaluado una vez por píxel (antes 5), resolución 0.5 (antes 0.62) con bajada automática si el equipo va lento, sin capa de grano con mix-blend.
- Motor de scroll: lee todo el layout primero y escribe después (antes intercalaba), y se duerme si no hay scroll.
- Problema, Industrias, Productos y cintas: geometría en caché, cero lecturas de layout por cuadro; partículas dibujadas por lotes de color.
- Animaciones CSS infinitas fuera de pantalla pausadas (eran ~1000 recálculos de estilo por segundo).
- Barrido de Casos con transformaciones en vez de `clip-path`; fondo de puntos con transform en vez de background-position.
- El estado del navbar vive en el navbar: sus cambios ya no re-renderizan la página.

Navbar: indicador que se desliza al enlace en hover y sigue la sección activa, enlaces con texto que rueda,
barra de progreso de lectura, se oculta al bajar y vuelve al subir, chevrones del logo que corren en hover,
entrada escalonada, botón de menú que se transforma en X, hoja móvil con enlaces en cascada.
Animaciones nuevas (solo opacity/translate, una vez, por IntersectionObserver): entradas escalonadas en
productos, metodología, diagnóstico, casos, contacto y footer; brillo en los botones principales;
subrayados que se dibujan; íconos que se inclinan; líneas de luz al inicio de las secciones oscuras.
