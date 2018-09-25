// import 'babel-polyfill'
// axios 实现的ajax请求
import axios from 'axios' 
import baseUrl from './config.js'

let host = window.location.host;

// let baseUrl = ''; //域名

// if(host == 'localhost:8080') { //本地环境
// 	baseUrl = "/api/sysdemo/api/v1";  //加项目名 只用于本地开发加
// 	// baseUrl = "/api/api/v1";  //加项目名 只用于本地开发加
// 	// baseUrl = "/api/back";  //加项目名 只用于本地开发加
// }else if(host == '192.168.22.102:8080'){
// 	baseUrl = "/api/sysdemo/api/v1";
// 	// baseUrl = "/api/api/v1";
// 	// baseUrl = "/api/back";
// }else {
// 	baseUrl = "/api/v1"; //测试 或生产环境
// }

// let baseUrl = this.configUrl;
// console.log("baseURL="+baseUrl);

// method get post   headers null {key:value} post以json的形式提交
export default (method,url,data,headers,sucFn,errFn) => {
	
	// axios.defaults.headers.post['Content-Type'] = 'application/json';

	headers = headers ? headers : {'X-Requested-With': 'XMLHttpRequest'};
	
	if(method == 'post') {
		axios.defaults.data = data;
	}else{
		axios.defaults.params = data;
	}
	
	axios({
		method: method,
		url: url,
		baseURL: baseUrl,
		headers: headers,
		// timeout: 5000,
	})
	.then(json => { //成功回调
		sucFn(json.data);
		if(!json.data.message) {
			swal({
			    title: "警告",
			    type: 'error',
			    text: '服务器繁忙！请稍后再试',
			    timer: 3000,
			    showConfirmButton: false
			});	
		}
	},err => { //失败回调
		if(errFn) {
			errFn(err);
		}else{
			swal({
				title: "温馨提示",
				text: '服务器繁忙！请稍后再试',
				type: 'warning',
				timer: 5000,
				showConfirmButton: false
			});
		}
	}).catch((errCatch) => {
    	console.log(errCatch);
   	
   	});;
}