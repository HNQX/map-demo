<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

import Map from '@/map/cmap.min'
import '@/map/style/style.css'

window.CESIUM_BASE_URL = "cesium";

defineProps({
  msg: String,
})

const ref_map = ref()

let map, air, shape

const LAYER_NAME = {
  IMG: 'LKHJNEQWF2LJK'
}

onMounted(() => {

  map = new Map('map', {
    shouldAnimate: false, // 默认开启动画
    animation: false, // 动画操作盘
    timeline: false, // 底部时间轴

    // 地图加载完回调
    onload: () => {
      console.log('map init')
    },

    // 选中地图中要素时回调
    onpick: (e) => {
      console.log(e)

      if (!e.target) return
      const id = e.target.id._id
      const position = map.geo.getPositionWithId(id)

      console.log(position)
    },

    // 选中航线时回调
    onselectAirline: e => {
      console.log(e);
    },

    defineInit: {
      baseMap: 5,
      drawTool: true,
      compass: {
        enable: true, // 指北罗盘
        distance: false, // 比例尺
        zoom: false, // 缩放控件
        center: [121, 31, 5000]
      }
    }
  })

  air = map.air({
    onSelect(e) {
      console.log(e)

    },
    onDraw(e) {
      console.log(e);

    }
  })
  shape = map.shape()

})

onUnmounted(() => {
  map.destroy()
})


const drawAirline = () => {
  const option = {
    color: [0, 1, 0, 0.8]
  }
  air.drawAirline(option)
}

const drawAirroad = () => {
  const option = {
    color: [1, 0, 1, 1],
    volumeColor: [102 / 255, 204 / 255, 255 / 255, 0.05], // 蓝色系2
    volumeOutlineColor: [102 / 255, 204 / 255, 255 / 255, 0.05],
    volumeHighLightColor: [0, 1, 0, 0.03],
  }
  air.drawAirroad(option)
}
const drawStop = () => {
  air.stop()
}
const drawClear = () => {
  air.clear()
}


const sectorDraw = () => {
  shape.sectorDraw()
}
const sectorExport = () => {
  const json = shape.sectorExport()
  console.log(json);
}
const sectorClear = () => {
  shape.sectorClear()
}

const addImg = () => {
  const data = [
    [121.1, 30.9, 0],
    [121, 31, 0],
    [121.3, 30.9, 0],
  ]

  data.forEach((i, index) => {

    const build = {
      id: LAYER_NAME.IMG,
      position: i,
      properties: i,
      text: {
        content: index + '点',
        color: '#ffffff',
        // font: "15pt monospace",
        // font:'14px monospace',
        showBackground: true,
        backgroundColor: '#1d335099',
        offset: [0, -40],
        anchor: ['center', 'bottom'],
        distanceDisplay: [4000, 16000]
      },
      image: {
        url: './img/pin1.png',
        width: 32,
        height: 32,
        offset: [0, 0],
        anchor: ['center', 'bottom'],
        distanceDisplay: [0, 4000]

      },
      point: {
        color: '#ffff00',
        pixelSize: 10,
        outlineColor: '#1d335099',
        outlineWidth: 2,
        distanceDisplay: [16000, 60000]
      },
      fly: true,
    }

    shape.point(build)

  })
}

const imgClear = () => {
  map.remove(LAYER_NAME.IMG)
}


const zoomIn = () => {
  map.zoomIn()}

const resetView = () => {
  map.resetView()
}

const zoomOut = () => {
  map.zoomOut()
}
</script>

<template>
  <div ref="ref_map" id="map"></div>

  <div class="overmap">

    <div class="panel">
      <button @click="zoomIn">-</button>
      <button @click="resetView">⌂</button>
      <button @click="zoomOut">+</button>
    </div>

    <div class="panel">
      <button @click="drawAirline">绘制航线</button>
      <button @click="drawAirroad">绘制航路</button>
      <button @click="drawStop">停止绘制</button>
      <button @click="drawClear">清除</button>
    </div>

    <div class="panel">
      <button @click="addImg">图片 / 像素 / 标签 => 点</button>
      <button @click="imgClear">清除</button>
    </div>

    <div class="panel">
      <button @click="sectorDraw">绘制扇形</button>
      <button @click="sectorExport">导出扇形</button>
      <button @click="sectorClear">清除</button>
    </div>

  </div>
</template>

<style lang="less" scoped>
#map {
  height: 100vh;
  width: 100vw;
}

.overmap {
  position: absolute;
  top: 0;
  left: 0;
  margin: 20px;

  .panel {}
}
</style>
