/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2458948245")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != \"\"",
    "deleteRule": "@request.auth.id != \"\"",
    "listRule": "",
    "updateRule": "@request.auth.id != \"\"",
    "viewRule": ""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2458948245")

  // update collection data
  unmarshal({
    "createRule": "",
    "deleteRule": "",
    "listRule": "@request.auth.id != \"\"",
    "updateRule": "",
    "viewRule": "@request.auth.id != \"\""
  }, collection)

  return app.save(collection)
})
