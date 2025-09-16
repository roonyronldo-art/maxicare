/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1037645436")

  // update field
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
      "User"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1037645436")

  // update field
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

  return app.save(collection)
})
