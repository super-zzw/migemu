<template>
	<view class="content" v-if="detail">
		<view class="top flex justify-center" >
			<view class="headBg"></view>
			<view class="block " @tap="navTo(`../index/good?id=${detail.courseId}&drop=1&aid=${detail.arrangeCourseId}`)">
				<view class="block-top flex flex-column">
					<view class="block-name flex">
						<view class="block-title">{{detail.courseName || ''}}</view>
						<text v-if="detail.studyType == 0">学习中</text>
						<text v-else-if="detail.studyType == 1">已完成</text> 
					</view>
					<view class="text total">课程总课节：{{detail.sumLesson || 0}}</view>
					<view class="text bar-text">学习进度：{{achieve.length }}/{{detail.sumLesson || 0}}</view>
					<view class="bar-outer">
						<view class="bar" :style="{width:barWidth+'%'}"></view>
					</view>
					<view class="text " v-if="status !== 2">购课时间：{{detail.buyCourseTime || ''}}</view>  <!-- 不等于已完成才显示 -->
					<view class="text time" v-if="status !== 2">有效期至：{{detail.indate || ''}}</view>  <!-- 不等于已完成才显示 -->
				</view>
				<view class="block-bottom flex" v-if="type == 0 && detail.studyType == 0"> <!-- 线下课且学习中 -->
					<view class="block-bottom-col flex align-center justify-center" @tap.stop="navTo(`./lookTeacher?cid=${detail.courseId}&tid=${detail.teacherId}`)">
						<image src="../../static/lianxi.png" ></image>
						联系老师
					</view>
					<view class="block-bottom-col flex align-center justify-center" @tap.stop="navTo(`./courseMaterial?cid=${detail.courseId}`)">
						<image src="../../static/my/zl.png" ></image>
						课程资料
					</view>
				</view>
				<!-- 线下课 -->
				<view class="block-bottom flex" v-else-if="type == 0 && detail.studyType == 1"> <!-- 线下课且已完成 -->
					<view class="block-bottom-col flex align-center justify-center" v-if="!detail.commentCourseId" @tap.stop="navTo(`./evaluate?cid=${detail.courseId}`)">
						<image src="../../static/my/pj.png" ></image>
						课程评价
					</view>
					<view class="block-bottom-col flex align-center justify-center" v-else @tap.stop="navTo(`./lookEval?cid=${detail.commentCourseId}`)">
						<image src="../../static/look.png" ></image> 
						查看课评
					</view>
					<view class="block-bottom-col flex align-center justify-center" @tap.stop="navTo(`./lookTeacher?cid=${detail.courseId}&tid=${detail.teacherId}`)">
						<image src="../../static/lianxi.png" ></image>
						联系老师
					</view>
					<view class="block-bottom-col flex align-center justify-center"  @tap.stop="navTo(`./courseMaterial?cid=${detail.courseId}`)">
						<image src="../../static/my/zl.png" ></image>
						课程资料
					</view>
				</view>
				<!-- 线下课 -->
				<!-- 这是线上课的 -->
				<view class="block-bottom flex" v-else-if="type == 1 && detail.studyType == 0">
					<view class="block-bottom-col flex align-center justify-center" @tap.stop="navTo(`./bookingClass?aid=${detail.arrangeCourseId}`)">
						<image src="../../static/nz.png" ></image>
						预约上课
					</view>
					<view class="block-bottom-col flex align-center justify-center" @tap.stop="navTo(`./lookTeacher?cid=${detail.courseId}&tid=${detail.teacherId}`)">
						<image src="../../static/lianxi.png" ></image>
						联系老师
					</view>
					<view class="block-bottom-col flex align-center justify-center" @tap.stop="navTo(`./courseMaterial?cid=${detail.courseId}`)">
						<image src="../../static/my/zl.png" ></image>
						课程资料
					</view>
				</view>
				<!-- 这是线上课的,已完成 -->
				<view class="block-bottom flex" v-else-if="type == 1 && detail.studyType == 1">
					<view class="block-bottom-col flex align-center justify-center" v-if="!detail.commentCourseId" @tap.stop="navTo(`./evaluate?cid=${detail.courseId}`)">
						<image src="../../static/my/pj.png" ></image>
						课程评价
					</view>
					<view class="block-bottom-col flex align-center justify-center" v-else @tap.stop="navTo(`./lookEval?cid=${detail.commentCourseId}`)">
						<image src="../../static/look.png" ></image> 
						查看课评
					</view>
					<view class="block-bottom-col flex align-center justify-center" @tap.stop="navTo(`./lookTeacher?cid=${detail.courseId}&tid=${detail.teacherId}`)">
						<image src="../../static/lianxi.png" ></image>
						联系老师
					</view>
					<view class="block-bottom-col flex align-center justify-center" @tap.stop="navTo(`./courseMaterial?cid=${detail.courseId}`)">
						<image src="../../static/my/zl.png" ></image>
						课程资料
					</view>
				</view>
			</view>
		</view>
		<!-- 灰色边框文字 用 grayIcon   绿色用 greenIcon -->
		<view class="lists">
			<uni-collapse accordion="true" class="detail">
			    <uni-collapse-item :title="`未开始的课节${notStartLength}`" v-if="notStart.length !== 0" :showAnimation="true" :open="true">
					<DefaultPage v-if="notStart.length == 0"></DefaultPage>
					<view class="calendar-block flex flex-column " @tap.stop="navTo(`./lessonsDetail?acid=${item.arrangeCourseId}&aclid=${item.arrangeCourseLessonId}&lid=${item.lessonsId}&sid=${item.srlId}`)" v-for="item in notStart" :key="item.id" v-else>
						<view class="calendar-description">{{item.lessonName || ''}}</view>
						<view class="calendar-time flex align-center">上课时间：{{item.startTime || ''}} <text class="grayIcon">未开始</text> </view>
					</view>
			    </uni-collapse-item>
				<uni-collapse-item :title="`待完成的课节${notAchieveLength}`" :showAnimation="true"  v-if="notAchieve.length !== 0">
					<DefaultPage v-if="notAchieve.length == 0"></DefaultPage>
					<view class="calendar-block flex flex-column " @tap.stop="navTo(`./lessonsDetail?acid=${item.arrangeCourseId}&aclid=${item.arrangeCourseLessonId}&lid=${item.lessonsId}&sid=${item.srlId}`)" v-for="item in notAchieve" :key="item.id" v-else>
						<view class="calendar-description">{{item.lessonName || ''}}</view>
						<view class="calendar-time flex align-center"><text class="grayIcon clearMl">待完成</text> </view>
					</view>
				</uni-collapse-item>
				<uni-collapse-item :title="`已完成的课节${achieveLength}`" :showAnimation="true" v-if="achieve.length !== 0">
					<DefaultPage v-if="achieve.length == 0"></DefaultPage>
					<view class="calendar-block flex flex-column " @tap.stop="navTo(`./lessonsDetail?acid=${item.arrangeCourseId}&aclid=${item.arrangeCourseLessonId}&lid=${item.lessonsId}&sid=${item.srlId}`)" v-for="item in achieve" :key="item.id" v-else>
						<view class="calendar-description">{{item.lessonName || ''}}</view>
						<view class="calendar-time flex align-center">上课时间：{{item.startTime || ''}} <text class="greenIcon">已完成</text> </view>
					</view>
				</uni-collapse-item>
			</uni-collapse>
		</view>
		
	</view>
</template>

<script>
import utils from "../../utils/method.js";
import DefaultPage from "../../components/defaultPage.vue";
import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue'
	export default{
		computed:{
			notStartLength(){
				if( this.notStart && this.notStart.length !== 0){
					return `(${this.notStart.length})`;
				}else{
					return "";
				}
			},
			notAchieveLength(){
				if( this.notAchieve && this.notAchieve.length !== 0){
					return `(${this.notAchieve.length})`;
				}else{
					return "";
				}
			},
			achieveLength(){
				if(this.achieve && this.achieve.length !== 0){
					return `(${this.achieve.length})`;
				}else{
					return "";
				}
			},
		},
		components:{
			DefaultPage,
			uniCollapse,
			uniCollapseItem
		},
		data(){
			return{
				status:1, 
				notStart: null, // 未开始
				notAchieve: null, // 待完成
				achieve: [], // 已完成
				barWidth: 0, // 学习的进度条
				detail:null,
				courseId: null , // 排课课程标识 用来获取课程概况
				type: null,  //课程类型 0=线下课,1=线上课
			}
		},
		onLoad({cid,type}) {
			cid && (this.courseId = cid)
			type && (this.type = type);
			console.log(this.type)
		},
		onShow() {
			this.getCourseGeneral();
		},
		methods:{
			navTo(path){
				uni.navigateTo({
					url: path
				})
			},
			// 获取课程概况
			async getCourseGeneral(){
				uni.showLoading({
					title: "正在加载数据..",
					mask:true
				});
				try{
					const { data } = await this.$http({
						apiName: "getCourseGeneralSituation",
						method: "POST",
						data:{
							courseId: this.courseId
						}
					});
					// 把时间戳转换成y-m-d格式
					data.notStart.forEach(item => {item['startTime'] = utils.unixToDatetime(item['startTime'])});
					data.fulfill.forEach(item => {item['startTime'] = utils.unixToDatetime(item['startTime'])});
					data.await.forEach(item => {item['startTime'] = utils.unixToDatetime(item['startTime'])});
					data.CourseGSModel.buyCourseTime = utils.unixToDatetime(data.CourseGSModel.buyCourseTime) ;
					data.CourseGSModel.indate = utils.unixToDatetime(data.CourseGSModel.indate) ;
					// 把时间戳转换成y-m-d格式
					this.detail = data.CourseGSModel;
					const bar = Math.ceil(data.fulfill.length / data.CourseGSModel.sumLesson * 100);
					isNaN(bar) ? this.barWidth = 0 : this.barWidth = bar;
					this.notStart = data.notStart;
					this.achieve = data.fulfill;
					this.notAchieve = data.await;
					uni.hideLoading();
				}catch(e){
					uni.hideLoading();
				}
				
			}
		}
	}
</script>

<style scoped lang="scss">
	.top{
		width: 100%;
		background-color: #FFFFFF;
		position: relative;
		height: auto;
		padding-bottom: 40rpx;
		.headBg{
			width: 100%;
			height: 284rpx;
			background:#FDC623;
			position: absolute;
		}
		.block{
			width: 686rpx;
			height: auto;
			position: relative;
			margin-top: 32rpx;
			z-index: 5;
			background-color: #FFFFFF;
			box-shadow:0px 4px 20px 0px rgba(0,0,0,0.12);
			border-radius:12rpx;
			.block-top{
				padding: 32rpx 32rpx 0;
			}
			.block-name{
				.block-title{
					font-size: 36rpx;
					font-weight: bold;
					margin-right: 20rpx;
				}
				
				text{
					padding: 6rpx 14rpx;
					font-size: 28rpx;
					color: #FFFFFF;
					background-color: #FDC623;
					border-radius: 8rpx;
				}
			}
			.text{
				font-size: 28rpx;
				color: #606266;
			}
			.total{
				margin: 20rpx 0 16rpx 0;
			}
			.bar-outer{
				width: 626rpx;
				height: 16rpx;
				background-color: #EDEDED;
				border-radius: 10rpx;
				margin: 12rpx 0 16rpx 0;
				.bar{
					height: 100%;
					background-color: #FDC623;
					border-radius: 10rpx;
				}
			}
			.time{
				margin: 16rpx 0 30rpx 0;
			}
			.block-bottom{
				width: 100%;
				height: 100rpx;
				border-top: 2rpx solid rgba(0,0,0,.1);
				.block-bottom-col{
					flex: 1;
					font-size: 30rpx;
					image{
						width: 48rpx;
						height: 48rpx;
						margin-right: 10rpx;
					}
				}
			}
		}
	}
	.lists{
		margin-top: 20rpx;
		width: 100%;
		height: auto;
		
		.calendar-block{
			width: 686rpx;
			height: auto;
			background-color: #F0FCF8;
			border-radius: 8rpx;
			padding: 30rpx;
			margin-left: 32rpx;
			margin-bottom: 30rpx;
			.calendar-description{
				margin-top: 10rpx;
				margin-bottom: 20rpx;
				font-size: 30rpx;
				font-weight: bold;
			}
			.calendar-time{
				font-size: 28rpx;
				color: #909399;
			}
			.grayIcon.clearMl{
				margin-left: 0 !important;
			}
		}
	}
</style>
