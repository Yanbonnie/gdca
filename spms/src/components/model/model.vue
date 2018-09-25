<template>
    <div class="cover-box" >
        <div class="alert-model" :style="'width:'+alelrtClassWidth">
            <div class="alert-header" v-show="showTitle">
                <slot name="alert-header">
                    <h3>{{title}}</h3>
                </slot>
            </div>
            <div class="alert-body">
                <i class="iconfont icon-close" @click="cancelHandle"></i>
                <slot name="alert-content">
                    <h3>{{context}}</h3>
                </slot>
            </div>
            <div class="alert-footer">
                <slot name="alert-footer">
                    <div v-show="type == 2">
                        <a href="javascript:;" class="cancel-btn"  @click="cancelHandle">取消</a>
                        <a href="javascript:;" class="sure-btn" @click="sureHandle" >{{sureBtnTxt}}</a>
                    </div>
                    <div v-show="type == 1">
                        <a href="javascript:;" class="center-btn"  @click="cancelHandle">{{sureBtnTxt}}</a>
                    </div>
                </slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'alert-box',
  props: {
        title: {            // 名称
            type: String,
            default: "提示框"
        },
        context:{
            type:String,
            default:"这里是提醒文字"
        },
        showState:{         //弹框状态
            type:Boolean,
            default:false
        },
        alelrtClassWidth:{    //给alert添加样式
            type:String,
            default:'398px'
        },
        type:{
            type:Number,   //只有一个确定
            default:1
        },
        sureBtnTxt:{        //解决多次点击确定问题
            type:String,
            default:"确定"
        },
        showTitle:{
            type:Boolean,
            default:false
        }
    },
    data() {
        return {
        }
    },
    methods: {
        cancelHandle(){
            this.$emit("cancelHandle");
        },
        sureHandle(){
            if(this.sureBtnTxt == "确定"){
                this.$emit("sureHandle");
            }           
        }
    }
}
</script>
<style scoped lang="scss">
 @import '../../assets/css/iconfont.css';
 a{text-decoration:none;}
 $border:#dedede;
.cover-box{
    width:100%;
    position:fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background:rgba(0,0,0,0.8);
    z-index: 9999;
    overflow-y: auto;
    .alert-model{
        width:398px;
        position:absolute;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        -ms-transform: translate(-50%,-50%);
        background:#fff;
        border-radius:12px;
        padding:0 0 20px;
        .alert-header{
            height:45px;
            line-height:45px;
            padding:0;
            h3{
                font-size:16px;
                color:#4B4B4B;
                position:relative;
                border-bottom:1px #dedede solid;
                padding:0 20px;
                font-weight: normal;
                i{
                    width:45px;
                    height:45px;
                    text-align:right;
                    font-size:25px;
                    color:#4B4B4B;
                    position:absolute;
                    right:0px;
                    top:0;
                    font-weight: normal;
                }
            }
            
        }
        .alert-sweet{
            width: 150px;
            height: 150px;
            position: absolute;
            left: 50%;
            margin-left: -75px;
            border-radius: 100%;
            -ms-border-radius:100%;
            top: -70px;
            background:#fff;
            z-index: 1;
            img{
                width: 150px;
                position: absolute;
                left: 30px;
                top: 20px;
            }
        }
        .alert-body{
            padding:50px 20px 40px;
            min-height:20px;
            text-align:center;
            position: relative;
            z-index: 2;
            .icon-close{
                position:absolute;
                top: -30px;
                right: -30px;
                color: #fff;
                font-size: 12px;
                line-height:30px;
                text-align:center;
                width:30px;
                height:30px;
                border-radius: 100%;
                -ms-border-radius:100%;
                border:1px #fff solid;
                cursor: pointer;
            }
            h3{
                font-weight: normal;
                line-height:35px;
                font-size: 16px;
            }
            ul{
                li{
                    text-align:left;
                    border-bottom:1px #dedede solid;
                    height:45px;
                    line-height:45px;
                    padding-left: 15px;
                }
            }
        }
        .alert-footer{
            max-width: 400px;
            width: 80%;
            margin: 0 auto;
            a,button{
                height:40px;
                line-height:40px;
                text-align:center;
                border:1px #e6e6e6 solid;
                border-radius:4px;
                display:block;
                max-width:150px;
                width: 40%;
                margin:2.5%;
                float:left;
                &.cancel-btn{
                    background:#e6e6e6;
                    color:#4b4b4b;
                }
                &.sure-btn{
                    background:#ff503f;
                    color:#fff;
                    border:1px #ff503f solid;
                    float:right;
                }
                &.center-btn{
                    background:#ff503f;
                    color:#fff;
                    border:1px #ff503f solid;
                    float:none;
                    margin:2.5% auto;
                }
            }
        }
    }
}
</style>
