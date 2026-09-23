-- MJ Developers — Initial schema

CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  location TEXT NOT NULL,
  property_type TEXT,
  status TEXT DEFAULT 'Upcoming',
  short_description TEXT,
  description TEXT,
  starting_price TEXT,
  bedrooms TEXT,
  area TEXT,
  possession TEXT,
  main_image TEXT,
  gallery TEXT DEFAULT '[]',
  amenities TEXT DEFAULT '[]',
  floor_plans TEXT DEFAULT '[]',
  specifications TEXT DEFAULT '[]',
  highlights TEXT DEFAULT '[]',
  map_embed TEXT,
  brochure_url TEXT,
  construction_status TEXT DEFAULT 'Planning',
  progress INTEGER DEFAULT 0,
  featured INTEGER DEFAULT 0,
  published INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  seo_og_image TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(published);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);

CREATE TABLE IF NOT EXISTS project_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS floor_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  title TEXT,
  area TEXT,
  description TEXT,
  image TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS amenities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_amenities (
  project_id INTEGER NOT NULL,
  amenity_id INTEGER NOT NULL,
  PRIMARY KEY (project_id, amenity_id),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS testimonials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  project TEXT,
  review TEXT NOT NULL,
  photo TEXT,
  enabled INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gallery (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT NOT NULL,
  title TEXT,
  alt_text TEXT,
  category TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category);

CREATE TABLE IF NOT EXISTS construction_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER,
  status TEXT,
  progress INTEGER DEFAULT 0,
  description TEXT,
  image TEXT,
  updated_on DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS content (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT NOT NULL,
  thumb TEXT,
  alt_text TEXT,
  title TEXT,
  category TEXT,
  project_id INTEGER,
  provider TEXT,
  meta TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_media_category ON media(category);

CREATE TABLE IF NOT EXISTS enquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  project TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'New',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries(created_at DESC);

CREATE TABLE IF NOT EXISTS site_visits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  project TEXT,
  preferred_date TEXT,
  preferred_time TEXT,
  message TEXT,
  status TEXT DEFAULT 'New',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_site_visits_created ON site_visits(created_at DESC);

-- Legacy compatibility tables referenced in prompt
CREATE TABLE IF NOT EXISTS homepage_content (id INTEGER PRIMARY KEY, key TEXT, value TEXT);
CREATE TABLE IF NOT EXISTS owner_profile (id INTEGER PRIMARY KEY, key TEXT, value TEXT);
CREATE TABLE IF NOT EXISTS team_profile (id INTEGER PRIMARY KEY, key TEXT, value TEXT);
CREATE TABLE IF NOT EXISTS contact_settings (id INTEGER PRIMARY KEY, key TEXT, value TEXT);
CREATE TABLE IF NOT EXISTS seo_settings (id INTEGER PRIMARY KEY, key TEXT, value TEXT);
CREATE TABLE IF NOT EXISTS site_settings (id INTEGER PRIMARY KEY, key TEXT, value TEXT);
