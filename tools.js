// === SQUARING / CUBING ===
function toggleCalculator() {
    document.getElementById('calculator-engine').classList.toggle('hidden');
}

document.getElementById('calc-btn').addEventListener('click', function() {
    let num = parseFloat(document.getElementById('math-input').value);
    let resultDiv = document.querySelector('#calculator-engine .result');
    if (isNaN(num)) return;
    resultDiv.innerHTML = `Squared: ${num*num}<br>Cubed: ${num*num*num}`;
});

// === PRIME FACTORISER ===
function toggleFactoriser() {
    document.getElementById('factoriser-engine').classList.toggle('hidden');
}
document.getElementById('factor-btn').addEventListener('click', function() {
    let n = parseInt(document.getElementById('factor-input').value);
    let res = [], d = 2;
    let temp = n;
    while (temp > 1) {
        while (temp % d === 0) { res.push(d); temp /= d; }
        d++;
    }
    document.getElementById('factor-result').innerText = n + " = " + res.join(" × ");
});

// === FRACTAL DESIGNER ===
function toggleFractal() {
    document.getElementById('fractal-engine').classList.toggle('hidden');
}

window.addEventListener('DOMContentLoaded', () => {
    let fracCanvas = document.getElementById('fractal-canvas');
    
    if (fracCanvas) {
        let fCtx = fracCanvas.getContext('2d');
        let angleSlider = document.getElementById('frac-angle');
        let scaleSlider = document.getElementById('frac-scale');
        let windSlider = document.getElementById('frac-wind'); 
        
        let time = 0; 

        // This tracks the position of the blowing wind lines
        let windLines = [
            { x: -50,  y: 50,  speed: 1.5, length: 40 },
            { x: -150, y: 120, speed: 2,   length: 60 },
            { x: -80,  y: 200, speed: 1.2, length: 30 }
        ];

        function drawWindEffect(windPower) {
            // If wind is 0, don't show any wind lines at all
            if (windPower === 0) return;

            fCtx.save();
            // Make the wind lines a semi-transparent light blue/white color
            fCtx.strokeStyle = "rgba(173, 216, 230, 0.4)"; 
            
            // The more power, the thicker the wind lines get!
            fCtx.lineWidth = Math.max(1, windPower * 0.5); 

            windLines.forEach(line => {
                fCtx.beginPath();
                // Draw a nice swooping wind gust line
                fCtx.moveTo(line.x, line.y);
                // The wind length scales up with the wind power slider
                let currentLength = line.length * (1 + windPower * 0.15);
                fCtx.lineTo(line.x + currentLength, line.y);
                fCtx.stroke();

                // Move the wind lines across the screen based on time and power
                line.x += line.speed * (1 + windPower * 0.5);

                // If a wind line goes off the right side of the canvas, wrap it back to the left
                if (line.x > fracCanvas.width) {
                    line.x = -currentLength - Math.random() * 100;
                    line.y = Math.random() * (fracCanvas.height - 100) + 30; // Randomize height
                }
            });

            fCtx.restore();
        }

        function drawFractal(x, y, len, angle, branchWidth) {
            fCtx.beginPath();
            fCtx.save();
            fCtx.strokeStyle = "#8B4513"; 
            fCtx.lineWidth = branchWidth;
            fCtx.translate(x, y);
            fCtx.rotate(angle * Math.PI / 180);
            fCtx.moveTo(0, 0);
            fCtx.lineTo(0, -len);
            fCtx.stroke();

            if (len < 10) {
                fCtx.beginPath();
                fCtx.arc(0, -len, 4, 0, Math.PI * 2); 
                fCtx.fillStyle = "#ff69b4"; 
                fCtx.fill();
                
                fCtx.restore();
                return;
            }

            let angleOffset = angleSlider ? parseInt(angleSlider.value) || 15 : 15;
            let rawScale = scaleSlider ? parseInt(scaleSlider.value) || 75 : 75;
            let safeScale = Math.min(rawScale, 82); 
            let scaleOffset = safeScale / 100;

            let windPower = windSlider ? parseInt(windSlider.value) : 3;
            let wind = Math.sin(time) * windPower; 

            drawFractal(0, -len, len * scaleOffset, angleOffset + wind, branchWidth * 0.7);
            drawFractal(0, -len, len * scaleOffset, -angleOffset + wind, branchWidth * 0.7);
            fCtx.restore();
        }

        function renderFractal() {
            fCtx.clearRect(0, 0, fracCanvas.width, fracCanvas.height);
            
            let windPower = windSlider ? parseInt(windSlider.value) : 3;

            // 1. Draw the blowing wind effects in the background first!
            drawWindEffect(windPower);

            // 2. Draw the tree on top of the wind
            drawFractal(200, 300, 80, 0, 10);
            
            let windSpeed = windSlider ? parseInt(windSlider.value) : 3;
            time += 0.01 * windSpeed; 
            
            requestAnimationFrame(renderFractal);
        }
        
        renderFractal();
    }
});

// === EQUATION GRAPHER ===
function toggleGrapher() {
    document.getElementById('grapher-engine').classList.toggle('hidden');
}

document.getElementById('graph-btn').addEventListener('click', function() {
    let canvas = document.getElementById('graph-canvas');
    let ctx = canvas.getContext('2d');
    let expr = document.getElementById('eq-input').value;
    let explanationPara = document.getElementById('root-explanation');
    if (explanationPara) {
    explanationPara.innerHTML = `Did you know that the x-intercepts are the roots of the equation <b>${expr} = 0</b>?`;
    }
    
    let labelRootsCheckbox = document.getElementById('label-roots');
    let shouldLabelRoots = labelRootsCheckbox ? labelRootsCheckbox.checked : false;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 1. Draw Axis
    ctx.strokeStyle = "#30363d";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(200, 0); ctx.lineTo(200, 400); // Y-axis
    ctx.moveTo(0, 200); ctx.lineTo(400, 200); // X-axis
    ctx.stroke();

    // 2. Plotting the function line completely first!
    ctx.strokeStyle = "#58a6ff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    let first = true;
    for (let x = -200; x <= 200; x++) {
        let valX = x / 20; 
        try {
            let sanitizedExpr = expr
              .replace(/\^/g, '**')              // Handle powers
              .replace(/(\d)(x)/g, '$1*$2')      // 2x -> 2*x
              .replace(/(x)(\d)/g, '$1**$2')     // x2 -> x**2 (common user mistake)
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
    ctx.stroke(); // <--- This completely finishes the blue line safely!

    // 3. Now loop through a second time to find and drop labels on top
    if (shouldLabelRoots) {
        let prevValX = null;
        let prevY = null;

        for (let x = -200; x <= 200; x++) {
            let valX = x / 20; 
            try {
                let sanitizedExpr = expr.replace(/\^/g, '**');
                let y = new Function('x', 'return ' + sanitizedExpr)(valX);
                let canvasX = x + 200;
                
                // Exact hit
                if (y === 0) {
                    drawRootLabel(ctx, canvasX, 200, valX);
                } 
                // Crossing point
                else if (prevY !== null && ((prevY > 0 && y < 0) || (prevY < 0 && y > 0))) {
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

// (Keep your helper drawRootLabel function underneath exactly as it was!)
function drawRootLabel(ctx, canvasX, canvasY, mathX) {
    ctx.save();
    ctx.fillStyle = "#ff6b6b";
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "10px sans-serif";
    ctx.fillText(mathX.toFixed(2), canvasX + 5, canvasY - 5);
    ctx.restore();
}
