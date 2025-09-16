/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2458948245")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.admin = true",
    "deleteRule": "@request.auth.admin = true",
    "listRule": "@request.auth.admin = true",
    "updateRule": "@request.auth.admin = true",
    "viewRule": "@request.auth.admin = true"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2458948245")

  // update collection data
  unmarshal({
    "createRule": "",
    "deleteRule": null,
    "listRule": null,
    "updateRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
