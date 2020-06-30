<template>
	<view class="taskDetail" :class="task ? 'active' : ''">
		<view class="" v-if="task">
			<view class="taskBox taskInfo">
				<view class="taskInfo1">
					<taskItem :task="task.lessonJob"></taskItem>
					<view class="detailBtn" v-if="!showDetail" @tap="showDetail = true">
						<view class="dbText">
							查看详情
						</view>
						<image src="../../static/getMore.png" class="dbImg" mode="widthFix"></image>
					</view>
				</view>
				<view class="taskInfo2" :class="showDetail ? 'active' : ''">
					<view class="md">
						<mediaShow :taskData="task.lessonJob"></mediaShow>
					</view>
					<taskCourse :courseData="task.lessonJob"></taskCourse>
				</view>
				
			</view>
			<view class="taskBox taskRes" v-if="task.lessonJob.checkStatus != 0">
				<view class="taskComp">
					<view class="taskCompTop">
						<view class="tcpLeft">
							<image class="tcpL1Img" src="../../static/mytask.png" mode=""></image>
							<view class="tcpL3">
								<text class="tcpL3Text t2" v-if="task.lessonJob.checkStatus == -1">被打回</text>
								<text class="tcpL3Text t2" v-if="task.lessonJob.checkStatus == 1">已提交</text>
								<text class="tcpL3Text t3" v-if="task.lessonJob.checkStatus == 2">已批阅</text>
							</view>
						</view>
					</view>
					<view class="taskCompBoo">
						<view class="tcb1">
							提交时间：
						</view>
						<view class="tcb2">
							{{task.studenJob.postTime}}
						</view>
						<view class="tcb2">
							{{task.studenJob.postWeek}}
						</view>
					</view>
					<view class="detailMore detailMore2">
						<mediaShow :taskData="task.studenJob"></mediaShow>
					</view>
				</view>
			</view>
			<view class="taskBox taskMark" v-if="task.lessonJob.checkStatus == 2">
				<image src="../../static/mark.png" class="markImg" mode=""></image>
				<view class="detailMore detailMore3">
					<mediaShow :taskData="task.teacherCStudent"></mediaShow>
				</view>
			</view>
			<view class="taskOpr" v-if="task.lessonJob.checkStatus != 2">
				<view v-if="task.lessonJob.checkStatus == 0" class="taskBtn" @tap="toMakeTask">
					做作业
				</view>
				<view v-if="task.lessonJob.checkStatus == -1 || task.lessonJob.checkStatus == 1" class="taskBtn" @tap="toMakeTask">
					修改作业
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
export default{
	components:{
		taskItem,
		taskCourse,
		mediaShow
	},
	data(){
		return {
			showDetail:false,
			srlJobId:"",
			task:null,
		}
	},
	async onLoad(opt) {
		this.srlJobId = opt.id;
		uni.showLoading({
			title:"数据加载中...",
			mask:true
		})
		await this.getData()
		uni.hideLoading()
	},
	methods:{
		//获取作业详情
		async getData(){
			try{
				let res = await this.$http({
					apiName:"stdentTaskDetail",
					method:"POST",
					data:{
						srlJobId:this.srlJobId
					}
				})
				this.task = res.data;
				if(this.task.lessonJob.checkStatus != 0){
					this.task.studenJob.postTime = utils.unixToDatetime(this.task.studenJob.postTime)
				}else{
					this.showDetail = true;
				}
			}catch(e){
				//TODO handle the exception
			}
		},
		toMakeTask(){
			uni.navigateTo({
				url:'/pagesB/student/taskMake?srlJobId=' + this.srlJobId
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.taskDetail.active{
	padding-bottom: 160rpx;
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
			padding-top: 30rpx;
		}
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
				display: flex;
				justify-content: space-between;
				align-items: center;
				.tcpLeft{
					display: flex;
					align-items: center;
					.tcpL1Img{
						width: 112rpx;
						height: 40rpx;
					}
					.tcpL3{
						margin-left: 26rpx;
						.tcpL3Text{
							display: block;
							padding-left: 16rpx;
							padding-right: 16rpx;
							padding-top: 4rpx;
							padding-bottom: 6rpx;
							color: #fff;
							font-size: 28rpx;
							border-radius: 8rpx;
						}
						.tcpL3Text.t1{
							background-color: #C0C4CC;
						}
						.tcpL3Text.t2{
							background-color: #FDC623;
						}
						.tcpL3Text.t3{
							background-color: #F72C2C;
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
		z-index: 999;
		.taskBtn{
			width: 686rpx;
			height: 88rpx;
			border-radius: 44rpx;
			background-color: #FDC623;
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
