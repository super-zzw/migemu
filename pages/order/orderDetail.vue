<template>
	<view class="container">
		<view class="topBG"></view>
		<view class="box1">
			<view class="top">
				<image src="../../static/order1.png" class="icon"></image>
				<text class="desc">拼团成功</text>
			</view>
		</view>
		<view class="box1">
			<view class="top">
				<image src="../../static/order2.png" class="icon"></image>
				<text class="desc">拼团失败</text>
			</view>

			<text class="info">钱款将在24小时内退回您的账户</text>
		</view>
		<view class="box1">
			<view class="top">
				<image src="../../static/order3.png" class="icon"></image>
				<text class="desc">拼团中</text>
			</view>
		</view>
		<view class="box1">
			<view class="top">
				<image src="../../static/order1.png" class="icon"></image>
				<text class="desc">已付款</text>
			</view>
		</view>
		<view class="box1">
			<view class="top">
				<image src="../../static/order4.png" class="icon"></image>
				<text class="desc">已退款</text>
			</view>
		</view>
		<view class="fightBox">
			<text class="text2">还差1人拼成，剩9小时38分钟结束</text>
			<view class="imgList">
				<view class="fpNumstImg" v-for="(imgItem,imgIndex) in 5" :key="imgIndex">
					<image  class="img" src="../../static/+.png" ></image>
				</view>
				<text class="status">已支付</text>
			</view>
			
		</view>
		<view class="box2">
			<view class="section">课程名称：Pioneers系列课程-Phase 1</view>
			<view class="section">订单创建时间：2020-09-09 18:00</view>
			<view class="section">订单编号：27974937657847
				<image src="../../static/copy.png" class="copyImg"></image>
			</view>
			<view class="section">订单总金额：¥3000</view>
			<view class="section">优惠券抵扣金额：- ¥1000</view>
			<view class="section">订单实付金额：¥2000</view>
			<view class="section">付款方式：微信支付</view>
			<text class="btn1 optBtn">联系教务老师</text>
			<text class="btn2 optBtn">联系客服</text>
			<text class="btn1 optBtn">邀请好友</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		padding: 0 32rpx;
	}

	.topBG {
		position: absolute;
		background: linear-gradient(180deg, #FDC623 0%, rgba(253, 198, 35, 0) 100%);
		width: 100%;
		height: 280rpx;
		top: 0;
		left: 0;
		z-index: -1;
	}

	.box1 {
		margin-top: 32rpx;
		display: flex;
		flex-direction: column;

		.top {
			display: flex;
			align-items: center;
		}

		.info {
			margin-top: 10rpx;
		}

		.icon {
			width: 40rpx;
			height: 40rpx;
		}

		.desc {
			font-size: 36rpx;
			font-weight: 600;
			color: #303133;
			margin-left: 15rpx;
		}
	}
    .fightBox{
    	   margin-top: 38rpx;
    	   display: flex;
    	   flex-direction: column;
		   padding: 30rpx 40rpx;
    	   background: #FFFFFF;
          border-radius: 12rpx;
    	   width: 100%;
    	   .imgList{
    		   display: flex;
    		   .fpNumstImg{
    		   	width: 50rpx;
    		   	height: 50rpx;
    		   	margin-left: -15rpx;
    		   	.img{
    		   		width: 100%;
    		   		height: 100%;
    		   	}
    		   	
    	   }
    	   .status{
    		   width: 74rpx;
    		   height: 32rpx;
    		   background: #FDC623;
    		   border-radius: 19rpx;
    		   	margin-left: -15rpx;
    			font-size: 20rpx;
    			font-weight: 600;
    			color: #303133;
    			line-height: 30rpx;
    			z-index: 100;
    			text-align: center;
    	   }
    	  }
    	  .text2{
    		  margin-top: 10rpx;
    		  margin-bottom: 20rpx;
    		  font-size: 30rpx;
    		  font-weight: 500;
    		  color: #606266;
    	  }
    	}
	.box2 {
		margin-top: 40rpx;
		background: #fff;
		padding: 40rpx;
		box-shadow: 0rpx 4rpx 20rpx 0rpx rgba(0, 0, 0, 0.1);
		border-radius: 12rpx;

		.section {
			margin-bottom: 20rpx;
			font-size: 32rpx;
			font-weight: 500;
			color: #303133;

		}

		.section:last-child {
			margin-bottom: 35rpx !important
		}

		.copyImg {
			width: 36rpx;
			height: 36rpx;
			margin-left: 10rpx;
		}

		.optBtn {
			padding: 6rpx 20rpx;
			font-size: 32rpx;
			font-weight: 600;
			line-height: 40rpx;
			border-radius: 200rpx;
			margin-top: 10rpx;
		}

		.btn1 {
			background: #FDC623;
			color: #303133;
		}

		.btn2 {
			border: 2rpx solid #EAECF1;
			color: #909399;
		}
	}
</style>
