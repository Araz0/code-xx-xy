# Quiz Print/Results — Calculation Overview

This README documents how the print/visualization logic works, where to find the calculations in the codebase, and the formulas used to compute bias summaries and marker positions.

Short map of important implementation files

- Print data normalization and bias helpers: [src/pages/printing/printDataUtils.ts](src/pages/printing/printDataUtils.ts)
- Building final print payload from quiz data: [src/pages/printing/printResultsUtils.ts](src/pages/printing/printResultsUtils.ts)
- Rendering the printable chart and bias markers: [src/components/PrintChart.tsx](src/components/PrintChart.tsx)
- Configurable sizes/colors used in previews/print: [src/pages/printing/config.ts](src/pages/printing/config.ts)
- CSS for print preview and marker styling: [src/pages/printing/printResults.css](src/pages/printing/printResults.css)

Key concepts and formulas

- `clampPoint(value)`
  - Purpose: clamp and round numeric percentage values into the 0–100 integer range.
  - Location: [src/pages/printing/printDataUtils.ts](src/pages/printing/printDataUtils.ts)

- Normalization: `normalizePrintData`
  - Purpose: sanitize incoming JSON so each line contains: `line`, `correctAnswer`, `historicalPoints[]`, `userPoint`, `targetGender`.
  - Location: [src/pages/printing/printDataUtils.ts](src/pages/printing/printDataUtils.ts)

- Per-question bias calculation (abstracted): `calculateBiasSummary`
  - Purpose: aggregate a sequence of points (user answer or one historical set) across all lines to compute a signed bias score that reflects whether estimates systematically over/under-estimate values for `men` vs `women`.
  - Algorithm (high level):
    1. For each line with a declared `targetGender` ('men' or 'women'), take the relevant point(s).
    2. For each point compute `diff = point - correctAnswer`.
    3. Convert to a signed-men-diff: if `targetGender === 'men'` then `menSigned = diff`, else `menSigned = -diff`.
       - Positive -> bias toward men; negative -> bias toward women.
    4. Sum `menSigned` over points and compute `score = menBiasSum / count`.
    5. Direction: `score > 0 ? 'men' : score < 0 ? 'women' : null`.
    6. Percent: `round(min(100, abs(score)))`.
  - Location: [src/pages/printing/printDataUtils.ts](src/pages/printing/printDataUtils.ts) — `calculateBiasSummary`.

- Applying bias info to PrintData: `applyBiasToPrintData`
  - Purpose: populate per-line `biasDiff` / `biasDirection` (from the user answer) and attach top-level summaries:
    - `biasSummary` — summary across user points
    - `historicalBiasSummary` — summary across all historical points
    - `historicalBiasBySet` — array of summaries, one per historical-answer set (used to place one marker per historical set)
  - Location: [src/pages/printing/printDataUtils.ts](src/pages/printing/printDataUtils.ts)

- Building print payload from quiz results: `buildPrintDataFromResults`
  - Purpose: transform `questions` + `results` (arrays from the quiz UI) into a `PrintData` payload that includes user/historical points, target genders, and bias summaries.
  - Location: [src/pages/printing/printResultsUtils.ts](src/pages/printing/printResultsUtils.ts)

- Bias marker horizontal position (visual mapping)
  - Formula: `markerLeft = clamp(0, 100, 50 + score / 2)`
    - `score == 0` -> `50%` (center). Positive scores shift right, negative left. The `/ 2` compresses the score range for the visual scale.
  - Location: [src/components/PrintChart.tsx](src/components/PrintChart.tsx) — function `getBiasMarkerLeft`.

Rendering behavior

- Points are drawn as black circles. Sizes come from `src/pages/printing/config.ts` (`historicalPointSize`, `correctPointSize`, `userPointSize`).
- The bias area renders:
  - a center (neutral) dot using `correctPointSize`;
  - the user bias dot using `userPointSize` (placed from `biasSummary`);
  - one historical-bias dot per historical-answer set using `historicalPointSize` (from `historicalBiasBySet`).
  - Implementation: [src/components/PrintChart.tsx](src/components/PrintChart.tsx) and styling in [src/pages/printing/printResults.css](src/pages/printing/printResults.css).

Where to change behavior

- Change clamping/rounding rules: `normalizePrintData` in [src/pages/printing/printDataUtils.ts](src/pages/printing/printDataUtils.ts).
- Change bias aggregation rules (weighting, ignoring zeros, dividing): `calculateBiasSummary` in [src/pages/printing/printDataUtils.ts](src/pages/printing/printDataUtils.ts).
- Change how quiz results are mapped to lines: `buildPrintDataFromResults` in [src/pages/printing/printResultsUtils.ts](src/pages/printing/printResultsUtils.ts).
- Change visual sensitivity (how quickly scores map to left/right): modify `getBiasMarkerLeft` in [src/components/PrintChart.tsx](src/components/PrintChart.tsx).
- Change sizes / color: [src/pages/printing/config.ts](src/pages/printing/config.ts) and [src/pages/printing/printResults.css](src/pages/printing/printResults.css).

Suggestions I can add next

- Unit tests for `calculateBiasSummary` and `applyBiasToPrintData` with controlled fixtures.
- A small sample JSON fixture that contains multiple historical answer sets so you can visually verify historical bias dots.

If you'd like, I can now add unit tests and a demo JSON fixture. Which would you prefer first?
