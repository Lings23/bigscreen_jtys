<template>
  <div class="modal" @click.self="$emit('close')">
    <div class="modal-content">
      <h3 class="modal-title">安全事件详情</h3>
      <div class="asset-table">
        <div class="table-header">
          <span>事件名称</span>
          <span>时间</span>
          <span>影响资产</span>
          <span>等级</span>
          <span>状态</span>
        </div>
        <div class="table-body">
          <div class="table-row" v-for="(item, index) in eventList" :key="index">
            <span>{{ item.name }}</span>
            <span>{{ item.time }}</span>
            <span>{{ item.asset }}</span>
            <span>{{ item.level }}</span>
            <span>{{ item.status }}</span>
          </div>
        </div>
      </div>

      <button @click="$emit('close')">关闭</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SecurityForm',
  props: [],
  data() {
    return {
      eventList: [
        {
          name: 'SQL注入攻击',
          time: '2025-06-25 09:00',
          asset: '10.0.0.1',
          level: '高',
          status: '处理中'
        },
        {
          name: '端口扫描',
          time: '2025-06-24 14:35',
          asset: '10.0.0.2',
          level: '中',
          status: '已处理'
        },
        {
          name: '木马上传',
          time: '2025-06-24 11:15',
          asset: '10.0.0.3',
          level: '高',
          status: '处理中'
        },
        {
          name: '木马上传',
          time: '2025-06-24 11:15',
          asset: '10.0.0.3',
          level: '高',
          status: '处理中'
        },
        {
          name: '木马上传',
          time: '2025-06-24 11:15',
          asset: '10.0.0.3',
          level: '高',
          status: '处理中'
        },
        {
          name: '木马上传',
          time: '2025-06-24 11:15',
          asset: '10.0.0.3',
          level: '高',
          status: '处理中'
        },
        {
          name: '木马上传',
          time: '2025-06-24 11:15',
          asset: '10.0.0.3',
          level: '高',
          status: '处理中'
        },
        {
          name: '木马上传',
          time: '2025-06-24 11:15',
          asset: '10.0.0.3',
          level: '高',
          status: '处理中'
        },

        {
          name: '恶意访问',
          time: '2025-06-23 18:05',
          asset: '10.0.0.4',
          level: '低',
          status: '已关闭'
        },
        {
          name: 'SQL注入攻击',
          time: '2025-06-25 09:00',
          asset: '10.0.0.1',
          level: '高',
          status: '处理中'
        },
        {
          name: '端口扫描',
          time: '2025-06-24 14:35',
          asset: '10.0.0.2',
          level: '中',
          status: '已处理'
        },
        {
          name: '木马上传',
          time: '2025-06-24 11:15',
          asset: '10.0.0.3',
          level: '高',
          status: '处理中'
        },
        {
          name: '木马上传',
          time: '2025-06-24 11:15',
          asset: '10.0.0.3',
          level: '高',
          status: '处理中'
        },
        {
          name: '木马上传',
          time: '2025-06-24 11:15',
          asset: '10.0.0.3',
          level: '高',
          status: '处理中'
        },
        {
          name: '木马上传',
          time: '2025-06-24 11:15',
          asset: '10.0.0.3',
          level: '高',
          status: '处理中'
        },
        {
          name: '木马上传',
          time: '2025-06-24 11:15',
          asset: '10.0.0.3',
          level: '高',
          status: '处理中'
        },
        {
          name: '木马上传',
          time: '2025-06-24 11:15',
          asset: '10.0.0.3',
          level: '高',
          status: '处理中'
        },

        {
          name: '恶意访问',
          time: '2025-06-23 18:05',
          asset: '10.0.0.4',
          level: '低',
          status: '已关闭'
        },
        {
          name: 'SQL注入攻击',
          time: '2025-06-25 09:00',
          asset: '10.0.0.1',
          level: '高',
          status: '处理中'
        },
        {
          name: '端口扫描',
          time: '2025-06-24 14:35',
          asset: '10.0.0.2',
          level: '中',
          status: '已处理'
        },
        {
          name: '木马上传',
          time: '2025-06-24 11:15',
          asset: '10.0.0.3',
          level: '高',
          status: '处理中'
        },
        {
          name: '木马上传',
          time: '2025-06-24 11:15',
          asset: '10.0.0.3',
          level: '高',
          status: '处理中'
        },
        {
          name: '木马上传',
          time: '2025-06-24 11:15',
          asset: '10.0.0.3',
          level: '高',
          status: '处理中'
        },
        {
          name: '木马上传',
          time: '2025-06-24 11:15',
          asset: '10.0.0.3',
          level: '高',
          status: '处理中'
        },
        {
          name: '木马上传',
          time: '2025-06-24 11:15',
          asset: '10.0.0.3',
          level: '高',
          status: '处理中'
        },
        {
          name: '木马上传',
          time: '2025-06-24 11:15',
          asset: '10.0.0.3',
          level: '高',
          status: '处理中'
        },

        {
          name: '恶意访问',
          time: '2025-06-23 18:05',
          asset: '10.0.0.4',
          level: '低',
          status: '已关闭'
        }
      ]
    };
  }
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
}

.modal-content {
  background-color: #1f2a44;
  color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  width: 700px;
  height: 700px;
  overflow: auto;
  z-index: 100;
  position: relative;
}

.modal-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 12px;
  text-align: center;
}

.asset-table {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.table-header {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  font-weight: bold;
  border-bottom: 2px solid #1e90ff;
}

.table-body {
  max-height: 550px;
  overflow-y: auto;
  min-height:550px;
  flex: 1;
}

.table-body::-webkit-scrollbar {
  width: 6px;
}

.table-body::-webkit-scrollbar-thumb {
  background-color: #1e90ff;
  border-radius: 3px;
}

.table-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #3a74a5;
  color: #d4eaff;
}

.table-row span,
.table-header span {
  flex: 1;
  text-align: center;
}

.modal-content button {
  margin-top: 30px;
  background: #0b7285;
  color: #fff;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
