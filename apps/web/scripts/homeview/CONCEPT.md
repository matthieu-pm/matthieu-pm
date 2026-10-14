# HomeView concept

A personal, Apple-inspired home display. A compact aluminum screen rests on a domed speaker; changing the scene changes the screen, and toggling the lamps changes both the simulated room and its live readout. This is an independent design study, not a specification for an Apple product.

Geometry uses arbitrary model units, not advertised dimensions. A single projection drives the enclosure, screen plane, hinge, grille, and controls. The homepage keeps its existing light card language.

Parts before geometry (47 solids):
- Base: rubber foot, aluminum bottom rim, speaker core, 36 flush curved grille segments, domed upper shell, neck collar.
- Mount: horizontal hinge barrel, end cap.
- Display: rear aluminum shell, polished edge rim, black bezel, recessed display glass.
- Surface detail: staggered speaker apertures, camera lens and trim, paired microphones, bottom rim, glass reflection.

The fixed geometry is generated ahead of time with Anatomy's MIT kit. Only the screen state and gentle display motion run in the browser; geometry never recomputes on animation frames. Regenerate with `node scripts/homeview/build.mjs --audit` from apps/web.
