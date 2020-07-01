<template>
	<view class="notice" v-if="isLogin">
		<view class="tab">
			<view class="tabItem" :class="currentTab == 0 ? 'active' : ''" @tap="changeTab(0)">
				<text class="text">提醒</text>
			</view>
			<view class="tabItem" :class="currentTab == 1 ? 'active' : ''" @tap="changeTab(1)">
				<text class="text">通知</text>
			</view>
		</view>
		<view class="tabCont">
			<view class="tc tc1" v-if="currentTab == 0">
				<view class="" v-if="notice1.length > 0">
					<view class="tabContItem" v-for="(item1,index1) in notice1" :key="index1" @tap="toItem(item1)">
						<view class="itemTime">
							{{item1.createTime|dealTime }}
						</view>
						<view class="itemCont">
							<view class="icTop">
								<text class="icTopText" v-if="item1.type == 1">排课提醒</text>
								<text class="icTopText" v-if="item1.type == 2">作业提醒</text>
								<text class="icTopText" v-if="item1.type == 3">结课提醒</text>
								<text class="icTopText" v-if="item1.type == 4">约课提醒</text>
								<text class="icTopText" v-if="item1.type == 5">取消约课提醒</text>
								<text class="icTopText" v-if="item1.type == 6">上课首次提醒</text>
								<text class="icTopText" v-if="item1.type == 7">课后评价提醒</text>
								<text class="icTopText" v-if="item1.type == 8">上课签到提醒</text>
								<text class="icTopText" v-if="item1.type == 9">作业提醒</text>
								<text class="icTopText" v-if="item1.type == 10">直播课室信息通知</text>
							</view>
							<view class="icBottom">
								<view class="icClass">
									{{item1.title}}
								</view>
								<!-- <view class="icLesson">
									<text>{{item1.lessonTitle}}</text>
								</view> -->
								<view class="icContent">
									<text class="t1">{{item1.content}}</text>
								</view>
								<view class="TipBox">
									<view class="leftTip">{{item1.tip}}</view>
									<view class="detail" @tap="toItem(item1)">查看详情</view>
								</view>
							</view>
							
								<!-- <view class="icBooRT">
									查看详情
								</view> -->
							
						</view>
					</view>
					<moreList @change="getMore" v-if="hasMore" ></moreList>
				</view>
				<view class="empty" v-else>
					<defaultPage></defaultPage>
				</view>
			</view>
			<view class="tc tc2" v-if="currentTab == 1">
				<view class="" v-if="notice2.length > 0">
					<view class="tabContItem" v-for="(item1,index1) in notice2"  :key="index1" @tap="toDetail(item1.id)">
						<view class="itemTime">
							{{item1.createTime|dealTime}}
						</view>
						<view class="itemCont" >
							<view class="icTop">
								{{item1.title}}
							</view>
							<view class="icSubmit">
								{{item1.subTitle}}
							</view>
							<view class="icBoo" @tap="toItem(item1)">
								查看详情
							</view>
						</view>
					</view>
					<moreList @change="getMore" v-if="hasMore" ></moreList>
				</view>
				<view class="empty" v-else>
					<defaultPage></defaultPage>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import moreList from "@/components/moreList.vue"
	import defaultPage from "@/components/defaultPage.vue"
	import utils from "../../utils/method.js"
	export default {
		components:{
			moreList
		},
		onShareAppMessage (){
			return utils.homeShare("../../static/homeshare.png")
		},
		data() {
			return {
				currentTab:0,
				hasMore:true,
				notice1:[
					
				],
				notice2:[
					
				],
				page:1,
				userRole:-1,  //初始值
				
			}
		},
		async onLoad() {
			uni.showLoading({
				title:"加载中...",
				mask:true
			})
			if(!this.isLogin){
				uni.redirectTo({
					url:'../author/author'
				})
				this.$store.commit('jumpPageSet',{
					rejectPath:"",
					path:"/pages/notice/index"
				})
			}else{
				this.userRole = this.userInfo.userType;
				uni.hideLoading()
				await this.getRemind()
			}
		},
		async onShow(){
			if(this.isLogin && this.userRole != -1){
				if(this.userInfo.userType != this.userRole){
					this.currentTab = 0;
					this.notice1 = [];
					this.page = 1;
					await this.getRemind();
					this.userRole = this.userInfo.userType;
				}
			}
			
		},
		filters:{
			dealTime(val){
				if(val){
					return utils.unixToDatetime(val)
				}else{
					return ""
				}
			}
		},
		computed:{
			...mapState(['isLogin','userInfo'])
		},
		methods: {
			toItem(item){
				switch(Number(item.type)){
					//老师课节详情
					case 1: case 3: case 4: case 5: 
						uni.navigateTo({
							url:"/pagesA/teacher/teacherLessonsDetail?aid=" + item.typeJson.arrangeCourseLessonId
						})
					break;
					//老师作业详情
					case 2:
						uni.navigateTo({
							url:"/pagesA/teacher/taskDetail?id=" + item.typeJson.jobId
						})
					break;
					//学生课节详情
					case 6: case 7: case 8: case 10:
						uni.navigateTo({
							url:"/pages/my/lessonsDetail?acid=" + item.typeJson.arrangeCourseId + "&aclid=" + item.typeJson.arrangeCourseLessonId + "&lid=" + item.typeJson.lessonId
						})
					break;
					//学生作业详情
					case 9:
						uni.navigateTo({
							url:"/pagesB/student/taskDetail?id=" + item.typeJson.srlJobId
						})
					break;
					// 学员我的课表
					case 11:
						uni.navigateTo({
							url:"/pages/my/classSchedule"
						})
					break;
					default:
						return
					break;
				}
			},
			toDetail(id){
				uni.navigateTo({
					url:"/pages/notice/detail?id=" + id
				})
			},
			getMore(){
				this.page ++ ;
				if(this.currentTab == 0){
					this.getRemind()
				}
				if(this.currentTab == 1){
					this.getNotice()
				}
			},
			changeTab(tab){
				if(this.currentTab == tab){
					return
				}else{
					this.page = 1;
					if(tab == 0){
						this.notice1 = []
						this.getRemind()
					}else if(tab == 1){
						// this.notice2 = []
						this.getNotice()
					}
					this.currentTab = tab;
				}
			},
			async getNotice(){
				uni.showLoading({
					title:"加载中...",
					mask:true
				})
				try{
					let res = await this.$http({
						apiName:"noticeList",
						data:{page:this.page}
					})
					this.notice2 = this.notice2.concat(res.data.list);
					this.hasMore = res.data.hasNextPage;
				}catch(e){
					//TODO handle the exception
				}finally{
					uni.hideLoading()
				}
				
			},
			async getRemind(){
				uni.showLoading({
					title:"加载中...",
					mask:true
				})
				try{
					let res = await this.$http({
						apiName:"remindList",
						data:{page:this.page}
					})
					
					this.notice1 = this.notice1.concat(res.data.list);
					this.hasMore = res.data.hasNextPage;
				}catch(e){
					//TODO handle the exception
				}finally{
					uni.hideLoading()
				}
			}
		},
		async onPullDownRefresh() {
			this.page = 1;
			this.hasMore == true;
			if(this.currentTab == 0){
				this.notice1 = [];
				await this.getRemind()
			}else if(this.currentTab == 1){
				this.notice2 = [];
				await this.getNotice()
			}
			uni.stopPullDownRefresh();
		},
	}
</script>

<style lang="scss" scoped>
.notice{
	min-height: calc(100vh - 86rpx);
	background-color: #F6F6F6;
	.tab{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		background-color: #fff;
		display: flex;
		.tabItem{
			width: 50%;
			text-align: center;
			.text{
				margin-top: 0;
				color: #909399;
				font-size: 32rpx;
				font-weight: bold;
				line-height: 86rpx;
				height: 86rpx;
				display: inline-block;
				box-sizing: border-box;
			}
		}
		.tabItem.active{
			.text{
				color: #FDC623;
				border-bottom: 4rpx solid #FDC623;
			}
		}
	}
	.tabCont{
		margin-top: 86rpx;
		padding-left: 28rpx;
		padding-right: 28rpx;
		.tabContItem{
			margin-bottom: 10rpx;
		}
		.tc{
			.itemTime{
				text-align: center;
				color: #909399;
				font-size: 28rpx;
				line-height: 84rpx;
			}
			.itemCont{
				background-color: #fff;
				border-radius: 12rpx;
				
				margin-bottom: 20rpx;
			}
			.empty{
				height: calc(100vh - 86rpx);
			}
		}
		.tc1{
			.itemCont{
				.icTop{
					display: flex;
					align-items: center;
					padding: 20rpx 0 20rpx 30rpx;
					border-bottom: 2rpx solid #F3F3F3;
					.icTopImgBox{
						width: 40rpx;
						height: 40rpx;
						border-radius: 50%;
						overflow: hidden;
						.icTopImg{
							width: 40rpx;
							height: 40rpx;
						}
					}
					.icTopImgBox1{
						background-color: #F72C2C;
					}
					.icTopImgBox2{
						background-color: #A92CF7;
					}
					.icTopImgBox3{
						background-color: #FDC623;
					}
					.icTopText{
						// margin-left: 10rpx;
						// padding: 20rpx 0 20rpx 30rpx;
						color: #303133;
						font-size: 28rpx;
						font-weight: bold;
					}
				}
				.icBottom{
					padding: 24rpx 32rpx 38rpx 30rpx;
					.icClass{
						// margin-top: 24rpx;
						color: #303133;
						font-size: 32rpx;
						font-weight: bold;
					}
					
					.icContent{
						margin-top: 10rpx;
						.t1{
							color: #303133;
							font-size: 32rpx;
							font-weight: 600;
						}
					}
					.TipBox{
						margin-top: 30rpx;
						display: flex;
						justify-content: space-between;
						.leftTip{
							color: #F72C2C;
							font-size:28rpx;
							font-weight:400;
							line-height:40rpx;
						}
						.detail{
							color:#F78726 ;
							font-size:24rpx;
							font-weight:400;
						}
					}
				}
				
				// .icBoo{
				// 	margin-top: 36rpx;
				// 	display: flex;
				// 	align-items: center;
				// 	justify-content: space-between;
				// 	.icBooLT{
				// 		color: #F72C2C;
				// 		font-size: 28rpx;
				// 	}
				// 	.icBooLT1{
						
				// 		.t2{
				// 			color: #909399;
				// 			font-size: 28rpx;
				// 			margin-left: 10rpx;
				// 		}
				// 	}
				// 	.icBooRT{
				// 		color: #2ACC8C;
				// 		font-size: 24rpx;
				// 		min-width: 110rpx;
				// 		text-align: center;
				// 	}
				// }
			}
		}
		.tc2{
			.itemCont{
				padding: 30rpx;
				.icTop{
					color: #303133;
					font-size: 32rpx;
					font-weight: bold;
				}
				.icSubmit{
					margin-top: 20rpx;
					color: #909399;
					font-size: 28rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 3;
					-webkit-box-orient: vertical;
				}
				.icBoo{
					margin-top: 18rpx;
					text-align: right;
					color: #F78726;
					font-size: 24rpx;
				}
			}
		}
	}
}

</style>
