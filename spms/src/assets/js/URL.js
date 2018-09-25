export default {
	login_generateQRcode: '/login/generateQRcode',//生成二维码
	login_getProgress: '/login/getProgress',//验证登录
	logout: '/logout',//退出
	isLogin: '/login/isLogin',//判断是否登录
	login_changeAccount:'login/changeAccount',//切换账号

	pushSign_generateTask: '/pushSign/generateTask',//推送
	pushSign_generateLargeTask: '/pushSign/generateLargeTask',//推送大文件 pushSign/generateLargeTask


	scanSign_generateTask: '/scanSign/generateTask',//扫码
	scanSign_generateLargeTask: '/scanSign/generateLargeTask',//扫码

	signResult_getSignInfoStatus: '/signResult/getSignInfoStatus',//刷进度
	
	signResult_downloadPdf: '/signResult/downloadPdf',//下载文件

	//签署
	getPerson:'/person/getPerson',         //获取用户列表
	addContact:'/contact/add',             //添加联系人
	loadList:'/contact/loadList',          //加载联系人
	prepare4ProcessSign:'/pushSign/prepare4ProcessSign',                        //推送签署流程接口
	queryAllSignListWithProcedure:'/signInfo/queryAllSignListWithProcedure',    //获取全部签名任务列表(用户记录)
	querySignorDetail:'/signInfo/querySignorDetail',                            //获取签署详情  
	downloadFile:'/signInfo/downloadFileBySignId',                              //下载文件
	previewSignFile:'/signInfo/previewSignFile',                                //预览
	cancelSign:'/signInfo/cancelSign',                                          //拒绝签署
 	remindersSign:'/signInfo/remindersSign',                                    //催办
 	getManyFileSignInfo:'signInfo/getManyFileSignInfo',                         //多文件签署列表
}
