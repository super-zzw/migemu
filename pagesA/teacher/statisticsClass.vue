<template>
	<view class="content">
		<view class="header flex align-center justify-between">
			<view class="data-time flex align-center">
				<picker mode="date" :value="startData"  @change="startTimeChange">
					<view class="oBg flex align-center">{{startData}} <image src="../../static/bottom.png" mode=""></image> </view>
				</picker>
				<text>至</text>
				<picker mode="date" :value="endData" @change="endTimeChange">
					<view class="oBg flex align-center">{{endData}}<image src="../../static/bottom.png" mode=""></image></view>
				</picker>
			</view>
			<view class="text-btn" @tap="searchList">查询</view>
		</view>
		<view class="goTime flex align-center justify-between">
			<text>上课时长：{{datas.totalTime}}分钟</text>
			<view class="flex align-center">
				<text>老师课时：{{datas.totalteacherCourseTime}}</text>
				<text class="border"></text>
				<text>学员课时：{{datas.totalstudentCourseTime}}</text>
			</view>
		</view>
		<view class="blocks flex flex-column align-center">
			<view class="null" v-if="datas.length == 0">
				<DefaultPage   imgWidth="220" imgHeight="206"></DefaultPage>
			</view>
			<template v-else>
				<view class="block flex flex-column" v-for="(list,index) in datas.list" :key="list.id" >
					<text class="time">{{list.startTime}}{{list.startTimeStr}} - {{list.endTimeStr}}</text>
					<view class="row one flex align-center">
						<text class="name">{{list.courseTitle}}</text>
					</view>
					<view class="m-border">
						<text class="myborder">
							{{ list.courseType == 0 ? '线下课':'线上课' }}
						</text>
						<text class="myborder">
							{{ list.courseClassType == 1 ? '1对1':list.courseClassType == 2?'1对2':'多人小班' }}
						</text>
					</view>
					<view class="row one flex align-center">
						<text class="name">{{list.lessonTitle}}</text>
					</view>
					 <!-- <text class="description one" v-if="list.courseType == 1">班级：{{list.clas}}</text>  -->
					<text class="description">学员：{{list.studentNameStr}}</text>
					<text class="description" v-if="list.courseType == 0">课室：{{list.classRoomTitle}}</text>
					<view class="tOrS flex align-center">
						<view class="t flex align-center ">老师课时：<text>{{list.teacherCourseTime}}</text></view>
						<view class="flex align-center">学员课时：<text>{{list.studentCourseTime}}</text></view>
					</view>
				</view>
			</template>
			
			
		</view>
	</view>
</template>

<script>
	import DefaultPage from "../../components/defaultPage.vue"
	import utils from "../../utils/method.js"
	export default{
		data(){
			return{
				startData: '',
				endData: '',
				datas:[], // 渲染数组
				dataObj: {}, // 数据对象
			}
		},
		methods:{
			startTimeChange(e){
				this.startData = e.detail.value;
			},
			endTimeChange(e){
				const startTime = new Date(this.startData).getTime();
				const endTime = new Date(e.detail.value).getTime();
				if(endTime <= startTime){
					uni.showToast({
						title: "选择的时间有误",
						icon: "none"
					})
					return;
				}
				this.endData = e.detail.value;
			},
			getDate() {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				let endDay = new Date(year,month,0).getDate();
				this.startData = `${year}-${month}-${day}`;
				this.endData = `${year}-${month}-${endDay}`;
			},
			// 查询
			searchList(){
				this.getReservationLesson();
			},
			// 获取课时统计列表
			async getReservationLesson(){
				uni.showLoading({
					title: "正在加载中...",
					mask:true
				})
				const arr = ['星期天','星期一','星期二','星期三','星期四','星期五','星期六'];
				const arr2 = ['totalTime','totalstudentCourseTime','totalteacherCourseTime'];
				const { data } = await this.$http({
					apiName: "getTeacherCourseCount",
					data:{
						startDateTime: this.startData,
						endDateTime: this.endData
					}
				})
				data.list.forEach(item => {
					item['startTime'] = utils.unixToDatetime(item['startTime'],3);
				})
				this.datas = data;
				uni.hideLoading();
			}
		},
		onLoad() {
			this.getDate();
			this.getReservationLesson();
		}
	}
</script>

<style scoped lang="scss">
	.content{
		min-height: 100vh;
		background-color: #FFFFFF;
	}
	.header{
		width: 100%;
		height: 120rpx;
		background-color: #FFFFFF;
		padding: 0 32rpx;
		.data-time{
			.oBg{
				width: 216rpx;
				height: 60rpx;
				border-radius: 8rpx;
				font-size: 28rpx;
				color: #F95C25;
				background-color: #FFF2ED;
				padding-left: 10rpx;
				image{
					width: 32rpx;
					height: 32rpx;
					margin-left: 4rpx;
				}
			}
			text{
				margin: 0 16rpx;
			}
		}
		.text-btn{
			padding: 8rpx 52rpx;
			background-color: #FDC623;
			color: #303133;
			font-size: 28rpx;
			border-radius:28rpx;
		}
	}
	.goTime{
		padding: 0 32rpx;
		background-color: #F6F6F6;
		width: 100%;
		height: 80rpx;
		text{
			font-size: 28rpx;
			color: #303133;
		}
		view{
			.border{
				width: 2rpx;
				height: 36rpx;
				background-color: #C0C4CC;
				margin: 0 10rpx;
			}
		}
	}
	.blocks{
		width: 100%;
		height: auto;
		.null{
			margin-top: 208rpx;
		}
		.block{
			width: 686rpx;
			height: auto;
			background: #FFFFFF;
			box-shadow:0px 4px 16px 0px rgba(0,0,0,0.12);
			border-radius:12px;
			padding: 32rpx;
			margin-bottom: 40rpx;
			&:first-of-type{
				margin-top: 30rpx;
			}
			.time{
				color: #606266;
				font-size: 28rpx;
				margin-bottom: 20rpx;
			}
			.description{
				font-size: 28rpx;
				color: #606266;
				margin-bottom: 10rpx;
				&:nth-of-type(2){
					margin-top: 16rpx;
				}
			}
			.tOrS{
				margin-top: 8rpx;
				font-size: 28rpx;
				color: #606266;
				view{
					text{
						font-size: 40rpx;
						color: #F95C25;
						font-weight: bold;
					}
				}
				.t{
					margin-right: 40rpx;
				}
			}
			.row .name{
				font-size: 32rpx;
				font-weight: bold;
				width: 590rpx;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}
			.row.one{
				height: 44rpx;
			}
			.m-border{
				margin: 10rpx 0;
			}
			.myborder{
				border-radius:21rpx;
				border:2rpx solid #FDC623;
				padding: 4rpx 12rpx;
				font-size: 24rpx;
				margin-right: 10rpx;
				color: #FDC623;
			}
			.row.two{
				font-size: 26rpx;
				color: #909399;
				margin: 16rpx 0 15rpx ;
			}
			
		}
	}
</style>
