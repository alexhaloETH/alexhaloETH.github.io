# Ship model credits

The three ship models in this folder were made for this site in Blender (5.3):

- `capital.glb`: capital warship, 50 m
- `fighter.glb`: escort strike fighter, 4 m
- `visitor.glb`: armed freighter (the ship that drops out of warp), 30 m

They are original designs, built from scratch with Blender's Python API: hard-surface geometry plus a procedural hull material. That material was then baked to the textures embedded in each file (base colour, occlusion/roughness/metallic, normal and emissive).

Third-party assets: none. No external textures, HDRIs, kitbash parts, logos or insignia were used.

Review renders and the `.blend` source files are in `design/models/`.

## Ring megastructure

`ring.glb` is an orbital construction and industry ring, made for this site in Blender (5.3). It is built at a radius of 1,000 m to the centre of the band, with a band 60 m wide and 25 m deep; the site scales it up in code.

It is an original design, built from scratch with Blender's Python API. It has an I-beam band of repeating modules, an exposed scaffold stretch, two unfinished gaps where only the framework stands, and docking arms, radiator arrays, tank clusters and construction gantries. A procedural material was baked to the textures embedded in the file (base colour, occlusion/roughness/metallic, normal and emissive). Repeated modules are stored once and placed with `EXT_mesh_gpu_instancing`.

Third-party assets: none. No external textures, HDRIs, kitbash parts, logos or insignia were used.

Review renders are `design/models/previews/ring_far.png`, `ring_arc.png` and `ring_detail.png`. The source file is `design/models/ring.blend`.
