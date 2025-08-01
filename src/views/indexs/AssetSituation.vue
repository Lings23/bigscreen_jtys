<template>
  <div class="asset-overview">
    <div class="header">
      <button @click="showModal = true">资产详情</button>
    </div>
    <div class="content-row">
      <div class="asset-block" v-for="(group, index) in assets" :key="index">
        <img :src="require(`@/assets/img/${group.icon}`)" alt="icon" class="icon" />
        <div class="category">{{ group.label }}</div>
        <ul class="sub-assets">
          <li v-for="(sub, idx) in group.items" :key="idx">{{ sub.name }}：{{ sub.count }}</li>
        </ul>
      </div>
    </div>
    <!-- 弹窗表单 -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h3 class="modal-title">资产详情</h3>
        <div class="asset-table">
          <div class="table-header">
            <span>系统名称</span>
            <span>IP</span>
            <span>主管司局</span>
            <span>等保级别</span>
            <span>城市</span>
          </div>
          <div class="table-body">
            <div class="table-row" v-for="(item,index) in assetList" :key="index">
              <span>{{item.systemName}}</span>
              <span>{{item.ip}}</span>
              <span>{{item.department}}</span>
              <span>{{item.securityLevel}}</span>
              <span>{{item.city}}</span>
            </div>
          </div>
        </div>

        <button @click="showModal = false">关闭</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AssetOverview',
  data() {
    return {
      showModal: false,
      assets:[],
      assetList: [
        {
          systemName:'全国公路出行网',
          ip:'10.0.0.1',
          department:'公路局',
          city:'北京'
        },
        {
          systemName:'全国公路出行网2',
          ip:'10.0.0.2',
          department:'公路局',
          city:'北京'
        },
        {
          systemName:'全国公路出行网3',
          ip:'10.0.0.3',
          department:'公路局',
          city:'北京'
        },
        {
          systemName:'全国公路出行网4',
          ip:'10.0.0.4',
          department:'公路局',
          city:'北京'
        },
        {
          systemName:'全国公路出行网2',
          ip:'10.0.0.2',
          department:'公路局',
          city:'北京'
        },
        {
          systemName:'全国公路出行网3',
          ip:'10.0.0.3',
          department:'公路局',
          city:'北京'
        },
        {
          systemName:'全国公路出行网4',
          ip:'10.0.0.4',
          department:'公路局',
          city:'北京'
        },
        {
          systemName:'全国公路出行网2',
          ip:'10.0.0.2',
          department:'公路局',
          city:'北京'
        },
        {
          systemName:'全国公路出行网3',
          ip:'10.0.0.3',
          department:'公路局',
          city:'北京'
        },
        {
          systemName:'全国公路出行网4',
          ip:'10.0.0.4',
          department:'公路局',
          city:'北京'
        },
      ]
    }
  },
  methods: {
    fetchData() {
      // 模拟 API 数据
      this.assets = [
        {

          icon: 'network.png',
          items: [
            { name: '网络设备', count: this.getRandom() },
            { name: '安全设备', count: this.getRandom() },
            { name: '域名', count: this.getRandom() }
          ]
        },
        {

          icon: 'web.png',
          items: [
            { name: '中间件', count: this.getRandom() },
            { name: '服务', count: this.getRandom() },
            { name: '应用', count: this.getRandom() }
          ]
        },
        {

          icon: 'app.png',
          items: [
            { name: '网站', count: this.getRandom() },
            { name: '虚拟设备', count: this.getRandom() },
            { name: '端口', count: this.getRandom() }
          ]
        },
        {

          icon: 'data.png',
          items: [
            { name: '主机', count: this.getRandom() },
            { name: '数据库', count: this.getRandom() },
            { name: '操作系统', count: this.getRandom() }
          ]
        }
      ]
    },
    getRandom() {
      return Math.floor(Math.random() * 100)
    }
  },
  mounted() {
    this.fetchData()
    setInterval(this.fetchData, 120000) // 2分钟刷新
  }
}
</script>

<style scoped>
.asset-overview {
  padding: 10px;
}

.header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 10px;
}

.header span {
  font-size: 18px;
  font-weight: bold;
}

.header button {
  background: #0f1e2d;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.content-row {
  display: flex;
  justify-content: space-between;
  height: 250px;
  overflow: hidden;
  margin-top:40px;
}

.asset-block {
  width: 120px;
  text-align: center;
}

.icon {
  width: 40px;
  height: 40px;
  margin-bottom: 4px;
}

.category {
  font-weight: bold;
  margin-bottom: 6px;
}

.sub-assets {
  font-size: 15px;
  list-style: none;
  padding: 3px;
  margin: 0;
}

/* 弹窗样式 */
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
  min-height: 550px;
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
}
</style>
