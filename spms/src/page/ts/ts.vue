<template>
  <div>
     <HeaderComponent ></HeaderComponent>
     <section class="con-box text-center">
        
        <input type="file" id="file" class="filestyle" />

        <div class="dashed" id="tstitle-wrap">
          <section class="item title">
            <input type="text" placeholder="输入标题" class="input"  autofocus="autofocus" v-model.trim="signTitle" id="signTitle"/>
          </section>
        </div>

        <div class="dashed" id="tsphone-wrap">
          <section class="item phone">
            <input type="text" placeholder="单击输入分配手机号码" class="input"  v-model.trim="doerPhoneNo" @keyup="checkPhone" id="doerPhoneNo"/>
          </section>
        </div>

        <div class="dashed" style="padding: 40px 0;" id="drop_area">
           <img v-if="!isImg" src="../../assets/image/shangchuan.png"  class="upfile"/>
           <img v-if="isImg" src="../../assets/image/file_pdf.png"  class="upfile"/>
           <p class="up-word" id="upword">请上传需要签署的PDF文件</p>
           <p class="mark">*点击选择上传文件或拖动文件到此处</p>
        </div>

        <div class="btn-sub progress active" id="canSub" @click="upFn()">
            <div class="btn-word" id="word">提交</div>
            <div id="son"></div>
        </div>
    </section>
    <div v-if="canSub" class="ceng"></div>
    <!-- <Loading v-if="canSub" :tip="tip"></Loading> -->
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
       doerPhoneNo: sessionStorage.getItem("phoneNo") || '',
       signFile: {},
       isImg: false,
       canSub: false,
       tip: '上传文件中，请耐心等候！',
       ajaxAbort: null,
    }
  },
  mounted() {

    // history.pushState(null, null, document.URL);
    // window.addEventListener('popstate', function () {
    //     history.pushState(null, null, document.URL);
    // });
    // $("signTitle").focus();
    // $("signTitle").parents('.dashed').addClass('focus');
    $('#tstitle-wrap').hide();
    // $('#tsphone-wrap').hide();
    this.loadFn();
  },
  destroyed() {
    if(this.ajaxAbort) {
      this.ajaxAbort.abort();
      this.ajaxAbort = null;
    }
    $("#son").css("width","0");
    $('#word').html('提交');
  },
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

          let index1 = filename.lastIndexOf('.pdf');
          that.signTitle = filename.substring(0,index1);
          $('#signTitle').focus();
          $('#tstitle-wrap').fadeIn();
          // $('#tsphone-wrap').fadeIn();

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
          // console.log(fileList[0]);
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

          let index1 = filename.lastIndexOf('.pdf');
          that.signTitle = filename.substring(0,index1);
          $('#signTitle').focus();
          $('#tstitle-wrap').fadeIn();
          // $('#tsphone-wrap').fadeIn();

          that.signFile = fileList[0];
           
      },false); 
       
    },
    checkPhone() {
      this.doerPhoneNo = this.doerPhoneNo.replace(/^0{1,}/g,'');
      this.doerPhoneNo = this.doerPhoneNo.replace(/[^\d]/g,'');
      this.doerPhoneNo = this.doerPhoneNo.substring(0,11);
    },
    
    upFn() {
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
      
      if($.trim(this.signTitle) == "") {
        swal({
          title: "温馨提示",
          text: '标题不能为空',
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

      

      let filesize = Math.floor((this.signFile.size)/1024/1024);
      this.upfileFn(URL['pushSign_generateLargeTask']);
      
      // if(filesize >= 10 && filesize <= 300) {
      //   this.upfileFn(URL['pushSign_generateLargeTask']);
      // }else if(filesize >= 0 && filesize < 10){
      //   this.upfileFn(URL['pushSign_generateTask']);
         
      // } 
    },

    upfileFn(url) {  
      if(this.canSub) {
        return;
      }
      this.canSub = true;
      let that = this;
      // $('#canSub').html('提交中...');
      $('#canSub').removeClass('active');
      let baseUrl = this.configUrl;
       

      // let data = new Buffer(JSON.stringify({signTitle: this.signTitle,doerPhoneNo: this.doerPhoneNo})).toString("base64");
      var formData = new FormData();
      formData.append('token', sessionStorage.getItem('token'));
      formData.append('signTitle', this.signTitle);
      formData.append('doerPhoneNo', this.doerPhoneNo); 
      formData.append('signFile', this.signFile);
      
      this.ajaxAbort = $.ajax({
          url: baseUrl + url,
          dataType: 'json',
          type: 'POST',
          headers: {'token': sessionStorage.getItem("token")},
          processData: false,
          contentType: false,
          cache: false,
          data: formData,
          xhr: () => {
              var xhr = $.ajaxSettings.xhr();
              if(that.onprogress && xhr.upload) {
               xhr.upload.addEventListener("progress" , that.onprogress, false);
               xhr.upload.addEventListener("loadend" , ()=> {
                  // console.log('loadend');
                  $("#son").css("width","0");
                  $("#word").addClass('active');
                  $("#word").html("文件上传完毕，处理中 请稍后" );

                }, false);
               return xhr;
              }
          }
      }).done((json) => {
        
        if(json.code == 0) {
          // $('#canSub').html('提交');
          // $('#canSub').addClass('active');

          $("#son").css("width","0");
          $('#word').html('提交');
          $("#word").removeClass('active');
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
          // $('#canSub').html('提交');
          // $('#canSub').addClass('active');

          $("#son").css("width","0");
          $('#word').html('提交');
          $("#word").removeClass('active');
          $('#canSub').addClass('active');

          this.canSub = false;
          if(json.message) {
            swal({
                title: "温馨提示",
                type: 'warning',
                text: json.message,
                timer: 5000,
                showConfirmButton: false
            }); 
          }
        }
      }).fail((err) => {
        swal({
            title: "温馨提示",
            type: 'warning',
            text: '服务器繁忙，请稍后再试！',
            timer: 3000,
            showConfirmButton: false
        });
        // $('#canSub').html('提交');
        $("#son").css("width","0");
        $('#word').html('提交');
        $("#word").removeClass('active');
        $('#canSub').addClass('active');
        this.canSub = false;
          
      });
    },
    onprogress(evt) {
      var loaded = evt.loaded;     //已经上传大小情况 
      var tot = evt.total;      //附件总大小 
      var per = Math.floor(100*loaded/tot);  //已经上传的百分比 
      $("#word").html( "上传 "+ per +"%" );
      $("#son").css("width" , per +"%");
    },
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
.btn-word.active {
  background: url(../../assets/image/loading.gif) right 70% no-repeat;
  background-size: 12%;
  // border: 1px solid #000;
}
.progress {
  position: relative;
  z-index: 1;
}
#son {
  position: absolute;
  top: 0;
  // z-index: -1;
}
// #parent{width:550px; height:10px; border:2px solid #09F;} 
#son {width:0; height:100%; background-color:rgba(214,20,0,.5); color:#fff;text-align:center; line-height:50px; font-size:20px; font-weight:bold;} 
</style>
