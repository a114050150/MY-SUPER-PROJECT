# World Charity Day — Local Preview & Deployment

簡短說明：這個靜態網站包含 `index.html`、`styles.css` 與 `script.js`。我已新增：

- 捐款彈窗（前端驗證 + 模擬後端呼叫）
- 分享按鈕（Facebook / Twitter / LINE / 複製連結）
- 無障礙處理（ARIA、ESC 關閉、鍵盤焦點）
- 本機 mock server：`mock-server.js`（模擬 POST /donate 回應）

快速預覽
1. 在專案目錄啟動靜態伺服器（任何靜態伺服器皆可）：

```bash
python3 -m http.server 8000
# 在瀏覽器開啟 http://localhost:8000
```

模擬後端（可選）
1. 使用 Node.js 啟動模擬捐款端點（將回應 JSON）：

```bash
# 安裝 Node.js（若尚未安裝）
node mock-server.js
# mock server 預設監聽 3000
```

2. 前端會嘗試發 POST 至 `/donate`（當在同一域名，或啟用 mock server 時有效）。若 mock server 不可用，前端會改採模擬回應。

部署到 GitHub Pages
1. 建議將專案推到 GitHub，然後在 repository 設定中啟用 GitHub Pages（使用 main 或 gh-pages 分支）。

可選自動化（gh-pages 套件）
1. 若使用 Node.js 環境，可安裝 `gh-pages` 並在 `package.json` 加入部署指令。

需要我幫你：
- 建 `package.json` 與 `gh-pages` 部署腳本（已新增 `package.json`）
- 或把整個專案打包成 zip

快速啟動（建議）
1. 安裝開發相依套件：

```bash
npm install
```

2. 單獨啟動 mock server：

```bash
npm run start:mock
```

3. 啟動靜態伺服器（或使用 `npm run start:static`）：

```bash
npm run start:static
# 或
python3 -m http.server 8000
```

4. 若要同時一鍵啟動（需要 `concurrently` 已安裝）：

```bash
npm run start:all
```

注意：若靜態伺服器與 mock server 位於不同 port，前端會先嘗試 `POST /donate`，若失敗會再嘗試 `http://localhost:3000/donate`，mock server 已允許 CORS。
