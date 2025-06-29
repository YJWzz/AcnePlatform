## 📌 前置作業
### 一、前端
1. frontend2檔名改成frontend
2. open terminal
3. cd frontend 
4. npm install
5. npm install react-bootstrap bootstrap



### 二、MySQL資料庫

-- 建立存放使用者的照片--
CREATE TABLE IF NOT EXISTS acne_analysis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id   VARCHAR(255) NOT NULL,
    filename  VARCHAR(255) NOT NULL,
    face_part ENUM('left', 'middle', 'right') NOT NULL,
    severity  VARCHAR(255) NOT NULL,
    confidence DECIMAL(5,2) NOT NULL,
    upload_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    acne_count INT DEFAULT 0
);


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
3. pip install Flask
4. pip install pymysql
5. python Acne.py
5. 
---


## 📌 AI 模型使用說明（Acne Detection）

### 一、用途概述

本系統使用一個 **事先訓練好的深度學習模型**，用來判斷使用者上傳的臉部圖片中**痘痘的嚴重程度**，協助提供後續的皮膚照護建議。此模型整合於 Flask 後端，並由 `/upload` API 自動呼叫執行推論。

---

### 二、模型資訊

| 項目     | 說明                                |
| ------ | --------------------------------- |
| 模型格式   | `.h5`（Keras 模型格式）                 |
| 模型檔案名稱 | `acne_model.h5`                   |
| 輸入尺寸   | `224 x 224 x 3`（RGB）              |
| 輸入資料處理 | OpenCV 載入後 resize 與標準化            |
| 輸出類別數量 | 4 類別（痘痘嚴重程度）                      |
| 輸出內容   | 分類結果（class index）與信心值（confidence） |

---

### 三、分類對應說明

模型輸出的類別索引（0\~3）會對應到以下痘痘等級說明：

| Class Index | 等級說明               |
| ----------- | ------------------ |
| 0           | Grade I：輕度粉刺型痘痘    |
| 1           | Grade II：中度丘疹型痘痘   |
| 2           | Grade III：嚴重膿皰型痘痘  |
| 3           | Grade IV：非常嚴重結節型痘痘 |

---

### 四、推論流程說明

模型推論整合於 `classify_acne(image_path)` 函數中，其流程如下：

1. 使用 OpenCV 讀取圖片
2. 將圖片 resize 成 `(224, 224)`，並將像素正規化到 `[0, 1]`
3. 加上 batch 維度，送入模型做 `model.predict()`
4. 使用 `np.argmax` 取最大機率對應的類別（即痘痘等級）
5. 使用 `np.max` 取最大信心值，作為可信度回傳

---

### 五、後端整合位置

| 檔案                | 說明                  |
| ----------------- | ------------------- |
| `Acne.py`          | 主程式，載入模型並呼叫推論       |
| `classify_acne()` | 執行圖片預處理與模型推論        |
| `/upload` API     | 接收前端圖片、呼叫模型分類並寫入資料庫 |

---

### 六、異常處理

若模型檔不存在或讀取失敗：

* 系統會顯示 `AI model not loaded`
* `classify_acne()` 回傳 `"AI model not loaded", "N/A"`

---

### 七、測試建議（for 開發者）

* 確保 `acne_model.h5` 放置於與 `Acne.py` 同目錄中
* 可用 `curl` 或 Postman 測試 `/upload` API 是否能正確回傳分類與信心值
* 圖片請使用正臉部清晰圖片（JPEG/PNG）
