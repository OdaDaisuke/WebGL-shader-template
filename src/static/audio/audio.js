let windowWidth;
let windowHeight;
let scene;
let camera;
let renderer;
let ball;
let balls = new Array();
let pointsGeometry;
let pointsMaterial;
let pointPositions;
let group;

let noise;

let audioContext;
let audioSource;
let audioBufferSource;
let audioAnalyser;
let audioCount;

window.addEventListener("load", () => {
  initThree();
  initAudio().then(buffer => {
    setAudio(buffer);
    playAudio();
  });
});

const initThree = () => {
  // ウィンドウサイズを変数へ格納
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;

  noise = new SimplexNoise();

  // scene の初期設定
  scene = new THREE.Scene();

  // camera の初期設定
  camera = new THREE.PerspectiveCamera(
    45,
    windowWidth / windowHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 100);
  camera.lookAt(scene.position);

  // renderer の初期設定
  renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  // 背景のグラデーションはCSSに任せるので、Canvasの背景は透明にする
  renderer.setClearColor(0x000000, 0.0);
  renderer.setSize(windowWidth, windowHeight);
  document.body.appendChild(renderer.domElement);

  group = new THREE.Group();

  const icosahedronGeometry = new THREE.IcosahedronGeometry(10, 2);
  const lambertMaterial = new THREE.MeshLambertMaterial({
    color: 0xf2d4ba,
    wireframe: true,
  });
  for (let i = 1; i < 3; i++) {
    const b = new THREE.Mesh(icosahedronGeometry, lambertMaterial);
    b.position.set(-35 + 25 * i, -35 + 25 * i, 0);
    console.log(b.position);
    group.add(b);
    balls.push(b);
  }

  const ambientLight = new THREE.AmbientLight(0x999999);
  scene.add(ambientLight);

  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.intensity = 0.9;
  spotLight.position.set(-10, 40, 20);
  spotLight.lookAt(balls[1]);
  spotLight.castShadow = true;
  scene.add(spotLight);
  scene.add(group);
  renderer.render(scene, camera);
};

const initAudio = () =>
  new Promise(resolve => {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioSource = "./audio/lofi_2.wav";
    audioBufferSource = audioContext.createBufferSource();
    audioAnalyser = audioContext.createAnalyser();

    let request = new XMLHttpRequest();
    request.open("GET", audioSource, true);
    request.responseType = "arraybuffer";
    request.onload = () => {
      audioContext.decodeAudioData(request.response, buffer => resolve(buffer));
    };
    request.send();
  });

const setAudio = buffer => {
  // fftサイズを指定する
  audioBufferSource.buffer = buffer;
  audioBufferSource.loop = true;

  // 音源を波形取得機能に接続
  audioBufferSource.connect(audioAnalyser);
  audioAnalyser.fftSize = 1024;

  // 波形取得機能を出力機能に接続
  audioAnalyser.connect(audioContext.destination);

  // 時間領域の波形データを格納する配列を生成
  audioCount = new Uint8Array(audioAnalyser.frequencyBinCount);

  // 音源の再生を開始する
  audioBufferSource.start(0);
};

function playAudio() {
  audioAnalyser.getByteFrequencyData(audioCount);

  const lowerHalfArray = audioCount.slice(0, (audioCount.length/2) - 1);
  const upperHalfArray = audioCount.slice((audioCount.length/2) - 1, audioCount.length - 1);
  const lowerMax = max(lowerHalfArray);
  const upperAvg = avg(upperHalfArray);

  const lowerMaxFr = lowerMax / lowerHalfArray.length;
  const upperAvgFr = upperAvg / upperHalfArray.length;
  balls.map((b, i) => {
    const mod1 = modulate(Math.pow(lowerMaxFr, 0.88 * i * 10), 0, 1 + i * 2, 0, 8 + i * 2);
    const mod2 = modulate(upperAvgFr, 0, 1, 0, 4);
    makeRoughBall(
      b,
      mod1,
      mod2,
      i,
    );
  });

  group.rotation.z += 0.009;

  renderer.render(scene, camera);
  requestAnimationFrame(playAudio);
};

function makeRoughBall(mesh, bassFr, treFr) {
  mesh.geometry.vertices.forEach(function (vertex, i) {
      var offset = mesh.geometry.parameters.radius;
      var amp = 7;
      var time = window.performance.now();
      vertex.normalize();
      // var rf = 0.00013;
      var rf = 0.0002;
      var distance = (offset + bassFr ) + noise.noise3D(vertex.x + time *rf*7, vertex.y +  time*rf*8, vertex.z + time*rf*9) * amp * treFr;
      vertex.multiplyScalar(distance);
  });
  mesh.geometry.verticesNeedUpdate = true;
  mesh.geometry.normalsNeedUpdate = true;
  mesh.geometry.computeVertexNormals();
  mesh.geometry.computeFaceNormals();
}

function modulate(val, minVal, maxVal, outMin, outMax) {
  var fr = fractionate(val, minVal, maxVal);
  var delta = outMax - outMin;
  return outMin + (fr * delta);
}

function fractionate(val, minVal, maxVal) {
  return (val - minVal)/(maxVal - minVal);
}

function avg(arr){
  var total = arr.reduce(function(sum, b) { return sum + b; });
  return (total / arr.length);
}

function max(arr){
  return arr.reduce(function(a, b){ return Math.max(a, b); })
}
