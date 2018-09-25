<template>
    <div class="detail">
        <HeaderComponent ></HeaderComponent>
        
        <section class="body-contain">
            <div class="title clf">
                <p class="shengl" v-if="queryState.signType != 3" @click="back" style="cursor:pointer;"><i class="iconfont icon-back"></i>{{signInfo.signTitle}}</p>
                <p @click="back"  style="width: 100%; max-width: 100%;" v-if="queryState.signType == 3"><i class="iconfont icon-back"></i>{{signInfo.signTitle}}</p><!--授权-->
                <span v-if="queryState.signType == 1 || queryState.signType == 5">截止日期:{{signInfo.duration | filterdata(0,false)}}<b :class="signInfo | filterStatus(0)">{{signInfo | filterStatus(1)}}</b></span>
                <div class="btn-box clf" v-if="queryState.signType == 1">
                    <a :href="preHref"   class="preview" target="_blank">预览</a>
                    <a href="javascript:;"  @click="downLoadFile">下载</a>
                </div>    
                <div  class="btn-box clf" v-if="queryState.signType == 5">
                    <a href="javascript:;"   class="preview" @click="previewSignFile">{{previewTxt}}</a>
                </div>            
            </div>
            <div class="sign-list" id="content-2">
                <ul class="clf" v-if="queryState.signType == 1 || queryState.signType == 5">  <!--签署和多文件-->
                    <li class="clf" v-for="(item,index) in signList" :class="item.status | filterStateClass(2)">
                        <span  :class="[item.count ? '':'opacity',signInfo.procedureType == 0 ? '':'opacity']">{{item.count > 10 ? item.count : '0'+item.count}}</span>
                        <span>
                            <b class="line"></b>
                            <i class="iconfont " :class="item.status | filterStateClass(0)"></i>
                            <!-- <b class="circle" v-if="item.status == 1"></b>
                            <b class="circle-length" v-if="item.status == 1"></b> 
                            <strong :class="[item.status == '1' ? 'hurry':'']">{{item.status | filterStateClass(1)}}</strong>-->
                            <strong>{{item.status | filterStateClass(1)}}</strong>
                        </span>
                        <span class="shengl" :title="item.accountName"><b class="iconfont " :class="[item.accountPlatform == 1 ? 'icon-com-sign' : 'icon-per-sign',item.count ? '':'opacity']"></b>{{item.accountName ? item.accountName : '未注册用户'}}{{(queryState.signType != 5 && item.phoneNo && item.count) || (queryState.signType == 5 &&　item.count) ?  '('+ item.phoneNo+')' : ''}}</span>
                        <span v-if="item.status < 0">{{item.finishTime}}</span>
                        <span v-else>{{item.finishTime | filterdata(1,true)}}</span>
                    </li>
                    <!-- <li class="clf">
                        <span>00</span>
                        <span><b class="line"></b><i class="iconfont icon-launch"></i><strong>发送人</strong></span>
                        <span class="shengl"><b class="opacity iconfont icon-add"></b>李四</span>
                        <span>2017-04-11</span>
                    </li>
                    <li class="clf">
                        <span>00</span>
                        <span><b class="line"></b><i class="iconfont icon-cc"></i><strong>抄送人</strong></span>
                        <span class="shengl"><b class="opacity iconfont icon-add"></b>李四</span>
                        <span>2017-04-11</span>
                    </li>
                    <li class="clf">
                        <span>01</span>
                        <span><b class="line"></b><i class="iconfont icon-check-circle"></i><strong>已签署</strong></span>
                        <span class="shengl"><b class="iconfont icon-com-sign"></b>王五</span>
                        <span>2017-04-11</span>
                    </li>
                    <li class="clf">
                        <span>01</span>
                        <span>
                            <b class="line"></b>
                            <i class="iconfont icon-hurry-circle" style="cursor: pointer;"></i>
                            <b class="circle"></b>
                            <b class="circle-length"></b>
                            <strong style="cursor: pointer;">催办</strong>
                        </span>
                        <span class="shengl"><b class="iconfont icon-com-sign"></b>王五</span>
                        <span>2017-04-11</span>
                    </li>
                    <li class="clf wait"  >
                        <span>03</span>
                        <span><b class="line"></b><i class="iconfont icon-clock"></i><strong>待签</strong></span>
                        <span class="shengl"><b class="iconfont icon-per-sign"></b>八阿哥</span>
                        <span>2017-04-11</span>
                    </li> -->
                </ul>

                <ol v-if="queryState.signType == 2" class="request">  <!--登录-->
                    <li>登录平台：<span>{{signInfo.channelStr}}</span></li>
                    <li>登录账号：<span>{{userData.phone}}</span></li>
                    <li>登录者：<span>{{userData.personName}}</span></li>
                    <li>状态：<span>{{signInfo.taskSignResult == 0 ? '待签署' : signInfo.taskSignResult == 1 ? '安全登录' : '拒绝登录'}}</span></li>
                    <li>发起时间：<span>{{signInfo.createTime | filterdata(1,true)}}</span></li>
                    <li  v-if="signInfo.taskSignResult != 0">完成时间：<span>{{signInfo.finishTimeStr}}</span></li>
                </ol>
                <ol v-if="queryState.signType == 3" class="request">  <!--授权-->
                    <li>发起平台：<span>{{signInfo.channelStr}}</span></li>
                    <li>状态：<span>{{signInfo.taskSignResult == 0 ? '待签署' : signInfo.taskSignResult == 1 ? '已授权' : '已拒绝'}}</span></li>
                    <li>发起时间：<span>{{signInfo.createTime | filterdata(1,true)}}</span></li>
                    <li v-if="signInfo.taskSignResult != 0">完成时间：<span>{{signInfo.finishTimeStr}}</span></li>
                </ol>  
                <ol v-if="queryState.signType == 4" class="request">  <!--绑定-->
                    <li>绑定平台：<span>{{signInfo.channelStr}}</span></li>
                    <li v-if="signInfo.taskSignResult != 0">绑定证书：{{signInfo.signCertName}}</li>
                    <li>绑定账号：{{signInfo.senderUuid}}</li>
                    <li>绑定者：{{signInfo.sender}}</li>
                    <li>状态：{{signInfo.taskSignResult == 0 ? '签署中' : signInfo.taskSignResult == 1 ? '已绑定' : '已拒绝'}}</li>
                    <li>发起时间：<span>{{signInfo.createTime | filterdata(1,true)}}</span></li>
                    <li v-if="signInfo.taskSignResult != 0">完成时间：<span>{{signInfo.finishTimeStr}}</span></li>
                </ol>
            </div>
        </section>
        <Model :type="2" v-show="revoke.state" @cancelHandle="revoke.state = false;previewTxt='预览'">
            <div slot="alert-content" style="max-height: 500px;overflow: auto;" class="sign_page_scroll">
                <ul>
                    <li v-for="(item,index) in revoke.list" class="shengl" :title="item.fileName">{{item.fileName}}</li>
                </ul>
            </div>
            <div slot="alert-footer"></div>
        </Model>


    </div>
</template>
<script>
    import Vue from 'vue'
    import HeaderComponent from '../../../src/components/header.vue'
    import axiosHttp from '../../assets/js/axiosHttp.js'
    import URL from '../../assets/js/URL.js'
    Vue.filter('filterStateClass', function (value,index) { //value为status状态码 index表示是返回的第几个 0位txt ，1为class
        let statusTxt = [];
        switch(value){
            case -2: //发送人
                statusTxt = ["icon-launch",'发起人',''];
                break;
            case -1: //抄送人
                statusTxt = ["icon-cc",'抄送人',''];
                break;
            case 0:  //待签
                statusTxt = ["icon-clock","待签",'wait'];
                break;
            case 1: //催办
                // statusTxt = ["icon-hurry-circle","催办",''];
                statusTxt = ["icon-clock","待签",'wait'];
                break;
            case 2: //已通过
                statusTxt = ["icon-check-circle","已签署",''];
                break;
            case 3: //已拒绝
                statusTxt = ["icon-del-hollow","已拒绝",'wait'];
                break;
            case 4: //已取消
                statusTxt = ["icon-del-hollow","已取消",'wait'];
                break;
            case 5: //已过期
                statusTxt = ["icon-del-hollow","已过期",'wait'];
                break;
            case 6: //无效
                statusTxt = ["icon-circle","",'wait'];
                break;
            default:
                break;
                 
        }
        return statusTxt[index];
    });
    Vue.filter('filterStatus',function(item,index){
        let statusTxt = [];
        if(item.taskSignStatus  == 1){ //签署中
            statusTxt = ["signing",'签署中']
        }
        if(item.taskSignStatus == 2){
            if(item.taskSignResult == 1){
                statusTxt = ['finished','已完成']
            }else if(item.taskSignResult == 2){
                statusTxt = ['refuse','已拒绝']
            }else if(item.taskSignResult == 3){
                statusTxt = ['overdue','已撤销']
            }else if(item.taskSignResult == 4){
                statusTxt = ['overdue','已过期']
            }else{
                statusTxt = ['noStart','未开始']
            }
        }
        return statusTxt[index];
    })
    export default{
        name:'detail',
        data(){
            return{
                revoke:{  //多文件签署
                    state:false,
                    list:[]
                },
                id:null,
                signList:[],
                signInfo:{},
                queryState:'',
                previewNum:0,
                previewTxt:'预览',
                preHref:null,
                pdfShow:false,
                headers:{
                    'token': sessionStorage.getItem("token")
                }
            }
        },
        computed:{
            userData(){
                return this.$store.state.userData
            }
        },
        components:{
            HeaderComponent,
        },
        methods:{
            closePreview(){
                this.pdfShow = false;
                this.previewTxt = '预览';
            },
            back(){
                this.$router.push({
                    name:'Record',
                    query:{
                        startTime:this.queryState.startTime,
                        endTime:this.queryState.endTime,
                        tabIndex:this.queryState.tabIndex,
                        pageIndex:this.queryState.pageIndex
                    }
                })
            },
            previewSignFile(){  //预览
                if(this.previewTxt == '预览中') return;
                this.previewTxt = '预览中';
                this.revoke.state = true;
                let data = {
                    signInfoId:this.signInfo.signId
                }
                axiosHttp('post',URL['getManyFileSignInfo'],data,this.headers,(json)=>{
                    if(json.code == 0){  //成功
                        this.revoke.list = json.content.manyFileSignInfo.fileDetailTransfers;   //?
                    }else{
                        this.revoke.state = false;
                        this.failHandle(json)
                    }
                })
                
            },
            previewSign(){  //签署预览
                let data = {
                    id:this.id
                } 
                axiosHttp('post',URL['previewSignFile'],data,this.headers,(json)=>{
                    if(json.code == 0){
                        this.previewTxt = '预览';
                        this.preHref = json.content.fileUrl;                  
                    }else{
                        this.failHandle();
                    }
                })
            },
            downLoadFile(){  //下载
                window.location.href=this.linkHref+URL['downloadFile']+'?id='+this.id
            },
            getDetail(){
                /*let data = new Buffer(JSON.stringify({
                    'id':this.id,
                     'token': sessionStorage.getItem("token")
                })).toString("base64");*/
                /*signType: 1-签署  2-登录  3-授权  4-绑定  5-多文件签署*/
                let data = {
                    'id':this.id
                }
                axiosHttp('post',URL['querySignorDetail'],data,this.headers,(json)=> {
                    if(json.code == 0){
                        this.signInfo = json.content.signInfo;
                        this.signList.unshift({
                            accountName:json.content.signInfo.signType == 5 ? json.content.signInfo.channelStr : json.content.signInfo.sender,
                            finishTime:json.content.signInfo.claimTimeStr,
                            phoneNo:json.content.signInfo.signType == 5 ? json.content.signInfo.doerAccount : json.content.signInfo.senderAccount,
                            status:-2,   //发送人
                        })
                        if(json.content.signCarBonList.length > 0){  //抄送人
                            let list = json.content.signCarBonList;
                            let name = '';
                            for(let i = 0; i < list.length; i++){
                                if(i < list.length - 1){
                                    name+=list[i].accountName+','
                                }else{
                                    name+=list[i].accountName
                                }
                                
                            }
                            this.signList.push({
                                accountName:name,
                                status:-1,   
                            })
                        }
                        if(json.content.procedureExecuterList.length > 0){
                            let list = json.content.procedureExecuterList;
                            let count = 0 ;
                            for(let i = 0 ; i < list.length ; i++){
                                this.signList.push({
                                    accountName:list[i].accountName,
                                    finishTime:list[i].finishTime,
                                    status:list[i].status,
                                    phoneNo:list[i].account,
                                    id:list[i].id,
                                    accountPlatform:list[i].accountPlatform,
                                    count:++count
                                })
                            }
                        }
                    }else{
                        this.failHandle(json)
                    }
                });
            },
            failHandle(json){
                if(json.code == -2){
                    this.$router.push("/login"); 
                }else{
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
            }
        },
        mounted(){
            this.id = this.$route.params.id;
            this.queryState = this.$route.query
            this.getDetail();
            this.previewSign();
        }
    }
</script>