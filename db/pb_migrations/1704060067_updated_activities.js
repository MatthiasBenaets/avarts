/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p2kcft43exjibnj")

  // remove
  collection.schema.removeField("rpqb06rw")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qwg1r4mo",
    "name": "tot_distance",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p2kcft43exjibnj")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "rpqb06rw",
    "name": "tot_distance",
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
  collection.schema.removeField("qwg1r4mo")

  return dao.saveCollection(collection)
})
