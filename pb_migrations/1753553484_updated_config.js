/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2458948245")

  // add field
  collection.fields.addAt(6, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3020519340",
    "max": 0,
    "min": 0,
    "name": "hero_title",
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
    "id": "text4103808537",
    "max": 0,
    "min": 0,
    "name": "hero_subtitle",
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
    "id": "text3376152954",
    "max": 0,
    "min": 0,
    "name": "hero_button_text",
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
    "id": "text567326461",
    "max": 0,
    "min": 0,
    "name": "hero_button_url",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

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
  collection.fields.addAt(11, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2729627992",
    "max": 0,
    "min": 0,
    "name": "clinic_title",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(12, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1547141069",
    "max": 0,
    "min": 0,
    "name": "clinic_desc",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(13, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1291497123",
    "max": 0,
    "min": 0,
    "name": "lab_title",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(14, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text438937807",
    "max": 0,
    "min": 0,
    "name": "lab_desc",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(15, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text180401372",
    "max": 0,
    "min": 0,
    "name": "edu_title",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(16, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1234021984",
    "max": 0,
    "min": 0,
    "name": "edu_desc",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(17, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text115277283",
    "max": 0,
    "min": 0,
    "name": "footer_text_",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
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

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2458948245")

  // remove field
  collection.fields.removeById("text3020519340")

  // remove field
  collection.fields.removeById("text4103808537")

  // remove field
  collection.fields.removeById("text3376152954")

  // remove field
  collection.fields.removeById("text567326461")

  // remove field
  collection.fields.removeById("file1510083480")

  // remove field
  collection.fields.removeById("text2729627992")

  // remove field
  collection.fields.removeById("text1547141069")

  // remove field
  collection.fields.removeById("text1291497123")

  // remove field
  collection.fields.removeById("text438937807")

  // remove field
  collection.fields.removeById("text180401372")

  // remove field
  collection.fields.removeById("text1234021984")

  // remove field
  collection.fields.removeById("text115277283")

  // remove field
  collection.fields.removeById("file1287236972")

  // remove field
  collection.fields.removeById("file2733757079")

  // remove field
  collection.fields.removeById("file3838560488")

  return app.save(collection)
})
