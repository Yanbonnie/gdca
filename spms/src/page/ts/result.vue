<template>
  <div>
    <HeaderComponent ></HeaderComponent>
    <section class="con-box text-center">
      <p class="result-p">
        <span class="result">推送成功</span>
      </p>

      <div class="page-title">
        <h1 class="tilte">
          <img src="../../assets/image/qslx.png" style="vertical-align: middle; margin-right: 15px;"/>
          {{fileName}}
        </h1>
      </div>

      <div class="code-div">
        <div v-if="resultStr == 3" class="result-div pending">
          <p class="word ">处理人：{{doer}}  {{phone}}</p>
        </div>
        <div v-if="resultStr == 2" class="result-div fail">
          <p class="word ">处理人：{{doer}}  {{phone}}</p>
        </div>
        <div  v-if="resultStr == 1" class="result-div sus">
          <p class="word ">处理人：{{doer}}  {{phone}}</p>
          <p class="down" @click="downFile">下载 已签署文件《{{fileName}}》</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import HeaderComponent from '../../../src/components/header.vue'
import axiosHttp from '../../assets/js/axiosHttp.js'
import URL from '../../assets/js/URL.js'

export default {
  // 推送
  name: 'code',
  components: {
    HeaderComponent
  },
  data () {
    return {
       id: '',
       uuid: '',
       fileName: '',
       advR: null,//定时器

       flag: false,

       doer: '', //用户名
       phone: '', //手机号
       resultStr: 3,//1是同意 2是拒绝 3是待审核 4是还没扫码
    }
  },
  created() {

  },
  mounted() {
    this.id = this.$route.params.id;
    this.uuid = this.$route.params.uuid;
    this.fileName = this.$route.params.fileName;
    
    this.resultFn(); //清除2s后请求数据
    this.advFn();
  },
  destroyed() {
    clearInterval(this.advR);
  },
  methods: {
    advFn() {
      this.advR = setInterval(()=> {
        this.resultFn();
      },2000);
      
    },

    resultFn() {
      let headers = {
        'token': sessionStorage.getItem("token")
      };
      let data = new Buffer(JSON.stringify({id: this.id,'token': sessionStorage.getItem("token")})).toString("base64");
      axiosHttp('post',URL['signResult_getSignInfoStatus'],{data: data},headers,(json) => {
        if(json.code == 0) {
          this.doer = json.content.doer;
          this.phone = json.content.phone;

          if(json.content.signStatus == 0) { //未认领
            this.resultStr = 4;
          }else if(json.content.signStatus == 1) { //正在处理
            this.resultStr = 3;
            // this.doer = json.content.doer;
            // this.phone = json.content.phone;
          }else if(json.content.signStatus == 2) { //完毕
            if(json.content.signResult == 1) { //同意
              this.resultStr = 1;
              // this.doer = json.content.doer;
              // this.phone = json.content.phone;
              clearInterval(this.advR);
            }else if(json.content.signResult == 2) { //拒绝
              this.resultStr = 2;
              // this.doer = json.content.doer;
              // this.phone = json.content.phone;
              clearInterval(this.advR);
            }
          }
        }else if(json.code == -2) {
          // 跳到登录
          this.$router.push("/login"); 
        }else {
          clearInterval(this.advR);
        }
      });
    },
    downFile() {
      let baseUrl = this.configUrl;
      location.href = baseUrl + URL['signResult_downloadPdf']+'?id=' + this.id;
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
