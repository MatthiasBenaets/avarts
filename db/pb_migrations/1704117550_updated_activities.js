/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p2kcft43exjibnj")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lkj38mlj",
    "name": "gpx",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p2kcft43exjibnj")

  // remove
  collection.schema.removeField("lkj38mlj")

  return dao.saveCollection(collection)
})
