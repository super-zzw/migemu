<template>
	<view class="classInfo">
		<view class="banner">
			<view class="bItem">
				<view class="bItemData" v-if="classHour.sumClassHour">
					{{classHour.sumClassHour - classHour.doneTime}}
				</view>
				<view class="bItemData" v-else>
					0
				</view>
				<view class="bItemLabel">
					剩余课时
				</view>
			</view>
			<view class="bItem">
				<view class="bItemData">
					{{clasName.reservedTime || 0}}
				</view>
				<view class="bItemLabel">
					预约课时
				</view>
			</view>
			<view class="bItem">
				<view class="bItemData">
					{{classHour.doneTime || 0}}
				</view>
				<view class="bItemLabel">
					完成课时
				</view>
			</view>
			<picker v-if="courseList.length > 0" class="logoBox" @change="courseChange" range-key="courseName" :value="courseIndex" :range="courseList">
				<image class="logo" src="../../static/classInfo.png" mode=""></image>
			</picker>
			<view class="logoBox" v-else>
				<image class="logo" src="../../static/classInfo.png" mode=""></image>
			</view>
		</view>
		<view class="cont">
			<view class="tabList">
				<view class="tabItem" :class="currtenTab == 0 ? 'active' : ''" @tap="currtenTab = 0">
					消耗记录
				</view>
				<view class="tabItem" :class="currtenTab == 1 ? 'active' : ''" @tap="currtenTab = 1">
					课时详情
				</view>
			</view>
			<view class="tabCont">
				<view class="tabCont1" v-if="currtenTab == 0 && wasteClass.length > 0">
					<view class="tcItem tc1Item" v-for="(item,index) in  wasteClass" :key="index" >
						<view class="tc1Left">
							<view class="tc1Top">
								<text class="tc1Top1">{{item.courseName}}</text>
								<text class="tc1Top2 tc1Top20" v-if="item.type == 1">未开始</text>
								<text class="tc1Top2 tc1Top21" v-if="item.type == 2">已完成</text>
							</view>
							<view class="tc1Center">
								<text>{{item.lessonName}}</text>
							</view>
							<view class="tc2Boo">
								上课时间：{{item.openTime}}
							</view>
						</view>
						<view class="tc1Right">
							-{{item.courseTime}}课时
						</view>
					</view>
					<!-- <moreList @change="getMore" v-if="hasMore" ></moreList> -->
				</view>
				<view class="tabCont2"  v-if="currtenTab == 1 && wateDetail.length > 0">
					<view class="tcItem tc2Item" v-for="(item,index) in  wateDetail" :key="index" >
						<view class="tc2T1">
							<text class="tc2Name">{{item.courseName}}</text>
							<text class="tc2Status" v-if="item.studyType == 0">学习中</text>
							<text class="tc2Status" v-if="item.studyType == 1">已完成</text>
						</view>
						<view class="tc2T2">
							课程总课节：{{item.sumLesson}}
						</view>
						<view class="tc2T2">
							学习进度：{{item.fulfillLesson}}/{{item.sumLesson}}
						</view>
						<view class="tc2T3">
							<view class="tc2Progress" :style="{width:item.fulfillLesson / item.sumLesson * 100 + '%'}"></view>
						</view>
						<view class="tc2T2">
							购课时间：{{item.buyCourseTime}}
						</view>
						<view class="tc2T2">
							有效期至：{{item.indate}}
						</view>
					</view>
					<!-- <moreList @change="getMore" v-if="hasMore" ></moreList> -->
				</view>
				<view class="empty" v-if="(currtenTab == 0 && wasteClass.length == 0) || (currtenTab == 1 && wateDetail.length == 0)">
					<defaultPage ></defaultPage>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script>
import moreList from "@/components/moreList.vue";
import utils from "@/utils/method.js"
import defaultPage from "@/components/defaultPage.vue"
export default{
	components:{
		moreList,
		defaultPage
	},
	onLoad() {
		this.init();
		this.getCourseList()
	},
	data(){
		return {
			currtenTab:0,
			hasMore:true,
			classHour: {},
			wasteClass:[],
			wateDetail:[],
			courseList:[],
			courseIndex:"",
			courseId:""
		}
	},
	methods:{
		async courseChange(e){
			this.courseIndex = e.detail.value;
			this.courseId = this.courseList[this.courseIndex].courseId;
			await this.init();
		},
		getMore(){
			if(this.currtenTab == 0){
				this.wasteClass = this.wasteClass.concat(this.wasteClass)
			}
			if(this.currtenTab == 1){
				this.wasteClass = this.wasteClass.concat(this.wasteClass)
			}
		},
		// 获取我的课时
		async getClassHour(){
			const { data } = await this.$http({
				apiName: "getStudentHour",
				method: "POST",
				data:{
					courseId:this.courseId
				}
			});
			this.classHour = data;
		},
		// 获取课时详情
		async getClassHourDetail(){
			const { data } = await this.$http({
				apiName: "getClassHourDetail",
				method: "POST",
				data:{
					courseId:this.courseId
				}
			});
			data.forEach(item => {
				item.buyCourseTime = utils.unixToDatetime(item.buyCourseTime,3); // 购买时间
				item.indate = utils.unixToDatetime(item.indate,3);
			})
			
			this.wateDetail = data;
		},
		// 获取消耗记录
		async getConsumeLog(){
			const { data } = await this.$http({
				apiName: "getConsumeLog",
				method: "POST",
				data:{
					courseId:this.courseId
				}
			});
			data.forEach(item => item.openTime = utils.unixToDatetime(item.openTime))
			this.wasteClass = data;
		},
		init(){
			this.getClassHour();
			this.getClassHourDetail();
			this.getConsumeLog();
		},
		async getCourseList(){
			try{
				let res = await this.$http({
					apiName:"getCourseList",
					data:{size:100}
				})
				this.courseList = res.data.doneCourse.list.concat(res.data.underwaryCourse.list)
			}catch(e){
				//TODO handle the exception
			}
		}
	},
	async onPullDownRefresh() {
		uni.showLoading({
			title:"数据加载中...",
			mask:true
		})
		this.init();
		setTimeout(_=>{
			uni.stopPullDownRefresh();
			uni.hideLoading();
		},2000)
	},
	
}	
</script>

<style lang="scss" scoped>
.classInfo{
	min-height: 100vh;
	background-color: #fff;
	.banner{
		background-color: #2ACC8C;
		padding: 40rpx 30rpx 40rpx 60rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 180rpx;
		.bItem{
			text-align: center;
			.bItemData{
				font-weight: bold;
				color: #fff;
				font-size: 40rpx;
			}
			.bItemLabel{
				color: #D2FAEA;
				font-size: 28rpx;
				margin-top: 12rpx;
			}
		}
		.logoBox{
			width: 60rpx;
			height: 60rpx;
			background-color: #fff;
			border-radius: 50%;
			overflow: hidden;
			.logo{
				width: 60rpx;
				height: 60rpx;
			}
		}
		
	}
	.cont{
		padding-top: 60rpx;
		.tabList{
			border-bottom: 2rpx solid #D8D8D8;
			display: flex;
			justify-content: space-around;
			.tabItem{
				color: #909399;
				font-size: 32rpx;
				padding-bottom: 18rpx;
				box-sizing: border-box;
			}
			.tabItem.active{
				color: #2ACC8C;
				border-bottom: 4rpx solid #2ACC8C;
			}
		}
		.tabCont{
			padding: 32rpx;
			box-sizing: border-box;
			.tcItem{
				box-shadow:0px 4px 20px 0px rgba(0,0,0,0.12);
				border-radius:12px;
				margin-bottom: 30rpx;
				padding: 30rpx;
			}
			.empty{
				align-items: center;
				justify-content: space-around;
				display: flex;
				min-height: calc(100vh - 380rpx);
			}
			.tc1Item{
				display: flex;
				justify-content: space-between;
				align-items: center;
				.tc1Left{
					.tc1Top{
						display: flex;
						align-items: center;
						.tc1Top1{
							color: #303133;
							font-size: 32rpx;
							font-weight: bold;
						}
						.tc1Top2{
							display: block;
							color: #fff;
							font-size: 28rpx;
							line-height: 50rpx;
							padding-left: 10rpx;
							padding-right: 10rpx;
							border-radius: 8rpx;
							margin-left: 20rpx;
						}
						.tc1Top20{
							background-color: #C0C4CC;
						}
						.tc1Top21{
							background-color: #2ACC8C;
						}
					}
					.tc1Center{
						color: #606266;
						font-size: 28rpx;
						margin-top: 10rpx;
					}
					.tc2Boo{
						color: #909399;
						margin-top: 10rpx;
						font-size: 24rpx;
					}
				}
				.tc1Right{
					color: #303133;
					font-size: 32rpx;
				}
			}
			.tc2Item{
				.tc2T1{
					.tc2Name{
						color: #303133;
						font-size: 36rpx;
						font-weight: bold;
					}
					.tc2Status{
						color: #fff;
						font-size: 28rpx;
						line-height: 50rpx;
						padding-left: 10rpx;
						padding-right: 10rpx;
						border-radius: 8rpx;
						margin-left: 20rpx;
						background-color: #2ACC8C;
					}
				}
				.tc2T2{
					margin-top: 20rpx;
					color: #606266;
					font-size: 28rpx;
				}
				.tc2T3{
					display: block;
					width: 100%;
					height: 16rpx;
					border-radius: 10rpx;
					background-color: #EDEDED;
					position: relative;
					margin-top: 20rpx;
					overflow: hidden;
					.tc2Progress{
						position: absolute;
						left: 0;
						top: 0;
						height: 100%;
						background-color: #2ACC8C;
						border-radius: 10rpx;
					}
				}
			}
		}
	}
}
</style>
