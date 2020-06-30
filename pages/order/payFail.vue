<template>
	<view class="payFa">
		<view class="pfTop">
			<image src="../../static/fail.png" class="pftImg" mode=""></image>
			<view class="pfText">
				支付失败
			</view>
		</view>
		<view class="pfBtn1" @tap="back">
			重新支付
		</view>
		<view class="pfBtn2" @tap="toTab('/pages/index/index')">
			返回首页
		</view>
	</view>
</template>

<script>
export default{
	methods:{
		back(){
			uni.navigateBack()
		},
		toTab(path){
			uni.switchTab({
				url:path
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.payFa{
	min-height: 100vh;
	background-color: #fff;
	padding-left: 32rpx;
	padding-right: 32rpx;
	.pfTop{
		padding-top: 80rpx;
		padding-bottom: 80rpx;
		text-align: center;
		.pftImg{
			width: 88rpx;
			height: 88rpx;
		}
		.pfText{
			color: #606266;
			margin-top: 20rpx;
			font-size: 28rpx;
		}
	}
	.pfBtn1{
		background-color: #FDC623;
		border-radius: 44rpx;
		line-height: 88rpx;
		font-size: 32rpx;
		text-align: center;
		color: #fff;
		font-weight: bold;
	}
	.pfBtn2{
		margin-top: 38rpx;
		border: 2rpx solid #C0C4CC;
		border-radius: 44rpx;
		color: #909399;
		text-align: center;
		font-size: 32rpx;
		line-height: 84rpx;
		font-weight: bold;
	}
}
</style>
