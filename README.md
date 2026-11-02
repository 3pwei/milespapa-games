# Milespapa Games

`games.milespapa.com` 的發布來源。每個遊戲是 `site/` 底下的一個資料夾，網址就是 `https://games.milespapa.com/<資料夾名>/`。

這個 repo 只放**建置好的靜態檔**。遊戲原始碼、測試與開發紀錄都留在各自的 repo，這裡只負責發布。

## 結構

```text
site/                 ← Cloudflare Pages 只發布這個資料夾
  _redirects          ← 網域根目錄導向 https://milespapa.com/projects
  404.html            ← 找不到頁面時顯示
  tarot/              ← 塔羅工坊（來源：3pwei/tarot-atelier）
  election/           ← 拜託，投我！（待加入）
scripts/check-site.mjs ← 發布前檢查
```

| 遊戲 | 網址 | 原始碼 | 建置方式 |
| --- | --- | --- | --- |
| 塔羅工坊 | `/tarot/` | `3pwei/tarot-atelier` | `NEXT_PUBLIC_BASE_PATH=/tarot pnpm check`，取 `out/` |
| 拜託，投我！ | `/election/` | 待補 | 待補 |

## 更新一個遊戲

1. 在遊戲的 repo 用正確的子路徑建置（例如 `/tarot`），否則資源會從網域根目錄載入而失效。
2. 用建置結果**整個取代** `site/<遊戲>/`，不要只覆蓋部分檔案，以免殘留舊的 chunk。
3. 執行 `node scripts/check-site.mjs`。
4. 開 PR。CI 會跑同一個檢查；合併到 `main` 後，Cloudflare Pages 會自動發布。

PR 標題建議寫明來源版本，例如 `deploy: tarot 2de8de7`，方便追查與回復。

## 新增一個遊戲

在 `site/` 底下新增資料夾（小寫英數與連字號），放入用 `/<資料夾名>` 子路徑建置的靜態檔，並更新上方表格。

**一個遊戲一個資料夾，不分類。** 每個遊戲直接放在 `site/` 下一層，不要建立 `site/card/tarot/` 這類分類子資料夾。資料夾名稱就是公開網址，加一層分類會改變網址、讓既有連結（例如主站連到的 `/election/`）失效，也必須重新建置遊戲。之後若需要分類，請用清單檔記錄，不要用資料夾層級表達。

給 AI 開發工具（例如 Codex）的完整規則寫在 [`AGENTS.md`](AGENTS.md)。

## Cloudflare Pages 設定

- Framework preset：None
- Build command：留空
- Build output directory：`site`
- Production branch：`main`
- 自訂網域：`games.milespapa.com`

**注意**：切換到這個 repo 之前，`site/` 必須包含目前線上所有的遊戲（包括 `election/`）。Cloudflare 每次發布都會以 `site/` 的內容**完整取代**網站，少放的遊戲會從線上消失。

## 回復

在 Cloudflare Pages 的 Deployments 頁面，對前一個成功的發布選擇 Rollback；或在這個 repo revert 該次合併。
