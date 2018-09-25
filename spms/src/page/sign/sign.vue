<template>
    <div class="sign">
        <HeaderComponent ></HeaderComponent>
        <section class="con-box text-center" v-if="step == 1">
          <input type="file" id="file" class="filestyle" />
            <div class="dashed" id="smtitle-wrap" v-show="isImg">
              <section class="item title" >
                <input type="text" placeholder="输入标题"  id="signTitle" autofocus="autofocus" class="input" v-model.trim="signTitle" />
              </section>
            </div>

            <div class="dashed" style="padding: 40px 0;" id="drop_area">
               <img v-if="!isImg" src="../../assets/image/shangchuan.png"  class="upfile"/>
               <img v-if="isImg"  src="../../assets/image/file_pdf.png"  class="upfile"/>
               <p class="up-word" id="upword">{{pdfFileName}}</p>
               <p class="mark">*点击选择上传文件或拖动文件到此处</p>
            </div>

            <div class="btn-sub active progress" @click="upFn()">
                <div class="btn-word">下一步</div>
            </div>            
        </section>
        <section class="center-contain" v-show="step == 2" >
            <div class="signSetting clf">
                <div class="settingBox">
                    <h3 class="title">签署设置</h3>
                    <div class="inputControl row clf">
                        <label for="" class=""><span>截止签约日期<b>*</b></span></label>
                        <!-- <span class="calendarBox">
                            <input size="16" type="text"  readonly class="form_datetime" v-model="this.durationTime">
                            <b class="add-on"><i class="iconfont icon-calendar-table"></i></b>
                        </span> -->
                        <span class="calendarBox">
                            <div class="input-append date form_datetime"  id="date_start" >
                                <input size="16" type="text" value="" placeholder="签约截止时间"  v-model.trim="durationTime" readonly>
                                <b class="add-on"><i class="iconfont icon-calendar-table"></i></b>
                            </div>
                        </span>
                        <div class="checkbox">
                            <span class="iconfont icon-checkboxOn"  @click="timeCheckBok" :class="[durationTime == '' ? 'active' : '']"></span>
                            <span >永久有效</span>
                        </div>
                    </div>
                    <div class="signWay clf">
                        <h4>选择签署方式</h4>
                        <ul class="row clf">
                            <li class="col-lg-6 col-md-6 col-sm-12 col-xs-12" @click="signOrder = 0">
                                <span class="iconfont icon-radio" :class="[signOrder == 0 ? 'active':'']"></span>
                                <span>顺序签<b>&nbsp;&nbsp;(A->B->C->D ，可拖动签署人调整排序)</b></span>
                            </li>
                            <li class="col-lg-6 col-md-6 col-sm-12 col-xs-12" @click="signOrder = '1'">
                                <span class="iconfont icon-radio" :class="[signOrder == 1 ? 'active':'']"></span>
                                <span>任意签<b>&nbsp;&nbsp;(签署人先到先签，无固定顺序)</b></span>
                            </li>                            
                        </ul>
                    </div>
                    <div class="addSingers">
                        <h4>添加签署人</h4>
                        <ul>
                            <draggable v-model="selectSignerArrayCheck">
                                <transition-group>
                                    <li v-for="(item,index) in selectSignerArrayCheck" :key="index" @mouseover="showDelSign(index,1)" @mouseout="hideDelSign(1)">
                                            <span><b class="icon-menu"></b></span>
                                            <span>{{index+1}}</span>
                                            <span class="opacity"></span>
                                            <span>{{item.account}}</span>
                                            <span class="shengl">{{item.userName ?item.userName : ''}}</span>
                                            
                                        <i class="iconfont icon-del" v-show="delIndex.one == index" @click="delSelectMail(item,index)"></i>
                                    </li>
                                </transition-group>
                            </draggable>
                        </ul>
                        <a href="javascript:;"  class="addContacts"  @click="addSignerHandle()"><i class="iconfont icon-add"></i>从通讯录添加</a>
                     </div>
                </div>
            </div>
            <div class="submitBox clf">
                <a href="javascript:;" @click="createDocument()" v-show="!progress">{{tip}}</a>
                <a href="javascript:;" id="progress" v-show="progress">
                    <span></span>
                    <b></b>
                </a>
            </div>
        </section>
        <!-- 添加签署人弹框 -->
        <div class="modelAddSigners" v-show="addSignerState">
            <div class="modelBox">
                <div class="modelHeader">
                    <h3>添加签署人<b class="icon-close" @click="addSignerState = false"></b></h3>
                </div>
                <div class="modelBody clf">
                    <div class="sideLeft">
                        <div class="sideLeftTop">
                            <div class="search">
                                <input type="text" v-model.trim="signersData.phone" placeholder="输入手机号码添加联系人" @keydown="keydown($event)"   @input="searchChange">
                                <i class="iconfont icon-add"></i>
                            </div>
                            <ul class="userInfo" v-if="userInfo && userInfo != ''">
                                <li :class="[userInfoIndex == 0 ? 'active' : '']">
                                    <span>{{userInfo.personName}}</span>
                                    <span>{{userInfo.phoneNo}}</span>
                                </li>
                            </ul>
                        </div>
                        <div class="sideContent">                            
                            <div class="signerTable">
                                <ul class="clf">
                                    <li class="title"> 
                                        <span><b class="iconfont" :class="[selectAll ? 'icon-checkboxOn':'icon-square']" @click="selectAllHandle"></b></span>
                                        <span>手机号码</span>
                                        <span>姓名</span>
                                    </li>
                                    <li class="loadSource" v-show="signersData.loading">
                                        <p>加载中...</p>
                                    </li>
                                    <li class="no-message" v-show="signersData.pageData.total == 0  && !signersData.loading">
                                        <img src="../../assets/image/noAnyThing.png">
                                        <p v-text="'暂无数据'"></p>
                                    </li>
                                    <li v-for="(item,index) in signersData.list" :key="index" @click="selectSigner(item)"> 
                                        <span ><b class="iconfont" :class="[item.selectVal ? 'icon-checkboxOn':'icon-square']" ></b></span>
                                        
                                        <span class="shengl" :title="item.account">{{item.account}}</span>
                                        <span class="shengl" :title="item.userName">{{item.userName ? item.userName:''}}</span>
                                    </li>                                    
                                    <li class="pageBox">
                                        <b>共{{signersData.pageData.total}}条记录</b>
                                        <div class="page-box" >
                                            <!-- :pagegroup="2" -->
                                            <pagination :total="signersData.pageData.total" :currentpage="signersData.pageData.pageIndex" :display="signersData.pageData.pageLength"  :isShowPreNex="1" @pagechange="pageChangeHandel"></pagination>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            
                        </div>
                    </div>
                    <div class="sideRight">
                        <div class="selectedTable">
                            <h3>已选</h3>
                            <ul>
                                <li class="title">
                                    <span><b class="icon-seal opacity"></b>手机号码</span>
                                    <span>姓名</span>
                                </li>
                            </ul>
                            <ul class="ul-list sign_page_scroll">
                                <li v-for="(item,index) in selectSignerArray" :key="index"  @mouseover="showDelSign(index,2)" @mouseout="hideDelSign(2)">
                                    <span class="shengl" :title="item.account"><b class="icon-seal opacity"></b>{{item.account}}</span>
                                    <span class="shengl" :title="item.userName">{{item.userName ? item.userName : ''}}</span>
                                    <i class="iconfont icon-del" @click="delSelect(item,index)" v-show="delIndex.two == index"></i>
                                </li>
                            </ul>
                            <div class="btnBox clf">
                                <a href="javascript:;" @click="sureAddSigners">确定</a>
                                <a href="javascript:;" @click="cancleAddSigners">取消</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modelFooter"></div>
            </div>
        </div>
    </div>  
</template>
<script>
    import HeaderComponent from '../../../src/components/header.vue'
    import footerComponent from '../../../src/components/footer.vue'
    import draggable from 'vuedraggable';
    import pagination from '../../../src/components/pagination.vue';
    import axiosHttp from '../../assets/js/axiosHttp.js'
    import URL from '../../assets/js/URL.js';   
    /*日期控件*/
    import '@/assets/js/plugin/bootstrap-datepicker.js';
    import '@/assets/css/datepicker3.css';

    export default{
        name:'sign',
        data(){
            return{
                step:1,          //签署第一步
                signTitle: '',   //文档名称
                signFile: {},    //文档流
                pdfFileName:'请上传需要签署的PDF文件',
                isImg: false,    //是否上传了pdf
                ajaxAbort: null,
                tip:"提交",
                durationTime:'',     //有效时间
                durationTimeTem:'',  //临时时间
                delIndex:{   //删除
                    one:null,
                    two:null
                },
                signOrder:0,   //顺序签 1无序签
                selectSignerArray:[],          //弹框选中签署人数据
                selectSignerArrayCheck:[],     //提交的选中签署人数据
                /* 弹框 */
                addSignerState:false,       //添加签署人弹框状态
                signersData:{               //签署人列表数据
                    list:[],                //列表数据
                    pageData:{              //添加签署人翻页数据
                        total:0,
                        pageIndex:1,
                        pageLength:10,
                    }, 
                    loading:false,         //请求加载显示  
                    phone:'',             //搜索关键字        
                },
                selectAll:false,    //添加签署人全选按钮

                userInfo:null,      //根据手机号码查找到的用户信息
                userInfoIndex:-1,   //下拉框index
                progress:false,
                headers:{
                    'token': sessionStorage.getItem("token")
                }
            }
        },
        components:{
            HeaderComponent,
            draggable,
            pagination,
            footerComponent,
        },
        methods:{
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
                      // console.log('change'+fileObj);
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
                          // alert("上传大小不能超过8M.");
                        swal({
                            title: "温馨提示",
                            text: '上传大小不能超过300M.',
                            type: 'warning',
                            timer: 2000,
                            showConfirmButton: false
                        }); 
                        return false; 
                    }
                    // $('#upword').html(filename);
                    that.pdfFileName = filename;
                    that.isImg = true;
                    let index1 = filename.lastIndexOf('.pdf');
                    that.signTitle = filename.substring(0,index1);
                    $('#signTitle').focus();
                    $('#smtitle-wrap').fadeIn();
                      
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
                      // console.log('drop');
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
                    // $('#upword').html(filename);
                    that.pdfFileName = filename;
                    let index1 = filename.lastIndexOf('.pdf');
                    that.signTitle = filename.substring(0,index1);
                    $('#signTitle').focus();
                    $('#smtitle-wrap').fadeIn();
                      
                    that.signFile = fileList[0];
                      

                },false); 
                   
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
                this.step = 2;                  
            },
            beforeSubmit(){
                if(this.selectSignerArrayCheck.length == 0){
                    swal({
                        title: "温馨提示",
                        text: '请至少添加一个签署人',
                        type: 'warning',
                        timer: 2000,
                        showConfirmButton: false
                    });
                    return false;
                }
                return true;
            },
            createDocument() {
                if(!this.beforeSubmit()){
                    return;
                }
                if(this.tip == '文件上传完毕，处理中...请稍后') return false;
                let that = this;               
                let procedureInfo = [];
                this.progress = true;
                for(let i = 0 ; i < this.selectSignerArrayCheck.length; i++){
                    procedureInfo.push({
                        account:this.selectSignerArrayCheck[i].account,
                        accountPlatform:0,
                        accountName:this.selectSignerArrayCheck[i].userName
                    })
                }
                let durationTime = this.durationTime == "" ? "" : this.durationTime+ " 23:59:59";
                let data = new Buffer(JSON.stringify({
                    signTitle: this.signTitle,
                    pdfFileName:this.pdfFileName,
                    procedureType:this.signOrder,
                    duration:durationTime,
                    procedureInfo:procedureInfo
                })).toString("base64");

                var formData = new FormData();             
                formData.append('data', data);
                formData.append('file', this.signFile);             
                
                this.ajaxAbort = $.ajax({
                    url: that.configUrl+URL['prepare4ProcessSign'],
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
                                $("#progress span").css("width","0");
                                this.tip = "文件上传完毕，处理中...请稍后";
                                this.progress = false;

                        }, false);

                        return xhr;
                        }
                    }
                }).done((json) => {
                    if(json.code == 0) {
                        this.progress = false;
                        $("#progress span").css("width","0");
                        let filename = this.signTitle;
                        let id = json.content.signId;
                        this.$router.push({
                            name:"SignResult",
                            params: { 
                                'fileName':filename,
                                'id':id
                            }
                        });

                    }else if(json.code == -2) {
                    // 跳到登录
                        this.$router.push("/login"); 
                    }else {
                        $("#progress span").css("width","0");
                        this.tip = "提交";                      
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
                    swal({
                        title: "温馨提示",
                        type: 'warning',
                        text: '服务器繁忙，请稍后再试！',
                        timer: 2000,
                        showConfirmButton: false
                    });
                    $("#progress span").css("width","0");
                    this.tip = "提交";     
                });              
            },
            onprogress(evt) {
              var loaded = evt.loaded;     //已经上传大小情况 
              var tot = evt.total;      //附件总大小 
              var per = Math.floor(100*loaded/tot);  //已经上传的百分比 
              $("#progress span").css("width",per +"%");
              $("#progress b").html("提交中"+per+"%")
            },
            isEmpty:function(str) {
                return str.replace(/(^\s*)|(\s*$)/g, "") ? false : true;
            },
            isEmail : function(str) {
                return /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/i.test(str);
            },
            isPhone : function(str) {
                if(typeof str === 'number'){
                    str = str.toString();
                }
                return /^0?1[3|4|5|7|8][0-9]\d{8}$/.test(str);
            },
            showDelSign(index,num){   //鼠标移入删除按钮显示
                if(num == 1){
                    this.delIndex.one = index;
                }
                if(num == 2){
                    this.delIndex.two = index;
                }
            },
            hideDelSign(num){     //鼠标移出删除按钮隐藏
                if(num == 1){
                    this.delIndex.one = null;
                }
                if(num == 2){
                    this.delIndex.two = null;
                }
            },
            selectAllHandle(){        //全选按钮                
                if(this.selectAll){   //取消全选
                    this.selectAll = false; 
                    for(let i = 0 ; i < this.signersData.list.length;i++){
                        this.signersData.list[i].selectVal = false;
                        for(let j = 0 ; j < this.selectSignerArray.length; j++){
                            if(this.signersData.list[i].account == this.selectSignerArray[j].account){
                                this.selectSignerArray.splice(j,1);
                            }
                        }
                    }
                }else{                //全选选中
                    this.selectAll = true;
                    let addArr = [];
                    for(var i = 0 ; i < this.signersData.list.length;i++){
                        this.signersData.list[i].selectVal = true;
                        addArr.push(this.signersData.list[i]);                     
                    }
                    for(let i = 0; i < this.selectSignerArray.length; i++){
                        for(let j = 0 ; j < addArr.length ; j++){
                            if(this.selectSignerArray[i].account == addArr[j].account){
                                addArr.splice(j,1);
                            }
                        }
                    }
                    this.selectSignerArray = this.selectSignerArray.concat(addArr);
                }
            },
            keydown(event){  //监听添加联系人输入框进行了什么操作
                if(event.keyCode == 13){   //回车
                    this.addContact();
                }
                if(event.keyCode == 38){   //上键
                    this.userInfoIndex = -1;
                }
                if(event.keyCode == 40){   //下键
                    this.userInfoIndex = 0;
                }
            },
            searchChange(){  //监听添加联系人输入框
                this.signersData.phone = this.signersData.phone.replace(/[^\d]/g,'');
                if(this.signersData.phone.length == 11){
                    this.getPerson();
                }else{
                    this.userInfo = null;
                }

            },
            addContact(){   //添加联系人
                if(!this.isPhone(this.signersData.phone)){
                    swal({
                        title: "警告",
                        type: 'error',
                        text: '手机号码格式不正确',
                        timer: 2000,
                        showConfirmButton: false
                    }); 
                    return
                }
                if(this.isEmpty(this.signersData.phone)){
                    swal({
                        title: "警告",
                        type: 'error',
                        text: '手机号码不能为空',
                        timer:2000,
                        showConfirmButton: false
                    }); 
                    return
                }
                let data = new Buffer(JSON.stringify({
                    'account':this.signersData.phone,
                    'userName':this.userInfo ? this.userInfo.personName : '',
                    'origin':0,
                    'token': sessionStorage.getItem("token")
                })).toString("base64");
                axiosHttp('post',URL['addContact'],{data:data},this.headers,(json)=> {
                    if(json.code == 0){
                        this.searchCompanySignatoryLight();
                        this.userInfo = null;
                        this.signersData.phone = '';
                    }else if(json.code == -2) {
                      // 跳到登录
                      this.$router.push("/login"); 
                    }else {
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
                });
            },
            getPerson(){   //获取用户列表
                let data = new Buffer(JSON.stringify({
                    'phoneNo':this.signersData.phone
                })).toString("base64");
                axiosHttp('post',URL['getPerson'],{data:data},this.headers,(json)=> {
                    if(json.code == 0){
                        this.userInfo = json.content;                        
                    }
                });
            },
            searchCompanySignatoryLight(){  //获取签署人列表
                this.signersData.loading = true;
                // this.selectSignerArray = [];
                this.selectAll = false;
                // if(this.selectSignerArrayCheck.length > 0){
                //     for(let i = 0; i < this.selectSignerArrayCheck.length; i++){
                //         this.selectSignerArray.push(this.selectSignerArrayCheck[i])
                //     }
                // }
                // console.log(this.selectSignerArrayCheck)
                let data = new Buffer(JSON.stringify({
                    'token': sessionStorage.getItem("token"),
                    'pageNo':this.signersData.pageData.pageIndex,
                    'pageSize':this.signersData.pageData.pageLength
                })).toString("base64");
                axiosHttp('post',URL['loadList'],{data:data},this.headers,(json)=> {
                    this.signersData.loading = false;
                    if(json.code == 0){
                        this.signersData.list = json.content.recordList;
                        this.signersData.pageData.total = json.content.totalCount;
                        let selectAllNum = 0;
                        for(let i = 0 ; i < this.signersData.list.length;i++){
                            if(this.selectSignerArray.length == 0) return;
                            for(let j = 0 ; j < this.selectSignerArray.length;j++){
                                if(this.signersData.list[i].account == this.selectSignerArray[j].account){
                                    this.signersData.list[i].selectVal = true;
                                    selectAllNum++;
                                }
                            }
                        }
                        if(this.signersData.list.length > 0 && selectAllNum == this.signersData.list.length){  //判断全选
                            this.selectAll = true;
                        }else{
                            this.selectAll = false;   
                        }
                    }else if(json.code == -2) {
                      // 跳到登录
                      this.$router.push("/login"); 
                    }else {
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
                });
            },        
            timeCheckBok(){
                //durationTime = durationTime == '' ? '':'' 
                if(this.durationTime == ''){
                    this.durationTime = this.durationTimeTem;
                }else{
                    this.durationTimeTem = this.durationTime;
                    this.durationTime = '';
                }
            },
            addSignerHandle(){            //点击添加签署人按钮
                this.Event2.$emit('tip2',1);
                this.addSignerState = true;
                this.selectSignerArray = [];
                if(this.selectSignerArrayCheck.length > 0){
                    for(let i = 0; i < this.selectSignerArrayCheck.length; i++){
                        this.selectSignerArray.push(this.selectSignerArrayCheck[i])
                    }
                }
                this.searchCompanySignatoryLight();
            },
            selectSigner(item){         //选择签署人
                if(item.selectVal){     //取消选中
                    this.selectAll = false;       
                    item.selectVal = false;
                    for(var i = 0 ; i < this.selectSignerArray.length;i++){
                        if(this.selectSignerArray[i].account == item.account){
                            this.selectSignerArray.splice(i,1);
                            return;                        
                        }
                    }                    
                }else{   //选中
                    item.selectVal = true;                    
                    this.selectSignerArray.push(item);
                    let selectAllNum = 0;
                    for(let i = 0 ; i < this.signersData.list.length; i++){
                        for(let j = 0 ; j < this.selectSignerArray.length ; j++){
                            if(this.signersData.list[i].account == this.selectSignerArray[j].account){
                                selectAllNum ++;
                            }
                        }
                    }
                    if(selectAllNum == this.signersData.list.length){
                        this.selectAll = true;
                    }
                }
            },
            delSelect(item,index){          //删除已选联系人
                this.selectSignerArray.splice(index,1);
                for(var i = 0; i<this.signersData.list.length;i++){
                    if(this.signersData.list[i].account == item.account){
                        this.signersData.list[i].selectVal = false;
                        this.selectAll = false;
                        return;                        
                    }
                }
            },
            delSelectMail(item,index){      //删除通讯录已选联系人
                this.selectSignerArrayCheck.splice(index,1);
            },
            sureAddSigners(){               //签署人弹框确定 （弹框外面已选要等于弹框里面已选）
                this.addSignerState = false;
                this.selectSignerArrayCheck = [];
                for(var i = 0; i < this.selectSignerArray.length;i++){
                    this.selectSignerArrayCheck.push(this.selectSignerArray[i]);
                }
            },
            cancleAddSigners(){             //取消签署人弹框确定（弹框里面已选要等于弹框外面已选）            
                this.selectSignerArray =  [];
                for(var i = 0 ; i < this.selectSignerArrayCheck.length;i++){
                    this.selectSignerArray.push(this.selectSignerArrayCheck[i])
                }
                this.addSignerState = false;
            },    
            pageChangeHandel(val){  //弹框翻页
                this.signersData.pageData.pageIndex = val;
                this.searchCompanySignatoryLight();
            },
            init(){
                 var This = this;
                /*日期控件*/
                /*$('.form_datetime').datetimepicker({
                    todayBtn: "linked",
                    keyboardNavigation: false,
                    forceParse: false,
                    calendarWeeks: true,
                    autoclose: true,                    
                    showSecond:1,
                    minuteStep:1, //显示秒
                    format: 'yyyy-mm-dd hh:ii',
                    startDate: new Date(),   
                    
                }).on("changeDate",(e) => {
                    this.durationTime = $(".form_datetime").val();
                });*/
                $('#date_start').datepicker({
                    todayBtn: "linked",
                    startDate:new Date(),
                    keyboardNavigation: false,
                    forceParse: false,
                    calendarWeeks: true,
                    autoclose: true,
                    todayHighlight: true,
                    format: 'yyyy-mm-dd',  
                    
                }).on("changeDate",(e) => {
                    this.durationTime = $("#date_start").find('input').val();
                });
                this.clickFileFn();
                this.dragFileFn();
            } 
        },
        mounted(){
            this.init();
        }
    }
</script>
<style scoped lang="scss">
</style>