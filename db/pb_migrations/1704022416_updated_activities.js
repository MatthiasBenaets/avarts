/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p2kcft43exjibnj")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "rpqb06rw",
    "name": "distance",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ljhnbgrl",
    "name": "speed",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "d4bftn3t",
    "name": "elevation",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "h4lasmac",
    "name": "time",
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
  collection.schema.removeField("rpqb06rw")

  // remove
  collection.schema.removeField("ljhnbgrl")

  // remove
  collection.schema.removeField("d4bftn3t")

  // remove
  collection.schema.removeField("h4lasmac")

  return dao.saveCollection(collection)
})
