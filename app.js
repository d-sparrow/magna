document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("estimationForm");
  const resultSection = document.getElementById("result");
  const materialSelect = document.getElementById("material");
  const edgeStyleSelect = document.getElementById("edgeStyle");
  const canvas = document.getElementById("dimensionCanvas");
  const clearCanvasBtn = document.getElementById("clearCanvas");
  const saveAsJsonBtn = document.getElementById("saveAsJson");
  const saveAsPdfBtn = document.getElementById("saveAsPdf");
  const ctx = canvas.getContext("2d");

  let shapes = []; // Array to store drawn shapes
  let isDrawing = false;
  let startX, startY;

  let estimationResult = {}; // Store result for saving or exporting

  // Fetch material options from JSON file
  fetch("../src/assets/materials.json")
    .then(response => response.json())
    .then(materials => {
      materials.forEach(material => {
        const option = document.createElement("option");
        option.value = material.name.toLowerCase();
        option.textContent = `${material.name} - $${material.pricePerSquareFoot}/sqft (${material.description})`;
        materialSelect.appendChild(option);
      });
    })
    .catch(err => console.error("Error loading materials:", err));

  // Canvas drawing logic
  canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    startX = e.offsetX;
    startY = e.offsetY;
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) return;
    const currentX = e.offsetX;
    const currentY = e.offsetY;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    redrawShapes();
    ctx.strokeStyle = "#007bff";
    ctx.strokeRect(startX, startY, currentX - startX, currentY - startY);
  });

  canvas.addEventListener("mouseup", (e) => {
    if (!isDrawing) return;
    isDrawing = false;
    const width = e.offsetX - startX;
    const height = e.offsetY - startY;
    shapes.push({ x: startX, y: startY, width, height });
    redrawShapes();
  });

  clearCanvasBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes = [];
  });

  function redrawShapes() {
    shapes.forEach(shape => {
      ctx.strokeStyle = "#007bff";
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Get user inputs
    const material = materialSelect.value;
    const edgeStyle = edgeStyleSelect.value;

    // Calculate total area from shapes
    const totalArea = shapes.reduce((sum, shape) => sum + Math.abs(shape.width * shape.height) / (12 * 12), 0);

    // Define material prices
    const materialPrices = {
      granite: 50,
      marble: 70,
      quartz: 90
    };

    // Define edge style price adjustments
    const edgeStylePrices = {
      square: 0,
      beveled: 5,
      rounded: 10
    };

    const pricePerSquareFoot = materialPrices[material];
    const edgePricePerSquareFoot = edgeStylePrices[edgeStyle];
    const materialCost = totalArea * pricePerSquareFoot;
    const edgeCost = totalArea * edgePricePerSquareFoot;
    const totalCost = materialCost + edgeCost;

    // Store the result for export
    estimationResult = {
      material: material.charAt(0).toUpperCase() + material.slice(1),
      edgeStyle: edgeStyle.charAt(0).toUpperCase() + edgeStyle.slice(1),
      totalArea: totalArea.toFixed(2),
      materialCost: materialCost.toFixed(2),
      edgeStyleCost: edgeCost.toFixed(2),
      totalCost: totalCost.toFixed(2)
    };

    // Display the result
    resultSection.innerHTML = `
      <h2>Estimation Result</h2>
      <p>Material: ${estimationResult.material}</p>
      <p>Edge Style: ${estimationResult.edgeStyle}</p>
      <p>Total Area: ${estimationResult.totalArea} square feet</p>
      <p>Material Cost: $${estimationResult.materialCost}</p>
      <p>Edge Style Cost: $${estimationResult.edgeStyleCost}</p>
      <h3>Total Cost: $${estimationResult.totalCost}</h3>
    `;
  });

  // Save as JSON
  saveAsJsonBtn.addEventListener("click", () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(estimationResult, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "estimate.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  });

  // Save as PDF
  saveAsPdfBtn.addEventListener("click", () => {
    const pdfContent = `
      Countertop Estimation Result
      ----------------------------
      Material: ${estimationResult.material}
      Edge Style: ${estimationResult.edgeStyle}
      Total Area: ${estimationResult.totalArea} square feet
      Material Cost: $${estimationResult.materialCost}
      Edge Style Cost: $${estimationResult.edgeStyleCost}
      Total Cost: $${estimationResult.totalCost}
    `;
    const blob = new Blob([pdfContent], { type: "application/pdf" });
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = window.URL.createObjectURL(blob);
    downloadAnchor.download = "estimate.pdf";
    downloadAnchor.click();
  });
});