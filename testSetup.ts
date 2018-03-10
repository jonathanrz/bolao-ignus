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

global.setupDatabaseHooks = testSuiteGlobalRef => {
  testSuiteGlobalRef.beforeAll(testSuiteGlobalRef.createConnection)
  testSuiteGlobalRef.beforeEach(testSuiteGlobalRef.clearDatabase)
  testSuiteGlobalRef.afterAll(testSuiteGlobalRef.closeConnection)
}
