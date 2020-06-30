<template>
	<view class="content">
		<view class="header flex align-center justify-center">
			<image :src="dataInfo.wechatImg" class="erweima" mode=""></image>
			<view class="info flex flex-column">
				<view class="info-top flex align-center">
					<image :src="dataInfo.avatarUrl" mode=""></image>
					{{dataInfo.name || ""}}
				</view>
				<view class="info-text flex">
					微信号：{{dataInfo.wechatCode || ""}}
				</view>
			</view>
		</view>
		<button class="btn" hover-class="none" @tap="copy(dataInfo.wechatCode)">点击复制老师微信号</button>
		<view class="rich flex align-center flex-column">
			<view class="title">课程须知</view>
			<rich-text :nodes="dataInfo.notice"></rich-text>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				dataInfo:{},
				courseId: null, // 课程标识
				teacherId: null // 老师标识
			}
		},
		onLoad({cid,tid}) {
			cid && (this.courseId = cid);
			tid && (this.teacherId = tid);
			this.getTeacherInfo();
		},
		methods:{
			copy(val){
				this.$copy(val);
			},
			async getTeacherInfo(){
				uni.showLoading({
					title: "正在加载中..."
				})
				const { data } = await this.$http({
					apiName: "getTeacher",
					method: "POST",
					data:{
						courseId: this.courseId,
						teacherId: this.teacherId
					}
				});
				data.notice = data.notice.replace(/\<img/gi, "<img class='html_img' ");
				this.dataInfo = data;
				uni.hideLoading();
			}
		}
	}
</script>

<style scoped lang="scss">
	.header{
		width: 100%;
		height: 240rpx;
		background-color: #F0FCF8;
		.erweima{
			width: 166rpx;
			height: 166rpx;
			margin-right: 44rpx;
		}
		.info{
			.info-top{
				margin-bottom: 16rpx;
				font-size: 32rpx;
				font-weight: bold;
				image{
					width: 56rpx;
					height: 56rpx;
					border-radius: 50%;
					margin-right: 10rpx;
				}
			}
			.info-text{
				font-size: 32rpx;
			}
		}
		
	}
	.btn{
		width: 540rpx;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 32rpx;
		color: #FFFFFF;
		font-weight: 500;
		margin: 40rpx 0 60rpx ;
		background-color: #FDC623;
	}
	.rich{
		width: 686rpx;
		height: auto;
		padding: 42rpx 32rpx 32rpx 32rpx;
		background-color: #F6F6F6;
		.title{
			font-size: 36rpx;
			font-weight: bold;
			margin-bottom: 20rpx;
		}
	}
</style>
