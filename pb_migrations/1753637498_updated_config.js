/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2458948245")

  // remove field
  collection.fields.removeById("autodate3332085495")

  // add field
  collection.fields.addAt(21, new Field({
    "hidden": false,
    "id": "number2630956131",
    "max": null,
    "min": null,
    "name": "hero_image_w",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(22, new Field({
    "hidden": false,
    "id": "number299448726",
    "max": null,
    "min": null,
    "name": "hero_image_h",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(23, new Field({
    "hidden": false,
    "id": "number3551789244",
    "max": null,
    "min": null,
    "name": "clinic_image_w",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(24, new Field({
    "hidden": false,
    "id": "number1589382473",
    "max": null,
    "min": null,
    "name": "clinic_image_h",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(25, new Field({
    "hidden": false,
    "id": "number3829840431",
    "max": null,
    "min": null,
    "name": "lab_image_w",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(26, new Field({
    "hidden": false,
    "id": "number1766766554",
    "max": null,
    "min": null,
    "name": "lab_image_h",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(27, new Field({
    "hidden": false,
    "id": "number2498861212",
    "max": null,
    "min": null,
    "name": "education_image_w",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(28, new Field({
    "hidden": false,
    "id": "number435787113",
    "max": null,
    "min": null,
    "name": "education_image_h",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2458948245")

  // add field
  collection.fields.addAt(22, new Field({
    "hidden": false,
    "id": "autodate3332085495",
    "name": "updated",
    "onCreate": true,
    "onUpdate": true,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // remove field
  collection.fields.removeById("number2630956131")

  // remove field
  collection.fields.removeById("number299448726")

  // remove field
  collection.fields.removeById("number3551789244")

  // remove field
  collection.fields.removeById("number1589382473")

  // remove field
  collection.fields.removeById("number3829840431")

  // remove field
  collection.fields.removeById("number1766766554")

  // remove field
  collection.fields.removeById("number2498861212")

  // remove field
  collection.fields.removeById("number435787113")

  return app.save(collection)
})
