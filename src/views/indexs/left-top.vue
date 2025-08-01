<!--
 * @Author: daidai
 * @Date: 2022-02-28 16:16:42
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-20 17:57:11
 * @FilePath: \web-pc\src\pages\big-screen\view\indexs\left-center.vue
-->
<template>
    <ul class="user_Overview flex" v-if="pageflag">
        <li class="user_Overview-item" style="color: #00fdfa">
            <div class="user_Overview_nums allnum ">
                <dv-digital-flop :config="config" style="width:100%;height:100%;" />
            </div>
            <p>总设备数</p>
        </li>
        <li class="user_Overview-item" style="color: #07f7a8">
            <div class="user_Overview_nums online">
                <dv-digital-flop :config="onlineconfig" style="width:100%;height:100%;" />
            </div>
            <p>在线数</p>
        </li>
        <li class="user_Overview-item" style="color: #e3b337">
            <div class="user_Overview_nums offline">
                <dv-digital-flop :config="offlineconfig" style="width:100%;height:100%;" />

            </div>
            <p>掉线数</p>
        </li>
        <li class="user_Overview-item" style="color: #f5023d">
            <div class="user_Overview_nums laramnum">
                <dv-digital-flop :config="laramnumconfig" style="width:100%;height:100%;" />
            </div>
            <p>告警次数</p>
        </li>
    </ul>
    <Reacquire v-else @onclick="getData" line-height="200px">
        重新获取
    </Reacquire>
</template>

<script>
let style = {
    fontSize: 24
}
export default {
    data() {
        return {
            pageflag: true,
            timer: null,
            config: {
                number: [0],
                content: '{nt}',
                style: {
                    ...style,
                    fill: "#00fdfa",
                },
            },
            onlineconfig: {
                number: [0],
                content: '{nt}',
                style: {
                    ...style,
                    fill: "#07f7a8",
                },
            },
            offlineconfig: {
                number: [0],
                content: '{nt}',
                style: {
                    ...style,
                    fill: "#e3b337",
                },
            },
            laramnumconfig: {
                number: [0],
                content: '{nt}',
                style: {
                    ...style,
                    fill: "#f5023d",
                },
            }
        };
    },
    created() {
        this.getData();
        this.startTimer();
    },
    beforeDestroy() {
        this.clearTimer();
    },
    methods: {
        clearTimer() {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
        },
        // 获取最新数据
        getLatestData(data) {
            if (!Array.isArray(data)) return data;
            return data.reduce((latest, item) => {
                if (!latest || new Date(item.statTime) > new Date(latest.statTime)) {
                    return item;
                }
                return latest;
            }, null);
        },
        async getData() {
            try {
                this.pageflag = true;
                const res = await this.$authFetch('/api/stat/device');
                const data = await res.json();
                const latestData = this.getLatestData(data);
                
                if (latestData) {
                    const totalNum = latestData.onlineCount + latestData.offlineCount;
                    
                    // 更新总数
                    this.config = {
                        ...this.config,
                        number: [totalNum]
                    };
                    
                    // 更新在线数
                    this.onlineconfig = {
                        ...this.onlineconfig,
                        number: [latestData.onlineCount]
                    };
                    
                    // 更新离线数
                    this.offlineconfig = {
                        ...this.offlineconfig,
                        number: [latestData.offlineCount]
                    };
                    
                    // 更新告警数
                    this.laramnumconfig = {
                        ...this.laramnumconfig,
                        number: [latestData.alarmCount]
                    };
                }
            } catch (e) {
                console.error('获取设备统计数据失败:', e);
                this.pageflag = false;
            }
        },
        startTimer() {
            this.clearTimer();
            this.timer = setInterval(() => {
                this.getData();
            }, 120000); // 2分钟刷新一次
        }
    }
};
</script>
<style lang='scss' scoped>
.user_Overview {
    li {
        flex: 1;

        p {
            text-align: center;
            height: 14px;
            font-size: 15px;
            margin-top: 8px ;
        }

        .user_Overview_nums {
            width: 100px;
            height: 100px;
            text-align: center;
            line-height: 100px;
            font-size: 22px;
            margin-top: 20px;
            margin-left: 15px;
            background-size: cover;
            background-position: center center;
            position: relative;

            &::before {
                content: '';
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
            }

            &.bgdonghua::before {
                animation: rotating 14s linear infinite;
            }
        }

        .allnum {

            // background-image: url("../../assets/img/left_top_lan.png");
            &::before {
                background-image: url("../../assets/img/left_top_lan.png");

            }
        }

        .online {
            &::before {
                background-image: url("../../assets/img/left_top_lv.png");

            }
        }

        .offline {
            &::before {
                background-image: url("../../assets/img/left_top_huang.png");

            }
        }

        .laramnum {
            &::before {
                background-image: url("../../assets/img/left_top_hong.png");

            }
        }
    }
}
</style>