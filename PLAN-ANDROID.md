# TradePilot → Android App Plan

**Decision:** Capacitor wrap of the existing React app (no rewrite, one codebase for web + Android).
**Local machine status:** Node 24 ✅ · Java ❌ · Android SDK ❌ → APK builds via GitHub Actions (Path A) or local Android Studio (Path B).

## Phase 1 — Mobile UX pass (web, benefits all platforms) ✅ DONE
- [x] Bottom tab bar navigation (thumb reach) replacing top nav on small screens
- [x] Larger touch targets (min 44px), safe-area insets (`viewport-fit=cover`)
- [x] Watchlist table → card layout on mobile (condensed 3-column view)
- [x] Charts: touch-friendly crosshair, sticky headers
- [x] `theme-color` + dark status bar styling

## Phase 2 — Capacitor wrap (no Java required) ✅ DONE
- [x] `npm install @capacitor/core @capacitor/cli @capacitor/android`
- [x] `npx cap init "TradePilot" com.tradepilot.app --web-dir=dist`
- [x] `npx cap add android`
- [x] App icon + splash screen (dark terminal theme, 100 assets generated)
- [x] `@capacitor/camera` → Chart Analyzer: photograph a chart directly
- [x] `@capacitor/local-notifications` → daily lesson reminder (8:12 AM)
- [x] `@capacitor/haptics` → quiz feedback
- [x] Verify `npm run build && npx cap sync` round-trip (5 plugins synced)

## Phase 3 — Build the APK
**Path A (recommended): GitHub Actions**
- [ ] Create/push GitHub repo
- [ ] `.github/workflows/android.yml`: checkout → npm ci → build → cap sync → gradle assembleDebug → upload APK artifact
- [ ] Download APK from Actions run, transfer to phone, enable "install unknown apps", install

**Path B: local**
- [ ] Install JDK 17 + Android Studio (~4 GB)
- [ ] `npx cap open android` → build APK / run emulator

## Phase 4 — Phone testing & later
- [ ] Daily flow test: regime read → lesson → journal entry
- [ ] Optional: signed release AAB + Google Play ($25 one-time dev account)
- [ ] Optional later: iOS (requires Xcode on this Mac)

## Notes
- Live quotes (CoinGecko/stooq) and snapshot fallback already work offline-tolerant; journal/lessons/quiz persist in localStorage (survives app restarts inside Capacitor WebView).
- Sideloaded debug APK is fine for personal use; release signing only needed for Play Store.
