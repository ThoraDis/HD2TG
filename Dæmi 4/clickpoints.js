var canvas;
var gl;

var maxNumPoints = 200;  


var points = [];  
var hring = [];   


window.onload = function init() {

    canvas = document.getElementById("gl-canvas");
    
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }
    
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.95, 1.0, 1.0, 1.0);

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * maxNumPoints, gl.DYNAMIC_DRAW);
    
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    canvas.addEventListener("mousedown", function(e){

        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        
        
        var t = vec2(2 * e.offsetX / canvas.width - 1, 2 * (canvas.height - e.offsetY) / canvas.height - 1);

        
        createCirclePoints(t, Math.random() * (0.2 - 0.05) + 0.05, 20);

        
        hring.push(points.slice());  
       
    });

    render();
}


function createCirclePoints(cent, rad, k) {
    points = [];
    points.push(cent);  
    
    var dAngle = 2 * Math.PI / k;
    for (var i = 0; i <= k; i++) {  
        var a = i * dAngle;
        var p = vec2(rad * Math.sin(a) + cent[0], rad * Math.cos(a) + cent[1]);
        points.push(p);
    }
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    
    for (var i = 0; i < hring.length; i++) {
        
        var flattenedPoints = flatten(hring[i]);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flattenedPoints);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, hring[i].length);  
    }

    window.requestAnimFrame(render);
}