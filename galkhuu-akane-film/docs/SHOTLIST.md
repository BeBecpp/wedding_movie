# Shot list

Timecodes are composition time (visual cut points). Transitions are centred on each cut.
Slots refer to `assets/photo-manifest.json`. Source of truth: `src/config/openingStoryboard.ts` and
`src/config/loopStoryboard.ts`. Run `npm run check:photos -- --full` to see which actual photo fills each slot.

## WeddingOpeningFilm — 1:20 (2400 f)

| # | Time | Dur | Layout | Slot(s) | Text | Camera | In |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 00:00.0 | 7.0 s | Ivory atmosphere, blossom branches draw on, daylight settles | — | *A beautiful day begins.* | — | start (not black) |
| 2 | 00:07.0 | 4.5 s | Portrait editorial, photo right | GALKHUU_PORTRAIT_01 | Meet / **Galkhuu.** | push-in | veil rise 1.0 s |
| 3 | 00:11.5 | 3.5 s | Portrait editorial, mirrored (photo left), vertical reveal | AKANE_PORTRAIT_01 | Meet / **Akane.** | push-in | **clean cut** |
| 4 | 00:15.0 | 3.0 s | Split frame, panels converge, gold divider + blossom | GALKHUU_PORTRAIT_01 · AKANE_PORTRAIT_01 | — | converge | dissolve 0.67 s |
| 5 | 00:18.0 | 8.0 s | Whole portrait on blurred copy, ivory text side (hold) | COUPLE_HERO_02 | Two people. / *One beautiful beginning.* | slow push | bloom 1.0 s |
| 6 | 00:26.0 | 5.0 s | Full bleed, close smiles | COUPLE_CANDID_01 | — | drift left | dissolve 0.8 s |
| 7 | 00:31.0 | 4.5 s | Full bleed, laughter | COUPLE_CANDID_02 | *A little laughter.* | push-in | feathered wipe → |
| 8 | 00:35.5 | 5.5 s | **Reaction edit**: he looks → (00:36.8) she laughs → (00:39.0) he laughs | GALKHUU_PORTRAIT_02 · AKANE_PORTRAIT_02 · GALKHUU_CANDID_01 | — | per panel | **clean cut** |
| 9 | 00:41.0 | 3.0 s | Full bleed, caption at top | COUPLE_CANDID_03 | *A lot of love.* | slow push | dissolve 0.67 s |
| 10 | 00:44.0 | 3.5 s | Inset print (detail) | COUPLE_HANDS_01 | — | rise | parallax drift |
| 11 | 00:47.5 | 3.5 s | Editorial collage (re-flows; rings disabled) | DETAIL_BOUQUET_01 · DETAIL_DECOR_01 · (DETAIL_RINGS_01) | — | per print | feathered wipe ↑ |
| 12 | 00:51.0 | 4.0 s | Full bleed, wide walk | COUPLE_WALKING_01 | — | pan left | dissolve 1.0 s |
| 13 | 00:55.0 | 4.0 s | Full bleed, warm monochrome → natural colour bloom | COUPLE_LOOK_01 | — | push-in | bloom 0.93 s |
| 14 | 00:59.0 | 12.0 s | **Hero**, reduced decoration, emotional lift | COUPLE_HERO_01 | *The best moments are the real ones.* (01:04–01:10) | deep push 1.00→1.07 | dissolve 1.2 s |
| 15 | 01:11.0 | 9.0 s | **End card**: names, rule + blossom, event, date; hero softly visible right | COUPLE_HERO_01 (intentional return) | Galkhuu & Akane / WEDDING CELEBRATION / *07 November 2026* | very slow | dissolve 1.2 s |

The end card text is fully settled by **01:13.5** and held completely still to **01:20.0** (6.5 s). The last frame is a clean, steady card for the operator.

## WeddingGuestLoop — 4:00 (7200 f)

| # | Time | Dur | Section | Layout | Slot(s) | Text |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 00:00 | 24 s | Welcome | Arched-window portrait + title block (already settled at frame 0) | COUPLE_HERO_02 | Welcome. We're happy you're here. / Galkhuu & Akane / Wedding Celebration · 07 November 2026 |
| 2 | 00:24 | 8 s | Portraits | Whole portrait on blurred copy | GALKHUU_PORTRAIT_01 | — |
| 3 | 00:32 | 8 s | | Whole portrait on blurred copy | AKANE_PORTRAIT_01 | — |
| 4 | 00:40 | 8 s | | Split pair, converging | GALKHUU_PORTRAIT_02 · AKANE_PORTRAIT_02 | — |
| 5 | 00:48 | 7 s | | Portrait editorial (left) + florals | GALKHUU_PORTRAIT_03 | — |
| 6 | 00:55 | 9 s | | Portrait editorial (right) + florals | AKANE_PORTRAIT_03 | — |
| 7 | 01:04 | 10 s | Together | Full bleed | COUPLE_LOOK_01 | Two people. / One beautiful beginning. |
| 8 | 01:14 | 7 s | | Full bleed, pan | COUPLE_WALKING_01 | — |
| 9 | 01:21 | 9 s | | Collage | COUPLE_CANDID_01 · COUPLE_WALKING_02 · COUPLE_LOOK_02 | — |
| 10 | 01:30 | 6 s | | Full bleed close | COUPLE_CANDID_04 | — |
| 11 | 01:36 | 6 s | | Inset print, duotone bloom | COUPLE_HANDS_01 | — |
| 12 | 01:42 | 7 s | Candid joy | Full bleed | COUPLE_CANDID_02 | The best moments are the real ones. |
| 13 | 01:49 | 8 s | | Reaction split (right lands on a beat) | GALKHUU_CANDID_01 · AKANE_CANDID_01 | — |
| 14 | 01:57 | 7 s | | Full bleed | FAMILY_OR_FRIENDS_01 | — |
| 15 | 02:04 | 8 s | | Collage | COUPLE_CANDID_03 · FAMILY_OR_FRIENDS_02 · COUPLE_CANDID_05 | — |
| 16 | 02:12 | 6 s | | Full bleed | COUPLE_CANDID_06 | — |
| 17 | 02:18 | 8 s | Details | Portrait editorial, rich florals | DETAIL_BOUQUET_01 | — |
| 18 | 02:26 | 7 s | | Inset print, slow sink | DETAIL_INVITATION_01 | — |
| 19 | 02:33 | 9 s | | Collage (rings disabled → re-flows) | DETAIL_DECOR_01 · (DETAIL_RINGS_01) · DETAIL_ATTIRE_01 | — |
| 20 | 02:42 | 7 s | | Full bleed | COUPLE_HANDS_02 | — |
| 21 | 02:49 | 6 s | | Full bleed, pan | DETAIL_DECOR_02 | — |
| 22 | 02:55 | 7 s | | Split | DETAIL_ATTIRE_02 · DETAIL_BOUQUET_02 | — |
| 23 | 03:02 | 14 s | Deep warm hero | Full bleed, deep push, warm lift | COUPLE_HERO_01 | A little laughter. / A lot of love. |
| 24 | 03:16 | 16 s | | Whole photo on blurred copy, long hold, lift | COUPLE_HERO_03 | — |
| 25 | 03:32 | 18 s | Reprise | Photo right, ivory text side | COUPLE_WALKING_02 | Thank you for being here. |
| 26 | 03:50 | 10 s | Seamless return | Welcome scene builds in (2.4 s bloom) and continues straight into 00:00 | COUPLE_HERO_02 (intentional) | (welcome block) |

There are 5 distinct text cards in the loop (the brief allows 4–6).
