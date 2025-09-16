/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1037645436")

  // add field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "select1402668550",
    "maxSelect": 1,
    "name": "uid",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "Relation"
    ]
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "date2675529103",
    "max": "",
    "min": "",
    "name": "start",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "date16528305",
    "max": "",
    "min": "",
    "name": "end",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text997143124",
    "max": 0,
    "min": 0,
    "name": "slotId",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1037645436")

  // remove field
  collection.fields.removeById("select1402668550")

  // remove field
  collection.fields.removeById("date2675529103")

  // remove field
  collection.fields.removeById("date16528305")

  // remove field
  collection.fields.removeById("text997143124")

  return app.save(collection)
})
