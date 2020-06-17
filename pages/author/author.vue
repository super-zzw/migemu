<template>
	<view class="content">
		<image src="../../static/logo.png" mode="" class="icon"></image>
		<text class="title">鹦鹉学唱</text>
		<text class="tips">为了保证用户安全和良好的用户体验，请确认授权以下信息</text>
		<view class="text flex align-center">
			<text class="radius"></text>
			<text class="statement">获得你的公开信息(昵称、头像、地区及性别)</text>
		</view>
		<button class="btn greenBtn"  hover-class="none" open-type="getUserInfo" lang="zh_CN" @getuserinfo="onGotUserInfo()">授权登录</button>
		<button class="btn emptyBtn" hover-class="none" @tap="back">暂不登录</button>
	</view>
</template>

<script>
import utils from '../../utils/method.js'
export default{
	methods:{
		async onGotUserInfo() {
			uni.showLoading({
			    title: '授权请求中...' 
			});
			try{
				let result = await utils.wxLogin();
				if(result){
					this.$store.commit("userInfoSet",result);
					await this.$http({apiName: "cacheJsCode",method:"POST",data: {jsCode:result.jsCode}})
					const data = await this.$http({
						apiName: "isBindRoutine",
						method: "POST",
						hiddenToast:true,
						data:{
							jsCode:result.jsCode
						}
					});
					uni.setStorageSync('session',data.data); // 存session
					this.$store.commit('isLoginSet',true); // 把登录状态变成true
					await this.getUserInfo();
					utils.dealResolvePage()
				}else{
					uni.showToast({
						icon: 'none',
						title: "授权失败",
						duration: 1500
					});
				}
				uni.hideLoading()
			}catch(e){
				if(e.data.code === 500005){
					uni.navigateTo({
						url: "./telBind"
					})
				}
				uni.hideLoading()
			}
			
		},
		back(){
			utils.dealRejectPage()
		},
		// 获取用户信息
		async getUserInfo(){
			const data = await this.$http({apiName: "getUserInfo"});
			if(data.code === 300000){
				uni.showToast({
					title: "授权已过期,请重新授权",
					icon: "none"
				});
				uni.navigateBack();
			}else{
				let _data = data.data
				this.$store.commit('userInfoSet',_data);
				this.$store.commit('userRoleChange',_data.userType);
			}
			
		},
	}
}
</script>

<style scoped lang="scss">
	.content{
		min-height: 100vh;
		background-color: #FFFFFF;
	}
	.icon{
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		margin: 50rpx 0 20rpx;
	}
	.title{
		font-size: 32rpx;
		font-weight: bold;
	}
	.tips{
		margin: 40rpx 0 20rpx 0;
		padding: 0 32rpx;
		color: #909399;
		font-size: 26rpx;
		width: 100%;
	}
	.text{
		width: 100%;
		padding: 0 32rpx;
		.radius{
			width: 12rpx;
			height: 12rpx;
			background-color: #2ACC8C;
			border-radius: 50%;
			margin-right: 10rpx;
		}
		.statement{
			font-size: 30rpx;
			line-height: 42rpx;
			font-weight: 400;
		}
	}
	.greenBtn{
		background-color: #2ACC8C;
		color: #FFFFFF;
		margin:80rpx 0 40rpx 0;
	}
	.emptyBtn{
		background-color: #FFFFFF;
		border:2rpx solid rgba(42,204,140,1);
		border-radius: 44px;
		color: #2ACC8C;
	}
</style>
