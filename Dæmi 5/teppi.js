"use strict";

var canvas;
var gl;

var points = [];

var NumTimesToSubdivide = 5;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.

    var vertices = [
        vec2( -1, 1 ),
        vec2(  1,  1 ),
        vec2(  1, -1 ),
        vec2(  -1, -1 ),

    ];

    divideTriangle( vertices[0], vertices[1], vertices[2],vertices[3],
                    NumTimesToSubdivide);

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};

function triangle( a, b, c ,d)
{
    points.push(a, b, c);
    points.push(a, c, d);
}

function divideTriangle( a, b, c, d, count )
{

    // check for end of recursion

    if ( count === 0 ) {
        triangle( a, b, c,d );
    }
    else {

        //bisect the sides

        var AB=mix(a,b,1/3,count);
        var BC=mix(b,c,1/3,count);
        var CD=mix(c,d,1/3,count);
        var DA=mix(d,a,1/3,count);

        var AB2=mix(a,b,2/3,count);
        var BC2=mix(b,c,2/3,count);
        var CD2=mix(c,d,2/3,count);
        var DA2=mix(d,a,2/3,count);

        //TÓMI KASSI
        var AC=mix(a,c,1/3,count);
        var BD=mix(b,d,1/3,count);

        var AC2=mix(a,c,2/3,count);
        var BD2=mix(b,d,2/3,count);

        --count;

        // three new triangles
        divideTriangle(a,AB,AC,DA2,count);
        divideTriangle(AB,AB2,BD,AC,count);
        divideTriangle(AB2,b,BC,BD,count);

        divideTriangle(DA2,AC,BD2,DA,count);
        divideTriangle(BD,BC,BC2,AC2,count);

        divideTriangle(DA,BD2,CD2,d,count);
        divideTriangle(BD2,AC2,CD,CD2,count);
        divideTriangle(AC2,BC2,c,CD,count);

        
    }
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}
