// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import 'jquery' //引入jq
import 'babel-polyfill'
import store from './store/index.js'  

import '../src/assets/css/reset.css'
import '../src/assets/css/bt.css'
import '../src/assets/css/style.scss'
import '../src/assets/css/sign.scss'
import '../src/assets/css/iconfont.css'

// 弹框插件
import './assets/other/sweetalert/sweetalert.css'
import './assets/other/sweetalert/sweetalert.min.js'

import axiosHttp from  './assets/js/axiosHttp.js'
import URL from './assets/js/URL.js'

import configUrl from './assets/js/config.js'
Vue.prototype.configUrl = configUrl;
Vue.use(Vuex);

import MyPlugin from './assets/js/common.js'
Vue.use(MyPlugin)

//弹窗公共组件
import Model from './components/model/index.js';
Vue.use(Model)


Vue.filter('filterdata', function (value,index,second) {//value为13位的时间戳  index为0的话是永久有效，为1的话是为空   second(是否包含时分秒)
    function add0(m) {
        return m < 10 ? '0' + m : m
    }
    if(value){
      var time = new Date(parseInt(value));
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();
      if(second){
        return y + '.' + add0(m) + '.' + add0(d)+ ' ' +add0(h)+':'+add0(mm)+':'+add0(s);
    }else{
        return y + '.' + add0(m) + '.' + add0(d)
    }
      
    }else{
      if(index == 0){
      	return '永久有效';
      }else{
      	return '';
      }
    }   
});


// 滚动条置顶
router.beforeEach((to, from, next) => {
	
	document.body.scrollTop = 0;

	if(to.path != '/login' && to.path != '/http404') {
		store.dispatch("changeFooter",true)
		if(!sessionStorage.getItem("token") &&  !to.params.token) {
			next({path: '/login'});
		}else {
			if(to.params.token) {
				sessionStorage.setItem('token',to.params.token);
			}
			let headers = {
		        'token': sessionStorage.getItem("token")
		    };

			axiosHttp('post',URL['isLogin'],headers,headers,(json)=> {
				if(json.code == -2)  {
					sessionStorage.removeItem("loginName");
					sessionStorage.removeItem("phoneNo");
					sessionStorage.removeItem("token"); //本地存储方式
					next({path: '/login'}); 
				}else{
					sessionStorage.setItem("loginName",json.content.loginPersonToken.sessionPerson.personName);
					sessionStorage.setItem("phoneNo",json.content.loginPersonToken.sessionPerson.phone);
					store.dispatch('saveUserData',json.content.loginPersonToken.sessionPerson)
					next();
				}
			});
		}
	}else {
		next();
		store.dispatch("changeFooter",false)
	}
});


Vue.config.productionTip = false;
Vue.prototype.Event2=new Vue();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
