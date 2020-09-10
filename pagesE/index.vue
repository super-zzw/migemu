<template>
	<view class="list" v-if="flag">
		<view class="itemList" v-for="item in orderList" :key="item.id" v-if="orderList.length>0">
			<view class="banner">
				<text class="date">{{orderTime(item.createTime)}}</text>
				<view v-if="item.groupRuleId!=null">
					<text class="status" v-if="item.groupStatus==0">待成团</text>
					<text class="status" v-if="item.groupStatus==1">已成团</text>
					<text class="status" v-if="item.groupStatus==-1">未成团</text>
				</view>
				<view v-else>
					<!-- <text class="status" v-if="item.orderStatus==0">待付款</text> -->
					<text class="status" v-if="item.orderStatus==1">已付款</text>
					<text class="status" v-if="item.orderStatus==2">退款中</text>
					<text class="status" v-if="item.orderStatus==3">已退款</text>
				</view>
				
			</view>
			<view class="tip" v-if="item.groupStatus==0" >
				<text v-if="item.groupMinMember-item.groupMember>0">还差{{item.groupMinMember-item.groupMember}}人拼成</text>
				<text v-else>已成团</text>，剩{{trDate(item)}}结束
			</view>
			<view class="desc" @tap="toDetail(item.id)">
				
				<text class="lessonName sec">课程名称：{{item.courseName}}</text>
				<view class="r1 sec">
					<text class="orderSn">订单编号：{{item.orderSn}}</text>
					<image src="../static/copy.png" class="copyImg" @tap.stop="copySn(item.orderSn)"></image>
				</view>
				<view class="r2 sec">
					<text class="price">实付金额：¥{{item.payAmount}}</text>
					
					<view v-if="item.groupRuleId!=null" @tap.stop="preventP">
						<button
						 v-if="item.groupStatus==0"
						   class="optBtn type2"
						   open-type="share"
						   hover-class="none"
						   :data-item="item">
						  邀请好友
						</button>
						<text class="optBtn type2" v-if="item.groupStatus==1" @tap="contactT(item.teacherId)">联系教务老师</text>
						<button open-type="contact" class="optBtn type1" hover-class="none" v-if="course.groupStatus==-1">
							联系客服
						</button>
						
					</view>
					<view v-else @tap.stop="preventP">
						
					
						<button open-type="contact" class="optBtn type1" hover-class="none" >
							联系客服
						</button>
					</view>
				</view>
			</view>
		</view>
		<DefaultPage v-if="orderList.length==0"/>
	</view>
</template>

<script>
	import utils from '@/utils/method.js'
	import {mapState} from 'vuex'
	export default{
		
		data(){
			return{
				orderList:[],
				timestamp:'',
				flag:false 
			}
		},
		onPullDownRefresh() {
			this.getGroupList()
			uni.stopPullDownRefresh()
		},
	    computed:{
			...mapState(['userInfo']),
			orderTime(){
				return function(time){
					return utils.unixToDatetime(time,1)
				}
			},
			
			trDate(){
				var This=this
				return function(obj){
					// if(obj.groupStatus==0){
						
						var date=utils.transToDate(obj.groupEndTime-This.timestamp)
						
									  if(date.h>0){
										  return date.d+'天'+date.h+'小时'+date.m+'分钟'
									  }else if(h>0){
										  return date.h+'小时'+date.m+'分钟'
									  }else{
										  return date.m+'分钟'
									  }
					// }
					
					
				}
			}
		},
		methods:{
			
			onShareAppMessage(e) {
				
				let item=e.target.dataset.item
				console.log(item)
					    return {
					      title:item.courseName,
					      path: "/pages/index/good?id=" + item.courseId + "&inviteCode=" + this.userInfo.inviteCode,
						  imageUrl:item.courseImg,
						 
					    };
			},
			contactT(id){
				
				uni.navigateTo({
					url:'./contactTeacher?id='+id
				})
			},
			async getGroupList(){
				await this.$http({
					apiName:'getOrderList',
				}).then(res=>{
					this.flag=true
					this.orderList=res.data
					this.timestamp=res.timestamp
				}).catch(err=>{})
			},
		    copySn(sn){
		    
		    	uni.setClipboardData({
		    	    data: sn,
		    	    success: function () {
		    	       uni.showToast({
		    	       	icon:'none',
		    			title:'复制成功'
		    	       })
		    	    }
		    	});
		    },
			toDetail(id){
				uni.navigateTo({
					url:'/pages/order/orderDetail?id='+id
				})
			}
		},
		async onLoad(opt) {
			uni.showLoading({
				title:"加载中...",
				mask:true
			})
			await this.getGroupList()
			uni.hideLoading()
		},
		
	
	}
</script>

<style lang="scss" scoped>
	.list{
		padding: 30rpx 30rpx 0;
		height: 100vh;
	}
	.itemList{
		background: #FFFFFF;
		box-shadow: 0rpx 4rpx 20rpx 0rpx rgba(0,0,0,0.1);
		border-radius: 12rpx;
		width: 100%;
		margin-bottom: 40rpx;
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
			.lessonName{
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
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
	button{
		background: #fff;
		line-height: 1;
		display: inline;
	}
</style>
