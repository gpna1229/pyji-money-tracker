# Pyji - 個人化記帳管理系統
## 專案簡介
Pyji 是一個專為現代使用者打造的記帳網站，支援新增多個資產帳戶管理帳務。本專案採用前後端分離架構，提供使用者記錄收支、管理資產等功能，並透過 Google 快速登入。
## 技術堆疊
- 前端：React, React Router, Axios, CSS
- 後端：FastAPI (Python)
- 資料庫：MySQL, SQLAlchemy (ORM)
- 驗證：OAuth 2.0 (Google Login), JWT (JSON Web Token)
- 開發工具：Git, VS Code
## 核心功能與技術實現
#### 安全認證機制
- 整合 Google OAuth 2.0 實現快速登入，後端使用 JWT 進行身分驗證，確保 API 請求的安全性與狀態管理。
#### 資料庫建模
- 透過 SQLAlchemy 定義資料模型，並在 MySQL 資料庫層級配置外鍵約束 (Foreign Key Constraints)。
#### API 標準化與開發效率優化
- 設計統一的 API 回傳格式，確保測試環境與正式環境的資料結構一致，有效降低前端解析錯誤。
- 透過 axios 封裝 HTTP 請求，簡化跨域請求邏輯。
#### 輸入資料驗證
- 利用 Pydantic 建立嚴謹的資料模型（Schema），針對所有 API 輸入進行型別檢查。
- 當使用者輸入異常資料時，系統會自動攔截並回傳標準化錯誤訊息，確保後端處理的資料皆為合法格式，有效防止不當請求造成的系統異常。
## 介面展示
#### 歡迎與登入頁面
<img width="500" alt="image" src="https://github.com/user-attachments/assets/06e80fed-5c2f-4aff-bd5c-714aa2373029" />

#### 記帳總覽
<img width="500" alt="image" src="https://github.com/user-attachments/assets/09a06986-43f0-463b-b7fb-f8caffd91b3a" />

#### 記帳明細
<img width="500" alt="image" src="https://github.com/user-attachments/assets/d02957e6-70f1-4fea-a143-455ff5cf9614" />

#### 資產管理
<img width="500" alt="image" src="https://github.com/user-attachments/assets/2116d1f4-cc11-43b2-a9c2-34804a94e4bd" />

#### 新增記帳
<img width="500" alt="image" src="https://github.com/user-attachments/assets/772d629c-e02f-4512-a88f-9413a9a57708" />


#### 新增資產帳戶
<img width="500" alt="image" src="https://github.com/user-attachments/assets/d2f58c5a-5635-4930-bf9e-3b66580174a3" />









