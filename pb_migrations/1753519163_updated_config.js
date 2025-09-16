/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3818476082")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "file841982534",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "homeEducationImg",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3592971864",
    "max": 0,
    "min": 0,
    "name": "homeClinicTitleEn",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1632175734",
    "max": 0,
    "min": 0,
    "name": "homeLabTitleEn",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text287612733",
    "max": 0,
    "min": 0,
    "name": "homeLabTitleAr",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1027398715",
    "max": 0,
    "min": 0,
    "name": "homeEducationTitleEn",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1297171824",
    "max": 0,
    "min": 0,
    "name": "homeEducationTitleAr",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3818476082")

  // remove field
  collection.fields.removeById("file841982534")

  // remove field
  collection.fields.removeById("text3592971864")

  // remove field
  collection.fields.removeById("text1632175734")

  // remove field
  collection.fields.removeById("text287612733")

  // remove field
  collection.fields.removeById("text1027398715")

  // remove field
  collection.fields.removeById("text1297171824")

  return app.save(collection)
})
