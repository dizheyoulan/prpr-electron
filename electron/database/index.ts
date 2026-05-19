import { app } from 'electron'
import { join } from 'path'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { runMigrations } from './migrations'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const initSqlJs = require('sql.js')

let _db: any = null

export function getDb(): any {
  if (!_db) throw new Error('Database not initialized')
  return _db
}

export function saveDb(): void {
  if (_db) writeFileSync(dbPath, Buffer.from(_db.export()))
}

let dbPath: string

export async function initDb(): Promise<void> {
  dbPath = join(app.getPath('userData'), 'prpr.db')
  const wasmPath = join(__dirname, '../../node_modules/sql.js/dist/sql-wasm.wasm')
  const wasmBinary = readFileSync(wasmPath)
  const SQL = await initSqlJs({ wasmBinary })
  _db = existsSync(dbPath)
    ? new SQL.Database(readFileSync(dbPath))
    : new SQL.Database()
  runMigrations(_db)
  saveDb()
}
