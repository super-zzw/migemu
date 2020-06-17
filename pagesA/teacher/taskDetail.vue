<template>
	<view class="taskDetail" :class="taskReviewData ? 'active' : ''">
		<view class="" v-if="taskInfo">
			<view class="taskBox taskInfo">
				<view class="taskInfo1">
					<taskItem :task="taskInfo"></taskItem>
					<view class="detailBtn" v-if="!showDetail" @tap="showDetail = true">
						<view class="dbText">
							查看详情
						</view>
						<image src="../../static/getMore.png" class="dbImg" mode="widthFix"></image>
					</view>
				</view>
				<view class="taskInfo2" :class="showDetail ? 'active' : ''">
					<view class="md">
						<mediaShow :taskData="taskInfo"></mediaShow>
					</view>
					
					<taskCourse :courseData="taskInfo"></taskCourse>
				</view>
				
			</view>
			<view class="taskBox taskRes" v-if="taskReviewData">
				<view class="taskComp">
					<view class="taskCompTop">
						<view class="tcpLeft">
							<image class="tcpL1Img" src="../../static/stuTask.png" mode=""></image>
							<view class="tcpL3">
								<view class="tcpL3T1">
									学员{{taskReviewData.studentModel.name}}的作业
								</view>
								<picker  class="tcpL3T2" range-key="studentName" @change="bindPickerChange" :value="currentStudentIndex" :range="students">
									<text class="tcpL3T2text">查看其他学员</text>
									<image class="tcpL3T2Img" src="../../static/bottom.png" mode=""></image>
								</picker>
							</view>
						</view>
					</view>
					<view class="taskCompBoo">
						<view class="tcb1">
							提交时间：
						</view>
						<view class="tcb2">
							{{taskReviewData.createTime}}
						</view>
						<view class="tcb2">
							{{taskReviewData.endWeek}}
						</view>
					</view>
					<view class="detailMore detailMore2">
						<mediaShow :taskData="taskReviewData.studentModel"></mediaShow>
					</view>
				</view>
			</view>
			<view class="taskBox taskStart" v-if="taskReviewData.status == 2">
				<Grade :start="taskReviewData.star" :isClick="false"></Grade>
			</view>
			<view class="taskBox taskMark" v-if="taskReviewData.status == 2">
				<image src="../../static/mark.png" class="markImg" mode=""></image>
				<view class="detailMore detailMore3">
					<mediaShow :taskData="taskReviewData.teacherModel"></mediaShow>
				</view>
			</view>
			<view class="taskOpr" v-if="taskReviewData">
				<view v-if="taskReviewData.status == 1" class="taskBtn" @tap="toMakeTask()">
					批阅作业
				</view>
				<view v-if="taskReviewData.status == 2" class="taskBtn" @tap="toMakeTask()">
					修改批阅
				</view>
			</view>
		</view>
	</view>
</template>

<script>
//1未做作业->做作业
//2已提交->修改作业
//4被打回->修改作业
//3已批阅
import taskItem from '@/components/taskItem.vue'
import taskCourse from '@/components/taskCourse.vue'
import mediaShow from '@/components/mediaShow.vue'
import utils from '../../utils/method.js'
import Grade from '@/components/Grade.vue';
export default{
	components:{
		Grade,
		taskItem,
		taskCourse,
		mediaShow
	},
	data(){
		return {
			showDetail:false,
			jobId:"",
			taskInfo: null,
			taskReviewData:null,
			students:[],
			currentStudentIndex:0
		}
	},
	async onLoad(opt) {
		this.jobId = opt.id;
		uni.showLoading({
			title:"数据加载中...",
			mask:true
		})
		await this.getTaskInfo()
		await this.getStudentList()
		uni.hideLoading()
	},
	methods:{
		//获取作业详情
		async getTaskInfo(){
			try{
				let res = await this.$http({
					apiName:"lessionTaskDetail2",
					data:{
						jobId:this.jobId
					}
				})
				this.taskInfo = res.data
			}catch(e){
				//TODO handle the exception
			}
		},
		//获取做了作业的学生列表
		async getStudentList(){
			try{
				let res = await this.$http({
					apiName:"didTaskStudentList",
					data:{
						arrangeLessonJobId:this.jobId
					}
				})
				this.students = res.data;
				if(this.students.length > 0){
					this.getRevewInfo()
				}else{
					this.showDetail = true
				}
			}catch(e){
				//TODO handle the exception
			}
		},
		//获取该学生的作业和教师批阅
		async getRevewInfo(){
			try{
				let res = await this.$http({
					apiName:"studentTaskDetail",
					data:{
						arrangeLessonJobId:this.jobId,
						studentId:this.students[this.currentStudentIndex].studentId
					}
				})
				this.taskReviewData = res.data;
				this.taskReviewData.createTime = utils.unixToDatetime(this.taskReviewData.createTime)
				if(this.taskReviewData.status == 2){
					Object.assign(this.taskReviewData,utils.setTeacherStar(this.taskReviewData.star));
				}
				
			}catch(e){
				//TODO handle the exception
			}
		},
		toMakeTask(){
			uni.navigateTo({
				url:'/pagesA/teacher/taskReview?arrangeLessonJobId=' + this.jobId + '&studentId=' + this.students[this.currentStudentIndex].studentId
			})
		},
		async bindPickerChange(e){
			this.currentStudentIndex = e.target.value;
			uni.showLoading({
				title:"加载中...",
				mask:true,
			})
			await this.getRevewInfo()
			uni.hideLoading()
		}
	}
}
</script>

<style lang="scss" scoped>
.taskDetail.active{
	padding-bottom: 140rpx;
}
.taskDetail{
	min-height: 100vh;
	background-color: #F6F6F6;
	box-sizing: border-box;
	padding: 32rpx;
	padding-bottom: 40rpx;
	.taskBox{
		box-shadow:0px 4px 24px 0px rgba(0,0,0,0.08);
		border-radius:12px;
		padding: 30rpx;
		background-color: #fff;
		overflow: hidden;
		.detailMore{
			padding: 30rpx;
			padding-top: 0;
			.detailDesc{
				color: #909399;
				font-size: 28rpx;
				line-height: 44rpx;
			}
			.detailImgBox{
				display: flex;
				flex-flow: row wrap;
				justify-content: space-between;
				.detailImg{
					width: 194rpx;
					height: 194rpx;
					border-radius: 8rpx;
					margin-top: 20rpx;
					
				}
			}
		}
		.detailMore2{
			padding: 0;
			padding-top: 30rpx;
		}
		.detailMore3{
			padding: 0;
		}
	}
	.taskStart{
		margin-top: 40rpx;
		display: flex;
	}
	.taskInfo{
		padding: 0;
		.taskInfo1{
			padding: 30rpx;
			.detailBtn{
				display: flex;
				justify-content: center;
				align-items: center;
				margin-top: 20rpx;
				.dbText{
					color: #909399;
					font-size: 28rpx;
				}
				.dbImg{
					width: 50rpx;
					height: 30rpx;
					height: auto;
				}
			}
		}
		.taskInfo2{
			background-color: #fff;
			height: 0;
			.md{
				padding: 30rpx;
				padding-top: 0;
			}
		}
		.taskInfo2.active{
			height: fit-content;
			transition: height 2s;
		}
	}
	.taskRes{
		margin-top: 40rpx;
		.taskComp{
			.taskCompTop{
				.tcpLeft{
					display: flex;
					align-items: center;
					.tcpL1Img{
						width: 112rpx;
						height: 40rpx;
					}
					.tcpL3{
						margin-left: 10rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						flex: 1;
						.tcpL3T1{
							color: #303133;
							font-size: 36rpx;
							font-weight: bold;
						}
						.tcpL3T2{
							display: flex;
							align-items: center;
							.tcpL3T2text{
								color: #909399;
								font-size: 24rpx;
							}
							.tcpL3T2Img{
								width: 28rpx;
								height: 24rpx;
							}
						}
					}
				}
			}
			.taskCompBoo{
				margin-top: 16rpx;
				display: flex;
				align-items: center;
				.tcb1{
					color: #606266;
					font-size: 26rpx;
				}
				.tcb2{
					margin-right: 10rpx;
					color: #F72C2C;
					font-size: 28rpx;
				}
			}
		}
	}
	.taskMark{
		margin-top: 40rpx;
		.markImg{
			width: 112rpx;
			height: 40rpx;
		}
	}
	.taskOpr{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 140rpx;
		background-color: #fff;
		.taskBtn{
			width: 686rpx;
			height: 88rpx;
			border-radius: 44rpx;
			background-color: #2ACC8C;
			margin: auto;
			margin-top: 26rpx;
			text-align: center;
			line-height: 88rpx;
			color: #fff;
			font-size: 32rpx;
		}
	}
}
</style>
