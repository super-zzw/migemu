<template>
	<view class="container">
		<image src="../../static/ok.png" class="successImg"></image>
		<text class="text1">恭喜你，参团成功</text>
		<view class="descBox">
			<view class="imgList">
				<view class="fpNumstImg" v-for="(imgItem,imgIndex) in course.imgList" :key="imgIndex">
					<image  class="img" :src="imgItem" ></image>
				</view>
				<text class="status">已支付</text>
			</view>
			<text class="text2">
				<text v-if="course.groupMinMember-course.groupMember>0">还差{{course.groupMinMember-course.groupMember}}人拼成</text>
				<text v-else>已成团</text>，剩
			<text v-if="trDate.d>0">{{trDate.d}}天</text>{{trDate.h}}小时{{trDate.m}}分钟结束</text>
		</view>
		<view class="optBtn btn1" @tap="invite">邀请好友参团</view>
		<view class="optBtn btn2" @tap="orderDetail">查看订单</view>
		
		
			<view class="mask" v-if="isInvite" @click.stop="isInvite=false"></view>
			<view class="box" :class="isInvite?'box active':'box'">
				<text class="title">分享到</text>
				<view class="shareList">
					<button
					   class="shareItem"
					   open-type="share"
					   hover-class="none">
					   <image
					      class='icon'
					      src="https://mgm-1300255297.cos.ap-nanjing.myqcloud.com/hyjy/default/share1.png" />
						  <text class="desc">微信好友</text>
					</button>
					
				</view>
				<view class="cancelBtn" @tap="isInvite=false">取消</view>
			</view>
	
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	import utils from "../../utils/method.js"
	export default {
		data() {
			return {
				isInvite:false,
				courseId:7,
				course:'',
				trDate:'',
				orderid:''
			};
		},
		
		
	   computed:{
	   	...mapState(['userInfo'])
	   },
	   onShareTimeline(opt){
	      return {
	        title: this.course.name,
	        query: "id=" + this.courseId + "&inviteCode=" + this.userInfo.inviteCode,
	        imageUrl:this.course.coverUrl,
	      }
	     },
		methods:{
			onShareAppMessage(options) {
					    return {
					      title:this.course.name,
					      path: "/pages/index/good?id=" + this.courseId + "&inviteCode=" + this.userInfo.inviteCode,
						  imageUrl:this.course.coverUrl,
						  success:()=>{
							  this.isInvite=false
						  }
					    };
			},
			invite(){
				this.isInvite=true
			},
			async getInfo(){
				let res =await  this.$http({
					apiName:"courseInfo",
					data:{
						courseId:this.courseId
					}
				})
				this.course = res.data
				this.$store.commit('orderInfoSet',this.course);
				this.trDate=utils.transToDate(res.data.groupEndTime-res.timestamp)
				console.log(this.trDate)
			},
			orderDetail(){
				
				uni.navigateTo({
					url:'/pages/order/orderDetail?fight=true',
					
				})
			}
			
		},
		
		async onLoad(opt) {
			if(opt.id){
				this.courseId=opt.id	
			}
			if(opt.orderid){
				this.orderid=opt.orderid	
			}
			uni.showLoading({
				title:"加载中...",
				mask:true
			})
			 await this.getInfo()
			 uni.hideLoading()
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		display: flex;
		height: 100vh;
		flex-direction: column;
		align-items: center;
		background: #fff;
	}
   .successImg{
	   width: 88rpx;
	   height: 88rpx;
	   margin-top: 60rpx;
   }
   .text1{
	   font-size: 28rpx;
	   font-weight: 400;
	   color: #606266;
	   margin-top: 20rpx;
   }
   .descBox{
	   margin-top: 60rpx;
	   display: flex;
	   flex-direction: column;
	   align-items: center;
	   background: #F6F6F6;
	   width: 100%;
	   .imgList{
		   display: flex;
		   margin-top: 30rpx;
		   .fpNumstImg{
		   	width: 60rpx;
		   	height: 60rpx;
		   	margin-left: -10rpx;
		   	.img{
		   		width: 100%;
		   		height: 100%;
				border-radius: 50%;
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
		  margin-bottom: 30rpx;
		  font-size: 28rpx;
		  font-weight: 500;
		  color: #606266;
	  }
	}
	.optBtn{
		width: 540rpx;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 44rpx;
		font-size: 32rpx;
		font-weight: 600;
		
	}
	.btn1{
		background: #FDC623;
		color: #303133;
		margin-top: 100rpx;
	}
	.btn2{
         border: 2rpx solid #C0C4CC;
		 color: #909399;
		 margin-top: 40rpx;
	}
	
		
		.mask{
			position: fixed;
			 top: 0;
			 left: 0;
			 width: 100vw;
			 height: 100vh;
			 background:rgba(52,52,52,0.7);
			 z-index: 100;
		}
		.box{
			height: 0;
			background: #fff;
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 100vw;
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 101;
			.title{
				font-size: 34rpx;
				font-weight: 600;
				color: #303133;
				margin-top: 30rpx;
				margin-bottom: 50rpx;
			}
			.shareList{
				display: flex;
				justify-content: space-around;
				width: 100%;
				.shareItem{
					display: flex;
					flex-direction: column;
					align-items: center;
					.icon{
						width: 80rpx;
						height: 80rpx;
						margin-bottom: 20rpx;
					}
					.desc{
						font-size: 32rpx;
						font-weight: 500;
						color: #606266;
					}
				}
			}
			.cancelBtn{
				width: 100%;
				margin-top: 52rpx;
				border-top: 2rpx solid #dbdbdb;
				height: 100rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				
				font-size: 32rpx;
			
				font-weight: 600;
				color: #909399;
			}
		
		}
		.box.active{
			height: 400rpx;
			transition: height .4s; 
		}
			
	    button{
			background: #fff;
			line-height: 1;
		}
</style>
