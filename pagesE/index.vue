<template>
	<view class="list">
		<view class="itemList">
			<view class="banner">
				<text class="date">2020-09-09 19:00</text>
				<text class="status">已付款</text>
			</view>
			<view class="tip">
				还差1人拼成，剩9小时38分钟结束
			</view>
			<view class="desc">
				
				<text class="lessonName sec">课程名称：Pioneers系列课程-Phase 1</text>
				<view class="r1 sec">
					<text class="orderSn">订单编号：27974937657847</text>
					<image src="../static/copy.png" class="copyImg"></image>
				</view>
				<view class="r2 sec">
					<text class="price">实付金额：¥288</text>
					<text class="optBtn type1">联系客服</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
</script>

<style lang="scss" scoped>
	.list{
		padding: 30rpx 30rpx 0;
	}
	.itemList{
		background: #FFFFFF;
		box-shadow: 0rpx 4rpx 20rpx 0rpx rgba(0,0,0,0.1);
		border-radius: 12rpx;
		width: 100%;
		
		.banner{
			display: flex;
			justify-content: space-between;
		
			align-items: center;
			border-bottom: 2rpx solid #F3F3F3;
			padding: 18rpx 30rpx;
			.date{
				font-size: 32rpx;
				font-weight: 500;
				color: #909399;
			}
			.status{
				font-size: 32rpx;
				font-weight: 500;
				color: #F72C2C;
			}
		}
		.tip{
			height: 58rpx;
			background: #FFF5D6;
			font-size: 30rpx;
			font-weight: 600;
			color: #F72C2C;
			display: flex;
			align-items: center;
			padding-left: 30rpx;
		}
		.desc{
			font-size: 32rpx;
			display: flex;
			flex-direction: column;
			padding: 24rpx 30rpx 30rpx;
			
			.sec{
				margin-bottom: 10rpx;
			}
			.r1{
				.copyImg{
					width: 36rpx;
					height: 36rpx;
					margin-left: 10rpx;
					vertical-align: middle;
				}
			}
			.r2{
				display: flex;
				justify-content: space-between;
				.optBtn {
					padding: 6rpx 20rpx;
					font-size: 32rpx;
					font-weight: 600;
					line-height: 40rpx;
					border-radius: 200rpx;
					margin-top: 10rpx;
				}
				.optBtn.type1{
                    color: #909399;
                    border: 2rpx solid #EAECF1;
				}
				.optBtn.type2{
				    color: #303133;
                    background: #FDC623;
				}
			}
		}
	}
</style>
