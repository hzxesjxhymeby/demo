//状态管理配置()

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: JSON.parse(sessionStorage.getItem("token")) ? JSON.parse(sessionStorage.getItem("token")) : "",
        user: JSON.parse(sessionStorage.getItem("user")) ? JSON.parse(sessionStorage.getItem("user")) : {}
    },
    mutations: {
        setInfo(state) { //设置数据
            let token = JSON.parse(sessionStorage.getItem("token")) ? JSON.parse(sessionStorage.getItem("token")) : "";
            let user = JSON.parse(sessionStorage.getItem("user")) ? JSON.parse(sessionStorage.getItem("user")) : {};
            state.token = token;
            state.user = user;
        },
        clearInfo(state) { //清除数据
            state.token = "";
            state.user = {}

        }
    }

})