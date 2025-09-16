/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2458948245")

  // remove field
  collection.fields.removeById("text1510083480")

  // add field
  collection.fields.addAt(20, new Field({
    "hidden": false,
    "id": "file1510083480",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "hero_image",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2458948245")

  // add field
  collection.fields.addAt(17, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1510083480",
    "max": 0,
    "min": 0,
    "name": "hero_image",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // remove field
  collection.fields.removeById("file1510083480")

  return app.save(collection)
})
