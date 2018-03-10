import "reflect-metadata"
import { createConnection, Connection } from "typeorm"

let connection: Connection = null

global.createConnection = async () => {
  if (!connection) {
    connection = await createConnection()
  }
}

global.closeConnection = async () => {
  if (connection) {
    await connection.close()
    connection = null
  }
}

global.clearDatabase = () => {
  const tables = connection.entityMetadatas
    .map(entity => `"${entity.tableName}"`)
    .join(", ")

  const sql = `TRUNCATE TABLE ${tables};`

  return connection.query(sql)
}

global.setupDatabaseHooks = _global => {
  _global.beforeAll(_global.createConnection)
  _global.beforeEach(_global.clearDatabase)
  _global.afterAll(_global.closeConnection)
}
