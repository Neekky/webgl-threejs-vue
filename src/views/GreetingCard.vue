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
camera.position.set(-3.23, 3, 4.06);

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
// loader.load("./model/tank.gltf", (gltf) => {
//   const model = gltf.scene;
//   model.castShadow = true;
//   model.position.set(10, 0, 10);
//   scene.add(model);
// });

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
    text: "入目无他人，四下皆是你",
    callback: () => {
      // 执行函数切换位置
      translateCamera(
        new THREE.Vector3(-3.23, 3, 4.06),
        new THREE.Vector3(-8, 2, 0)
      );
    },
  },
  {
    text: "愿你野蛮生长，最终璀璨生光",
    callback: () => {
      // 执行函数切换位置
      translateCamera(new THREE.Vector3(7, 0, 23), new THREE.Vector3(0, 0, 0));
    },
  },
  {
    text: "承蒙你的出现，足够让我喜欢一辈子",
    callback: () => {
      // 执行函数切换位置
      translateCamera(new THREE.Vector3(10, 3, 0), new THREE.Vector3(5, 2, 0));
    },
  },
  {
    text: "召唤漫天的星辰送给你",
    callback: () => {
      // 执行函数切换位置
      translateCamera(new THREE.Vector3(7, 2, 25), new THREE.Vector3(0, 0, 0));
      makeHeart();
    },
  },
  {
    text: "愿有岁月可回收且以深情共白头",
    callback: () => {
      // 执行函数切换位置
      translateCamera(
        new THREE.Vector3(-20, 1.3, 6.6),
        new THREE.Vector3(5, 2, 0)
      );
    },
  },
];

// 实例化创建满天星星
const starInstance = new THREE.InstancedMesh(
  new THREE.SphereGeometry(0.1, 32, 32),
  new THREE.MeshStandardMaterial({
    color: 0xf50b5b,
    emissive: 0xf50b5b,
    emissiveIntensity: 10,
  }),
  100
);

// 星星随机分布到天上
const startArr: any[] = [];
const endArr: any[] = [];

for (let i = 0; i < 100; i++) {
  let x = Math.random() * 100 - 50;
  let y = Math.random() * 100 - 50;
  let z = Math.random() * 100 - 50;
  startArr.push(new THREE.Vector3(x, y, z));

  let martix = new THREE.Matrix4();
  martix.setPosition(x, y, z);
  starInstance.setMatrixAt(i, martix);
}

// 使用补间动画移动星星-创建爱心路径
let heartShape = new THREE.Shape();
heartShape.moveTo(-25, -25);
heartShape.bezierCurveTo(-25, -25, -20, 0, 0, 0);
heartShape.bezierCurveTo(30, 0, 30, -35, 30, -35);
heartShape.bezierCurveTo(30, -55, 10, -77, -25, -95);
heartShape.bezierCurveTo(-60, -77, -80, -55, -80, -35);
heartShape.bezierCurveTo(-80, -35, -80, 0, -50, 0);
heartShape.bezierCurveTo(-35, 0, -25, -25, -25, -25);

// 根据爱心路径获取点
let center = new THREE.Vector3(8, 10, 10);
for (let i = 0; i < 100; i++) {
  let point = heartShape.getPoint(i / 100);
  endArr.push(
    new THREE.Vector3(
      point.x * 0.1 + center.x,
      point.y * 0.1 + center.y,
      center.z
    )
  );
}

// 创建爱心动画
function makeHeart() {
  let params = {
    time: 0,
  };

  gsap.to(params, {
    time: 1,
    duration: 2,
    onUpdate: () => {
      for (let i = 0; i < 100; i++) {
        let x = startArr[i].x + (endArr[i].x - startArr[i].x) * params.time;
        let y = startArr[i].y + (endArr[i].y - startArr[i].y) * params.time;
        let z = startArr[i].z + (endArr[i].z - startArr[i].z) * params.time;
        let matrix = new THREE.Matrix4();
        matrix.setPosition(x, y, z);
        starInstance.setMatrixAt(i, matrix);
      }
      starInstance.instanceMatrix.needsUpdate = true;
    },
  });
}

function restoreHeart() {
  let params = {
    time: 0,
  };

  gsap.to(params, {
    time: 1,
    duration: 1,
    onUpdate: () => {
      for (let i = 0; i < 100; i++) {
        let x = endArr[i].x + (startArr[i].x - endArr[i].x) * params.time;
        let y = endArr[i].y + (startArr[i].y - endArr[i].y) * params.time;
        let z = endArr[i].z + (startArr[i].z - endArr[i].z) * params.time;
        let matrix = new THREE.Matrix4();
        matrix.setPosition(x, y, z);
        starInstance.setMatrixAt(i, matrix);
      }
      starInstance.instanceMatrix.needsUpdate = true;
    },
  });
}

scene.add(starInstance);

let index = ref(0);

let isAnimated = false;
// 监听鼠标事件
window.addEventListener(
  "click",
  (e) => {
    if (isAnimated) return;
    isAnimated = true;
    index.value++;
    if (index.value > screens.length - 1) {
      index.value = 0;
      restoreHeart();
    }
    screens[index.value].callback();
    setTimeout(() => {
      isAnimated = false;
    }, 1000);
  },
  false
);

// 监听鼠标事件
window.addEventListener(
  "touchstart",
  (e) => {
    if (isAnimated) return;
    isAnimated = true;
    index.value++;
    if (index.value > screens.length - 1) {
      index.value = 0;
      restoreHeart();
    }
    screens[index.value].callback();
    setTimeout(() => {
      isAnimated = false;
    }, 1000);
  },
  false
);

// 挂载完毕之后获取dom
onMounted(() => {
  // 添加控制器
  const controls = new OrbitControls(camera, container.value);
  controls.enableDamping = true;
  // 设置控制器默认坐标
  controls.target.set(-8, 2, 0);
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
  <div
    class="scenes"
    :style="{
      transform: `translateY(${index * -100}vh)`,
    }"
  >
    <div class="scenes-text-wrap" :key="item.text" v-for="item in screens">
      <h1 class="scenes-text">{{ item.text }}</h1>
    </div>
  </div>
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

.scenes {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  pointer-events: none;
  transition: all 0.6s;
}

.scenes-text-wrap {
  width: 100vw;
  height: 100vh;
}

.scenes-text {
  padding: 100px 50px;
  font-size: 50px;
  color: #fff;
  font-weight: 600;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.5),
    0 0 30px rgba(255, 255, 255, 0.5), 0 0 30px rgba(255, 255, 255, 0.5),
    0 0 30px rgba(255, 255, 255, 0.5);
}
</style>
