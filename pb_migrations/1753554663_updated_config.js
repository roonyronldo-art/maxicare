/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2458948245")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != \"\"",
    "deleteRule": "@request.auth.id != \"\"",
    "listRule": "@request.auth.id != \"\"",
    "updateRule": "@request.auth.id != \"\"",
    "viewRule": "@request.auth.id != \"\""
  }, collection)

  return app.save(collection)
}, (app) => {
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
})
