/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2458948245")

  // update field
  collection.fields.addAt(20, new Field({
    "hidden": false,
    "id": "file3838560488",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "Education_image",
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

  // update field
  collection.fields.addAt(20, new Field({
    "hidden": false,
    "id": "file3838560488",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "edu_image",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  return app.save(collection)
})
