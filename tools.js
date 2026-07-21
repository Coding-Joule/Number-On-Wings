// ===== CALCULATOR TOOL: Square and Cube Numbers =====
/**
 * Toggle visibility of the calculator interface
 */
function toggleCalculator() {
    document.getElementById('calculator-engine').classList.toggle('hidden');
}

// Listen for calculator button clicks and compute results
document.getElementById('calc-btn').addEventListener('click', function() {
    let num = parseFloat(document.getElementById('math-input').value);
    let resultDiv = document.querySelector('#calculator-engine .result');
    if (isNaN(num)) return;
    resultDiv.innerHTML = `Squared: ${num*num}<br>Cubed: ${num*num*num}`;
});

// ===== PRIME FACTORISER TOOL =====
/**
 * Toggle visibility of the prime factoriser interface
 */
function toggleFactoriser() {
    document.getElementById('factoriser-engine').classList.toggle('hidden');
}

/**
 * Find prime factors of a number and display them
 */
document.getElementById('factor-btn').addEventListener('click', function() {
    let n = parseInt(document.getElementById('factor-input').value);
    let res = [], d = 2;
    let temp = n;
    
    // Divide by each divisor starting from 2
    while (temp > 1) {
        while (temp % d === 0) { 
            res.push(d); 
            temp /= d; 
        }
        d++;
    }
    
    document.getElementById('factor-result').innerText = n + " = " + res.join(" × ");
});

// ===== FRACTAL DESIGNER TOOL =====
/**
 * Toggle visibility of the fractal designer interface
 */
function toggleFractal() {
    document.getElementById('fractal-engine').classList.toggle('hidden');
}

/**
 * Initialize fractal tree animator with wind effects
 * Tree branches recursively and wind animation simulates blowing
 */
window.addEventListener('DOMContentLoaded', () => {
    let fracCanvas = document.getElementById('fractal-canvas');
    
    if (fracCanvas) {
        let fCtx = fracCanvas.getContext('2d');
        let angleSlider = document.getElementById('frac-angle');
        let scaleSlider = document.getElementById('frac-scale');
        let windSlider = document.getElementById('frac-wind'); 
        
        let time = 0; // Animation time variable

        // Array of wind line objects that move across the canvas
        let windLines = [
            { x: -50,  y: 50,  speed: 1.5, length: 40 },
            { x: -150, y: 120, speed: 2,   length: 60 },
            { x: -80,  y: 200, speed: 1.2, length: 30 }
        ];

        /**
         * Draw animated wind effect on canvas
         * @param {number} windPower - Intensity of wind effect from slider
         */
        function drawWindEffect(windPower) {
            if (windPower === 0) return; // Don't draw wind if slider is at 0

            fCtx.save();
            fCtx.strokeStyle = "rgba(173, 216, 230, 0.4)"; // Light blue semi-transparent
            fCtx.lineWidth = Math.max(1, windPower * 0.5); // Thicker lines = more wind

            windLines.forEach(line => {
                fCtx.beginPath();
                fCtx.moveTo(line.x, line.y);
                
                // Wind line length scales with wind power
                let currentLength = line.length * (1 + windPower * 0.15);
                fCtx.lineTo(line.x + currentLength, line.y);
                fCtx.stroke();

                // Move wind lines across screen
                line.x += line.speed * (1 + windPower * 0.5);

                // Wrap wind lines back to left when they exit right edge
                if (line.x > fracCanvas.width) {
                    line.x = -currentLength - Math.random() * 100;
                    line.y = Math.random() * (fracCanvas.height - 100) + 30;
                }
            });

            fCtx.restore();
        }

        /**
         * Recursively draw a fractal tree branch
         * Uses rotation and scaling to create natural-looking branches
         * @param {number} x - X position
         * @param {number} y - Y position
         * @param {number} len - Current branch length
         * @param {number} angle - Current rotation angle in degrees
         * @param {number} branchWidth - Current line width (gets thinner for sub-branches)
         */
        function drawFractal(x, y, len, angle, branchWidth) {
            fCtx.beginPath();
            fCtx.save();
            fCtx.strokeStyle = "#8B4513"; // Brown color for branches
            fCtx.lineWidth = branchWidth;
            fCtx.translate(x, y);
            fCtx.rotate(angle * Math.PI / 180);
            fCtx.moveTo(0, 0);
            fCtx.lineTo(0, -len);
            fCtx.stroke();

            // Base case: draw pink flower when branch is short enough
            if (len < 10) {
                fCtx.beginPath();
                fCtx.arc(0, -len, 4, 0, Math.PI * 2); 
                fCtx.fillStyle = "#ff69b4"; // Hot pink
                fCtx.fill();
                
                fCtx.restore();
                return;
            }

            // Get slider values (with safe defaults)
            let angleOffset = angleSlider ? parseInt(angleSlider.value) || 15 : 15;
            let rawScale = scaleSlider ? parseInt(scaleSlider.value) || 75 : 75;
            let safeScale = Math.min(rawScale, 82); // Cap at 82% to prevent infinite recursion
            let scaleOffset = safeScale / 100;

            // Calculate wind sway effect using sine wave
            let windPower = windSlider ? parseInt(windSlider.value) : 3;
            let wind = Math.sin(time) * windPower; 

            // Recursively draw left and right sub-branches
            drawFractal(0, -len, len * scaleOffset, angleOffset + wind, branchWidth * 0.7);
            drawFractal(0, -len, len * scaleOffset, -angleOffset + wind, branchWidth * 0.7);
            fCtx.restore();
        }

        /**
         * Main animation loop - renders tree and wind each frame
         */
        function renderFractal() {
            fCtx.clearRect(0, 0, fracCanvas.width, fracCanvas.height);
            
            let windPower = windSlider ? parseInt(windSlider.value) : 3;

            // Draw wind effects first (background layer)
            drawWindEffect(windPower);

            // Draw tree on top of wind
            drawFractal(200, 300, 80, 0, 10);
            
            // Increment animation time based on wind strength
            let windSpeed = windSlider ? parseInt(windSlider.value) : 3;
            time += 0.01 * windSpeed; 
            
            requestAnimationFrame(renderFractal);
        }
        
        renderFractal();
    }
});

// ===== EQUATION GRAPHER TOOL =====
/**
 * Toggle visibility of the equation grapher interface
 */
function toggleGrapher() {
    document.getElementById('grapher-engine').classList.toggle('hidden');
}

/**
 * Graph a user-entered equation and optionally mark x-intercepts (roots)
 * Supports basic math functions and multiple mathematical operators
 */
document.getElementById('graph-btn').addEventListener('click', function() {
    let canvas = document.getElementById('graph-canvas');
    let ctx = canvas.getContext('2d');
    let expr = document.getElementById('eq-input').value;
    let explanationPara = document.getElementById('root-explanation');
    
    // Display educational tip about roots
    if (explanationPara) {
        explanationPara.innerHTML = `Did you know that the x-intercepts are the roots of the equation <b>${expr} = 0</b>?`;
    }
    
    let labelRootsCheckbox = document.getElementById('label-roots');
    let shouldLabelRoots = labelRootsCheckbox ? labelRootsCheckbox.checked : false;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw coordinate axes
    ctx.strokeStyle = "#30363d";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(200, 0); ctx.lineTo(200, 400); // Y-axis
    ctx.moveTo(0, 200); ctx.lineTo(400, 200); // X-axis
    ctx.stroke();

    // First pass: plot the function line
    ctx.strokeStyle = "#58a6ff"; // Light blue
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    let first = true;
    for (let x = -200; x <= 200; x++) {
        let valX = x / 20; 
        try {
            // Sanitize user input: convert to valid JavaScript math expression
            let sanitizedExpr = expr
              .replace(/\^/g, '**')              // ^ to ** for exponents
              .replace(/(\d)(x)/g, '$1*$2')      // 2x -> 2*x
              .replace(/(x)(\d)/g, '$1**$2')     // x2 -> x**2
              .replace(/\)(x)/g, ')*$1')         // )( -> )*(  
              .replace(/(x)\(/g, '$1*(')         // x( -> x*(
              .replace(/pi/gi, 'Math.PI')
              .replace(/cos/gi, 'Math.cos')
              .replace(/sin/gi, 'Math.sin')
              .replace(/tan/gi, 'Math.tan')
              .replace(/log/gi, 'Math.log');
            
            let y = new Function('x', 'return ' + sanitizedExpr)(valX);
            
            let canvasX = x + 200;
            let canvasY = 200 - (y * 20); 
            
            if (first) {
                ctx.moveTo(canvasX, canvasY);
                first = false;
            } else {
                ctx.lineTo(canvasX, canvasY);
            }
        } catch(e) { continue; }
    }
    ctx.stroke();

    // Second pass: find and label roots (x-intercepts) if enabled
    if (shouldLabelRoots) {
        let prevValX = null;
        let prevY = null;

        for (let x = -200; x <= 200; x++) {
            let valX = x / 20; 
            try {
                let sanitizedExpr = expr.replace(/\^/g, '**');
                let y = new Function('x', 'return ' + sanitizedExpr)(valX);
                let canvasX = x + 200;
                
                // Check for exact y=0 or sign change (root crossing)
                if (y === 0) {
                    drawRootLabel(ctx, canvasX, 200, valX);
                } 
                else if (prevY !== null && ((prevY > 0 && y < 0) || (prevY < 0 && y > 0))) {
                    // Approximate root location between two points
                    let approximateRootX = (prevValX + valX) / 2;
                    let approximateCanvasX = canvasX - 0.5;
                    drawRootLabel(ctx, approximateCanvasX, 200, approximateRootX);
                }

                prevValX = valX;
                prevY = y;
            } catch(e) { continue; }
        }
    }
});

/**
 * Draw a red circle and label at a root location
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} canvasX - X pixel position on canvas
 * @param {number} canvasY - Y pixel position on canvas  
 * @param {number} mathX - Mathematical x-value to display
 */
function drawRootLabel(ctx, canvasX, canvasY, mathX) {
    ctx.save();
    ctx.fillStyle = "#ff6b6b"; // Red
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff"; // White text
    ctx.font = "10px sans-serif";
    ctx.fillText(mathX.toFixed(2), canvasX + 5, canvasY - 5);
    ctx.restore();
}
