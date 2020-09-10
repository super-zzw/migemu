<template>
	<view class="container">
		<view class="banner">
			<image src="../static/wanfa.png" class="icon1"></image>
			<text class="content">参团</text>
			<text class="line"></text>
			<text class="content">邀请好友</text>
			<text class="line"></text>
			<text class="content">满员购课(不满员退款)</text>
			<!-- <image src="../static/rule.png" class="icon2"></image> -->
		</view>
		<view class="list" v-if="list.length>0">
			<view class="itemList" v-for="item in list" :key="item.id" @tap="toDetail(item.courseId)">
				<image :src="item.courseImg" class="lesson-img"></image>
				<view class="main">
					<view class="title">
						<text class="t1">{{item.courseName}}</text>
						
						<text class="tag" v-if="item.courseType==0">线下课</text>
						<text class="tag" v-if="item.courseType==1">线上课</text>
					</view>
					<view class="price">
						<text class="now">¥{{item.courseGrouponPrice}}</text>
						<text class="origin">¥{{item.courseOriginalPrice}}</text>
					</view>
					<view class="bt">
						<view class="left">
							<uni-countdown color="#FFFFFF" background-color="#F23D3D" border-color="#F23D3D" 
							splitorColor="#F23D3D"  :day="item.day" :hour="item.hour" :minute="item.minute" 
							:second="item.second" @timeup="timeUp"> </uni-countdown>
							<text class="t1">后结束</text>
						</view>
					    <view class="right" @tap="toFight()">
							<image src="../static/add1.png" mode=""></image>
							参团
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="nullPage" v-if="list.length==0" >
			<DefaultPage />
		</view>
		
	</view>
</template>

<script>
	import uniCountdown from "@/components/linnian-CountDown/uni-countdown.vue"
	import utils from '@/utils/method.js'
	export default{
		components:{
			uniCountdown
		},
		data(){
			return{
				page:1,
				size:4,
				list:[],
				currentTime:'',
				hasNextPage:true
			}
		},
	   onReachBottom() {
		   if(this.hasNextPage){
			   this.page++
			   this.getGroupList()
		   }else{
			
			   	uni.showToast({
			   		icon:'none',
			   		title:'没有更多了...'
			   	})
			   
		   }
	   },
	   onPullDownRefresh() {
	   	this.page=1
		this.list=[]
		this.getGroupList()
		uni.stopPullDownRefresh()
	   },
		methods:{
			async getGroupList(){
				uni.showLoading({
					title:'加载中...'
				})
				await this.$http({
					apiName:'getGroupList',
					data:{
						page:this.page,
						size:this.size
					}
				}).then(res=>{
					uni.hideLoading()
					this.hasNextPage=res.data.hasNextPage
					
					this.list=this.list.concat(res.data.list)
					
					this.currentTime = res.timestamp;
					this.list.map(item => {
						if(item.status == 0){
							item["startDate"] = utils.unixToDatetime(item.startTime,8)
						}
						if(item.status == 1){
							var etime = item.endTime - this.currentTime;
							if(etime > 0){
								let _trDate = utils.transToDate(etime);
								item["day"] = _trDate.d;
								item["hour"] = _trDate.h;
								item["minute"] = _trDate.m;
								item["second"] = _trDate.s;
							}
						}
					})
					
				})
			},
			toDetail(id){
				uni.navigateTo({
					url:'/pages/index/good?id='+id
				})
			}
		},
		async onLoad(opt) {
			await this.getGroupList()
		},
	
	}
</script>

<style lang="scss" scoped>
	.container {
		background: #fff;
		min-height: 100vh;
	}

	.banner {
		height: 88rpx;
		background: #F6F6F6;
		font-size: 28rpx;
		font-weight: 500;
		display: flex;
		align-items: center;
		padding: 0 32rpx;

		.icon1 {
			width: 68rpx;
			height: 44rpx;
			margin-right: 15rpx;
		}

		.content {
			margin-right: 5rpx;
		}

		.line {
			width: 28rpx;
			height: 2rpx;
			background-color: #909399;
			margin-right: 8rpx;
		}

		.icon2 {
			width: 38rpx;
			height: 38rpx;

		}
	}

	.list {
		padding: 30rpx 32rpx 50rpx;
        
		.itemList {
			margin-top: 40rpx;
			display: flex;
			align-items: center;
			.lesson-img {
				width: 190rpx;
				height: 234rpx;
				border-radius: 16rpx;
				box-shadow: 0px 12px 20px 0px rgba(253, 198, 35, 0.2);
			}

			.main {
				margin-left: 22rpx;
				flex: 1;
				.title {
					
					margin-top: 15rpx;
                     .t1{
						 display: block;
						 width: 400rpx;
						 overflow:hidden;
						 text-overflow:ellipsis;
						 white-space:nowrap;
						 flex-wrap: nowrap;
						 font-size: 32rpx;
						 font-weight: 600;
						 color: #303133;
						  margin-bottom: 10rpx;
					 }
					.tag {
						padding: 0 15rpx;
						border-radius: 21rpx;
						border: 2rpx solid #F78726;
						line-height: 36rpx;
						font-size: 28rpx;
                       
						
						font-weight: 500;
						color: #F78726;
					}
				}
				.price{
					margin-top: 20rpx;
					display: flex;
					align-items: flex-end;
					.now{
						font-size: 36rpx;
						font-weight: 600;
						color: #F72C2C;
						margin-right: 16rpx;
					}
					.origin{
					    text-decoration: line-through;
						font-size: 28rpx;
						font-weight: 500;
						color: #C0C4CC;
					}
				}
				.bt{
					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					margin-top: 25rpx;
					.left{
						display: flex;
						align-items: center;
						.t1{
							
							font-size: 32rpx;
							margin-left: 10rpx;
							font-weight: 500;
							color: #909399;
						}
					}
					.right{
						width: 132rpx;
						height: 56rpx;
						background: #FDC623;
						border-radius: 28rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						
						font-size: 32rpx;
			
						font-weight: 600;
						color: #303133;
						image{
							width: 24rpx;
							height: 24rpx; 
							margin-right: 10rpx;
						}
					}
				}
			}

		}
		.itemList:first-child{
			margin-top: 0;
		}
	}
	.nullPage{
		height: 80vh;
	}
</style>
