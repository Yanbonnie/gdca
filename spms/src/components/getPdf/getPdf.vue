<template>
    <div class="preview" id="preview">
        <div class="iconfont  icon-close" @click="closeHandle"></div>
        <div class="clearfix signMidFix">
            <div id="tableBox" class="tableBox clf">
                <div class="signFile " valign="top">
                    <div id="pdf_mid_inner" class="signMiddleInner left sign_page_scroll">
                        <div class="s-content">
                            <div class="page_style">
                                <img width="100%" class="pdf_page_content" id="pdf_page_0" pageindex="0" src="../../assets/image/loadingpdf.gif">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="page-num">
            <a href="javascript:;" @click="goPage($event,1)" :class="[pageNumIndex == 1 ? 'display':'']">首页</a>
            <a href="javascript:;" @click="goPrePage" :class="[pageNumIndex == 1 ? 'display':'']">上一页</a>
            <div><input type="text" id="jump" v-model="pageNumIndex" @keyup.enter="jump"><span>/ &nbsp;{{pdf_page_num}}</span></div>
            <a href="javascript:;" @click="goNextPage" :class="[pageNumIndex == pdf_page_num ? 'display':'']">下一页</a>
            <a href="javascript:;" @click="goPage($event,pdf_page_num)" :class="[pageNumIndex == pdf_page_num ? 'display':'']">尾页</a>
        </div>
    </div>
</template>
<script>
    import loadingImg from '@/assets/image/loadingpdf.gif';
    import axiosHttp from '@/assets/js/axiosHttp.js'
    import URL from '@/assets/js/URL.js'
    export default{
        data(){
            return{
                loadingImg:loadingImg,
                pdf_page_num:0,
                docId:null,
                pageNumIndex:1,

            }
        },
        methods:{
            closeHandle(){
                this.$emit('closePreview'); 
            },
            goPrePage(){
                let TemPage = this.pageNumIndex;
                this.pageNumIndex > 1 ? this.pageNumIndex-- : 1 ;
                if(TemPage != this.pageNumIndex){
                    this.getPdf();
                }
            },
            goNextPage(){
                let TemPage = this.pageNumIndex;
                this.pageNumIndex < this.pdf_page_num ? ++this.pageNumIndex : this.pdf_page_num ;
                if(TemPage != this.pageNumIndex){
                    this.getPdf();
                }
            },
            jump(){
                if(this.pageNumIndex < 1){
                    this.pageNumIndex = 1;
                    this.getPdf();
                }else if(this.pageNumIndex > this.pdf_page_num){
                    this.pageNumIndex = this.pdf_page_num;
                    this.getPdf();
                }else{
                    this.getPdf();
                }
            },
            goPage(event,num){
                if($(event.target).hasClass('display')) return;
                this.pageNumIndex = num;
                this.getPdf();
            },
            getPdf(){
                let data = {
                    id:this.docId,
                    pageNum:this.pageNumIndex,
                }   
                $("#pdf_page_0").attr('src', loadingImg);      
                axiosHttp('post',URL['previewSignFile'],data,this.headers,(json)=>{
                    if(json.code == 0){
                        if($.isEmptyObject(json.content)){  //空对象
                            this.getPdf();
                        }else{
                            this.pdf_page_num = json.content.pageSize;
                            let imgUrl = json.content.imgBase64; 
                            $("#pdf_page_0").attr('src', "data:image/png;base64,"+imgUrl);         
                        }                       
                    }else{
                        this.getPdf(this.pageNumIndex);
                    }
                })
            },
            fixHeight() {
                $("#pdf_preview").height($(window).height()-108);//head50+页数标题38+padding20
                $("#pdf_mid_inner").height($(window).height()-50);
            },
        },
        mounted(){           
            this.fixHeight();
            $(window).resize(this.fixHeight);
            this.Event2.$on('getpdf',function(num,docId){
                this.docId = docId;
                if(num == 0){
                    this.pageNumIndex = 1;
                    this.getPdf();                    
                }
            }.bind(this));
        }
    }
</script>
<style lang="scss" scoped>
.signMiddleInner {
    margin: 0;
    overflow-y: auto;
    overflow-x: hidden;
    height: auto;
    width: 70%;
    margin:0 auto;
    z-index: 100;
    max-width: 800px;
}
.signFile {
    margin: 0 auto;
}
.sign_page_scroll::-webkit-scrollbar-track
{
    -webkit-box-shadow: inset 0 0 0px #F3F3F3;
    border-radius: 0px;
    background-color: #F3F3F3;
}
.sign_page_scroll::-webkit-scrollbar
{
    width: 5px;
    background-color: #8C8D90;
}

.sign_page_scroll::-webkit-scrollbar-thumb
{
    border-radius: 100px;
    -webkit-box-shadow: inset 0 0 5px #8C8D90;
    background-color: #8C8D90;
}
#preview{
    width:100%;
    height:100%;
    position: fixed;
    top:0;
    left:0;
    background: rgba(0,0,0,0.8);
    z-index:101;
    display: block;
    padding-top:50px;
}
#preview #titleName{
    color: #fff;
    font-size: 22px;
    line-height: 50px;
    height: 50px;
    text-align: center;
}
#preview .icon-close{
    position: fixed;
    top:10px;
    right: 10px;
    color: #fff;
    font-size: 20px;
    /*border: 2px rgba(255,255,255,0.5) solid;*/
    border-radius: 100%;
    width: 40px;
    height: 40px;
    line-height: 36px;
    text-align: center;
}
// #preview .icon-close:before {
//     content: '\e817';
//     font-size: 38px;
//     margin-left: 0px;
//     color: rgba(255,255,255,0.5);
// }
#preview .page-num{
    position: fixed;
    bottom:10px;
    left:50%;
    -webkit-transform: translatex(-50%);
    -moz-transform: translatex(-50%);
    -ms-transform: translatex(-50%);
    -o-transform: translatex(-50%);
    transform: translatex(-50%);
}
#preview .page-num a{
    width:80px;
    height:35px;
    -webkit-border-radius:6px;
    -moz-border-radius:6px;
    -ms-border-radius:6px;
    border-radius:6px;
    border:2px rgba(255,255,255,0.5) solid;
    float: left;
    background: rgba(0,0,0,0.5);
    color: #fff;
    text-align: center;
    line-height:32px;
    margin-right:10px;
    &.display{
        color: #4a4a4a;
        cursor: not-allowed;
    }
}
#preview .page-num div{
    height:35px;
    line-height:30px;
    background: rgba(0,0,0,0.5);
    -webkit-border-radius:6px;
    -moz-border-radius:6px;
    -ms-border-radius:6px;
    border-radius:6px;
    border:2px rgba(255,255,255,0.5) solid;
    float: left;
    margin-right:10px;
    color: #fff;
    padding-right:10px;
}
#preview .page-num div span{
    width:auto !important;
    padding-right:5px;
    font-size:12px;
}
#preview .page-num div input{
    width:40px;
    text-align: center;
    height:30px;
    line-height:30px;
    background: none;
    border:none;
    border:0;
    color: #fff;
    font-size:20px;
    outline:none !important;
    appearance:none;
    float: left;
}
#preview .page-num div span{
    float: left;
    margin-top:3px;
    padding-left:5px;
    width:30px;
}
#preview .page-num div input:focus{
    border:none;
    outline: inherit;
    border-color: transparent;
    /*background-color:yellow;*/
}
#defDocImg{
    width:100%;
    height:100%;
}
.pdf_page_content{
    width:100%;
}
</style>
