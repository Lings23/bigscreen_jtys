<!--
 * @Author: daidai
 * @Date: 2022-03-04 09:23:59
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-05-07 11:05:02
 * @FilePath: \web-pc\src\pages\big-screen\view\indexs\index.vue
-->
<template>
  <div class="contents">
    <div class="contetn_left">
      <div class="pagetab">
        <!-- <div class="item">实时监测</div> -->

      </div>
      <ItemWrap class="contetn_left-top contetn_lr-item" title="资产情况">
        <LeftTop/>

      </ItemWrap>
<!--      <ItemWrap  title="设备总览">-->
<!--        <LeftFourth/>-->
<!--      </ItemWrap>-->
      <ItemWrap class="contetn_left-center contetn_lr-item" title="漏洞扫描统计">
      <LeftCenter />
    </ItemWrap>
      <ItemWrap
          class="contetn_left-bottom contetn_lr-item"
          title="渗透测试情况"
          style="padding: 0 10px 16px 10px"
      >
        <LeftBottom />
        <button class="more-button" @click="showSecurityForm = true">
          查看更多</button>
      </ItemWrap>
      <SecurityForm v-if="showSecurityForm" @close="showSecurityForm = false" />



    </div>
    <div class="contetn_center">
      <CenterMapChange class="contetn_center_top" />
      <ItemWrap class="contetn_center-bottom" title="攻击情况分析">
        <CenterBottom />
      </ItemWrap>
    </div>
    <div class="contetn_right">
      <ItemWrap
        class="contetn_left-bottom contetn_lr-item"
        title="报警次数"
      >
        <RightTop />
      </ItemWrap>
      <ItemWrap
        class="contetn_left-bottom contetn_lr-item"
        title="报警排名(TOP10)"
        style="padding: 0 10px 16px 10px"
      >
        <RightCenter />
      </ItemWrap>
      <div class="between-switch">
        <button :class="{active:activeTab==='event'}" @click="activeTab='event'">安全事件</button>
        <button :class="{active:activeTab==='duty'}" @click="activeTab='duty'">值班列表</button>
      </div>
      <ItemWrap class="contetn_left-bottom contetn_lr-item" :title="activeTab==='event'?'安全事件列表':'值班情况列表'">
        <component :is="activeTab==='event'?'RightBottom':'DutyTable'"/>
        <button class="more-button" @click="showSecurityForm = true">查看更多</button>
      </ItemWrap>

      <SecurityForm v-if="showSecurityForm" @close="showSecurityForm = false" />
    </div>
  </div>
</template>

<script>
import LeftTop from './AssetSituation.vue';
import LeftFourth from './left-top.vue';
import LeftCenter from "./Vulnerability.vue";
import LeftBottom from "./PenetrationTest.vue";
import CenterMap from "./center-map.vue";
import CenterMapChange from "./FlylineChartEnhanced.vue";
import CenterBottom from "./AttackAnysis.vue";
import RightTop from "./AlarmLineChart.vue";
import RightCenter from "./AlarmSort.vue";
import RightBottom from "./SecurityList.vue";
import SecurityForm from "./SecurityForm.vue";
import DutyTable from "./DutyForm.vue";

export default {
  components: {
    LeftTop,
    LeftCenter,
    LeftBottom,
    LeftFourth,
    CenterMapChange,
    RightTop,
    RightCenter,
    RightBottom,
    CenterBottom,
    SecurityForm,
    DutyTable,
  },
  data() {
    return {
      showSecurityForm: false, // 控制安全事件表单的显示
      activeTab:'event',
    };
  },
  filters: {
    numsFilter(msg) {
      return msg || 0;
    },
  },
  created() {
  },

  mounted() {},
  methods: {
  
  },
};
</script>
<style lang="scss" scoped>
// 内容
.contents {
  .contetn_left,
  .contetn_right {
    width: 540px;
    box-sizing: border-box;
    // padding: 16px 0;
  }

  .contetn_center {
    width: 720px;
  }

  //左右两侧 三个块
  .contetn_lr-item {
    height: 310px;
  }

  .contetn_center_top {
    width: 100%;
  }

  // 中间
  .contetn_center {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  .contetn_center-bottom {
    height: 315px;
  }

  //左边 右边 结构一样
  .contetn_left,
  .contetn_right {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    position: relative;

  
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
        -webkit-transform: rotate(0) scale(1);
        transform: rotate(0) scale(1);
    }
    50% {
        -webkit-transform: rotate(180deg) scale(1.1);
        transform: rotate(180deg) scale(1.1);
    }
    100% {
        -webkit-transform: rotate(360deg) scale(1);
        transform: rotate(360deg) scale(1);
    }
}
</style>
