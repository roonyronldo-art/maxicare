/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3818476082")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.role = \"admin\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3818476082")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.collectionName = \"admins\""
  }, collection)

  return app.save(collection)
})
