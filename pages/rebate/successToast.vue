<template>
	<view class="payFa">
		<view class="pfTop">
			<image src="../../static/ok.png" class="pftImg" mode=""></image>
			<view class="pfText">
				提交成功
			</view>
			<view class="pfTips">
				你的提现申请将在客服审核通过后打款，请耐心等待
			</view>
		</view>
		<view class="pfBtn2" @tap="navTo">
			返回首页
		</view>
	</view>
</template>

<script>
	export default{
		methods:{
			navTo(){
				uni.reLaunch({
					url: "../index/index"
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
			margin-top: 20rpx;
			font-size: 30rpx;
			font-weight: bold;
		}
		.pfTips{
			font-size: 26rpx;
			color: #909399;
			margin-top: 20rpx;
		}
	}
	.pfBtn2{
		margin-top: 38rpx;
		border: 2rpx solid #FDC623;
		border-radius: 44rpx;
		color: #FDC623;
		text-align: center;
		font-size: 32rpx;
		line-height: 84rpx;
		font-weight: bold;
	}
}
</style>
