export const DEFAULT_PRINT_CONFIG = {
  pageSize: "A5",
  pageOrientation: "portrait",
  printMargin: "8mm",
  pageBackground: "#f1f1f1",
  lineBorderColor: "#d6d6d6",
  lineBorderWidth: 1,
  screenMaxWidth: 1100,
  printPagePadding: "14px 10px",
  rowHeight: 35,
  rowGap: 4,
  barWidth: 5,
  minBarWidth: 1,
  maxBarWidth: 5,
  barTopOffset: 3,
  scaleFontSize: 10,
  altAColor: "#51b7de",
  altBColor: "#0e5ea6",
  defaultLineColor: "#9f9f9f",
  correctAnswerColor: "#d8d8d8",
  lineColors: [
    "#df7590",
    "#df7590",
    "#df7590",
    "#cfd471",
    "#cfd471",
    "#cfd471",
    "#9fc36f",
    "#9fc36f",
    "#9fc36f",
    "#6fa86d",
    "#6fa86d",
    "#6fa86d",
    "#dd676c",
  ],
  colorPalette: {
    orange: {
      hex: "#e64632",
      rgb: "RGB 230/70/50",
      cmyk: "CMYK 1/84/82/0",
      name: "ORANGE",
    },
    pink: {
      hex: "#ff7daf",
      rgb: "RGB 255/125/175",
      cmyk: "CMYK 0/65/2/0",
      name: "PINK",
    },
    grau: {
      hex: "#d8d8d8",
      rgb: "RGB 216/216/216",
      cmyk: "CMYK 18/13/14/0",
      name: "GRAU (Neutral)",
    },
    gelb: {
      hex: "#d7dc5a",
      rgb: "RGB 215/220/90",
      cmyk: "CMYK 22/1/76/0",
      name: "GELB",
    },
    gruen: {
      hex: "#238373",
      rgb: "RGB 35/145/115",
      cmyk: "CMYK 80/19/64/4",
      name: "GRÜN",
    },
  },
};

export async function loadJsonData(url) {
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Unable to load ${url} (${response.status})`);
  }

  return response.json();
}

function clampPoint(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(values) {
  return values[randomInt(0, values.length - 1)];
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 128, g: 128, b: 128 };
}

function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

function interpolateColor(color1, color2, ratio) {
  ratio = Math.max(0, Math.min(1, ratio));
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * ratio);
  const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * ratio);
  const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * ratio);
  return rgbToHex(r, g, b);
}

function buildRandomLine(seed, intensity = 1) {
  const points = [];
  const clusterCount = randomInt(2, 4 + intensity);
  const centers = [];
  const maxClusters = Math.min(6, clusterCount);

  while (centers.length < maxClusters) {
    const center = randomInt(4, 96);
    if (centers.every((existing) => Math.abs(existing - center) > 8)) {
      centers.push(center);
    }
  }

  centers
    .sort((a, b) => a - b)
    .forEach((center, clusterIndex) => {
      const clusterSize = randomInt(
        Math.max(2, 2 + intensity - 1),
        Math.min(10, 4 + intensity * 2)
      );
      const spread = randomChoice([0.7, 0.9, 1, 1.2, 1.4, 1.6]);

      for (let i = 0; i < clusterSize; i++) {
        const offset = i - (clusterSize - 1) / 2;
        const wobble = randomInt(-2, 2) + ((seed + clusterIndex + i) % 3) - 1;
        points.push(clampPoint(center + offset * spread + wobble));
      }

      if (intensity > 1 && Math.random() > 0.4) {
        points.push(clampPoint(center + randomInt(-4, 4)));
      }
    });

  const scatterCount = randomInt(1, 3 + intensity * 2);
  for (let i = 0; i < scatterCount; i++) {
    points.push(clampPoint(randomInt(0, 100)));
  }

  return [...new Set(points)].sort((a, b) => a - b);
}

export function generateRandomData(options = {}) {
  const intensity = Math.max(
    1,
    Math.min(4, Number(options.intensity) || randomInt(1, 4))
  );

  return {
    lines: Array.from({ length: 13 }, (_, index) => ({
      line: index + 1,
      correctAnswer: randomInt(20, 80),
      points: buildRandomLine(index + randomInt(1, 999), intensity),
    })),
  };
}

export function createPrintDataSection({
  inputEl,
  printRootEl,
  printStyleEl,
  config = {},
  onError = (message) => alert(message),
}) {
  let currentConfig = {
    ...DEFAULT_PRINT_CONFIG,
    ...config,
    lineColors: Array.isArray(config.lineColors)
      ? config.lineColors
      : DEFAULT_PRINT_CONFIG.lineColors,
  };

  function applyConfig() {
    const root = document.documentElement;
    root.style.setProperty("--page-bg", currentConfig.pageBackground);
    root.style.setProperty("--line-border", currentConfig.lineBorderColor);
    root.style.setProperty(
      "--line-border-width",
      `${currentConfig.lineBorderWidth}px`
    );
    root.style.setProperty(
      "--screen-max-width",
      `${currentConfig.screenMaxWidth}px`
    );
    root.style.setProperty(
      "--print-page-padding",
      currentConfig.printPagePadding
    );
    root.style.setProperty("--row-height", `${currentConfig.rowHeight}px`);
    root.style.setProperty("--row-gap", `${currentConfig.rowGap}px`);
    root.style.setProperty("--bar-width", `${currentConfig.barWidth}px`);
    root.style.setProperty(
      "--bar-top-offset",
      `${currentConfig.barTopOffset}px`
    );
    root.style.setProperty(
      "--scale-font-size",
      `${currentConfig.scaleFontSize}px`
    );
    root.style.setProperty("--alt-a-color", currentConfig.altAColor);
    root.style.setProperty("--alt-b-color", currentConfig.altBColor);
    root.style.setProperty(
      "--default-line-color",
      currentConfig.defaultLineColor
    );

    if (printStyleEl) {
      printStyleEl.textContent = `
                @media print {
                    @page {
                        size: ${currentConfig.pageSize} ${currentConfig.pageOrientation};
                        margin: ${currentConfig.printMargin};
                    }
                }
            `;
    }
  }

  function normalizeData(data) {
    if (!data || !Array.isArray(data.lines)) {
      throw new Error('JSON must include "lines" array.');
    }

    const lines = data.lines.slice(0, 13).map((line, index) => {
      const points = Array.isArray(line.points) ? line.points : [];
      const validPoints = points
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value))
        .map((value) => Math.max(0, Math.min(100, value)));
      const correctAnswer = Number(line.correctAnswer) || 50;
      const validAnswer = Math.max(0, Math.min(100, correctAnswer));
      return {
        line: index + 1,
        correctAnswer: validAnswer,
        points: validPoints,
      };
    });

    while (lines.length < 13) {
      lines.push({ line: lines.length + 1, correctAnswer: 50, points: [] });
    }

    return { lines };
  }

  function barClass(lineIndex, pointIndex) {
    if ((lineIndex + pointIndex) % 17 === 0) return "alt-b";
    if ((lineIndex + pointIndex) % 9 === 0) return "alt-a";
    return "";
  }

  function getAdaptiveBarWidth(pointCount) {
    const minWidth = Math.max(1, Number(currentConfig.minBarWidth) || 1);
    const maxWidth = Math.max(
      minWidth,
      Number(currentConfig.maxBarWidth) || currentConfig.barWidth || 5
    );
    const density = Math.max(0, Math.min(1, (pointCount - 10) / 50));
    return Math.max(
      minWidth,
      Math.min(maxWidth, maxWidth - density * (maxWidth - minWidth))
    );
  }

  function getBarColorForPoint(point, correctAnswer, lineIndex) {
    const palette = currentConfig.colorPalette;
    const stops = [
      palette.orange?.hex || palette.orange,
      palette.pink?.hex || palette.pink,
      palette.grau?.hex || palette.grau,
      palette.gelb?.hex || palette.gelb,
      palette.gruen?.hex || palette.gruen,
    ];

    const correctColor =
      (typeof currentConfig.correctAnswerColor === "object"
        ? currentConfig.correctAnswerColor.hex
        : currentConfig.correctAnswerColor) || "#d8d8d8";

    const diff = point - correctAnswer;
    if (Math.abs(diff) < 1) return correctColor;

    const maxDiff = 35;
    const ratio = Math.max(-1, Math.min(1, diff / maxDiff));

    // Map ratio (-1..1) to position (0..1) across full multi-stop gradient
    const position = (ratio + 1) / 2;
    const segments = stops.length - 1;
    const scaled = position * segments;
    const idx = Math.min(segments - 1, Math.max(0, Math.floor(scaled)));
    const t = scaled - idx;
    const left = stops[idx];
    const right = stops[idx + 1];
    return interpolateColor(left, right, t);
  }

  function render(data) {
    if (!printRootEl) {
      return;
    }

    printRootEl.innerHTML = "";

    data.lines.forEach((lineData, lineIndex) => {
      const row = document.createElement("section");
      row.className = "line-row";
      row.style.setProperty(
        "--line-color",
        currentConfig.lineColors[lineIndex] || currentConfig.defaultLineColor
      );

      const layer = document.createElement("div");
      layer.className = "bars-layer";

      const effectiveBarWidth = getAdaptiveBarWidth(lineData.points.length);
      const halfBarWidth = effectiveBarWidth / 2;

      lineData.points.forEach((point, pointIndex) => {
        const bar = document.createElement("div");
        const barClass_ = barClass(lineIndex, pointIndex);
        bar.className = `point-bar ${barClass_}`.trim();
        bar.style.width = `${effectiveBarWidth}px`;
        bar.style.left = `calc(${point}% - ${halfBarWidth}px)`;

        if (!barClass_) {
          const barColor = getBarColorForPoint(
            point,
            lineData.correctAnswer,
            lineIndex
          );
          bar.style.backgroundColor = barColor;
        }

        layer.appendChild(bar);
      });

      const correctAnswerLabel = document.createElement("div");
      correctAnswerLabel.className = "correct-answer-label";
      correctAnswerLabel.textContent = lineData.correctAnswer;
      correctAnswerLabel.style.left = `calc(${lineData.correctAnswer}% - 12px)`;
      layer.appendChild(correctAnswerLabel);

      row.appendChild(layer);
      printRootEl.appendChild(row);
    });
  }

  function renderFromJsonText(jsonText) {
    try {
      const parsed = JSON.parse(jsonText);
      const normalized = normalizeData(parsed);
      render(normalized);
      return true;
    } catch (error) {
      onError(`Invalid JSON: ${error.message}`);
      return false;
    }
  }

  function renderFromInput() {
    return renderFromJsonText(inputEl.value);
  }

  function setInputData(data) {
    inputEl.value = JSON.stringify(data, null, 2);
  }

  function loadData(data) {
    setInputData(data);
    render(normalizeData(data));
  }

  function loadFromUrl(url) {
    return loadJsonData(url).then((data) => {
      loadData(data);
      return data;
    });
  }

  function loadRandomData(options = {}) {
    const data = generateRandomData(options);
    loadData(data);
    return data;
  }

  function print() {
    const ok = renderFromInput();
    if (ok) {
      window.print();
    }
    return ok;
  }

  function updateConfig(partialConfig) {
    currentConfig = {
      ...currentConfig,
      ...partialConfig,
      lineColors: Array.isArray(partialConfig?.lineColors)
        ? partialConfig.lineColors
        : currentConfig.lineColors,
    };
    applyConfig();
    renderFromInput();
  }

  function getConfig() {
    return { ...currentConfig, lineColors: [...currentConfig.lineColors] };
  }

  applyConfig();

  return {
    renderFromInput,
    renderFromJsonText,
    setInputData,
    loadData,
    loadFromUrl,
    loadRandomData,
    print,
    updateConfig,
    getConfig,
  };
}
