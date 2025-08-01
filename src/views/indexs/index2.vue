<template>
  <div class="contents">
    <div class="contetn_left">
      <div class="pagetab"></div>

      <ItemWrap class="contetn_left-top contetn_l1-item" title="资产情况">
        <LeftTop/>
        <button class="more-button" @click="showAssetDetail = true">资产详情</button>
      </ItemWrap>
      <AssetDetail v-if="showAssetDetail" @close="showAssetDetail = false" />

      <ItemWrap class="contetn_left-top contetn_l2-item" title="设备总览">
        <LeftFourth />
      </ItemWrap>

      <ItemWrap class="contetn_left-center contetn_l3-item" title="漏洞扫描统计">
        <LeftCenter />
      </ItemWrap>

      <ItemWrap
          class="contetn_left-bottom contetn_l4-item"
          title="漏洞情况列表"
          style="padding: 0 10px 16px 10px"
      >
        <LeftBottom />
        <button class="more-button" @click="showSecurityForm = true">查看更多</button>
      </ItemWrap>

      <SecurityForm v-if="showSecurityForm" @close="showSecurityForm = false" />
    </div>

    <div class="contetn_center">
      <CenterMapChange class="contetn_center_top" />

      <ItemWrap class="contetn_center-middle " title="攻击监测情况">
        <EmptyBlock />
      </ItemWrap>

      <ItemWrap class="contetn_center-bottom" title="攻击情况分析">
        <CenterBottom />
      </ItemWrap>
    </div>

    <div class="contetn_right">
      <ItemWrap class="contetn_left-bottom contetn_lr-item" title="报警次数">
        <RightTop />
      </ItemWrap>

      <ItemWrap class="contetn_left-bottom contetn_lr-item" title="报警排名(TOP10)" style="padding: 0 10px 16px 10px">
        <RightCenter />
      </ItemWrap>
      <div class="between-switch">
        <button :class="{active:activeTab==='event'}" @click="activeTab='event'">安全事件</button>
        <button :class="{active:activeTab==='duty'}" @click="activeTab='duty'">值班列表</button>
        <button :class="{active:activeTab==='score'}" @click="activeTab='score'">风险评分</button>
      </div>
      <ItemWrap class="contetn_left-bottom contetn_lr-item" :title="getTitle">
        <component :is="getComponent"/>
        <button class="more-button" @click="showSecurityForm = true">查看更多</button>
      </ItemWrap>

      <SecurityForm v-if="showSecurityForm" @close="showSecurityForm = false" />
    </div>
  </div>
</template>


<script>
import LeftTop from './AS2.vue';
import LeftFourth from './left-top.vue';
import LeftCenter from "./V2.vue";
import LeftBottom from "./PenetrationTest.vue";
import EmptyBlock from "./FL-Attack.vue";
import CenterMapChange from "./FCE2.vue";
import CenterBottom from "./AA2.vue";
import RightTop from "./AlarmLineChart.vue";
import RightCenter from "./AlarmSort.vue";
import RightBottom from "./SL2.vue";
import SecurityForm from "./SecurityForm.vue";
import AssetDetail  from "./AssetDetail.vue";
import DutyTable from "./DutyForm.vue";
import ScoreTable from "./ScoreTable.vue";

export default {
  computed: {
    getTitle() {
      switch (this.activeTab) {
        case 'event':
          return '安全事件列表';
        case 'duty':
          return '值班情况列表';
        case 'score':
          return '风险评分列表';
        default:
          return '列表';
      }
    },
    getComponent() {
      switch (this.activeTab) {
        case 'event':
          return 'RightBottom';
        case 'duty':
          return 'DutyTable';
        case 'score':
          return 'ScoreTable';
        default:
          return 'DutyTable'; // fallback
      }
    },
  },
  components: {
    LeftTop,
    LeftCenter,
    LeftBottom,
    LeftFourth,
    EmptyBlock,
    CenterMapChange,
    RightTop,
    RightCenter,
    RightBottom,
    CenterBottom,
    SecurityForm,
    AssetDetail,
    DutyTable,
    ScoreTable,
  },
  data() {
    return {
      showSecurityForm: false,
      showAssetDetail: false,
      activeTab:'event',
    };
  },
};

</script>


<style lang="scss" scoped>
.contents {
  height:100%;
  display: flex;
  .contetn_left{
    width: 540px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    max-height: 990px;
    gap: 0px;
  }
  .contetn_right {
    width: 540px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    max-height: 990px;
  }

  .contetn_center {
    width: 720px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    max-height: 990px;
    gap: 2px;
  }
  .contetn_l1-item{
    height: 180px;
    //margin-bottom: 2px;
  }
  .contetn_l2-item{
    height: 220px;
    //margin-bottom: 80px;
  }
  .contetn_l3-item {
    height: 270px;
    //margin-bottom: 40px;
  }
  .contetn_l4-item{
    height: 300px;
    //margin-bottom: 20px;
  }
  .contetn_lr-item {
    height: 310px;
    margin-bottom: 2px;
  }

  .contetn_center_top {
    width: 100%;
  }

  .contetn_center-middle {
    height: 180px;

  }

  .contetn_center-bottom {
    height: 250px;

  }


}

.more-button {
  position: absolute;
  top: 12px;
  right: 14px;
  background: transparent;
  color: #3d7ef6;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
  box-shadow: none;

  &:hover {
    background: transparent;
  }
}
.between-switch {
  display: flex;
  justify-content: center;
  gap: 0px;
  z-index: 1;

  button {
    padding: 6px 14px;
    background-color: rgba(255, 255, 255, 0.08);
    border: none;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;

    &.active {
      background-color: #409EFF;
    }
  }
}

@keyframes rotating {
  0% {
    transform: rotate(0) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.1);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}
</style>
