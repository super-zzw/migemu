<template>
	<view class="container">
		<view class="box">
			<view class="main">
				<image class="left" :src="info.wechatImg"></image>
				<view class="right">
					<view class="teacher">
						<image :src="info.avatarUrl"  class="avatar"></image>
						<text class="name txt">{{info.introduce}}</text>
					</view>
					<view class="wxCode txt">微信号：{{info.wechatCode}}</view>
				</view>
			</view>
		</view>
		<view class="copyCode" @tap="copyCode" >点击复制老师微信号</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				teacherId:'',
				info:''
			};
		},
		methods:{
			async getData(){
				try{
					let res = await this.$http({
						apiName:"teacherInfo",
						data:{teacherId:this.teacherId}
					})
					this.info = res.data
				}catch(e){
					//TODO handle the exception
				}
			},
			copyCode(){
				uni.setClipboardData({
				    data: this.info.wechatCode,
				    success: function () {
				       uni.showToast({
				       	icon:'none',
						title:'复制成功'
				       })
				    }
				});
			}
		},
		async onLoad(opt) {
			uni.showLoading({
				title:"加载中...",
				mask:true
			})
			if(opt.id){
				this.teacherId=opt.id
			}
			
			await this.getData();
			uni.hideLoading();
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		background: #fff;
	}
   .box{
	   margin-top: 60rpx;
	   width: 100%;
	   width: 690rpx;
	   height: 250rpx;
	   background: #F6F6F6;
       border-radius: 15rpx;
	   display: flex;
	   align-items: center;
	   padding-left: 100rpx;
	   overflow: hidden;
	   .main{
		   display: flex;
		   align-items: center;
		   .left{
			   width: 160rpx;
			   height: 160rpx;
			   margin-right: 20rpx;
			  
		   }
		   .right{
			   display: flex;
			   flex-direction: column;
			   .teacher{
				   .avatar{
					   width: 57rpx;
					   height: 57rpx;
					   border-radius: 50%;
					   margin-right: 15rpx;
					    vertical-align: middle;
				   }
				   .name{
					   font-size: 32rpx;
					   font-weight: 600;
					   color: #303133;
					   line-height: 57rpx;
				   }
			   }
			   .wxCode{
				   margin-top: 16rpx;
				   font-size: 32rpx;
				   font-weight: 500;
				   color: #303133;
				   line-height: 44rpx;
			   }
		   }
	   }
   }
   .copyCode{
	   width: 540rpx;
	   height: 80rpx;
	   background: #FDC623;
	   border-radius: 44rpx;
	   display: flex;
	   justify-content: center;
	   align-items: center;
	   
	   font-size: 32rpx;
	  
	   font-weight: 600;
	   color: #303133;
	   margin-top: 40rpx;
   }
   .txt{
	   overflow: hidden;
	   text-overflow: ellipsis;
	   white-space: nowrap;
	   width: 370rpx;
   }
</style>
