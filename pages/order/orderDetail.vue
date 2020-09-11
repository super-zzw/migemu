<template>
	<view class="container">
		<view class="topBG"></view>
		<view v-if="course.groupRuleId!=null">
			<view class="box1" v-if="course.groupStatus==0">
				<view class="top">
					<image src="../../static/order3.png" class="icon"></image>
					<text class="desc">拼团中</text>
				</view>
			</view>
			<view class="box1" v-if="course.groupStatus==1">
				<view class="top">
					<image src="../../static/order1.png" class="icon"></image>
					<text class="desc">拼团成功</text>
				</view>
			</view>
			<view class="box1" v-if="course.groupStatus==-1">
				<view class="top">
					<image src="../../static/order2.png" class="icon"></image>
					<text class="desc">拼团失败</text>
				</view>
			
				<text class="info">钱款将在24小时内退回您的账户</text>
			</view>
		</view>
		<view v-else>
			<view class="box1" v-if="course.orderStatus==1">
				<view class="top">
					<image src="../../static/order1.png" class="icon"></image>
					<text class="desc">已付款</text>
				</view>
			</view>
			<view class="box1" v-if="course.orderStatus==3">
				<view class="top">
					<image src="../../static/order4.png" class="icon"></image>
					<text class="desc">已付款</text>
				</view>
			</view>
			<!-- <text class="status" v-if="item.orderStatus==0">待付款</text> -->
		</view>
		
		
		
		
		<view class="fightBox" v-if="course.groupStatus==0">
			<text class="text2">还差{{course.groupMinMember-course.groupMember}}人拼成，剩{{trDate}}结束</text>
			<view class="imgList">
				<view class="fpNumstImg" v-for="(imgItem,imgIndex) in course.imgList" :key="imgIndex">
					<image  class="img" :src="imgItem" ></image>
				</view>
				<text class="status">已支付</text>
			</view>
			
		</view>
		<view class="box2">
			<view class="section">课程名称：{{course.courseName}}</view>
			<view class="section">订单创建时间：{{createTime}}</view>
			<view class="section">订单编号：{{course.orderSn}}
				<image src="../../static/copy.png" class="copyImg" @tap="copySn"></image>
			</view>
			<view class="section">订单总金额：¥{{course.payAmount}}</view>
			<view class="section" v-if="course.groupRuleId==null&&course.couponAmount>0">优惠券抵扣金额：- ¥{{course.couponAmount}}</view>
			<view class="section">订单实付金额：¥{{(course.payAmount-course.couponAmount).toFixed(2)}}</view>
			
			<view class="section" v-if="course.payType==-1">付款方式：未支付</view>
			<view class="section" v-if="course.payType==0">付款方式：微信支付</view>
			<view class="section" v-if="course.payType==1">付款方式：现金支付</view>
			<view class="section" v-if="course.payType==2">付款方式：支付宝支付</view>
			<view class="section" v-if="course.payType==3">付款方式：POS机支付</view>
			
			<view v-if="course.groupRuleId!=null" @tap.stop="preventP" style="margin-top: 50rpx;">
				<button
				 v-if="course.groupStatus==0"
				   class="btn1 optBtn"
				   open-type="share"
				   hover-class="none"
				   >
				  邀请好友
				</button>
				<text class="btn1 optBtn" v-if="course.groupStatus==1" @tap="contactT">联系教务老师</text>
				<!-- <text class="btn2 optBtn" v-if="course.groupStatus==-1" @tap="contactT">联系客服</text> -->
				<button open-type="contact" class="btn2 optBtn" hover-class="none" v-if="course.groupStatus==-1">
					联系客服
				</button>
			</view>
			<view v-else style="margin-top: 50rpx;">
				<!-- <text class="optBtn type1" v-if="item.orderStatus==0">待付款</text> -->
				<!-- <text class="btn2 optBtn" @tap="contactT">联系客服</text> -->
				<button open-type="contact" class="btn2 optBtn" hover-class="none">
					联系客服
				</button>
			</view>
			
		</view>
	</view>
</template>

<script>
	import utils from '../../utils/method.js'
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				courseId:'',
				course:'',
				timestamp:'',
				createTime:'',
				isFight:false
			};
		},
		computed:{
			...mapState(['userInfo']),
			trDate(){
				if(this.course.groupStatus==0){
					var trDate=utils.transToDate(this.course.groupEndTime-this.timestamp)
					
								  if(trDate.h>0){
									  return trDate.d+'天'+trDate.h+'小时'+trDate.m+'分钟'
								  }else if(h>0){
									  return trDate.h+'小时'+trDate.m+'分钟'
								  }else if(m==0){
									   return trDate.h+'小时'
								  }else
								  {
									  return trDate.m+'分钟'
								  }
				}
					
					
				
			}
		},
		async onLoad(opt) {
			uni.showLoading({
			  title:'加载中'	
			})
			if(opt.fight){
				this.isFight=true
			}
			if(opt.id){
				this.courseId=opt.id
			}
			await this.getData()
			uni.hideLoading()
		},
		methods:{
			onShareAppMessage() {
					    return {
					      title:this.course.courseName,
					      path: "/pages/index/good?id=" + this.course.courseId + "&inviteCode=" + this.userInfo.inviteCode,
						  imageUrl:this.course.courseImg,
						 
					    };
			},
			copySn(){
				uni.setClipboardData({
				    data: this.course.orderSn,
				    success: function () {
				       uni.showToast({
				       	icon:'none',
						title:'复制成功'
				       })
				    }
				});
			},
			contactT(){
				uni.navigateTo({
					url:'/pagesE/contactTeacher?id='+this.course.teacherId
				})
			},
			async getData(){
				let dataInfo={}
				if(!this.isFight){
					dataInfo['orderId']=this.courseId
				}
				let res =await this.$http({
					apiName:"getOrderInfo",
					data:dataInfo
				})
				this.course = res.data
				this.timestamp=res.timestamp
			    this.createTime=utils.unixToDatetime(res.data.createTime,1) 
				
			},
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
			padding: 15rpx 30rpx;
			font-size: 32rpx;
			font-weight: 600;
			line-height: 40rpx;
			border-radius: 200rpx;
			
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
	button{
		display: inline;
	}
</style>
