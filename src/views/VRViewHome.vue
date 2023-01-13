<script setup lang="ts">
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ref, onMounted } from "vue";

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
camera.position.z = 0.1;

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);

const container = ref<any>(null);

// 添加立方体
const geometry = new THREE.BoxGeometry(10, 10, 10);

// 定义图片数组
const arr = ["4_l", "4_r", "4_u", "4_d", "4_b", "4_f"];

const boxMaterials: any = [];

arr.forEach((item) => {
  // 纹理加载
  let texture = new THREE.TextureLoader().load(
    `/imgs/vrHome/living/${item}.jpg?url`
  );

  if (item === "4_u" || item === "4_d") {
    texture.rotation = Math.PI;
    texture.center = new THREE.Vector2(0.5, 0.5);
    // 创建材质
    boxMaterials.push(new THREE.MeshBasicMaterial({ map: texture }));
  } else {
    boxMaterials.push(new THREE.MeshBasicMaterial({ map: texture }));
  }
});

const cube = new THREE.Mesh(geometry, boxMaterials);

cube.geometry.scale(1, 1, -1);
scene.add(cube);

// 挂载完毕之后获取dom
onMounted(() => {
  // 添加控制器
  const controls = new OrbitControls(camera, container.value);
  controls.enableDamping = true;
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
    <router-link to="/BeautyIsland">
      <button>去小岛</button>
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
