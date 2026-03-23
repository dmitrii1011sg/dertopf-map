# Dertopf Map

---

### Overview

A geographic data editor built with **Angular** and **CesiumJS**. This project demonstrates an architectural approach to building complex GIS interfaces.

### Currently implemented

- **Reactive Drawing Tools**: Implementation of point, polyline and polygon sipmle drawing logic.

### 🚀 Roadmap

- [x] **Core GIS Engine**: Integration with CesiumJS and base layer configuration.
- [x] **Entity Management**: CRUD operations for Points, Polylines, and Polygons.
- [x] **Modern State Management**: Seamless integration of NgRx Signal Store and RxJS.
- [x] **Responsive UI/UX**: Custom UI with Angular Material and a unified design system.
- [ ] **Advanced Analytics**: Interactive charts and graphs for spatial data analysis (D3.js).
- [ ] **Data Interoperability**: Support for GeoJSON/KML import and export.
- [ ] **Imagery Layers**: Support for custom WMS/TMS layers.
- [ ] **Contour Lines**: Dynamic terrain analysis using custom GLSL shaders.
- [ ] **Performance Suite**: Handling 10k+ entities using Cesium Primitive API.

### Tech Stack

- **Framework**: Angular
- **GIS Engine**: CesiumJS
- **Other**: RxJs, NgRx, Fontawesome, Angular Material

### Installation & Setup

1. **Clone the repo**: `git clone https://github.com/dmitrii1011sg/dertopf-map.git`
2. **Install dependencies**: `pnpm install`
3. **Run the app**: `npx nx serve map-app`
