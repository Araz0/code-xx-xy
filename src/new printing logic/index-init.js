import { createPrintDataSection, loadJsonData } from "./print-data-section.js";

const DATA_URL = "fake-user-data.json";

const jsonInput = document.getElementById("jsonInput");
const printBtn = document.getElementById("printBtn");
const loadFakeBtn = document.getElementById("loadFakeBtn");
const randomizeBtn = document.getElementById("randomizeBtn");
const printPage = document.getElementById("printPage");
const dynamicPrintStyle = document.getElementById("dynamicPrintStyle");

const printController = createPrintDataSection({
  inputEl: jsonInput,
  printRootEl: printPage,
  printStyleEl: dynamicPrintStyle,
  config: {
    pageSize: "A5",
  },
});

async function loadAndRenderData() {
  try {
    const data = await loadJsonData(DATA_URL);
    printController.loadData(data);
  } catch (error) {
    alert(`Unable to load JSON data: ${error.message}`);
  }
}

loadAndRenderData();

loadFakeBtn.addEventListener("click", () => loadAndRenderData());
randomizeBtn.addEventListener("click", () => {
  printController.loadRandomData();
});
printBtn.addEventListener("click", () => {
  printController.print();
});

window.addEventListener("beforeprint", () => {
  printController.renderFromInput();
});

function initializeColorPalette() {
  const colorLegend = document.getElementById("colorLegend");
  const config = printController.getConfig();
  const palette = config.colorPalette;

  const colorSwatches = [
    palette.orange,
    palette.pink,
    palette.grau,
    palette.gelb,
    palette.gruen,
  ];

  const gradientSwatches = [
    {
      name: "ORANGE → GELB (Unified Gradient)",
      left: palette.orange.hex,
      right: palette.gelb.hex,
    },
  ];

  colorLegend.innerHTML = "";

  colorSwatches.forEach((colorData) => {
    const swatchEl = document.createElement("div");
    swatchEl.className = "color-swatch";
    swatchEl.innerHTML = `
      <div class="color-bar">
        <div class="color-bar-section" style="background: ${colorData.hex}; width: 100%;"></div>
      </div>
      <div class="color-info">
        <div class="color-name">${colorData.name}</div>
        <div class="color-values">${colorData.rgb}<br>${colorData.cmyk}</div>
      </div>
    `;
    colorLegend.appendChild(swatchEl);
  });

  gradientSwatches.forEach((gradient) => {
    const swatchEl = document.createElement("div");
    swatchEl.className = "color-swatch";
    const stops = [
      palette.orange.hex,
      palette.pink.hex,
      palette.grau.hex,
      palette.gelb.hex,
      palette.gruen.hex,
    ];
    const gradientCss = `linear-gradient(to right, ${stops.join(", ")})`;
    swatchEl.innerHTML = `
      <div class="color-bar">
        <div class="color-bar-section" style="background: ${gradientCss}; width: 100%;"></div>
      </div>
      <div class="color-info">
        <div class="color-name">${gradient.name}</div>
        <div class="color-values">with neutral center</div>
      </div>
    `;
    colorLegend.appendChild(swatchEl);
  });
}

initializeColorPalette();

window.PrintPageController = printController;
