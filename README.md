# Fix It First (PS 01)

Fix It First helps people choose whether to repair, reuse, repurpose, replace, or recycle a damaged item, then explains the ranking.

## Live demo and repo

Live demo: TODO — add deployed URL
Repository: [Sohamthakkar2007-CodeVariant](https://github.com/soham1251130190-pixel/Sohamthakkar2007-CodeVariant)

Try it in 30 seconds: drag **Charger or cable** from the Card tray to **1. Item**; drag **Physical** to **2. Problem**; drag **Moderate** to **3. Severity**; then drag **Your decision bundle** to **Score it**. The default Low budget priority produces the ranked charger result. For the safety case, choose **Smartphone**, add a problem and severity, then drag **Swollen or bulging battery** to **4. Safety** before scoring.

## How it works

Pipeline: input cards → item facts → safety and value gates → scores → ranking → explanations → next steps → history.

The plan panel provides a numbered checklist, estimated cost and time, a suggested place to go, and a fallback option. When a safety notice is active, its drop-off steps come first and DIY steps are omitted. The steps are generic checklists defined per option in `templates.js`.

## Surprise Challenge: Canvas Protocol

The scoring engine remains separate from the canvas interaction layer. Primary actions use card drops rather than buttons. The app maps each permitted card-and-zone combination to a reducer action through one `dropRules` table in `src/config/canvas.js`; adding or changing a rule does not require action logic in a component.

| Action Zone | What it does |
| --- | --- |
| Score it | Scores the current decision bundle. |
| Commit to plan | Sets the selected option as the plan and records committed history. |
| Save for later | Records saved history without changing the plan. |
| Rule out | Removes an option from the current ranking. |
| Reopen | Restores a history snapshot and re-scores it. |
| Delete | Removes a history entry and clears its linked committed plan. |

## Input and accessibility

- Mouse: drag a card after moving it 6 px.
- Touch: a card drag uses a 250 ms hold with an 8 px tolerance; page scrolling is blocked only while a drag is active.
- Keyboard: Tab to a draggable card, then use Space, arrow keys, and Space to drop it.

Compatible zones highlight during a drag; successful drops pulse and rejected drops shake. Cards and zones have visible focus styling.

## Challenges and fixes

| Problem | Cause | Fix |
| --- | --- | --- |
| The drag preview obscured the interface and distorted the source card. | The moving representation used the card geometry. | A compact square chip follows the pointer while the original card remains a dashed, reduced-opacity ghost. Pointer-first collision detection chooses the zone beneath the pointer. |
| Touch scrolling competed with card dragging. | Whole-card `touch-action: none` and overlapping pointer/touch sensing interfered with normal swipes. | Cards use `touch-action: manipulation`; `MouseSensor` and `TouchSensor` are separate; scrolling is prevented only during an active drag. |
| The Surprise Challenge removed buttons. | The original wizard was button-based. | The engine stayed separate from the UI while the primary workflow moved to cards, zones, and `dropRules`. |

## Run locally

Stack: React 19, Vite 8, Tailwind CSS 4, and `@dnd-kit/core`.

```bash
npm install
npm run dev
npm run build
npm run check:engine
npm run check:explain
```

## AI use and limitations

AI tools were used for planning and coding; the team can explain both the scoring engine and the `dropRules` table.

- Next steps are generic option-level checklists, not local service recommendations.
- The demo catalog is limited to the item categories in `src/data/items.json`.
