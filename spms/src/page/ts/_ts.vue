<template>
  <div>
     <HeaderComponent ></HeaderComponent>
     <section class="con-box text-center">
        
        <input type="file" id="file" class="filestyle" />

        <div class="dashed flex">
          <span class="icon title"></span>
          <!-- <p></p> -->
          <input type="text" placeholder="单击输入签署文件主题" class="input"  autofocus="autofocus" v-model="signTitle"/>
        </div>

        <div class="dashed flex">
          <span class="icon phone"></span>
          <!-- <p></p> -->
          <input type="text" placeholder="单击输入分配手机号码" class="input"  autofocus="autofocus" v-model="doerPhoneNo" @keyup="checkPhone"/>
        </div>

        <div class="dashed" style="padding: 84px 0;" id="drop_area">
           <img v-if="!isImg" src="../../assets/image/shangchuan.png"  class="upfile"/>
           <img v-if="isImg" src="../../assets/image/file_pdf.png"  class="upfile"/>
           <p class="up-word" id="upword">请上传需要签署的PDF文件</p>
           <p class="mark">*点击选择上传文件或拖动文件到此处</p>
        </div>

        <div class="btn-sub active" id="canSub" @click="upFn()">提交</div>
    </section>
    <div v-if="canSub" class="ceng"></div>
    <Loading v-if="canSub" :tip="tip"></Loading>
  </div>
</template>

<script>
import HeaderComponent from '../../../src/components/header.vue'
import axiosHttp from '../../assets/js/axiosHttp.js'
import URL from '../../assets/js/URL.js'
import Loading from '../../components/loading.vue'

export default {
  // 推送
  name: 'ts',
  components: {
    HeaderComponent,
    Loading
  },
  data () {
    return {
       signTitle: '',
       doerPhoneNo: '',
       signFile: {},
       isImg: false,
       canSub: false,
       tip: '上传文件中，请耐心等候！'
    }
  },
  mounted() {
    this.loadFn();
  },
  destroyed() {},
  methods: {
    loadFn() {
      this.clickFileFn();
      this.dragFileFn();

      $('.input').on('focus',function(e) {
        $(this).parents('.dashed').addClass('focus');
      });
      $('.input').on('blur',function(e) {
        $(this).parents('.dashed').removeClass('focus');
      });

      
    },
    clickFileFn() {
      let that = this;
      $('#drop_area').on('click',()=> {
        $('#file').click();
      });
      // 文件更改
      $('#file').on('change',function(e) {
          e = e || window.event;  
          e.stopPropagation(); // 阻止冒泡  
          e.preventDefault();  //阻止默认行为  
              
          let fileObj = $("#file")[0].files[0];
          //检测是否有文件 
          if(!fileObj){ 
              return false; 
          } 
          if(fileObj.type.indexOf('application/pdf') === -1) {

              swal({
                title: "温馨提示",
                text: '您拖的不是pdf文件.',
                type: 'warning',
                timer: 2000,
                showConfirmButton: false
              }); 
              return;
          }

          var filename = fileObj.name; //图片名称 
          var filesize = Math.floor((fileObj.size)/1024/1024);  

          var fsize = fileObj.size/1024/1024;

          if(filesize>300){ 
              swal({
                title: "温馨提示",
                text: '上传大小不能超过300M.',
                type: 'warning',
                timer: 2000,
                showConfirmButton: false
              });
              return false; 
          }
          that.isImg = true;
          $('#upword').html(filename);
          that.signFile = fileObj;


      });
       
    },
    dragFileFn() {
      let that = this;
      $(document).on({ 
          dragleave:function(e){    //拖离 
              e.preventDefault(); 
          }, 
          drop:function(e){  //拖后放 
              e.preventDefault(); 
          }, 
          dragenter:function(e){    //拖进 
              e.preventDefault(); 
          }, 
          dragover:function(e){    //拖来拖去 
              e.preventDefault(); 
          } 
      }); 
      
      var box = document.getElementById('drop_area'); //拖拽区域 
      box.addEventListener("drop",function(e){ 
          e.preventDefault(); //取消默认浏览器拖拽效果 
          var fileList = e.dataTransfer.files; //获取文件对象 
          console.log(fileList[0]);
          //检测是否是拖拽文件到页面的操作 
          if(fileList.length == 0){ 
              return false; 
          } 
          // application/pdf
          if(fileList[0].type.indexOf('application/pdf') === -1) {
              swal({
                title: "温馨提示",
                text: '您拖的不是pdf文件.',
                type: 'warning',
                timer: 2000,
                showConfirmButton: false
              });
              return;
          }
           
          var filename = fileList[0].name; //图片名称 
          var filesize = Math.floor((fileList[0].size)/1024/1024);  

          var fsize = fileList[0].size/1024/1024;
          if(filesize>300){ 
              swal({
                title: "温馨提示",
                text: '上传大小不能超过300M.',
                type: 'warning',
                timer: 2000,
                showConfirmButton: false
              });
              return false; 
          } 
          that.isImg = true;
          $('#upword').html(filename);
          that.signFile = fileList[0];
           
      },false); 
       
    },
    checkPhone() {
      this.doerPhoneNo = this.doerPhoneNo.replace(/^0{1,}/g,'');
      this.doerPhoneNo = this.doerPhoneNo.replace(/[^\d]/g,'');
      this.doerPhoneNo = this.doerPhoneNo.substring(0,11);
    },
    
    upFn() {

      if($.trim(this.signTitle) == "") {
        swal({
          title: "温馨提示",
          text: '签署文件主题不能为空',
          type: 'warning',
          timer: 2000,
          showConfirmButton: false
        });
        return false;
      }
      if(!(/^1(3|4|5|7|8)\d{9}$/.test(this.doerPhoneNo))){ 
        swal({
          title: "温馨提示",
          text: '请输入正确手机号',
          type: 'warning',
          timer: 2000,
          showConfirmButton: false
        });
        return false; 
      }

      if(!this.signFile.size) {
        swal({
          title: "温馨提示",
          text: '请上传需要签署的PDF文件',
          type: 'warning',
          timer: 2000,
          showConfirmButton: false
        });
        return false;
      }

      let filesize = Math.floor((this.signFile.size)/1024/1024);
      if(filesize >= 10 && filesize <= 300) {
        this.upfileFn(URL['pushSign_generateLargeTask']);
      }else if(filesize >= 0 && filesize < 10){
        this.upfileFn(URL['pushSign_generateTask']);
         
      } 
    },

    upfileFn(url) {  
      if(this.canSub) {
        return;
      }
      this.canSub = true;
      let that = this;
      $('#canSub').html('提交中...');
      $('#canSub').removeClass('active');
      let baseUrl = this.configUrl;
       

      // let data = new Buffer(JSON.stringify({signTitle: this.signTitle,doerPhoneNo: this.doerPhoneNo})).toString("base64");
      var formData = new FormData();
      formData.append('token', sessionStorage.getItem('token'));
      formData.append('signTitle', this.signTitle);
      formData.append('doerPhoneNo', this.doerPhoneNo); 
      formData.append('signFile', this.signFile);
      
      $.ajax({
          url: baseUrl + url,
          dataType: 'json',
          type: 'POST',
          headers: {'token': sessionStorage.getItem("token")},
          processData: false,
          contentType: false,
          cache: false,
          data: formData
      }).done((json) => {
        
        if(json.code == 0) {
          $('#canSub').html('提交');
          $('#canSub').addClass('active');
          this.canSub = false;
          let id = json.content.id;
          let uuid = json.content.uuid;
          let code = json.content.qRCodeBase64;
          let filename = json.content.signTitle;

          this.$router.push("/result/201/"+id+'/'+uuid+'/'+filename); 
        }else if(json.code == -2) {
          // 跳到登录
          that.$router.push("/login"); 
        }else {
          $('#canSub').html('提交');
          $('#canSub').addClass('active');
          this.canSub = false;
          if(json.message) {
            swal({
                title: "温馨提示",
                type: 'warning',
                text: json.message,
                timer: 2000,
                showConfirmButton: false
            }); 
          }
        }
      }).fail((err) => {
        $('#canSub').html('提交');
        $('#canSub').addClass('active');
        this.canSub = false;
          
      });
    }
  },
}
</script>

<style lang="scss" scoped>
.ceng {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background-color:rgba(0,0,0,0);
}
</style>
