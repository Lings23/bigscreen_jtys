<template>
  <div class="alarm3d-container">
    <img src="/Alarm3D.svg" alt="3D Alarm" class="alarm-svg" />
    
    <!-- 左上角统计表格 -->
    <div class="stats-table">
      <div class="stats-row">
        <span class="stats-label">告警总数：</span>
        <span class="stats-value">{{ totalAlarms }}</span>
      </div>
      <div class="stats-row">
        <span class="stats-label">阻断告警数：</span>
        <span class="stats-value">{{ blockedAlarms }}</span>
      </div>
    </div>

    <!-- 红色SVG图标 -->
    <img 
      v-for="loc in locations"
      :key="loc.id"
      v-if="loc.visible"
      src="/red.svg" 
      :alt="loc.id"
      :class="['red-svg', { 'alarm-blink': loc.alarm }]" 
      :style="{ left: loc.x + 'px', top: loc.y + 'px' }" 
      @mouseenter="showTooltip(loc, $event)"
      @mouseleave="hideTooltip"
    />

    <!-- 悬停提示框 -->
    <div 
      v-if="tooltip.visible" 
      class="tooltip"
      :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
    >
      {{ tooltip.text }}
    </div>

    <!-- 处置通报文本框 -->
    <div 
      v-for="notice in notices"
      :key="notice.id"
      class="disposal-notice"
      :style="{ 
        left: notice.x + 'px', 
        top: notice.y + 'px',
        transform: `translate(-50%, -50%) perspective(1000px) rotateY(${notice.rotateY}deg) rotateX(${notice.rotateX}deg) rotateZ(${notice.rotateZ}deg)`
      }"
    >
      {{ notice.label }}({{ notice.count }})
    </div>
  </div>
</template>

<script>
export default {
  name: 'Alarm3D',
  data() {
    return {
      locations: [
        { id: 'a1', x: 263, y: 225, visible: true, name: '单位A1', alarm: true },
        { id: 'a2', x: 309, y: 254, visible: true, name: '单位A2', alarm: false },
        { id: 'a3', x: 352, y: 281, visible: true, name: '单位A3', alarm: false },
        { id: 'a4', x: 397, y: 313, visible: true, name: '单位A4', alarm: false },
        { id: 'a5', x: 443, y: 341, visible: true, name: '单位A5', alarm: false },
        { id: 'a6', x: 486, y: 368, visible: true, name: '单位A6', alarm: false },
        { id: 'a7', x: 532, y: 393, visible: true, name: '单位A7', alarm: false },
        { id: 'a8', x: 570, y: 419, visible: true, name: '单位A8', alarm: false },
        { id: 'a9', x: 612, y: 448, visible: true, name: '单位A9', alarm: false },
        { id: 'a10', x: 654, y: 474, visible: true, name: '单位A10', alarm: false },
        { id: 'b1', x: 214, y: 273, visible: true, name: '单位B1', alarm: false },
        { id: 'b2', x: 256, y: 299, visible: true, name: '单位B2', alarm: false },
        { id: 'b3', x: 302, y: 331, visible: true, name: '单位B3', alarm: false },
        { id: 'b4', x: 347, y: 363, visible: true, name: '单位B4', alarm: false },
        { id: 'b5', x: 399, y: 391, visible: true, name: '单位B5', alarm: false },
        { id: 'b6', x: 444, y: 420, visible: true, name: '单位B6', alarm: false },
        { id: 'b7', x: 490, y: 449, visible: true, name: '单位B7', alarm: false },
        { id: 'b8', x: 536, y: 478, visible: true, name: '单位B8', alarm: false },
        { id: 'b9', x: 582, y: 503, visible: true, name: '单位B9', alarm: false },
      ],
      notices: [
        { id: 'c1', x: 522, y: 142, count: 10, label: '风险通知', rotateX: 12, rotateY: -53, rotateZ: -19 },
        { id: 'c2', x: 610, y: 210, count: 10, label: '白名单', rotateX: 12, rotateY: -53, rotateZ: -19 },
        { id: 'c3', x: 730, y: 285, count: 1101, label: '整改通知', rotateX: 12, rotateY: -53, rotateZ: -19 },
        { id: 'd1', x: 551, y: 80, count: 10, label: '风险资产', rotateX: 12, rotateY: -53, rotateZ: -19 },
        { id: 'd2', x: 640, y: 130, count: 10, label: '安全事件', rotateX: 12, rotateY: -53, rotateZ: -19 },
        { id: 'd3', x: 730, y: 188, count: 0, label: '漏洞', rotateX: 12, rotateY: -53, rotateZ: -19 },
        { id: 'd4', x: 820, y: 245, count: 90, label: '攻击IP', rotateX: 12, rotateY: -53, rotateZ: -19 },
      ],
      tooltip: {
        visible: false,
        text: '',
        x: 0,
        y: 0
      },
      totalAlarms: 1231,
      blockedAlarms: 456
    }
  },
  methods: {
    showTooltip(location, event) {
      this.tooltip.visible = true;
      this.tooltip.text = location.name;
      this.tooltip.x = location.x + 60;
      this.tooltip.y = location.y - 10;
    },
    hideTooltip() {
      this.tooltip.visible = false;
    },
    // 处理后端告警数据
    handleAlarmData(data) {
      // data 格式示例: { id: 'a1', flag: 1 } 或 [{ id: 'a1', flag: 1 }, { id: 'b3', flag: 1 }]
      if (Array.isArray(data)) {
        data.forEach(item => {
          this.updateLocationAlarm(item.id, item.flag === 1);
        });
      } else {
        this.updateLocationAlarm(data.id, data.flag === 1);
      }
    },
    // 更新指定位置的告警状态
    updateLocationAlarm(locationId, isAlarm) {
      const location = this.locations.find(loc => loc.id === locationId);
      if (location) {
        location.alarm = isAlarm;
      }
    }
  }
}
</script>

<style scoped>
.alarm3d-container {
  position: relative; /* 添加相对定位 */
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* 防止拖动时元素溢出容器 */
}

.alarm-svg {
  max-width:100%;
  max-height:100%;
  object-fit: contain;
}

.red-svg {
  position: absolute; /* 添加绝对定位 */
  width: 55px; /* 示例宽度 */
  height: 55px; /* 示例高度 */
}

.disposal-notice {
  position: absolute;
  padding: 5px 10px;
  background-color: rgba(10, 244, 250, 0.84);
  color: rgba(93, 255, 0, 0.84);
  font-size: 19px;
  font-weight: bold;
  border-radius: 5px;
  user-select: none;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
  white-space: nowrap; /* 防止文本换行 */
  min-width: 100px; /* 设置最小宽度 */
  text-align: center; /* 文本居中对齐 */
}

.red-svg {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.red-svg:hover {
  transform: scale(1.2);
}

.tooltip {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.85);
  color: #fff;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stats-table {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 100;
}

.stats-row {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background: linear-gradient(to right, rgba(0, 100, 255, 0.8), rgba(0, 100, 255, 0));
  border-radius: 8px;
  min-width: 250px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stats-label {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.stats-value {
  font-size: 20px;
  font-weight: bold;
  color: #00d4ff;
  margin-left: 10px;
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.6);
}

/* 告警闪烁动画 */
@keyframes alarm-blink {
  0%, 100% {
    opacity: 1;
    filter: drop-shadow(0 0 8px rgba(255, 0, 0, 0.8));
  }
  50% {
    opacity: 0.3;
    filter: drop-shadow(0 0 15px rgba(255, 0, 0, 1));
  }
}

.alarm-blink {
  animation: alarm-blink 1s ease-in-out infinite;
}
</style>