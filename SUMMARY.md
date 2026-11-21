BRIEF: PR #2 Merge and Conflict Resolution

Scope
- Repository: maison-notle-303
- PR: #2 (feat/i18n-6lang → main), title: "6-language i18n rollout"
- Conflict file: index.html only

What I did
1. Updated feature branch
   - On branch feat/i18n-6lang, merged the latest main (origin/main) into the branch.
   - Resolved the single conflict in index.html.

2. Conflict resolution policy applied
   - Base: feature branch content preferred.
   - Do not lose relevant changes from main.
   - Maintain the removal of any embedded Wi‑Fi password and ensure no access codes are exposed.

3. index.html conflict details and decisions
   - Host contact paragraph:
     - Kept the feature-side variant that adds data-i18n (branch) while preserving the text from main.
     - Result: <p id="hostContact" data-i18n="hostContact">…</p>.
   - Wi‑Fi config constant:
     - Kept the feature-side empty password to remove the embedded credential.
     - Removed main’s hardcoded password value and ensured QR generation is gated by the absence of a password.

4. Merge and push
   - Pushed the resolved feature branch.
   - Merged PR #2 into main locally with a merge commit and pushed.
   - Main now contains the i18n rollout and the conflict-free index.html.

Verification
- No conflict markers remain in index.html.
- Wi‑Fi password is not embedded:
  - Verified that the constant is: const WIFI = { ssid: 'Maisonnotle303', password: '', type: 'WPA' }.
  - Grepped for the previous secret value (hello.okubo) → none found.
- No access codes present:
  - Searched repo for terms indicating key numbers, lock codes, keybox numbers, passcodes.
  - Matches are instructional text only (e.g., “door codes and key box information will be sent to you…” in how-to-open). No numeric access codes are included anywhere.
- Language switcher works (code-level validation):
  - index.html includes <div data-i18n-switcher> and loads assets/i18n.js and assets/i18n.css.
  - assets/i18n.js initializes automatically, builds the 6-language switcher, persists selection, applies window.I18N_STRINGS, and dispatches i18n:change.
  - window.I18N_STRINGS dictionaries exist for en/ja/zh/ko/fr/es; host contact text updates via window.I18N_ON_CHANGE.

Result
- PR #2 merged into main with commit: Merge pull request #2 from Tsumugi-concierge/feat/i18n-6lang (54666b3).
- index.html conflict resolved per guidelines; Wi‑Fi password and any access codes are not embedded.
- i18n language switcher is present and functional by static analysis; no external changes were made outside this repository.

Notes
- All work was performed within this repository. No external writes or changes were made.

---

Wi‑Fi 情報の復旧（2026-11-21）

実施内容
1. ブランチ作成: main から `feat/wifi-restore` を作成。
2. 履歴確認: 6言語化前の `index.html`（commit b8f61eb）にて Wi‑Fi パスワードが `hello.okubo` であることを確認。QRコードは `WIFI` 定数から生成されていた。
3. 復旧対応（現行の6言語対応を維持）:
   - `index.html` の `WIFI` 定数を `{ ssid: 'Maisonnotle303', password: 'hello.okubo', type: 'WPA' }` に復旧。
   - パスワード行のボタン挙動を `showPwInfo(...)` → `copyWifi(this, 'hello.okubo')` に変更し、表示テキストを `hello.okubo` に復旧。
   - QR トグルは現行のガード（パスワード未設定時にトースト）を維持。今回パスワードを設定したため、開いた際に QR が従来どおり生成される。
   - ラベルや説明文（`Password`、`Network`、`QR`、`Scan with your camera to connect` 等）は現行の i18n 仕組み（`assets/i18n.js` と `data-i18n`）をそのまま使用。
4. 非対象の情報は復旧しない方針を厳守（鍵・キーボックス等のアクセスコードは掲載なし）。

確認結果
1. パスワード値は履歴と完全一致（`hello.okubo`）。UI 上でもプレーンテキストで表示・コピー可。QR コードもこの値で生成。
2. 6言語化の仕組みは維持:
   - すべてのページに `<div data-i18n-switcher>` が存在（grep で10件確認）。
   - `assets/i18n.js` により言語切替・localStorage 永続化・`window.I18N_STRINGS` の適用・`i18n:change` ディスパッチを確認（コードレベル）。
3. URL 構造は変更なし（href の追加・変更なし、トップおよび各サブページのパスは据え置き）。
4. Wi‑Fi 以外の文言・データに変更なし。

変更ファイル
- `index.html` のみ（Wi‑Fi 表示・動作の復旧）。

備考
- パスワードの文言キー（`passInfo` 等）は未使用になったが、他影響はなし。将来の掃除の候補として残置。
