<script setup lang="ts">
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
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
  0.5,
  1000
);

// 设置相机位置
camera.position.set(-3.23, 7.98, 7.06);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  // 设置对数深度缓冲区
  logarithmicDepthBuffer: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);

// 设置色调映射
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = true;

const container = ref<any>(null);

const controlsRef = ref<any>(null);

// 实例化gltf载入库
const loader = new GLTFLoader();
// 实例化dracoLoader库
const dracoLoader = new DRACOLoader();
// 添加draco载入库
dracoLoader.setDecoderPath("/draco/");
loader.setDRACOLoader(dracoLoader);

// 加载环境纹理
const rgbeLoader = new RGBELoader();
rgbeLoader.load("hdr/sky.hdr", (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
});

// 加载模型
loader.load("./model/scene.glb", (gltf) => {
  const model = gltf.scene;
  model.traverse((child) => {
    if (child.name === "Plane") {
      child.visible = false;
    }
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.add(model);
});

// 加载模型
loader.load("./model/tank.gltf", (gltf) => {
  const model = gltf.scene;
  model.castShadow = true;
  model.position.set(10, 0, 10);
  scene.add(model);
});

// 添加光源
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 50, 0);
scene.add(light);

// 添加点光源
const pointLight1 = new THREE.PointLight(0xffffff, 20);
pointLight1.position.set(0.1, 2.4, 0);
pointLight1.castShadow = true;
scene.add(pointLight1);

// 创建点光源组
const pointLightGroup = new THREE.Group();

pointLightGroup.position.set(-8, 2.5, -1.5);

const radius = 3;
const pointLightArr: any[] = [];

for (let i = 0; i < 3; i++) {
  // 创建球体，作为灯泡
  let sphereGeometry = new THREE.SphereGeometry(0.15, 32, 32);
  let sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 10,
  });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

  sphere.position.set(
    radius * Math.cos((i * 2 * Math.PI) / 3),
    Math.cos((i * 2 * Math.PI) / 3),
    radius * Math.sin((i * 2 * Math.PI) / 3)
  );

  let pointLight = new THREE.PointLight(0xffffff, 10);
  sphere.add(pointLight);

  pointLightArr.push(sphere);

  pointLightGroup.add(sphere);
}

scene.add(pointLightGroup);

// 使用补间函数，从0到2π，使灯泡旋转
let options = {
  angle: 0,
};

gsap.to(options, {
  angle: Math.PI * 2,
  duration: 10,
  repeat: -1,
  ease: "linear",
  onUpdate: () => {
    pointLightGroup.rotation.y = options.angle;
    pointLightArr.forEach((item, i) => {
      item.position.set(
        radius * Math.cos((i * 2 * Math.PI) / 3),
        Math.cos((i * 2 * Math.PI) / 3 + options.angle * 5),
        radius * Math.sin((i * 2 * Math.PI) / 3)
      );
    });
  },
});

// 设置水面效果
const waterGeometry = new THREE.CircleGeometry(300, 32);

const water = new Water(waterGeometry, {
  textureWidth: 1024,
  textureHeight: 1024,
  color: 0x99f0ff,
  flowDirection: new THREE.Vector2(0.5, 1),
  scale: 100,
});

// 水面旋转至水平
water.rotation.x = -Math.PI / 2;
water.position.y = -0.3;

scene.add(water);

// 使用补间动画，移动相机
let timeline1 = gsap.timeline();
let timeline2 = gsap.timeline();

// 定义相机移动函数
const translateCamera = (position: any, target: any) => {
  timeline1.to(camera.position, {
    x: position.x,
    y: position.y,
    z: position.z,
    duration: 1,
    ease: "power2.inOut",
  });

  timeline2.to(controlsRef.value.target, {
    x: target.x,
    y: target.y,
    z: target.z,
    duration: 1,
    ease: "power2.inOut",
  });
};

// 定义场景
let screens = [
  {
    text: "圣诞快乐",
    callback: () => {
      // 执行函数切换位置
      translateCamera(
        new THREE.Vector3(-3.23, 3, 4.06),
        new THREE.Vector3(-8, 2, 0)
      );
    },
  },
  {
    text: "哈哈哈哈哈",
    callback: () => {
      // 执行函数切换位置
      translateCamera(new THREE.Vector3(7, 0, 23), new THREE.Vector3(0, 0, 0));
    },
  },
  {
    text: "爱你么么哒",
    callback: () => {
      // 执行函数切换位置
    },
  },
  {
    text: "亚西西亚",
    callback: () => {
      // 执行函数切换位置
    },
  },
  {
    text: "疫情结束，健康快乐",
    callback: () => {
      // 执行函数切换位置
    },
  },
];

let index = ref(0);

// 监听鼠标事件
window.addEventListener(
  "click",
  (e) => {
    console.log(21332112);
    index.value++;
    if (index.value > screens.length - 1) {
      index.value = 0;
    }
    screens[index.value].callback();
  },
  false
);

// 挂载完毕之后获取dom
onMounted(() => {
  // 添加控制器
  const controls = new OrbitControls(camera, container.value);
  controls.enableDamping = true;
  container.value.appendChild(renderer.domElement);
  controlsRef.value = controls;
  // 定义渲染函数
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
    <router-link to="/">
      <button>去VR看房</button>
    </router-link>
  </div>
</template>

<style scoped>
.container {
}

.nav-btn {
  position: fixed;
  top: 20px;
  left: 20px;
}
</style>
