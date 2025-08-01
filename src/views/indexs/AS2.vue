<template>
  <div class="asset-overview">
    <div class="content-row">
      <div class="asset-block" v-for="(group, index) in assets" :key="index">
        <img :src="require(`@/assets/img/${group.icon}`)" alt="icon" class="icon" />
        <div class="category">{{ group.label }}</div>
        <ul class="sub-assets">
          <li v-for="(sub, idx) in group.items" :key="idx">{{ sub.name }}：{{ sub.count }}</li>
        </ul>
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
    }
  },
  methods: {
    async fetchData() {
      try {
        const res = await this.$authFetch('/api/stat/asset');
        const data = await res.json();
        // 只取statDate最新的一条
        let d = {};
        if (Array.isArray(data) && data.length) {
          d = data.reduce((latest, item) => {
            if (!latest) return item;
            return new Date(item.statDate || item.stat_date) > new Date(latest.statDate || latest.stat_date) ? item : latest;
          }, null);
        }
        this.assets = [
          {
            icon: 'network.png',
            label: '网络安全',
            items: [
              { name: '网络设备', count: d.networkDevice || 0 },
              { name: '安全设备', count: d.securityDevice || 0 },
              { name: '域名', count: d.domainName || 0 }
            ]
          },
          {
            icon: 'web.png',
            label: '应用服务',
            items: [
              { name: '中间件', count: d.middleware || 0 },
              { name: '服务', count: d.service || 0 },
              { name: '应用', count: d.application || 0 }
            ]
          },
          {
            icon: 'app.png',
            label: '网站与端口',
            items: [
              { name: '网站', count: d.website || 0 },
              { name: '虚拟设备', count: d.virtualDevice || 0 },
              { name: '端口', count: d.port || 0 }
            ]
          },
          {
            icon: 'data.png',
            label: '主机与数据库',
            items: [
              { name: '主机', count: d.host || 0 },
              { name: '数据库', count: d.databaseCount || 0 },
              { name: '操作系统', count: d.osCount || 0 }
            ]
          }
        ]
      } catch (e) {
        this.assets = [];
      }
    },
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

.content-row {
  display: flex;
  justify-content: space-between;
  height: 180px;
  overflow: hidden;
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
</style>
