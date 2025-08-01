/*
 * @Author: daidai
 * @Date: 2022-01-12 14:05:56
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-08-07 17:12:07
 * @FilePath: \web-pc\src\pages\big-screen\main.js
 */
import Vue from "vue";
import App from "./App.vue";
import router from './router'
import store from './store'
import {loading,borderBox13,digitalFlop,capsuleChart,borderBox8} from '@jiaminghi/data-view'
import { Radio,Button,RadioGroup } from 'element-ui'
import Echart from './components/echart/index.vue'
import ItemWrap from './components/item-wrap/item-wrap.vue'
import Message from './components/message/message.vue'
import Reacquire from './components/reacquire/reacquire.vue'
import Messages from './components/message/message'
import "vue-easytable/libs/theme-default/index.css";
import  '@/assets/css/public.scss'
import "@/assets/css/index.scss"
import { flylineChartEnhanced } from '@jiaminghi/data-view'

import * as filters from '@/directives/filters'

require('./mock/mock')//是否使用mock
Vue.config.productionTip = false;
Vue.use(flylineChartEnhanced)
// 自定义组件
Vue.component("Echart",Echart)
Vue.component("ItemWrap",ItemWrap)
Vue.component("Message",Message)
Vue.component("Reacquire",Reacquire)
Vue.prototype.$Message =  Messages
// element组件
Vue.use(Radio);
Vue.use(Button);
Vue.use(RadioGroup)

// datav组件
Vue.use(loading)
Vue.use(borderBox13)
Vue.use(borderBox8)
Vue.use(digitalFlop)
Vue.use(capsuleChart)
// 全局数据过滤器
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));

// 自动登录并存储 token（新版，接口为 /auth/screen-login，仅需用户名 screen）
async function autoLogin() {
  let token = localStorage.getItem('token');
  if (token) return token;
  const res = await fetch('/auth/screen-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'screen' }) // 只传用户名
  });
  const data = await res.json();
  if (data.token) {
    localStorage.setItem('token', data.token);
    return data.token;
  }
  throw new Error('自动登录失败');
}

// 全局 fetch 封装
export async function authFetch(url, options = {}) {
  let token = localStorage.getItem('token');
  if (!token) {
    token = await autoLogin();
  }
  options.headers = options.headers || {};
  options.headers.Authorization = 'Bearer ' + token;
  let res = await fetch(url, options);
  if (res.status === 401) {
    localStorage.removeItem('token');
    token = await autoLogin();
    options.headers.Authorization = 'Bearer ' + token;
    res = await fetch(url, options);
  }
  return res;
}

Vue.prototype.$authFetch = authFetch;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");