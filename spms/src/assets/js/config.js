let host = window.location.host;
let baseUrl = '';
if(host == 'localhost:8082') { //本地环境
  // baseUrl = "/api/sysdemo/api/v1";  //加项目名 只用于本地开发加
  baseUrl = "/api/api/v1";  ////开发环境
}else if(host == '192.168.22.102:8082'){
  // baseUrl = "/api/sysdemo/api/v1";
  baseUrl = "/api/api/v1"; //开发环境
}else {
  baseUrl = "/api/v1"; //测试 或生产环境
}

export default  baseUrl;