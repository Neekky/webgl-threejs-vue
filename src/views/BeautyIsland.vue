<script setup lang="ts">
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ref, onMounted } from "vue";

// 导入水面
import { Water } from "three/examples/jsm/objects/Water2";

// 导入gltf载入库
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// 导入模型解压库
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

// 导入天空纹理HDR
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

// 初始化场景
const scene = new THREE.Scene();

// 初始化相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  3000
);

// 设置相机位置
camera.position.set(0, 100, 100);

// 更新摄像头宽高比例
camera.aspect = window.innerWidth / window.innerHeight;

// 更新摄像头投影矩阵
camera.updateProjectionMatrix();

// 创建一个巨大的天空球体
const skyGeometry = new THREE.SphereGeometry(1000, 60, 60);

skyGeometry.scale(1, 1, -1);

const skyTexture = new THREE.TextureLoader().load("./imgs/island/sky.jpg");
const skyMaterial = new THREE.MeshBasicMaterial({
  map: skyTexture,
});

const sky = new THREE.Mesh(skyGeometry, skyMaterial);

scene.add(sky);

const light = new THREE.DirectionalLight(0xffffff, 1); // soft white light
light.position.set(-100, 100, 10);
scene.add(light);



// 添加鼠标事件，触发视频播放
window.addEventListener("click", (e) => {
  // 创建视频纹理
  const video = document.createElement("video");
  video.src = "./imgs/island/sky.mp4?url";
  video.loop = true;
  // 当鼠标移动的时候，播放视频
  // 判断视频是否处于播放状态
  if (video.paused) {
    video.play();
    const texture = new THREE.VideoTexture(video);
    skyMaterial.map = texture;
    skyMaterial.map.needsUpdate = true;
  }
});

// 载入环境纹理hdr
const hdrLoader = new RGBELoader();
hdrLoader.loadAsync("hdr/050.hdr").then((texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
});

// 创建水面
const waterGeometry = new THREE.CircleBufferGeometry(300, 64);
const water = new Water(waterGeometry, {
  textureWidth: 1024,
  textureHeight: 1024,
  color: 0x99f0ff,
  flowDirection: new THREE.Vector2(0.5, 1),
  scale: 1,
});

// 水面旋转至水平
water.rotation.x = -Math.PI / 2;
water.position.y = 3;

scene.add(water);

// 添加小岛模型
// 实例化gltf载入库
const loader = new GLTFLoader();

// 实例化dracoLoader库
const dracoLoader = new DRACOLoader();

// 添加draco载入库
dracoLoader.setDecoderPath("/draco/");

loader.setDRACOLoader(dracoLoader);

loader.load("./model/island2.glb", (gltf) => {
  const island = gltf.scene;
  scene.add(island);
});

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({
  // 设置抗锯齿
  antialias: true,
  // 设置对数深度缓冲区
  logarithmicDepthBuffer: true
});

renderer.outputEncoding = THREE.sRGBEncoding;

// 设置渲染器宽高
renderer.setSize(window.innerWidth, window.innerHeight);

const container = ref<any>(null);

// 挂载完毕之后获取dom
onMounted(() => {
  // 添加控制器
  const controls = new OrbitControls(camera, container.value);
  controls.enableDamping = true;
  // 控制器不许平移
  controls.enablePan = false;
  container.value.appendChild(renderer.domElement);
  const render = () => {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };
  render();

  // 监听屏幕的变化，更新渲染的画面
  window.addEventListener("resize", () => {
    // 更新摄像头
    camera.aspect = window.innerWidth / window.innerHeight;
    // 更新摄像头的投影矩阵
    camera.updateProjectionMatrix();
    // 更新渲染器
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 设置渲染器的像素比
    renderer.setPixelRatio(window.devicePixelRatio);
  });
});
</script>

<template>
  <div class="container" ref="container" />
  <div class="nav-btn">
    <router-link to="/CarModelDisplay">
      <button>去车模</button>
    </router-link>
  </div>
</template>

<style>
.nav-btn {
  position: fixed;
  top: 20px;
  left: 20px;
}
</style>
