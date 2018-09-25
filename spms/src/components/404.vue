<template>
	<div class="wrap-404">
		<div class="middle-box text-center animated fadeInDown">
        <h1 class="title">404</h1>
        <h3 class="font-bold">亲,访问路径不存在哦！！！</h3>

        <div class="error-desc">
            <br/><router-link to="/home" class="btn-gohome">返回首页</router-link>
        </div>
    </div>
		
	</div>
</template>

<script>
	export default {
		//404页面
		name: 'http404', 
		components: {},
		data() {
			return {

			}
		},
		mounted() {

		},
		methods: {

		},
	}
</script>
<style lang="scss" scoped>
.wrap-404{
	position: absolute;
	top: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
	background-color: #f3f3f4 !important;
	text-align: center;
	padding-top: 150px;
	.title {
		font-size: 170px;
		color: #676a6c;
	}
	.btn-gohome {
		color: #fff;
		background-color: #1ab394;
		padding: 8px 15px;
		border-radius: 5px;
		margin-top: 15px;
	}
}

</style>