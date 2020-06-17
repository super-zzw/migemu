<template>
	<view class="content" v-if="isLogin">
		<view class="top flex align-center justify-between">
			<view class="left flex" v-if="userInfo.userType === 2">
				<image :src="userInfo.avatarUrl" class="avaterUrl"></image>
				<view class="user-info">
					<view class="user-name flex">
						<text class="name">{{ userInfo.nickName || userInfo.name }}</text>
						<text class="identity">学员</text>
					</view>
					<view class="age">{{studentAge}}</view>
				</view>
			</view>
			<view class="left flex" v-if="userInfo.userType === 1">
				<image :src="userInfo.avatarUrl" class="avaterUrl"></image>
				<view class="user-info">
					<view class="user-name flex">
						<text class="name">{{ userInfo.nickName || userInfo.name }}</text>
					</view>
					<text class="identity t">教师</text>
				</view>
			</view>
			<view class="right flex align-center">
				<view @tap="toPath('/pages/author/userInfo?edit=1')" class="flex align-center justify-center one">
					<image  src="../../static/my/edit.png" mode="" class="edit"></image>
				</view>
				<view @tap="toPath('/pages/my/set')" class="flex align-center justify-center two">
					<image  src="../../static/my/config.png"  mode=""></image>
				</view>
			</view>
		</view>
		<view class="block notYet flex flex-column align-center">
			<view class="title">最近待上课节</view>
			<swiper :duration="500" class="outer-swiper" :class="userInfo.userType === 1 ? 'teacher' : ''" :disable-touch="true" :current="current">
				<swiper-item @touchmove.stop>
					<view class="swiper-item o">
						<DateSwitch @day="getDay" @type="getType" @change="dateChange" @navTo="navTo('./classSchedule?move=1')"></DateSwitch>
						<DefaultPage tipsText="- 今天没有待上课节哦 -" imgWidth="128" imgHeight="124" v-if="course.length === 0"></DefaultPage>
						<swiper :duration="500" class="swiper-inside" :indicator-dots="course.length != 0 ? true : false" indicator-active-color="#ccc" :vertical="true" v-if="userInfo.userType === 2 && course.length != 0">  <!-- 是学生 -->	
							<swiper-item v-for="(list, index) in course" :key="list.id" @tap="navTo(`./lessonsDetail?acid=${list.arrangeCourseId}&aclid=${list.arrangeCourseLessonId}&lid=${list.lessonId}`)">
								<view class="swiper-item">
									<view class="calendar-description">{{ list.lessonsName }}</view>
									<view class="calendar-time">{{ list.classInfo }}</view>
									<view class="calendar-time flex align-center">
										上课时间：{{ list.startTime }}
										<text class="grayBg">未开始</text>
									</view>
								</view>
							</swiper-item>
						</swiper>
						<swiper :duration="500" class="swiper-inside teacher" :indicator-dots="true" indicator-active-color="#ccc" :vertical="true" v-if="userInfo.userType === 1 && course.length != 0">
							<swiper-item v-for="(list, index) in course" :key="list.id" @tap="navTo(`../../pagesA/teacher/teacherLessonsDetail?aid=${list.arrangeCourseLessonId}`)">
								<view class="swiper-item row">
									<view class="row one flex align-center"><text class="name">{{list.courseTitle}}</text></view>
									<view class="m-border">
										<text class="myborder">
											{{ list.courseType == 0 ? '线下课':'线上课' }}
										</text>
										<text class="myborder">
											{{ list.courseClassType == 1 ? '1对1':list.courseClassType == 2?'1对2':'多人小班' }}
										</text>
									</view>
									<view class="row one flex align-center"><text class="name two">{{list.lessonTitle}}</text></view>
									<view class="row two els">学员：{{list.studentNameStr}}</view>
									<view class="row two">时间段：{{list.startTimeStr}}-{{list.endTimeStr}}</view>
									<view class="tipss">
										<text :class="list.signInFlag == 1 ? 'greenBg' : 'grayBg'" >{{list.signInFlag == 1 ?'已签到' : '未签到'}}</text>
										<text v-if="list.courseType == 1" :class="list.liveUrl ? 'greenBg' : 'grayBg'">{{list.liveUrl ? '已填写课室号':'未填写课室号'}}</text>
									</view> 
								</view>
							</swiper-item>
						</swiper>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="block nav flex " v-if="userInfo.userType === 2">
			<template v-for="(item, index) in navLists">
				<navigator class="col flex align-center justify-center flex-column" :key="item.id" v-if="!item.isBtn" :url="item.to" hover-class="none">
					<image :src="item.src"></image>
					<text>{{ item.text }}</text>
				</navigator>
				
				<button open-type="contact" class="wxBtn col flex align-center justify-center flex-column cBtn" v-else :key="item.id"  hover-class="none">
					<image :src="item.src"></image>
					<text>{{ item.text }}</text>
				</button>
				
			</template>
		</view>
		<view class="block nav flex " v-if="userInfo.userType === 1">
			<template v-for="(item, index) in teacherNavList" >
				<navigator class="col flex align-center justify-center flex-column" :key="item.id"   :url="item.to" hover-class="none">
					<image :src="item.src"></image>
					<text>{{ item.text }}</text>
				</navigator>
				
			</template>
		</view>
	</view>
</template>

<script>
import DateSwitch from '../../components/dateSwitch.vue';
import DefaultPage from "../../components/defaultPage.vue"
import Utils from '../../utils/method.js';
import { mapState } from 'vuex';
export default {
	components: {
		DateSwitch,
		DefaultPage
	},
	onShareAppMessage (){
		return Utils.homeShare("../../static/homeshare.png")
	},
	data() {
		return {
			navLists: [
				{
					src: require('../../static/my/icon1.png'),
					text: '我的课表',
					to: './classSchedule'
				},
				{
					src: require('../../static/my/icon2.png'),
					text: '我的作业',
					to: '/pagesB/student/task'
				},
				{
					src: require('../../static/my/icon3.png'),
					text: '我的课时',
					to: './classInfo'
				},
				{
					src: require('../../static/my/icon4.png'),
					text: '邀请返利',
					to: '../rebate/index'
				},
				{
					src: require('../../static/my/icon5.png'),
					text: '我的积分',
					to: './myIntegral'
				},
				{
					src: require('../../static/my/icon6.png'),
					text: '如何上课',
					to: '../index/article?id=4'       
				},
				{
					src: require('../../static/my/icon7.png'),
					text: '联系客服',
					to: '',
					isBtn:true
				},
				{
					src: require('../../static/my/icon8.png'),
					text: '关于我们',
					to: '../index/article?id=5'   
				}
			],
			teacherNavList: [
				{
					src: require('../../static/teacher/icon1.png'),
					text: '课表管理',
					to: './classSchedule'
				},
				{
					src: require('../../static/teacher/icon2.png'),
					text: '课后管理',
					to: '/pagesA/teacher/afterClass'
				},
				{
					src: require('../../static/teacher/icon3.png'),
					text: '作业管理',
					to: '/pagesA/teacher/task'
				},
				{
					src: require('../../static/teacher/icon4.png'),
					text: '课时统计',
					to: '/pagesA/teacher/statisticsClass'
				}
			],
			course: [],
			teacherCourse: [
				{
					textData: [
						{
							text: '线下课',
							color: '#008c8c'
						}
					]
				}
			],
			today: [],
			studentAge: "" , //学生才需要
			day:0, 
			type:0,
			now:null,
		};
	},
	computed: {
		...mapState(['userRole', 'userInfo','isLogin'])
	},
	onLoad() {
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
				path:"/pages/my/index"
			})
		}
	},
	async onShow() {
		if(this.isLogin){ // 如果是学生，年龄会变，需要重新计算 
			await this.getUserInfo();
			await this.getLessonsList();
			this.studentAge = Utils.getOld(this.userInfo.birthday);
		}
	},
	methods: {
		toPath(path) {
			uni.navigateTo({
				url: path
			});
		},
		// 获取用户个人资料
		async getUserInfo(){
			const {data} = await this.$http({apiName: "getUserInfo"});
			if(data.userType === 2){
				this.studentAge = Utils.getOld(data.birthday);
			}
			this.$store.commit('userInfoSet',data);
			this.$store.commit('userRoleChange',data.userType);
		},
		// 获取待上课节
		async getLessonsList(){
			try{
				let apiName = "",method = "";
				uni.showLoading({
					title: "正在加载中...",
					mask: true
				})
				if(this.userInfo.userType === 2){
					apiName = "getNotLessonsList";
					method = "POST";
				}else{
					apiName = "getTeachSelectDate";
					method = "GET";
				};
				const requestData = {
					day: this.day,
					type: this.type
				}
				const { data } = await this.$http({
					apiName,
					method,
					data:requestData
				});
				if(data.length !== 0){
					data.list.forEach(item => {item['startTime'] = Utils.unixToDatetime(item['startTime'])});
				}
				this.course = data.list;
				uni.hideLoading();
			}catch(e){
				console.log(e)
				uni.hideLoading();
			}
		},
		async onPullDownRefresh() {
			uni.showLoading({
				title:"数据加载中...",
				mask:true
			})
			this.getLessonsList();
			setTimeout(_=>{
				uni.stopPullDownRefresh();
				uni.hideLoading();
			},1500)
		},
		getDay(e){
			this.day = e;
		},
		getType(e){
			this.type = e;
		},
		dateChange(e) { // 日期切换
			this.getLessonsList();
		},
		navTo(path){
			uni.navigateTo({
				url: path
			})
		}
	}
};
</script>

<style scoped lang="scss">
.content {
	background-color: #f6f6f6;
	min-height: 100vh;
}
.outer-swiper {
	height: 300rpx;
	width: 100%;
	&.teacher {
		height: 440rpx;
	}
	.swiper-item.o{
		height: 80%;
	}
	.swiper-inside {
		width: 100%;
		height: 208rpx;
		&.teacher {
			height: 376rpx;
		}
		.swiper-item {
			background-color: #f0fcf8;
			border-radius: 8rpx;
			padding: 30rpx;
			margin-bottom: 30rpx;
			.calendar-description {
				margin-top: 10rpx;
				margin-bottom: 20rpx;
				font-size: 30rpx;
				font-weight: bold;
			}
			.calendar-time {
				font-size: 28rpx;
				color: #909399;
				.grayBg {
					margin-left: 30rpx;
				}
				.greenBg {
					margin-left: 30rpx;
				}
			}
			&.row {
				.row .name {
					font-size: 32rpx;
					font-weight: bold;
					width: 346rpx;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
					&.two {
						width: 530rpx;
						margin: 10rpx 0 4rpx;
					}
				}
				.row.one {
					height: 44rpx;
				}
				.m-border {
					margin: 10rpx 0;
				}
				.myborder {
					border-radius: 21rpx;
					border: 2rpx solid #FDC623;
					padding: 4rpx 12rpx;
					font-size: 24rpx;
					margin-right: 10rpx;
					color: #FDC623;
				}
				.row.two {
					font-size: 26rpx;
					color: #909399;
					margin: 16rpx 0 15rpx;
				}
				.row.els{
					width: 600rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				.tipss text:first-of-type {
					margin-right: 16rpx;
				}
				.tipss {
					text {
						font-size: 26rpx !important;
					}
				}
			}
		}
	}
	.swiper-top {
		width: 100%;
		height: 40rpx;
		margin-bottom: 19rpx;
		margin-top: 33rpx;
		.s-left,
		.s-right {
			image {
				width: 14rpx;
				height: 22rpx;
				margin-top: 2rpx;
			}
			font-size: 26rpx;
			color: #c0c4cc;
		}
		.s-left {
			image {
				margin-right: 12rpx;
			}
		}
		.s-mid {
			image {
				width: 40rpx;
				height: 40rpx;
				margin-right: 10rpx;
			}
			font-size: 28rpx;
			color: #f95c25;
		}
		.s-right {
			image {
				margin-left: 12rpx;
				transform: rotateY(180deg);
			}
		}
	}
}
.top {
	height: 200rpx;
	width: 100%;
	padding: 0 32rpx;
	background-color: #2acc8c;
	.left {
		.avaterUrl {
			width: 88rpx;
			height: 88rpx;
			border-radius: 50%;
		}
		.user-info {
			margin-left: 20rpx;
			color: #ffffff;
			.user-name {
				text {
					font-size: 32rpx;
				}
				.name {
					line-height: 44rpx;
					height: 44rpx;
					margin-bottom: 2rpx;
					font-weight: bold;
				}
			}
			.identity {
				font-size: 24rpx;
				padding: 4rpx 10rpx;
				background: rgba(253, 198, 35, 1);
				line-height: 40rpx;
				text-align: center;
				border-radius: 200rpx 0px 200rpx 200rpx;
				margin-left: 12rpx;
				font-weight: 400;
				&.t {
					margin-left: 0;
				}
			}
			.age {
				font-size: 28rpx;
				font-weight: 400;
			}
		}
	}
	.right {
		.one{
			height: 100rpx;
			image{
				margin-right: 30rpx;
			}
		}
		.two{
			height: 100rpx;
			justify-content: flex-end;
		}
		image {
			width: 36rpx;
			height: 36rpx;
		}
		.edit {
			width: 39rpx;
			height: 39rpx;
		}
	}
}
.block {
	padding: 15rpx 0;
	width: 686rpx;
	height: auto;
	margin: 30rpx 0 40rpx;
	background: rgba(255, 255, 255, 1);
	box-shadow: 0px 4rpx 20rpx 0px rgba(0, 0, 0, 0.05);
	border-radius: 12rpx;
	&:last-of-type {
		margin-top: 0;
	}
}
.notYet {
	font-size: 30rpx;
	padding: 30rpx;
	.title {
		font-weight: bold;
	}
}
.nav {
	flex-wrap: wrap;
	.col {
		flex: 1 0 25%;
		height: 170rpx;
		image {
			width: 72rpx;
			height: 72rpx;
			margin-bottom: 20rpx;
		}
	}
	button {
		background-color: #FFFFFF;
		border: 0;
		outline: 0;
		text{
			font-size: 28rpx;
			color: #303133;
			height: 40rpx;
			font-weight: 400;
		}
		image{
			
		}
		&::after{
			border: none;
		}
	}
}
</style>
