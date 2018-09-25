<template>
  <div>
    <HeaderComponent ></HeaderComponent>
    <section class="con-box text-center">
      
      <p class="result-p">
        <span class="result">提交成功</span>
      </p>
      <div class="page-title">
        <h1 class="tilte">
          <img src="../../assets/image/qslx.png" style="vertical-align: middle; margin-right: 15px;"/>
          {{fileName}}
        </h1>
      </div>
      <div class="code-div signResult">
        <div>
            <!-- <a class="lookDetail">查看详情</a>           -->
            <a href="javascript:;" @click="lookDetail">查看详情</a>
        </div>
        <span class="result-img">
          <img src="../../assets/image/daichuli_yinzhang.png">
        </span>
      </div>
    </section>
  </div>
</template>

<script>
import HeaderComponent from '../../../src/components/header.vue'
import axiosHttp from '../../assets/js/axiosHttp.js'
import URL from '../../assets/js/URL.js'

export default {
  // 扫码出现二维码
  name: 'signResult',
  components: {
    HeaderComponent
  },
  data () {
    return {
      fileName:this.$route.params.fileName,
      id:this.$route.params.id
    }
  },
  methods:{
    lookDetail(){  //详情页面
      this.$router.push({
          name:"Detail",
          params: { 
              id:this.id
          },
          query:{
            signType:1
          }
      });
    },
  },
  mounted() {
    // $(".form_datetime").datetimepicker({format: 'yyyy-mm-dd hh:ii'});
  }
}
</script>

<style lang="scss" scoped>

</style>
