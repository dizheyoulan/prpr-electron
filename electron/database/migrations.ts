// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function runMigrations(db: any): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS wallpaper_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id TEXT NOT NULL,
      file_path TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS lockscreen_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id TEXT NOT NULL,
      file_path TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ex_search_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      query TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS download_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id TEXT NOT NULL,
      file_path TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL
    );
  `)
}
