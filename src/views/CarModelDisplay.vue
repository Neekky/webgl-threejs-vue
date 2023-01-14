<script setup lang="ts">
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ref, onMounted } from "vue";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

// 初始化场景
const scene = new THREE.Scene();

// 初始化相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.5,
  1000
);

// 设置相机位置
camera.position.set(0, 2, 6);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);

const canvasContainer = ref<any>(null);

// 添加网格地面
const gridHelper = new THREE.GridHelper(20, 20);
gridHelper.material.opacity = 0.7;
gridHelper.material.transparent = true;

scene.add(gridHelper);

// 添加汽车模型
const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/gltf/");
gltfLoader.setDRACOLoader(dracoLoader);

// 定义模型部件变量
let wheels = [];
let carBody, frontCar, hoodCar, glassCar;

// 创建材质
const bodyMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xff0000,
  metalness: 1,
  roughness: 0.5,
  clearcoat: 1,
  clearcoatRoughness: 0.1,
});

const frontMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xff0000,
  metalness: 1,
  roughness: 0.5,
  clearcoat: 1,
  clearcoatRoughness: 0.1,
});

const hoodMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xff0000,
  metalness: 1,
  roughness: 0.5,
  clearcoat: 1,
  clearcoatRoughness: 0.1,
});

const wheelsMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xff0000,
  metalness: 1,
  roughness: 0.1,
});

const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  transmission: 1,
  metalness: 0,
  roughness: 0,
  transparent: true,
});

gltfLoader.load("./model/bmw01.glb", (gltf) => {
  const bmw = gltf.scene;
  // bmw.position.x = 2;
  bmw.traverse((child) => {
    if (!child.isMesh) return;
    // 判断轮毂
    if (child.name.includes("轮毂")) {
      child.material = wheelsMaterial;
      wheels.push(child);
    }
    // 判断是否是车身
    if (child.name.includes("Mesh002")) {
      carBody = child;
      child.material = bodyMaterial;
    }
    // 判断是否是车前脸
    if (child.name.includes("前脸")) {
      child.material = frontMaterial;
      frontCar = child;
    }
    // 判断是否是引擎盖
    if (child.name.includes("引擎盖_1")) {
      child.material = hoodMaterial;
      hoodCar = child;
    }
    // 判断是否是挡风玻璃
    if (child.name.includes("挡风玻璃")) {
      child.material = glassMaterial;
      glassCar = child;
    }
  });
  scene.add(bmw);
});

// 添加灯光
const light1 = new THREE.DirectionalLight(0xffffff, 0.8);
light1.position.set(0, 0, 10);
scene.add(light1);

const light2 = new THREE.PointLight(0xffffff, 0.8);
light2.position.set(0, 0, -10);
scene.add(light2);

const light3 = new THREE.DirectionalLight(0xffffff, 0.5);
light3.position.set(10, 0, 0);
scene.add(light3);

const light4 = new THREE.PointLight(0xffffff, 0.6);
light4.position.set(-10, 0, 0);
scene.add(light4);

const light5 = new THREE.DirectionalLight(0xffffff, 0.8);
light5.position.set(0, 10, 0);
scene.add(light5);

const light6 = new THREE.PointLight(0xffffff, 0.5);
light6.position.set(5, 10, 0);
scene.add(light6);

const light7 = new THREE.DirectionalLight(0xffffff, 0.8);
light7.position.set(0, 10, 5);
scene.add(light7);

const light8 = new THREE.PointLight(0xffffff, 0.6);
light8.position.set(0, 10, -5);
scene.add(light8);

const light9 = new THREE.DirectionalLight(0xffffff, 0.4);
light9.position.set(-5, 10, 0);
scene.add(light9);

// 定义车身色值选项
const colors = [
  "red",
  "blue",
  "green",
  "yellow",
  "orange",
  "pink",
  "purple",
  "gray",
];

const selectColor = (item: string, type?: number) => {
  if (type === 2) {
    hoodMaterial.color.set(item);
    return;
  }
  if (type === 3) {
    bodyMaterial.color.set(item);
    return;
  }
  if (type === 4) {
    frontMaterial.color.set(item);
    return;
  }
  if (type === 5) {
    wheelsMaterial.color.set(item);
    return;
  }
  bodyMaterial.color.set(item);
  frontMaterial.color.set(item);
  hoodMaterial.color.set(item);
  wheelsMaterial.color.set(item);
  // glassMaterial.color.set(item);
};

// 定义车衣
const materials = [
  { name: "磨砂", value: 1 },
  { name: "冰晶", value: 0.1 },
];

const selectMaterial = (item: any) => {
  bodyMaterial.clearcoatRoughness = item.value;
  frontMaterial.clearcoatRoughness = item.value;
  hoodMaterial.clearcoatRoughness = item.value;
}

// 挂载完毕之后获取dom
onMounted(() => {
  // 添加控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // 初始化渲染场景
  renderer.setClearColor("#ccc");
  scene.background = new THREE.Color("#ccc");
  scene.environment = new THREE.Color("#ccc");

  canvasContainer.value.appendChild(renderer.domElement);

  const render = () => {
    controls && controls.update();
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
  <div class="container">
    <div ref="canvasContainer" />
    <div class="selector">
      <div class="selector-title">
        <h1>汽车展示与选配</h1>
      </div>
      <h2>选择整体车身颜色</h2>
      <div class="body-select">
        <div
          class="select-item"
          v-for="(item, index) in colors"
          v-bind:key="index"
          @click="selectColor(item, 1)"
        >
          <div
            class="select-item-color"
            :style="{ backgroundColor: item }"
          ></div>
        </div>
      </div>
      <h2>选择引擎盖颜色</h2>
      <div class="body-select">
        <div
          class="select-item"
          v-for="(item, index) in colors"
          v-bind:key="index"
          @click="selectColor(item, 2)"
        >
          <div
            class="select-item-color"
            :style="{ backgroundColor: item }"
          ></div>
        </div>
      </div>
      <h2>选择车身颜色</h2>
      <div class="body-select">
        <div
          class="select-item"
          v-for="(item, index) in colors"
          v-bind:key="index"
          @click="selectColor(item, 3)"
        >
          <div
            class="select-item-color"
            :style="{ backgroundColor: item }"
          ></div>
        </div>
      </div>
      <h2>选择前脸颜色</h2>
      <div class="body-select">
        <div
          class="select-item"
          v-for="(item, index) in colors"
          v-bind:key="index"
          @click="selectColor(item, 4)"
        >
          <div
            class="select-item-color"
            :style="{ backgroundColor: item }"
          ></div>
        </div>
      </div>
      <h2>选择轮毂颜色</h2>
      <div class="body-select">
        <div
          class="select-item"
          v-for="(item, index) in colors"
          v-bind:key="index"
          @click="selectColor(item, 5)"
        >
          <div
            class="select-item-color"
            :style="{ backgroundColor: item }"
          ></div>
        </div>
      </div>


      <h2>选择贴膜材质</h2>
      <div class="body-select">
        <div
          class="select-item"
          v-for="(item, index) in materials"
          v-bind:key="index"
          @click="selectMaterial(item)"
        >
          <button class="select-item-btn">
            {{ item.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.selector {
  position: fixed;
  top: 20px;
  right: 40px;
  transform: scale(0.7);
  transform-origin: right top;
}

.body-select {
  display: flex;
}

.select-item {
  margin: 0 5px 0 5px;
}
.select-item-color {
  width: 30px;
  height: 30px;
  border-radius: 5px;
}

.select-item-btn {
  padding: 8px 12px;
  background-color: beige;
  border-radius: 3px;
  font-size: 16px;
}

.select-item-btn:hover {
  cursor: pointer;
}

</style>
