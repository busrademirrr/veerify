
CREATE TABLE users (
	id SERIAL NOT NULL, 
	username VARCHAR NOT NULL, 
	email VARCHAR NOT NULL, 
	password VARCHAR, 
	google_id VARCHAR, 
	avatar_url VARCHAR, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	PRIMARY KEY (id)
)

;


CREATE TABLE queries (
	id SERIAL NOT NULL, 
	user_id INTEGER, 
	query_text TEXT NOT NULL, 
	result TEXT, 
	reliability_score FLOAT, 
	similar_news_count INTEGER, 
	source_diversity VARCHAR, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE
)

;


CREATE TABLE trends (
	id SERIAL NOT NULL, 
	topic VARCHAR NOT NULL, 
	query_count INTEGER, 
	last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	PRIMARY KEY (id)
)

;


CREATE TABLE logs (
	id SERIAL NOT NULL, 
	log_type VARCHAR NOT NULL, 
	message TEXT NOT NULL, 
	metadata JSONB, 
	log_time TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	PRIMARY KEY (id)
)

;

