# Ramble Quest

## Goal of the project

To create an FastAPI that allows users to upload a GeoJson file and then view it on a map.

## Project Demonstrates

1. The ability to upload a shape, store it in the database.
2. Uploads persist between sessions.
3. Previous shapes that were uploaded are selectable from a list.
4. When a shape is selected the map will highlight the shape and zoom to its bounds.
5. When a shape finishes uploading it is automatically selected.

## Technology used

* FastAPI
* SQLAlchemy
* SQLite
* React implemented in TypeScript
* MapBox GL JS


Detects and Adjusts for system Light/Dark mode.