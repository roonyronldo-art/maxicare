/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1792621413")

  // update collection data
  unmarshal({
    "createRule": null,
    "listRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1792621413")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != \"\"",
    "listRule": "user.id = @request.auth.id || @request.auth.role = \"admin\"",
    "viewRule": "user.id = @request.auth.id || @request.auth.role = \"admin\""
  }, collection)

  return app.save(collection)
})
