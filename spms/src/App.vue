<template>
  <div id="app">
    <router-view></router-view>    
    <footerComponent v-show="FooterState"></footerComponent>
  </div>
</template>

<script>
import footerComponent from './components/footer.vue'
import { mapGetters } from 'vuex';
export default {
  name: 'app',
  components:{
    footerComponent
  },
  computed:{
    ...mapGetters([
      'FooterState'
    ])
  },
}
</script>

<style>
html,body {
  /*font-family: 'Microsoft YaHei';*/
  font-family: 'Hiragino Sans GB,Microsoft YaHei,\\5FAE\8F6F\96C5\9ED1,Arial,sans-serif'
}
#app {
  font-family: 'Hiragino Sans GB,Microsoft YaHei,\\5FAE\8F6F\96C5\9ED1,Arial,sans-serif';
  /*font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;*/
}
</style>
