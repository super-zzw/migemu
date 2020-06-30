<template>
	<view class="content" v-if="classDetail">
		<view class="top flex justify-center" >
			<view class="headBg"></view>
			<view class="block ">
				<view class="block-top flex flex-column">
					<view class="block-name flex flex-column">
						<view class="flex ">
							<view class="block-title z">{{classDetail.courseName || ''}}</view>
							<text class="grayBg" v-if="classDetail.status==1">未开始</text>
							<text class="greenBg" v-else-if="classDetail.status == 3">待完成</text> 
							<text class="greenBg" v-else-if="classDetail.status == 2">已完成</text> 
						</view>
						<view class="block-title ass">{{classDetail.lessonName || ''}}</view>
					</view>
					<view class="text total">授课老师：{{classDetail.teacherName || ''}}</view>
					<view class="text bar-text" v-if="classDetail.type == 0">上课地点：<text>{{classDetail.site || ''}}</text> </view>
					<!-- <text class="text text-block">{{classDetail.adr2}}</text> -->
					<view class="text bt" v-if="classDetail.type == 0">课室信息：{{classDetail.classInfo || ''}}</view>  
					<view class="text time" v-if="classDetail.status != 3" >上课时间：{{classDetail.startTime || ''}} {{classDetail.startWeek || ''}}</view>  
				</view>
				<!-- 线下 -->
				<view class="block-bottom flex" v-if="classDetail.type == 0 &&  classDetail.status != 3  &&  (!classDetail.sign || classDetail.commentTeacherStatus == 0) ">
					<view class="block-bottom-col flex align-center justify-center" v-if="classDetail.status==1 && !classDetail.sign" @tap="showModal($event,'sign')" data-target="Modal">
						<image src="../../static/my/qd.png" ></image>
						上课签到
					</view>
					<view class="block-bottom-col flex align-center justify-center" v-if="classDetail.status == 2"  @tap="showModal($event,'pingjia')" data-target="Modal">
						<image src="../../static/my/pjls.png" ></image>
						评价老师
					</view>
				</view>
				<!-- 线下 -->
				<!-- 线上 -->
				<view class="block-bottom flex" v-else-if="classDetail.type == 1 && classDetail.status != 3 && (!classDetail.sign || classDetail.commentTeacherStatus == 0) ">
					<view class="block-bottom-col flex align-center justify-center" v-if="classDetail.status==1 && !classDetail.sign" @tap="showModal($event,'sign')" data-target="Modal">
						<image src="../../static/my/xq.png" ></image>
						上课签到
					</view>
					<view class="block-bottom-col flex align-center justify-center"  v-if="classDetail.status==1 && !classDetail.sign" @tap="navTo(`./bookingClass?aid=${classDetail.arrangeCourseId}&startTime=${classDetail.startTime}`)" data-target="Modal">
						<image src="../../static/my/hsj.png" ></image>
						换个时间
					</view>
					<view class="block-bottom-col flex align-center justify-center"  v-if="classDetail.status==1 && !classDetail.sign" @tap="showModal($event,'cancel')" data-target="Modal">
						<image src="../../static/my/qxyy.png" ></image>
						取消预约
					</view>
					<view class="block-bottom-col flex align-center justify-center"  v-if="classDetail.status == 2" @tap="showModal($event,'pingjia')" data-target="Modal">
						<image src="../../static/my/pjls.png" ></image>
						评价老师
					</view>
				</view>
				<!-- 线上 -->
			</view>
		</view>
		<!-- 这是线上课才需要展示的 -->
		<view class="c-block " v-if="classDetail.type == 1 && classDetail.live_url">
			<view class="c-title">本课节直播课室信息</view>
			<view class="on-line flex flex-column">
				<view class="on-line-col flex align-center" v-if="classDetail.live_url">直播课室网址：<text>{{classDetail.live_url}}</text><image @tap.stop="copy(classDetail.live_url)" src="../../static/my/oncopy.png" mode=""></image></view>
				<view class="on-line-col flex align-center" v-if="classDetail.live_number">直播课室号码：<text>{{classDetail.live_number}} </text><image @tap.stop="copy(classDetail.live_number)" src="../../static/my/oncopy.png" mode=""></image></view>
				<view class="on-line-col flex align-center" v-if="classDetail.live_pwd">直播课室密码：<text>{{classDetail.live_pwd}} </text><image @tap.stop="copy(classDetail.live_pwd)" src="../../static/my/oncopy.png" mode=""></image></view>
			</view>
		</view>
		<!--  -->
		<view class="c-block " v-if="classDetail.lessonInroduce">
			<view class="c-title">课节内容简介</view>
			<text class="intro">{{classDetail.lessonInroduce}}</text>
		</view>
		<view class="c-block">
			<view class="c-title">作业</view>
			<view class="job flex justify-between">
				<view class="job-block flex align-center " @tap="toTask('left')">
					<view class="job-text flex flex-column" >
						<text>课前作业</text>
						<text class="border"></text>
					</view>
				</view>
				<view class="job-block flex align-center justify-center" @tap="toTask('right')">
					<view class="job-text flex flex-column">
						<text>课后作业</text>
						<text class="border"></text>
					</view>
				</view>
			</view>
		</view>
		<view class="c-block" v-if="classDetail.commentStudent" >
			<view class="c-title">课后评价</view>
			<view class="eval-content flex flex-column">
				<view class="number flex align-center">
					<text>评分：</text>
					<view class="scoreBox" >
						<image class="star" src="../../static/star1.png" v-for="index1 of gradeInfo.scope" :key="index1" mode=""></image>
						<!-- <image class="star" v-if="teacherInfo.star2 > 0" src="../../static/star2.png" mode=""></image> -->
						<image class="star" src="../../static/star3.png" v-for="index2 of gradeInfo.black" :key="index2" mode=""></image>
					</view>
				</view>
				<MediaShow :taskData="classDetail.commentStudent"></MediaShow>
			</view>
		</view>
		
		<view class="cu-modal" :class="modalName=='Modal'?'show':''">
			<view class="cu-dialog myDialog">
				<view class="boxTop flex align-center flex-column justify-center">
					<view class="boxTop-name">{{classDetail.courseName}}</view>
					<view class="boxTop-lesson">{{classDetail.lessonName}}</view>
					<view class="boxTop-time" v-if="type=='sign' || type == 'cancel'">上课时间：{{classDetail.startTime}}({{classDetail.startWeek}})</view> <!--  签到 -->
					<button class="sign" @tap="detailSign" v-if="type=='sign'">确认签到</button> <!--  签到 -->
					
					<view class="grade flex flex-column  align-center" v-if="type=='pingjia'"> <!--  不是签到 -->
						<text>给老师本课节评分吧～</text>
						<Grade @gradeChange="gradeChange" :start="5"></Grade>
						<button class="submitBtn" @tap="confirmGrade">确认</button>
					</view>
					<view class="btns flex align-center justify-center" v-if="type == 'cancel'">
						<button class="cancel green" @tap="hideModal">再想想</button> <!--  取消预约 -->
						<button class="cancel gray" @tap="cancelClass" >确认取消</button> <!--  取消预约 -->
					</view>
					
				</view>
				<view class="boxBoo">
					<image @tap="hideModal" class="close" src="../../static/closeModal.png" mode=""></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Grade from "../../components/Grade.vue"
	import utils from "../../utils/method.js"
	import MediaShow from "../../components/mediaShow.vue" 
	export default{
		components:{
			Grade,
			MediaShow
		},
		data(){
			return{
				classDetail: null, // 课节详情内容
				imgSrcs:[],
				modalName:null,
				type:'',
				status:1,
				gradeInfo:{
					scope:0,
					black:0
				},
				grade: 0,
				arrangeCourseId: '' , // 排课课程标识
				arrangeCourseLessonId: '' , // 排课课节标识
				lessonId: '', // 课节标识
				// srlId: '' , // 已约标识
			}
		},
		onLoad({acid,aclid,lid}) {
			acid && (this.arrangeCourseId = acid);
			aclid && (this.arrangeCourseLessonId = aclid);
			lid && (this.lessonId = lid);
			this.getStudentLessonDetail();
			this.$set(this.gradeInfo,'scope',3);
			this.$set(this.gradeInfo,'black',2);
		},
		methods:{
			toTask(type){
				let title = "",id = "";
				if(type == 'left'){
					title = "暂无课前作业";
					id = this.classDetail.befJobId;
				}else{
					title = "暂无课后作业";
					id = this.classDetail.aftJobId;
				}
				if(id){
					this.navTo(`/pagesB/student/taskDetail?id=${id}`)
				}else{
					uni.showToast({
						title,
						icon: "none"
					})
				}
			},
			showModal(e,type) {
				this.modalName = e.currentTarget.dataset.target;
				this.type = type;
			},
			hideModal(e) {
				this.modalName = null;
			},
			gradeChange(e){
				this.grade = e;
				console.log(e);
			},
			navTo(path){
				uni.navigateTo({
					url: path
				})
			},
			copy(val){
				this.$copy(val);
			},
			// 获取课节详情
			async getStudentLessonDetail(){
				uni.showLoading({
					title: "正在加载数据..",
					mask:true
				})
				const requestData = {} ;
				if(this.arrangeCourseId != 'null'){
					requestData['arrangeCourseId'] = this.arrangeCourseId;
				}
				if(this.arrangeCourseLessonId != 'null'){
					requestData['arrangeCourseLessonId'] = this.arrangeCourseLessonId;
				}
				if(this.lessonId != 'null'){
					requestData['lessonId'] = this.lessonId;
				}
				const { data } = await this.$http({
					apiName: "getStudentLessonDetail",
					method: "POST",
					data:requestData
				});
				data['startTime'] = utils.unixToDatetime(data['startTime']);
				// if(data.size){
				// 	this.getTwoRowAddress(data.site,data);
				// }
				if(data.commentStudent){
					this.gradeInfo.scope = data.commentStudent.star;
					this.gradeInfo.black = 5 - Number(data.commentStudent.star)
				}
				this.classDetail = data;
				uni.hideLoading();
			},
			// 签到
			async detailSign(){
				const { srlId } = this.classDetail;
				try{
					const { data } = await this.$http({
						apiName: "studentSign",
						method: "POST",
						data: {
							srlId
						}
					});
					
					this.hideModal(); 
					uni.showToast({
						title: "签到成功"
					});
					this.getStudentLessonDetail();
				}catch(e){
				}
			},
			// 把地址分成两行
			// getTwoRowAddress(str,data){
			// 	const reg = /区|镇/;
			// 	if(reg.test(str)){ // 如果匹配
			// 		const result = str.match(reg)[0];
			// 		const resultSplit = str.split(result);
			// 		data.adr1 = resultSplit[0] + result;
			// 		data.adr2 = resultSplit[1];
			// 	}
			// },
			// 提交评价
			async confirmGrade(){
				try{
					const { data } = await this.$http({
						apiName: "studentCommentTeacher",
						method: "POST",
						data: {
							srlId: this.classDetail.srlId,
							teacherId: this.classDetail.teacherId,
							star: this.grade
						}
					})
					uni.showToast({
						title: "评价老师成功",
						icon: "success"
					})
					this.$set(this.classDetail,'commentTeacherStatus',1);
					this.hideModal()
				}catch(e){
					uni.showToast({
						title: "评价老师失败,请重试...",
						icon: "icon"
					})
				}
				
			},
			// 取消预约
			async cancelClass(){
				try{
					const { data } = await this.$http({
						apiName: "getCancelReservationLesson",
						method: "POST",
						data:{arrangeCourseLessonId:this.classDetail.arrangeCourseLessonId }
					});
					uni.showToast({title: "取消预约成功"});
					this.hideModal(); // 隐藏模态框
					setTimeout(() => {
						uni.navigateBack();
					},400)
					
				}catch(e){
					
				}
			},
		}
	}
</script>

<style scoped lang="scss">
	.content{
		min-height: 100vh;
		background-color: #FFFFFF;
		padding-bottom: 40rpx;
	}
	.top{
		width: 100%;
		background-color: #FFFFFF;
		position: relative;
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
			background-color: #FFFFFF;
			box-shadow:0px 4px 20px 0px rgba(0,0,0,0.12);
			border-radius:12rpx;
			.block-top{
				padding: 32rpx 32rpx 22rpx ;
			}
			.block-name{
				.block-title{
					font-size: 36rpx;
					font-weight: bold;
					margin-right: 20rpx;
					&.z{
						max-width: 490rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					&.ass{
						max-width: 620rpx;
						margin-top: 4rpx;
						margin-bottom: 18rpx;
						margin-right: 0;
					}
				}
				
			}
			.text{
				font-size: 28rpx;
				color: #606266;
				&.bt{
					margin-bottom: 10rpx;
				}
			}
			.total{
				margin: 20rpx 0 16rpx 0;
			}
			.text-block{
				margin-left: 136rpx;
				margin-top: 10rpx;
				margin-bottom: 10rpx;
			}
			.bar-outer{
				width: 626rpx;
				height: 16rpx;
				background-color: #EDEDED;
				border-radius: 10rpx;
				margin: 12rpx 0 16rpx 0;
				.bar{
					width: 40%;
					height: 100%;
					background-color: #FDC623;
					border-radius: 10rpx;
				}
			}
			.time{
				margin: 16rpx 0 0 0;
			}
			.block-bottom{
				width: 100%;
				height: 100rpx;
				border-top: 2rpx solid rgba(0,0,0,.1);
				margin-top: 16rpx;
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
	.c-block{
		margin-top: 40rpx;
		padding: 0 32rpx;
		width: 100%;
		
		.c-title{
			font-size: 34rpx;
			font-weight: bold;
			margin-bottom: 20rpx;
			position: relative;
			&::after{
				content: "";
				position: absolute;
				left: -34rpx;
				top: 50%;
				transform: translateY(-50%);
				width: 10rpx;
				height: 40rpx;
				background:#FDC623;
				border-radius:0px 200px 200px 0px;
			}
		}
		.intro{
			font-size: 28rpx;
			color: #606266;
			line-height: 44rpx;
		}
		.job{
			.job-block{
				flex: 0 0 48.2%;
				height: 160rpx;
				position: relative;
				justify-content: flex-end;
				.job-text{
					
					align-items: flex-start;
					justify-content: center;
					margin-right: 44rpx;
					font-size: 28rpx;
					.border{
						width: 34rpx;
						height: 4rpx;
						background-color: #303133;
						margin-top: 24rpx;
					}
				}
				&:nth-of-type(1){
					background-image: url(../../static/my/kqbg.png);
					background-repeat: no-repeat;
					background-position: center center;
					background-size: 100%;
				}
				&:nth-of-type(2){
					background-image: url(../../static/my/khbg.png);
					background-repeat: no-repeat;
					background-position: center center;
					background-size: 100%;
				}
			}
		}
		.eval-content{
			padding: 30rpx 30rpx 10rpx;
			background-color: #F8F8F8;
			.eContext{
				font-size: 30rpx;
				line-height: 42rpx;
				margin: 16rpx 0 28rpx;
			}
			.number{
				font-size: 30rpx;
				font-weight: bold;
				margin-bottom: 10rpx;
			}
			.imgs{
				flex-wrap: wrap;
				image{
					width: 194rpx;
					height: 194rpx;
					margin-bottom: 30rpx;
					margin-right: 20rpx;
					&:nth-of-type(3n){
						margin-right: 0; 
					}
				}
			}
			.scoreBox{
				display: flex;
				align-items: center;
				justify-content: center;
				.scoreText{
					color: #FDC623;
					font-size: 28rpx;
				}
				.star{
					margin-right: 16rpx;
					width: 32rpx;
					height: 32rpx;
				}
			}
		}
		.on-line{
			.on-line-col{
				font-size: 28rpx;
				color: #606266;
				line-height: 50rpx;
				text{
					color: #F95C25;
				}
				image{
					width: 36rpx;
					height: 36rpx;
					margin-left: 3rpx;
				}
			}
		}
	}
	.myDialog{
		width: 580rpx;
		text-align: center;
		background: transparent;
		.boxTop{
			padding: 70rpx 0 68rpx ;
			background-color: #fff;
			border-radius: 12rpx;
			.boxTop-name,.boxTop-lesson,.boxTop-time,.sign{
				font-size: 28rpx;
			}
			.boxTop-name,.boxTop-lesson{
				font-weight: bold;
			}
			.boxTop-lesson{
				margin: 8rpx 0 40rpx;
			}
			.boxTop-time{
				color: #F72C2C;
				margin-bottom: 80rpx;
			}
			.grade{
				margin-top: 12rpx;
				text{
					font-size: 28rpx;
					color: #606266;
					margin-bottom: 10rpx;
				}
				.score{
					margin-top: 20rpx;
					text{
						font-size: 30rpx;
						color: #303133;
						margin-bottom: 0;
					}
				}
				.submitBtn{
					width: 378rpx;
					height: 64rpx;
					line-height: 64rpx;
					background-color: #FDC623;
					border-radius: 32rpx;
					color: #FFFFFF;
					margin: 80rpx 0 40rpx ;
				}
			}
			.scoreBox{
				display: flex;
				align-items: center;
				justify-content: center;
				.scoreText{
					color: #FDC623;
					font-size: 28rpx;
				}
				.star{
					margin-right: 16rpx;
					width: 32rpx;
					height: 32rpx;
				}
			}
			.sign{
				width: 378rpx;
				height: 64rpx;
				line-height: 64rpx;
				background-color: #FDC623;
				border-radius: 32rpx;
				color: #FFFFFF;
			}
			.btns{
				width: 530rpx;
				margin-bottom: 30rpx;
				button{
					width: 228rpx;
					height: 64rpx;
					line-height: 64rpx;
					font-size: 28rpx;
					color: #FFFFFF;
					border-radius: 32rpx;
					&.green{
						background-color: #FDC623;
					}
					&.gray{
						background-color: #C0C4CC;
					}
				}
			}
		}
		.boxBoo{
			margin-top: 60rpx;
			text-align: center;
			.close{
				width: 84rpx;
				height: 84rpx;
			}
		}
	}
</style>
