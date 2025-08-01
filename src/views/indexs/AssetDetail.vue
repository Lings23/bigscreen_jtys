<template>
  <div class="modal">
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
          <div class="table-row" v-for="(item, index) in assetList" :key="index">
            <span>{{ item.systemName }}</span>
            <span>{{ item.ip }}</span>
            <span>{{ item.department }}</span>
            <span>{{ item.securityLevel || '-' }}</span>
            <span>{{ item.city }}</span>
          </div>
        </div>
      </div>
      <button @click="$emit('close')">关闭</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AssetDetailModal',
  data(){
    return{
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

  }
  // props: {
  //   data: {
  //     type: Array,
  //     required: true
  //   }
  // }
}
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
