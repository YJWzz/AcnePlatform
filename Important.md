### 一、前端前置作業
1. frontend2檔名改成frontend
2. open terminal
3. cd frontend 
4. npm install
5. npm install react-bootstrap bootstrap



### 二、MySQL資料庫

-- 建立存放使用者的照片--
    CREATE TABLE IF NOT EXISTS acne_analysis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    face_part ENUM('left', 'middle', 'right') NOT NULL,
    severity VARCHAR(255) NOT NULL,
    confidence DECIMAL(5,2) NOT NULL
	);
ALTER TABLE acne_analysis ADD COLUMN upload_time DATETIME DEFAULT CURRENT_TIMESTAMP;
-- ALTER TABLE acne_analysis ADD COLUMN username VARCHAR(255) DEFAULT NULL;


-- 建立存放使用者的資料夾資訊的表格--
	CREATE TABLE IF NOT EXISTS user_folders (
	 id INT AUTO_INCREMENT PRIMARY KEY,
	 username VARCHAR(255) NOT NULL UNIQUE,
	 folder_path VARCHAR(512) NOT NULL,
	 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

### 三、後端開啟方式
1. open terminal
2. cd backend
2. python Acne.py