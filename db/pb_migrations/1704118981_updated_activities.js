/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p2kcft43exjibnj")

  // remove
  collection.schema.removeField("lkj38mlj")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "r4u30bsk",
    "name": "gpx",
    "type": "file",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "mimeTypes": [],
      "thumbs": [],
      "maxSelect": 1,
      "maxSize": 5242880,
      "protected": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
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

  // remove
  collection.schema.removeField("r4u30bsk")

  return dao.saveCollection(collection)
})
