<template>
  <div class="headerC">
    <section class="h">
        <div class="h-left"><img src="../assets/image/ding_logo.png" @click="goHome"/></div>
        <!-- {{type}} -->
        <div class="h-right">

          <span v-for="m in menus">
              <router-link  :to='setPath(m.path)' class="item" :class="[(type && type == m.type) ? 'router-link-exact-active' : '' ]">
                {{m.text}}
              </router-link>
          </span>
          
          <a class="item user"> <span v-if="loginName">{{loginName}}</span> <span v-if="phoneNo">{{phoneNo}}</span> <span class="btn-close" @click="exit"><img src="../assets/image/tuichu.png" /></span></a>
        </div>
    </section>
  </div>
</template>

<script>
import axiosHttp from '../assets/js/axiosHttp.js'
import URL from '../assets/js/URL.js'
export default {
  // 头部
  name: 'header',
  components: {
    
  },
  data () {
    return {
      token: sessionStorage.getItem("token") ? sessionStorage.getItem("token") : '',
      loginName: sessionStorage.getItem("loginName") ? sessionStorage.getItem("loginName") : '',
      phoneNo: sessionStorage.getItem("phoneNo") ? sessionStorage.getItem("phoneNo") : '',
      
      type:'',
      menus: [
        {text: '首页',path: '/home',type: 301},  
        {text: '扫码签',path: '/sm',type: 101},  
        {text: '推送签',path: '/ts',type: 201},  
        {text:'多方签',path:'/sign',type:401},
        {text:'签署记录',path:'/record',type:501}
      ]
    }
  },
  mounted() {
    // this.isLogin();
   this.type = this.$route.meta.type;
  },
  destroyed() {},
  methods: {
    goHome() {
      this.$router.push("/home");
    },
    setPath(path) {
      return path;
    },
    isLogin() {
      if(!sessionStorage.getItem("token")) {
        this.$router.push("/login"); 
        return;
      }
      let headers = {
        'token': sessionStorage.getItem("token")
      };    
      axiosHttp('post',URL['isLogin'],{'token': sessionStorage.getItem("token")},headers,(json)=> {
        console.log(json)
          if(json.code == -2)  {
            sessionStorage.removeItem("loginName");
            sessionStorage.removeItem("phoneNo");
            sessionStorage.removeItem("token"); //本地存储方式
            this.$router.push("/login"); 
          }else{
             if(json.code == 0){
              console.log(json.content.loginPersonToken.sessionPerson)
              this.$store.dispatch('saveUserData',json.content.loginPersonToken.sessionPerson)
             }
          }
      });
    },
    // 退出登录
    exit() {
      
      let that = this;
      swal({
            title: "",
            text: "确定退出登录？",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#D61400",
            confirmButtonText: "确定",
            cancelButtonText: "取消",
        },() =>  {
            let headers = {
               'token': sessionStorage.getItem("token")
            };
            axiosHttp('post',URL["logout"],{},headers,(json) => {
                if(json.code == 0 || json.code == -2)  {
                  sessionStorage.removeItem("loginName");
                  sessionStorage.removeItem("phoneNo");
                  sessionStorage.removeItem("token"); //本地存储方式
                  that.$router.push("/login"); 
                }else{
                   
                }
      
            });

      });
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
