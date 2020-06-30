<template>
	<view class="content">
		<view class="top flex justify-between align-center">
			<text :class="act == 0 ? 'active' : ''" @tap="changeAct(0)">{{userInfo.userType == 2?'课程列表':'签到'}}</text>
			<text :class="act == 1 ? 'active' : ''" @tap="changeAct(1)">课程日历</text>
		</view>
		<swiper :duration="500" :circular="true" @change="swiperChange" :current="act">
			<swiper-item>
				<view class="lists" v-if="userInfo.userType == 2">
					<DefaultPage v-if="goingClass.length == 0 && finishClass.length == 0"></DefaultPage>
					<uni-collapse accordion="true" class="details">
						
					    <uni-collapse-item :title="`学习中的课程${goingClassLength}`" v-if="goingClass.length !== 0 " :showAnimation="true" :open="true">
							<template v-for="item in goingClass">
								<view class="block" @click="navTo(`./overview?cid=${item.courseId}&type=${item.type}`)"   :key="item.id" >
									<view class="block-top">
										<view class="row one flex align-center">
											<text class="name">{{item.courseName}}</text>
										</view>
										<!-- <view class="m-border">
											<text class="myborder " v-for="list in item.textData" :key="list.id" :style="{borderColor:list.color,color:list.color}">{{list.text}}</text>
										</view> -->
										<view class="m-border">
											<text class="myborder ">{{item.type == 0 ? '线下课' : '线上课'}}</text>
											<text class="myborder ">{{item.classType == 1 ? '1对1' : item.classType == 2 ? '1对2' : '多人小班' }}</text>
										</view>
										<view class="row two">授课老师：{{item.teacherName}}</view>
										<view class="row three flex">
											<view class="flex align-center">
												<text class="flex align-center">{{item.lessonNum}}</text>总课节
											</view>
											<view class="flex align-center">
												<text class="flex align-center">{{item.lessonAlready}}</text>已上
											</view>
											<view class="flex align-center">
												<text class="flex align-center">{{item.lessionRemain}}</text>剩余
											</view>
										</view>
										<view class="row four twos flex align-center justify-between" v-if="item.type == 0"> <!-- 线上 -->
											<view class="flex align-center justify-center" @tap.stop="navTo(`./overview?cid=${item.courseId}&type=${item.type}`)"><image src="../../static/my/xq.png" class="yy"></image><text>课节详情</text></view>
											<view class="flex align-center justify-center" @tap.stop="navTo(`./courseMaterial?cid=${item.courseId}`)"><image src="../../static/my/zl.png" class="xq"></image><text>课程资料</text></view>
										</view>
										<view class="row four flex align-center justify-between" v-else> <!-- 线下 -->
											<view class="flex align-center" @tap.stop="navTo(`./bookingClass?aid=${item.arrangeCourseId}`)"><image src="../../static/my/yy.png" class="yy"></image><text>上课预约</text></view>
											<view class="flex align-center" @tap.stop="navTo(`./overview?cid=${item.courseId}&type=${item.type}`)"><image src="../../static/my/xq.png" class="xq"></image><text>课节详情</text></view>
											<view class="flex align-center" @tap.stop="navTo(`./courseMaterial?cid=${item.courseId}`)"><image src="../../static/my/zl.png" class="zl"></image><text>课程资料</text></view>
										</view>
									</view>
								</view>
								
							</template>
							
					    </uni-collapse-item>
						<uni-collapse-item :title="`已完成的课程${finishClassLength}`" v-if="finishClass.length !== 0 " :showAnimation="true" >
							<view class="block" v-for="item in finishClass" @click="navTo(`./overview?cid=${item.courseId}&type=${item.type}`)" :key="item.id">
								<view class="block-top">
									<view class="row one flex align-center">
										<text class="name">{{item.courseName}}</text>
									</view>
									<view class="m-border">
										<text class="myborder ">{{item.type == 0 ? '线下课' : '线上课'}}</text>
										<text class="myborder ">{{item.classType == 1 ? '1对1' : item.classType == 2 ? '1对2' : '多人小班' }}</text>
									</view>
									<view class="row two">授课老师：{{item.teacherName}}</view>
									<view class="row three flex">
										<view class="flex align-center">
											<text class="flex align-center">{{item.lessonNum}}</text>总课节
										</view>
										<view class="flex align-center">
											<text class="flex align-center">{{item.lessonAlready}}</text>已上
										</view>
										<view class="flex align-center">
											<text class="flex align-center">{{item.lessionRemain}}</text>剩余
										</view>
									</view>
									<view class="row four  flex align-center justify-between" >
										<view class="flex align-center" v-if="!item.commentCourseId" @tap.stop="navTo(`./evaluate?cid=${item.courseId}`)"><image src="../../static/my/pj.png" class="pj"></image><text>课程评价</text></view>
										<view class="flex align-center" v-else @tap.stop="navTo(`./lookEval?cid=${item.commentCourseId}`)"><image src="../../static/look.png" class="pj"></image><text>查看课评</text></view>
										<view class="flex align-center" @tap.stop="navTo(`./overview?cid=${item.courseId}&type=${item.type}`)"><image src="../../static/my/xq.png" class="xq"></image><text>课节详情</text></view>
										<view class="flex align-center"  @tap.stop="navTo(`./courseMaterial?cid=${item.courseId}`)"><image src="../../static/my/zl.png" class="zl"></image><text>课程资料</text></view>
									</view>
								</view>
							</view>
							
						</uni-collapse-item>
					</uni-collapse>
				</view>
				<view class="teacher-sign" v-else>
					<DateSwitch @day="teacherGetDay" @type="teacherGetType" @change="teacherDateChange"></DateSwitch>
					<view class="t-blocks">
						<DefaultPage v-if="teacherSign.length == 0"></DefaultPage>
						<view class="block" @click="navTo(`../../pagesA/teacher/teacherLessonsDetail?aid=${item.arrangeCourseLessonId}`)" v-for="item in teacherSign"  v-else  :key="item.id" >
							<view class="block-top">
								<view class="row one flex align-center">
									<text class="name">{{item.courseTitle}}</text>
								</view>
								<view class="m-border">
									<text class="myborder">
										{{ item.courseType == 0 ? '线下课':'线上课' }}
									</text>
									<text class="myborder">
										{{ item.courseClassType == 1 ? '1对1':item.courseClassType == 2?'1对2':'多人小班' }}
									</text>
								</view>
								<view class="row one flex align-center">
									<text class="name two">{{item.lessonTitle}}</text>
								</view>
								<view class="row two els">学员：{{item.studentNameStr}}</view>
								<view class="row two th">时间段：{{item.startTimeStr}}-{{item.endTimeStr}}</view>
								<view class="tipss" v-if="item.courseType == 1">  <!--  如果是线上课显示这个 -->
									<text :class="item.signInFlag==1 ? 'greenBg' : 'grayBg'" >{{item.signInFlag == 1 ?'已签到' : '未签到'}}</text>
									<text :class="item.liveUrl ? 'greenBg' : 'grayBg'">{{item.liveUrl ? '已填写课室号':'未填写课室号'}}</text>
								</view>
								<view class="row three flex" v-else> <!--  如果是线下课显示这个 -->
									<view class="flex align-center">
										<text>{{item.realNum}}</text>实到
									</view>
									<view class="flex align-center"> 
										<text>{{item.signNum}}</text>签到
									</view>
									<view class="flex align-center">
										<text>{{item.stuNum}}</text>应到
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="calendar">
					<Calendar @getDay="getDay" :lessonsArrs="lunarDateList"></Calendar>
					<uni-collapse accordion="true" class="details">
					    <uni-collapse-item :title="`未开始的课节${notCalendarLength}`" v-if="notCalendar.length !== 0" :showAnimation="true" :open="true">
							<DefaultPage v-if="notCalendar.length == 0"></DefaultPage>
							<template v-if="userInfo.userType == 2">
								<view class="calendar-block flex flex-column " v-for="item in notCalendar" @tap.stop="navTo(`./lessonsDetail?acid=${item.arrangeCourseId}&aclid=${item.arrangeCourseLessonId}&lid=${item.lessonId}`)"  :key="item.id" >
									<view class="calendar-name">{{item.courseName}}</view>
									<view class="calendar-description">{{item.lessonName}}</view>
									<view class="calendar-time">上课时间：{{item.startTime}}</view>
								</view>
							</template>
							<template v-else-if="userInfo.userType == 1 && notCalendar.length !== 0">
								<view class="calendar-block flex flex-column " v-for="item in notCalendar" @tap.stop="navTo(`../../pagesA/teacher/teacherLessonsDetail?aid=${item.arrangeCourseLessonId}`)"  :key="item.id" >
									<view class="calendar-name">{{item.courseTitle}}</view>
									<view class="m-border">
										<text class="myborder ">{{item.courseType == 0 ? '线下课':'线上课'}}</text>
										<text class="myborder ">{{item.classType == 1 ? '1对1' : item.classType == 2 ? '1对2' : '多人小班' }}</text>
									</view>
									<view class="calendar-description">{{item.lessonTitle}}</view>
									<view class="calendar-time">学员：{{item.studentNameStr}}</view>
									<view class="calendar-time">时间段：{{item.startTimeStr}}-{{item.endTimeStr}}</view>
									<view class="tipss" >  <!--  如果是线上课显示这个 -->
										<text :class="item.signInFlag==1 ? 'greenBg' : 'grayBg'" >{{item.signInFlag == 1 ?'已签到' : '未签到'}}</text>
										<text :class="item.liveUrl ? 'greenBg' : 'grayBg'">{{item.liveUrl ? '已填写课室号':'未填写课室号'}}</text>
									</view>
								</view>
							</template>
					    </uni-collapse-item>
						<uni-collapse-item :title="`已完成的课节${finishCalendarLength}`" v-if="finishCalendar.length !== 0" :showAnimation="true" >
							<DefaultPage v-if="finishCalendar.length == 0"></DefaultPage>
							<template v-if="userInfo.userType == 2 && finishCalendar.length !== 0">
								<view class="calendar-block flex flex-column " v-for="item in finishCalendar" @tap.stop="navTo(`./lessonsDetail?acid=${item.arrangeCourseId}&aclid=${item.arrangeCourseLessonId}&lid=${item.lessonId}`)"  :key="item.id" >
									<view class="calendar-name">{{item.courseName}}</view>
									<view class="calendar-description">{{item.lessonName}}</view>
									<view class="calendar-time">上课时间：{{item.startTime}}</view>
								</view>
							</template>
							<template v-else-if="userInfo.userType == 1 && finishCalendar.length !== 0">
								<view class="calendar-block flex flex-column " v-for="item in finishCalendar" @tap.stop="navTo(`../../pagesA/teacher/teacherLessonsDetail?aid=${item.arrangeCourseLessonId}`)"  :key="item.id" >
									<view class="calendar-name">{{item.courseTitle}}</view>
									<view class="m-border">
										<text class="myborder ">{{item.courseType == 0 ? '线下课':'线上课'}}</text>
										<text class="myborder ">{{item.classType == 1 ? '1对1' : item.classType == 2 ? '1对2' : '多人小班' }}</text>
									</view>
									<view class="calendar-description">{{item.lessonTitle}}</view>
									<view class="calendar-time">学员：{{item.studentNameStr}}</view>
									<view class="calendar-time">时间段：{{item.startTimeStr}}-{{item.endTimeStr}}</view>
									<view class="tipss" >  <!--  如果是线上课显示这个 -->
										<text :class="item.signInFlag == 1 ? 'greenBg' : 'grayBg'" >{{item.signInFlag == 1 ? '已签到' : '未签到'}}</text>
										<text :class="item.liveUrl ? 'greenBg' : 'grayBg'">{{item.liveUrl ? '已填写课室号':'未填写课室号'}}</text>
									</view>
								</view>
							</template>
						</uni-collapse-item>
					</uni-collapse>
				</view>
				
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import { mapState } from "vuex"
	import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
	import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue'
	import Calendar from "../../components/c-calendar/c-calendar.vue"
	import DateSwitch from "../../components/dateSwitch.vue"
	import utils from "../../utils/method.js"
	import DefaultPage from "../../components/defaultPage.vue"
	export default{
		components:{
			uniCollapse,uniCollapseItem,Calendar,DateSwitch,DefaultPage
		},
		computed:{
			...mapState(['userInfo']),
			goingClassLength(){ // 课程列表学习中列表长度
				if( this.goingClass && this.goingClass.length !== 0){
					return `(${this.goingClass.length})`;
				}else{
					return "";
				}
			},
			finishClassLength(){ //课程列表已完成列表长度
				if( this.finishClass && this.finishClass.length !== 0){
					return `(${this.finishClass.length})`;
				}else{
					return "";
				}
			},
			notCalendarLength(){ // 课程日历未完成长度
				if( this.notCalendar && this.notCalendar.length !== 0){
					return `(${this.notCalendar.length})`;
				}else{
					return "";
				}
			},
			finishCalendarLength(){ // 课程日历已完成长度
				if(this.userInfo.type == 1){
					if( this.teacherSign && this.teacherSign.length !== 0){
						return `(${this.teacherSign.length})`;
					}else{
						return "";
					}
				}else{
					if( this.finishCalendar && this.finishCalendar.length !== 0){
						return `(${this.finishCalendar.length})`;
					}else{
						return "";
					}
				}
			}
		},
		data(){
			return{
				act: 0,
				lunarDateList:[], // 后台拿到的天数
				goingClass: [],
				finishClass: [],
				teacherSign: [],
				notCalendar: [],
				finishCalendar: [],
				day:0,
				type:0,
				dateYear:"",
				year: "",
				month: ""
			}
		},
		onLoad({move}) {
			move && (this.act = 1);
		},
		async onShow(){
			uni.showLoading({
				title: "加载中...",
				mask: true
			})
			if(this.userInfo.userType == 2){
				await this.studentInit();
			}else{
				await this.teacherInit();
			}
			await this.getCourseDate(this.year,this.month);
			uni.hideLoading();
		},
		methods:{
			swiperChange(e){
				const current = e.detail.current;
				this.act = current;
			},
			changeAct(i){
				this.act = i;
			},
			navTo(path){
				uni.navigateTo({url: path})
			},
			// 获取课程列表 学生
			async getCourseList(){
				uni.showLoading({
					title: "正在加载中...",
					mask:true
				})
				const { data } = await this.$http({
					apiName: "getCourseList",
				});
				this.goingClass = data.underwaryCourse.list; // 学生进行中
				this.finishClass = data.doneCourse.list;
				uni.hideLoading();
			},
			
			getDay(e){ // 拿到年和月和日 
				this.year = e[0];
				this.month = e[1];
				this.getCourseDate(e[0],e[1]);
				this.dateYear = e.join("-");
				this.getLessonsList(this.dateYear);
			},
			// 获取课程日历
			async getCourseDate(year,month){
				let apiName = "";
				if(this.userInfo.userType == 2){
					apiName = "getCourseDate"
				}else{
					apiName = "teacherGetCourseDate"
				}
				const { data } = await this.$http({
					apiName,
					method: "POST",
					data:{
						year,
						month
					}
				})
				this.lunarDateList = data;
			},
			// 日历的课程列表
			async getLessonsList(date){
				let apiName = "";
				if(this.userInfo.userType == 2){
					apiName = "getLessonsList"
				}else{
					apiName = "teacherGetLessonsList"
				}
				const { data } = await this.$http({
					apiName,
					method: "POST",
					data:{
						dayTime: date
					}
				});
				data.notStart.forEach(item=>{item['startTime'] = utils.unixToDatetime(item['startTime'])});
				data.done.forEach(item => {
					item['startTime'] = utils.unixToDatetime(item['startTime'],8);
					if(item['endTime']){
						item['endTime'] = utils.unixToDatetime(item['endTime'],8);
					}
				});
				this.notCalendar = data.notStart;
				this.finishCalendar = data.done;
			},
			
			// 获取待上课节
			async teacherGetLessonsList(){
				try{
					uni.showLoading({
						title: "正在加载中...",
						mask: true
					})
					const { data } = await this.$http({
						apiName: "getTeachSelectDate",
						method: "GET",
						data:{
							day: this.day,
							type: this.type
						}
					});
					if(data.length !== 0){
						data.list.forEach(item => {item['startTime'] = utils.unixToDatetime(item['startTime'])});
					}
					this.teacherSign = data.list;
					uni.hideLoading();
				}catch(e){
					console.log(e)
					uni.hideLoading();
				}
			},
			// 学生初始化
			studentInit(){
				this.getCourseList();
			},
			// 老师初始化
			teacherInit(){
				this.teacherGetLessonsList();
			},
			teacherGetDay(e){
				this.day = e;
			},
			teacherGetType(e){
				this.type = e;
			},
			teacherDateChange(e) { // 日期切换
				this.teacherGetLessonsList();
			}
		},
		async onPullDownRefresh() {
			uni.showLoading({
				title:"数据加载中...",
				mask:true
			})
			if(this.userInfo.userType == 2){
				this.studentInit();
			}else{
				this.teacherInit();
			}
			setTimeout(_=>{
				uni.stopPullDownRefresh();
				uni.hideLoading();
			},2000)
		},
	}
</script>

<style scoped lang="scss">
	swiper-item{
		background-color: #FFFFFF;
	}
	.top{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 86rpx;
		padding: 0 123rpx;
		background-color: #FFFFFF;
		border-bottom: 2rpx solid rgba(0,0,0,.1);
		z-index: 999;
		text{
			font-size: 32rpx;
			color: #909399;
			font-weight: 400;
			position: relative;
			transition: all .3s linear;
			&.active{
				font-size: bold;
				color: #FDC623;
				&::after{
					content: "";
					position: absolute;
					bottom: -21rpx;
					left: 0;
					width: 100%;
					height: 4rpx;
					background-color: #FDC623;
				}
			}
		}
	}
	swiper{
		width: 100%;
		height: 100vh;
	}
	
	.lists{
		margin-top: 86rpx;	
		height: 100vh;
		overflow-x: hidden;
		overflow-y: scroll;
		padding-bottom: 100rpx;
		.learn{
			width: 100%;
			height: 120rpx;
			padding: 0 32rpx;
			background-color: #FFFFFF;
			&:last-of-type{
				margin-top: 20rpx;
			}
			.title{
				font-size: 34rpx;
				font-weight: bold;
			}
			.jt{
				width: 26rpx;
				height: 16rpx;
			}
		}
		.details{
			width:100%;
			background-color: #FFFFFF;
			transition: all 1s;
			.block{
				width: 686rpx;
				height: auto;
				background:rgba(255,255,255,1);
				box-shadow:0px 4px 16px 0px rgba(0,0,0,0.12);   
				border-radius:12rpx;
				margin: 0 auto 40rpx auto;
				.block-top{
					padding: 28rpx 0 0 30rpx;
					.row .name{
						font-size: 32rpx;
						font-weight: bold;
						width: 600rpx;
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
						border:2rpx solid;
						padding: 4rpx 12rpx;
						font-size: 24rpx;
						margin-right: 10rpx;
						border-color: #FDC623;
						color: #FDC623;
					}
					.row.two{
						font-size: 26rpx;
						color: #909399;
						margin: 16rpx 0 26rpx ;
					}
					.row.els{
						width: 600rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					.row.three{
						margin-bottom: 30rpx;
						view{
							font-size: 26rpx;
							color: #606266;
							margin-right: 50rpx;
							text{
								font-size: 40rpx;
								color:#FDC623;
								margin-right: 10rpx;
								font-weight: bold;
							}
						}
					}
					.row.four{
						height: 100rpx;
						position: relative;
						width: 100%;
						padding-right: 34rpx;
						font-size: 28rpx;
						color: #303133;
						&.twos{
							view{
								flex: 1 0 50%;
							}
						}
						&::after{
							content: "";
							position: absolute;
							top: 0;
							left: -28rpx;
							width: 685rpx;
							height: 2rpx;
							background-color: rgba(243, 243, 243, 1);
						}
						view{
							font-size: 28rpx;
							image{
								margin-right: 14rpx;
							}
							.pj{
								width: 48rpx;
								height: 48rpx;
							}
							.yy{
								width: 48rpx;
								height: 48rpx;
							}
							.xq{
								width: 48rpx;
								height: 48rpx;
							}
							.zl{
								width: 48rpx;
								height: 48rpx;
							}
						}
					}
				}
			}
		}
	}
	.teacher-sign{
		margin-top: 86rpx;
		padding: 1rpx 32rpx 32rpx 32rpx;
		height: 100vh;
		overflow-x: hidden;
		overflow-y: scroll;
		padding-bottom: 100rpx;
		.block{
			width: 686rpx;
			height: auto;
			background:rgba(255,255,255,1);
			box-shadow:0px 4px 16px 0px rgba(0,0,0,0.12);
			border-radius:12rpx;
			margin: 0 auto 40rpx auto;
			.t-blocks{
				margin-top: 26rpx;
			}
			.block-top{
				padding: 28rpx 0 30rpx 30rpx;
				.row .name{
					font-size: 32rpx;
					font-weight: bold;
					width: 600rpx;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
					&.two{
						width: 610rpx;
						margin: 10rpx 0 4rpx;
					}
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
					margin: 16rpx 0 10rpx ;
					&.th{
						margin-top: 0;
						margin-bottom: 22rpx;
					}
				}
				.tipss text:first-of-type{
					margin-right: 16rpx;
				}
				.tipss{
					text{
						font-size: 26rpx !important;
					}
				}
				.row.three{
					view{
						font-size: 26rpx;
						color: #606266;
						margin-right: 30rpx;
						text{
							font-size: 40rpx;
							color: #FDC623;
							margin-right: 10rpx;
						}
					}
				}
			}
		}
	}
	.calendar{
		margin-top: 86rpx;
		height: 100vh;
		background-color: #FFFFFF;
		overflow-y: scroll;
		overflow-x: hidden;
		padding-bottom: 100rpx;
	}
	.calendar-block{
		width: 686rpx;
		height: auto;
		background-color: #F0FCF8;
		border-radius: 8rpx;
		padding: 30rpx;
		margin-left: 32rpx;
		margin-bottom: 30rpx;
		.calendar-name,.calendar-description{
			font-size: 30rpx;
			font-weight: bold;
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
		.calendar-description{
			margin-top: 10rpx;
			margin-bottom: 30rpx;
		}
		.calendar-time{
			font-size: 28rpx;
			color: #909399;
		}
		.tipss text:first-of-type{
			margin-right: 16rpx;
		}
		.tipss{
			margin-top: 20rpx;
			text{
				font-size: 26rpx !important;
			}
		}
	}
</style>
