<template>
    <div class="record" v-cloak>
        <HeaderComponent></HeaderComponent>
        <div class="panel-tab">
            <div class="tabNav">
                <label>文档状态</label>
                <ul class="clf"> <!--大B管理员-->
                    <li><a href="javascript:;" :class="[tabIndex == 100 ? 'active':'']" @click="changeStatus(100,'')">不限</a></li>
                    <li><a href="javascript:;" :class="[tabIndex == 0 ? 'active':'']" @click="changeStatus(0,'0')">签署中</a></li>
                    <li><a href="javascript:;" :class="[tabIndex == 1 ? 'active':'']" @click="changeStatus(1,'1')">已完成</a></li>
                    <li><a href="javascript:;" :class="[tabIndex == 2 ? 'active':'']" @click="changeStatus(2,'2')">已拒绝</a></li>
                    <li><a href="javascript:;" :class="[tabIndex == 3 ? 'active':'']" @click="changeStatus(3,'3')">已撤销</a></li>
                    <li><a href="javascript:;" :class="[tabIndex == 4 ? 'active':'']" @click="changeStatus(4,'4')">已过期</a></li>
                </ul>                
            </div>
            <div class="search clf">                
                <div class="timebox">
                    <label>发送时间</label>
                    <span class="calendarBox">
                        <div class="input-append date form_datetime"  id="date_start" >
                            <input size="16" type="text" value="" placeholder="开始时间"  v-model.trim="startTime" readonly>
                            <b class="add-on"><i class="iconfont  icon-calendar-table"></i></b>
                        </div>
                    </span>
                    <span class="txt">至</span>
                    <span class="calendarBox">
                        <div class="input-append date form_datetime"  id="date_end">
                            <input size="16" type="text" value="" placeholder="结束时间" v-model.trim="endTime" readonly>
                            <b class="add-on"><i class="iconfont  icon-calendar-table"></i></b>
                        </div>
                    </span>   
                </div>
                <div class="search-input">
                    <i class="iconfont icon-search"></i><input type="text" v-model.trim="searchTitle" placeholder="文档名称" @keyup.enter="searchDocumentLight"> 
                </div>
                <a href="javascript:;" class="search-btn" @click="searchDocumentLight">查询</a>
                <a href="javascript:;" @click="clearHandle">清空</a>
            </div>
        </div>
        <div class="panel-box"  v-cloak>
            <ul>
                <li class="no-message" v-show="!tableLoading &&　page.total == 0">
                    <img src="../../assets/image/noAnyThing.png">
                    <p>暂无数据</p>
                </li>
                <li class="loadSource" v-show="tableLoading">
                    <p>加载中....</p>
                </li>
                <li v-for="(item,index) in recordList" class="itemList">
                    <i v-if="item.signType == 2"><img src="../../assets/image/ju_denglu.png"></i>
                    <i v-if="item.signType == 3"><img src="../../assets/image/ju_shouquan.png"></i>  <!--授权-->
                    <i v-if="item.signType == 4"><img src="../../assets/image/ju_bangding.png"></i>  <!--绑定-->
                    <i v-if="item.signType == 1 || item.signType == 5"><img src="../../assets/image/person_sign.png"></i>
                    <div class="clf">
                        <h3 class="shengl">{{item.signTitle}}</h3>
                        <span>来源：{{item.channelStr}}</span>
                    </div>
                    <div class="clf" >
                        <p class="shengl">{{item.originalFileName}}</p>
                        <span v-if="item.originalFileName">截止日期：{{item.durationStr ? item.durationStr : '永久有效'}}</span>
                    </div>
                    <div class="clf">
                        <p>发起时间:{{item.createTimeStr ? item.createTimeStr : ''}}</p>
                        <span ><b :class="item.taskSignResult | filterState(1)">{{item.taskSignResult | filterState(0)}}</b></span>
                    </div>
                    <a href="javascript:;" class="look" @click="lookDetail(item)">查看</a>
                </li>
                <li v-show="page.total > 0">
                    <div class="page-box clf">
                        <span class="recordTotal">共{{page.total}}条记录/当前页为第{{page.currentpageIndex}}页</span>
                        <pagination style="float:right"  :total="page.total" :currentpage="page.currentpageIndex" :display="page.display"  @pagechange="pageChangeHandel"></pagination>
                    </div>
                </li>
            </ul>
            
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import pagination from '../../../src/components/pagination.vue';
    import axiosHttp from '../../assets/js/axiosHttp.js';
    import URL from '../../assets/js/URL.js';
    import HeaderComponent from '../../../src/components/header.vue';
    import '@/assets/js/plugin/bootstrap-datepicker.js';
    import '@/assets/css/datepicker3.css';

     Vue.filter('filterState', function (value,index) { //value为status状态码 index表示是返回的第几个 0位txt ，1为class
        let statusTxt = [];
        switch(value){
            case 0:
                statusTxt = ["签署中","signing"];
                break;
            case 1:
                statusTxt = ["已完成","finished"];
                break;
            case 2:
                statusTxt = ["已拒绝","refuse"];
                break;
            case 3:
                statusTxt = ["已撤销","refuse"];
                break;
            case 4:
                statusTxt = ["已过期","overdue"];
                break;
            default:
                break;
                 
        }
        return statusTxt[index];
    });

    export default{
        data(){
            return{
                tableLoading:false,
                page:{
                    total:0,
                    currentpageIndex:1,
                    display:8
                },
                recordList:[],
                startTime:'',  //搜索开始时间
                endTime:'',    //搜索结束时间
                searchTitle:'',//搜索文档名称
                tabIndex:100,      //文档状态index
                taskSignResult:'',    //文档状态

                headers:{
                    'token': sessionStorage.getItem("token")
                }
            }
        },
        components:{
            HeaderComponent,
            pagination
        },
        methods:{
            lookDetail(item){  //详情页面
                let state = null;   //
                this.$router.push({
                    name:"Detail",
                    params: { 
                        id:item.id
                    },
                    query:{
                        signType:item.signType,
                        result:item.taskSignResult,   //签署中-0  已完成-1  已拒绝-2   已撤销-3  已过期-4
                        startTime:this.startTime,
                        endTime:this.endTime,
                        tabIndex:this.tabIndex,
                        pageIndex:this.page.currentpageIndex
                    }
                });
            },
            getRecord(){  //获取记录列表
                if(this.startTime != '' && this.endTime != '' &&　new Date(this.startTime).getTime() > new Date(this.endTime).getTime()){
                    swal({
                        title: "温馨提示",
                        type: 'warning',
                        text: '开始日期大于截止日期，不合法',
                        timer: 2000,
                        showConfirmButton: false
                    });
                    return;
                }
                this.tableLoading = true;
                let data = new Buffer(JSON.stringify({
                    'pageNo':this.page.currentpageIndex,
                    'pageSize':this.page.display,
                    'taskSignResult':this.taskSignResult,
                    'signTitle':this.searchTitle,
                    'dateFrom':this.startTime,
                    'dateTo':this.endTime,
                    'token': sessionStorage.getItem("token")
                })).toString("base64");
                axiosHttp('post',URL['queryAllSignListWithProcedure'],{data:data},this.headers,(json)=> {
                    this.tableLoading = false;
                    if(json.code == 0){
                        this.recordList = json.content.recordList;
                        this.page.total = json.content.totalCount;

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
            changeStatus(num,signStatus){ //文档状态改变
                this.tabIndex = num;
                this.taskSignResult = signStatus;
                this.page.currentpageIndex = 1;
                this.Event2.$emit('tip2',1);
                this.getRecord();
            },
            searchDocumentLight(){   //搜索
                this.page.currentpageIndex = 1;
                this.Event2.$emit('tip2',1);
                this.getRecord();
            },
            clearHandle(){           //清空
                this.startTime = this.endTime = this.searchTitle = "";
                this.getRecord();
            },
            pageChangeHandel(val){
                this.page.currentpageIndex = val;
                this.getRecord();
            },
            init(){
                var This = this;
                /*日期控件*/
                $('#date_start').datepicker({
                    todayBtn: "linked",
                    endDate:new Date(),
                    keyboardNavigation: false,
                    forceParse: false,
                    calendarWeeks: true,
                    autoclose: true,
                    todayHighlight: true,
                    format: 'yyyy-mm-dd',  
                    
                }).on("changeDate",(e) => {
                    this.startTime = $("#date_start").find('input').val();
                    $('#date_start').find('input').val(this.startTime);
                });
                $('#date_end').datepicker({
                    todayBtn: "linked",
                    endDate:new Date(),
                    keyboardNavigation: false,
                    forceParse: false,
                    calendarWeeks: true,
                    autoclose: true,
                    todayHighlight: true,
                    format: 'yyyy-mm-dd',  
                    
                }).on("changeDate",(e) => {
                    this.endTime = $("#date_end").find('input').val();
                    $('#date_end').find('input').val(this.endTime);
                });
            }
        },
        mounted(){
            this.page.currentpageIndex = this.$route.query.pageIndex ?  Number(this.$route.query.pageIndex) : 1;
            this.tabIndex = this.$route.query.tabIndex || this.$route.query.tabIndex == 0 ? this.$route.query.tabIndex : 100;
            this.taskSignResult = String(this.$route.query.tabIndex) != 'undefined' ? (this.$route.query.tabIndex  == 100 ? '' : String(this.$route.query.tabIndex)):'';
            this.startTime = this.$route.query.startTime ? this.$route.query.startTime : '' ;
            this.endTime = this.$route.query.endTime ? this.$route.query.endTime : '';
            this.Event2.$emit('tip2',this.page.currentpageIndex);
            this.getRecord();
            this.init();

        }
    }
</script>