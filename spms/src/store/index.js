import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  userData:null,         //当前登录用户的信息
  FooterState:true,      //页脚显示隐藏
}

const Actions = {
    changeFooter({commit},bol){
      commit('changeFooter',bol)
    },
    saveUserData({commit},json){
      commit('saveUserData',json)
    },
  }
const Mutations = {
  changeFooter(state,bol){   //用户信息
    state.FooterState = bol;
  },
  saveUserData(state,json){
    state.userData = json
  },
}

const Getters = {
  FooterState(state){
    return state.FooterState;
  },
  userData(state){
    return state.userData;
  }
}

export default new Vuex.Store({
  state:state,
  actions:Actions,
  mutations:Mutations,
  getters:Getters
})
