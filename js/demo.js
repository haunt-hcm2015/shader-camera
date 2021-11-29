let camShader;
let poseNet;
let poses = [];
let skeletons = [];

// the camera variable
let cam;
let camShift;
let countup;
let countdown;
let counttx = 0;
let countty = 0;
let fragment = 
'precision mediump float;' +
'varying vec2 vTexCoord;' +
'uniform sampler2D tex0;' +
'uniform sampler2D tex1;' +
'uniform float amt;' +
'void main() {' +
  'vec2 uv = vTexCoord;' +
  'uv = 1.0 - uv;' +
  'vec4 cam = texture2D(tex0, uv);' +
  'float avg = dot(cam.rgb, vec3(0.33333));' +
  'avg = avg * 6.0 - 1.0;' +
  'float disp = avg * amt;' +
  'vec4 blurg  = texture2D(tex1, uv + disp);' +
  'gl_FragColor = blurg;' +
'}';
let vert = 
'attribute vec3 aPosition;' +
'attribute vec2 aTexCoord;' +
'varying vec2 vTexCoord;' +
'void main() {' +
  'vTexCoord = aTexCoord;' +
  'vec4 positionVec4 = vec4(aPosition, 1.0);' +
  'positionVec4.xy = positionVec4.xy * 2.0 - 1.0;' +
  'gl_Position = positionVec4;' +
'}';

function setup() {
  createCanvas(960, 720, WEBGL);
  noStroke();
  cam = createCapture(VIDEO);
  cam.size(window.innerWidth, window.innerHeight);
  camShader = createShader(vert, fragment);
  cam.hide();
}

function draw() {  
  if (countup){
        counttx = counttx + 0.0001;
        if (counttx >= 0.05)
          countup = false;
      }
      else{
        counttx = counttx - 0.0001;
        if (counttx <= -0.05)
          countup = true;
      }
  
  if (countdown){
        countty = countty + 0.001;
        if (countty >= 0.5)
          countdown = false;
      }
      else{
        countty = countty - 0.001;
        if (countty <= -0.05)
          countdown = true;
      }

  shader(camShader);
  camShader.setUniform('tex0', cam);
  camShader.setUniform('tex1', cam);
  camShader.setUniform('amt', map(0, 80, width, counttx, 0));
  rect(0,0,width, height);
}

function windowResized(){
  resizeCanvas(960, 720);
}

