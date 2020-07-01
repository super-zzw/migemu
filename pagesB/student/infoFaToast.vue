<template>
	<view class="payFa">
		<view class="pfTop">
			<image src="@/static/fail.png" class="pftImg" mode=""></image>
			<view class="pfText">
				提交失败
			</view>
		</view>
		<view class="pfBtn1" @tap="back">
			返回再次提交
		</view>
		<navigator class="pfBtn2" hover-class="none" target="miniProgram" open-type="exit">
			退出
		</navigator>
	</view>
</template>

<script>
export default{
	methods:{
		back(){
			uni.navigateBack()
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
		padding-top: 40rpx;
		padding-bottom: 40rpx;
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
		width: 540rpx;
		background-color: #FDC623;
		border-radius: 44rpx;
		line-height: 88rpx;
		font-size: 32rpx;
		text-align: center;
		color: #303133;
		font-weight: bold;
		margin: 0 auto;
	}
	.pfBtn2{
		width: 540rpx;
		margin-top: 38rpx;
		border:2px solid rgba(192,196,204,1);
		border-radius: 44rpx;
		color: #909399;
		text-align: center;
		font-size: 32rpx;
		line-height: 84rpx;
		font-weight: bold;
		margin: 38rpx auto 0 ;
	}
}
</style>
