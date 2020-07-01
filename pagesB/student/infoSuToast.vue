<template>
	<view class="paySu">
		<view class="psTop">
			<image src="@/static/ok.png" class="pkImg" mode=""></image>
			<view class="topText">
				恭喜您，成功获得一节体验课
			</view>
		</view>
		<view class="infoBox">
			<image :src="info.wechatImg" class="qrCode" mode=""></image>
			<view class="teacher">
				<view class="top">
					<image :src="info.avatarUrl" class="teaPic" mode=""></image>
					<text class="teaName">{{info.name}}</text>
				</view>
				<view class="boo">
					微信号：{{info.wechatCode}}
				</view>
			</view>
		</view>
		<view class="copyQrCode" @tap="copy(info.wechatCode)">
			点击复制老师微信号，预约体验课
		</view>
		<text class="tips">说明：请您留意手机，您的专属课程顾问将在稍后电话联系您</text>
	</view>
</template>

<script>
import utils from '../../utils/method.js'
import { mapState } from 'vuex'
export default{
	data(){
		return {
			info:{}
		}
	},
	methods:{
		copy(data){
			utils.copy(data)
		},
		async getData(){
			try{
				let res = await this.$http({
					apiName:"getAuditionTeacher"
				})
				this.info = res.data;
			}catch(e){
				//TODO handle the exception
			}
		},
		toPath(url){
			uni.navigateTo({
				url:url
			})
		},
	},
	async onLoad() {
		await this.getData()
	}
}
</script>

<style lang="scss" scoped>
.paySu{
	min-height: 100vh;
	background-color: #fff;
	padding: 32rpx;
	box-sizing: border-box;
	.psTop{
		text-align: center;
		padding-top: 40rpx;
		padding-bottom: 60rpx;
		.pkImg{
			width: 88rpx;
			height: 88rpx;
		}
		.topText{
			margin-top: 20rpx;
			color: #606266;
			font-size: 28rpx;
		}
	}
	.infoBox{
		background-color: #F0FCF8;
		border-radius: 12rpx;
		padding: 48rpx 10rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		.qrCode{
			width: 144rpx;
			height: 144rpx;
		}
		.teacher{
			margin-left: 20rpx;
			.top{
				display: flex;
				align-items: center;
				.teaPic{
					width: 56rpx;
					height: 56rpx;
					border-radius: 50%;
				}
				.teaName{
					color: #303133;
					font-size: 32rpx;
					margin-left: 10rpx;
				}
			}
			.boo{
				margin-top: 16rpx;
				color: #303133;
				font-size: 32rpx;
			}
		}
	}
	.copyQrCode{
		width: 540rpx;
		background-color:#FDC623;
		border-radius: 44rpx;
		text-align: center;
		line-height: 80rpx;
		font-size: 32rpx;
		color: #fff;
		text-align: center;
		margin: auto;
		margin-top: 40rpx;
		font-weight: bold;
	}
	.readme{
		margin-top: 60rpx;
		border-radius: 10rpx;
		padding: 20rpx;
		background-color: #F6F6F6;
		.title{
			text-align: center;
			color: #303133;
			font-size: 36rpx;
			font-weight: bold;
		}
		.cont{
			margin-top: 20rpx;
		}
	}
	.tips{
		font-size: 26rpx;
		color: #909399;
		width: 540rpx;
		line-height:36rpx;
		display: block;
		margin: 40rpx auto 0;
	}
}
</style>
