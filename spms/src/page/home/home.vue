<template>
  <div class="home">
     <HeaderComponent ></HeaderComponent>
      <!--<section class="_box-content">
       <img src="../../assets/image/home_bg.png" class="home-img" />
       <ul class="btn-group flex">
         <li class="btn-sm">
            <div class="item" @click="goPath('/sm')">
              <img src="../../assets/image/saomaqian.png" />
              <p class="bq">扫码签</p>
            </div>
         </li>
         <li class="btn-ts">
            <div class="item"  @click="goPath('/ts')">
              <img src="../../assets/image/tuisongqian.png" />
              <p class="bq">推送签</p>
            </div>
         </li>
       </ul>
     </section> -->
    <img src="../../assets/image/home_bg.png" class="home-img" />
    <section class="tag">
      <div class="item i-left">
          <img src="../../assets/image/saomaqian.png" class="img" @click="goPath('/sm')"/>
          <span class="word" @click="goPath('/sm')">扫码签</span>
      </div>
      <div class="item i-right">
          <img src="../../assets/image/tuisongqian.png" class="img" @click="goPath('/ts')"/>
          <span class="word" @click="goPath('/ts')">推送签</span>
      </div>
      <div class="item i-right">
          <img src="../../assets/image/duofangqian.png" class="img" @click="goPath('/sign')"/>
          <span class="word" @click="goPath('/sign')">多方签</span>
      </div>
      <div class="item i-right">
          <img src="../../assets/image/qianshujilu.png" class="img" @click="goPath('/record')"/>
          <span class="word" @click="goPath('/record')">签署记录</span>
      </div>
    </section>
     
  </div>
</template>

<script>

import HeaderComponent from '../../../src/components/header.vue'
import axiosHttp from '../../assets/js/axiosHttp.js'
import URL from '../../assets/js/URL.js'

export default {
  // 首页
  name: 'home',
  components: {
    HeaderComponent
  },
  data () {
    return {
       
    }
  },
  mounted() {
    // console.log(111);
    $('html,body').css('background-color','#fff'); //f3f3f4
    // this.isLogin(); //token有问题
  },
  destroyed() {
    $('html,body').css('background-color','#f3f3f4'); //f3f3f4
    
  },
  methods: {
    isLogin() {
      if(!sessionStorage.getItem("token")) {
        this.$router.push("/login"); 
        return;
      }
      let headers = {
        'token': sessionStorage.getItem("token")
      };    
      axiosHttp('post',URL['isLogin'],{'token': sessionStorage.getItem("token")},headers,(json)=> {
          if(json.code == -2)  {
            sessionStorage.removeItem("loginName");
            sessionStorage.removeItem("phoneNo");
            sessionStorage.removeItem("token"); //本地存储方式
            this.$router.push("/login"); 
          }else{
            console.log(json.msg);
          }
      });
    },
    goPath(path) {
      this.$router.push(path); 
    }
  },
}
</script>

<style lang="scss" scoped> 
</style>
