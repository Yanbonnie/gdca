<template>
  <div class="login-bg">
    <header class="header">
      <img src="../../assets/image/zhenyiqian_logo_l.png" height="28" width="85" class="logo" />
    </header>

    <section v-if="flag" class="login-box">
      <div class="code-wrap">
        <img v-if="qRCodeBase64" :src="'data:image/png;base64,'+qRCodeBase64" alt="二维码" class="code" width="auto" height="auto" />
        <div class="refreshBox" v-if="refreshState">
          <a href="javascript:;" @click="refreshHandle">刷新二维码</a>
        </div>
      </div>
      <p class="use">使用手机真宜签扫码登录</p>
      <p class="tip">网页版真宜签需要配合手机使用</p>
    </section>

    <section v-if="!flag" class="login-box">
       <p class="name"> {{loginName}} </p>
       <p class="tip"> {{phoneNo}} </p>
       <hr class="line" />
       <p class="su" style="margin-bottom: 25px;">扫码成功</p>
       <p class="use">请在手机上点击确认登录</p>
       <span class="btn-switch" @click="setFlag">切换账号</span>
    </section>

    <footer class="footer">
      <a href="https://www.google.cn/chrome/browser/desktop/index.html#" target="_blank" class="f-left" title="直接点击下载谷歌 Google chrome">所支持浏览器【谷歌 Google chrome 或 360浏览器 极速模式】</a>
      <p class="f-right">版权所有©数安时代科技股份有限公司2002-2017  保留一切权利</p>
    </footer>
  </div>
</template>

<script>
import axiosHttp from '../../assets/js/axiosHttp.js'
import URL from '../../assets/js/URL.js'
export default {
  // 登录
  name: 'login',
  components: {
    
  },
  data () {
    return {
        flag: true,
         // imgUrl: window.location.host == 'localhost:8080' ? '/sysdemo/':'',
        advQRCode: null,//生成二维码的定时器
        advProgress: null,//验证登录的定时器

        qRCodeBase64: '',
        claimTaskId: '',

        qrStatus: 0,//0未过期   888888标示已经任务认领，可进入提示页面
        signStatus:0, // 签署状态 为1标示手机端正在处理，2标示手机端处理完毕
        signResult: '', //签署结果 1标示同意登入 2或者其他标示不同意登入取消登入

        loginName: '', // 登入用户名称
        phoneNo: '', // 登入用户手机号

        claimTaskIdB64: '',
        refreshState:false,    //刷新二维码状态
    }
  },
 
  mounted() {
    this.generateQRcode({});

    $('.footer').css('background-color','transparent');  
    
  },
  beforeDestroy() {
    clearInterval(this.advProgress);
    // console.log("beforeDestroy");
  },
  destroyed() {
    clearInterval(this.advProgress);
    $('.footer').css('background-color','#ecebeb');
    // console.log("destroyed");
  },
  methods: {
    setFlag() {
      // this.flag = true;
      // clearInterval(this.advProgress);
      // this.generateQRcode({});
      // console.log(this.claimTaskIdB64);
      axiosHttp('post',URL['login_changeAccount'],{data: this.claimTaskIdB64},null,(json) => {
          if(json.code == 0) {
            this.flag = true;
            clearInterval(this.advProgress);
            this.generateQRcode({});
          }else if(json.code == 500013) {
            swal({
                title: "警告",
                type: 'error',
                text: '服务器繁忙！切换失败！请稍后再试！',
                timer: 3000,
                showConfirmButton: false
            }); 
          }
      });
    },
    refreshHandle(){  //刷新二维码
      this.generateQRcode({});
    },
    // 生产二维码
    generateQRcode(param) {
      this.refreshState = false;
      axiosHttp('post',URL['login_generateQRcode'],param,null,(json) => {
        if(json.code == 0) {
          this.qRCodeBase64 = "";
          this.qRCodeBase64 = json.content.qRCodeBase64;
          this.claimTaskId = json.content.claimUuid;

          // console.log("this.claimTaskId="+this.claimTaskId);
          /*Date.parse(new Date())/1000*/
          let timestamp = Date.parse(new Date())/1000;
          this.claimTaskIdB64 = "";
          this.claimTaskIdB64 = new Buffer(JSON.stringify({claimTaskId: this.claimTaskId,timestamp:timestamp})).toString("base64");
            // 暂时不刷新进度
          this.advProgress = setInterval(()=> {
              this.getProgress({
                data: this.claimTaskIdB64
              });
          },1000);
        
        }else {

        }
      });
    },
    getProgress(param) {
      axiosHttp('post',URL['login_getProgress'],param,null,(json) => {
        if(json.code == 0) {
            this.loginName = json.content.loginName;
            this.phoneNo = json.content.phoneNo;
            if(json.content.qrStatus == 0) {
                this.flag = true;  
                return;
            }else if(json.content.qrStatus == 888888) {
              this.flag = false;
              if(json.content.signStatus == 1) { //手机处理中

              }else if(json.content.signStatus == 2) {//手机处理完毕
                
                if(json.content.signResult == 1) {//同意
                    // ie不能访问
                    if(window.navigator.userAgent.indexOf('compatible') != -1){
                      swal({
                          title: "",
                          text: "签署平台仅支持浏览器【谷歌Google chrome 或 360极速模式】",
                          type: "warning"
                      },()=> {
                         // 
                      });
                      return;
                    }


                    sessionStorage.setItem("token",json.content.token);
                    sessionStorage.setItem("loginName",json.content.loginName);
                    sessionStorage.setItem("phoneNo",json.content.phoneNo);

                    clearInterval(this.advProgress);
                    this.$router.push("/home"); 
                }else if(json.content.signResult == 2) {//取消登录
                  this.flag = true;
                  this.refreshState = true;
                  clearInterval(this.advProgress);
                  // this.generateQRcode({});
                  return;
                }
              }
            }else {
              // console.log('code 是其他值');
              this.flag = true;
              this.refreshState = true;
              clearInterval(this.advProgress);
              // this.generateQRcode({});
            }
            
        }else {
          this.flag = true;
          clearInterval(this.advProgress);
        }
      });
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
