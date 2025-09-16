/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2458948245")

  // remove field
  collection.fields.removeById("file1510083480")

  // remove field
  collection.fields.removeById("file1287236972")

  // remove field
  collection.fields.removeById("file2733757079")

  // remove field
  collection.fields.removeById("file3838560488")

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

  // add field
  collection.fields.addAt(18, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3838560488",
    "max": 0,
    "min": 0,
    "name": "edu_image",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(19, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2733757079",
    "max": 0,
    "min": 0,
    "name": "lab_image",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(20, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1287236972",
    "max": 0,
    "min": 0,
    "name": "clinic_image",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2458948245")

  // add field
  collection.fields.addAt(10, new Field({
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

  // add field
  collection.fields.addAt(18, new Field({
    "hidden": false,
    "id": "file1287236972",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "clinic_image",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  // add field
  collection.fields.addAt(19, new Field({
    "hidden": false,
    "id": "file2733757079",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "lab_image",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  // add field
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

  // remove field
  collection.fields.removeById("text1510083480")

  // remove field
  collection.fields.removeById("text3838560488")

  // remove field
  collection.fields.removeById("text2733757079")

  // remove field
  collection.fields.removeById("text1287236972")

  return app.save(collection)
})
