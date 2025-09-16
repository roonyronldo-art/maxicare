/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": "@request.auth.id = \"PASTE_ADMIN_ID_HERE\"",
    "deleteRule": "@request.auth.id = \"PASTE_ADMIN_ID_HERE\"",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
        "hidden": false,
        "id": "file2041650936",
        "maxSelect": 1,
        "maxSize": 0,
        "mimeTypes": [],
        "name": "education_image",
        "presentable": false,
        "protected": false,
        "required": false,
        "system": false,
        "thumbs": [],
        "type": "file"
      },
      {
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
      },
      {
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
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_3818476082",
    "indexes": [],
    "listRule": null,
    "name": "config",
    "system": false,
    "type": "base",
    "updateRule": "@request.auth.id = \"PASTE_ADMIN_ID_HERE\"",
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3818476082");

  return app.delete(collection);
})
