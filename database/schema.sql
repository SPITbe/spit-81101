CREATE TABLE IF NOT EXISTS games (
  id INT AUTO_INCREMENT PRIMARY KEY,
  guild_id VARCHAR(32) NOT NULL,
  status ENUM('pending','running','ended') DEFAULT 'pending',
  started_at DATETIME,
  ended_at DATETIME
);

CREATE TABLE IF NOT EXISTS players (
  id INT AUTO_INCREMENT PRIMARY KEY,
  discord_id VARCHAR(32) NOT NULL,
  guild_id VARCHAR(32) NOT NULL,
  pp INT DEFAULT 0,
  registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(discord_id, guild_id)
);

CREATE TABLE IF NOT EXISTS keywords (
  id INT AUTO_INCREMENT PRIMARY KEY,
  guild_id VARCHAR(32) NOT NULL,
  keyword VARCHAR(100) NOT NULL,
  fail_text TEXT,
  success_text TEXT,
  perfect_text TEXT,
  delay_minutes INT NOT NULL
);

CREATE TABLE IF NOT EXISTS investigations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  guild_id VARCHAR(32),
  discord_id VARCHAR(32),
  keyword VARCHAR(100),
  pp_spent INT,
  result ENUM('fail','success','perfect'),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  intercepted_by VARCHAR(32),
  spied_by VARCHAR(32)
);

CREATE TABLE IF NOT EXISTS pp_distributions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  guild_id VARCHAR(32) NOT NULL,
  game_id INT NOT NULL,
  execute_at DATETIME NOT NULL,
  executed BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS pending_responses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  guild_id VARCHAR(32),
  discord_id VARCHAR(32),
  keyword VARCHAR(100),
  result ENUM('fail','success','perfect'),
  response_text TEXT,
  execute_at DATETIME,
  delivered BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS pending_actions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  guild_id VARCHAR(32),
  actor_id VARCHAR(32),
  target_id VARCHAR(32),
  type ENUM('spy','intercept'),
  consumed BOOLEAN DEFAULT FALSE
);
