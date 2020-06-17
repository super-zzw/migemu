<template>
	<view class="StaskMake">
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
			<view class="taskBox taskData">
				<mediaData :taskData="task.studenJob" :textPlaceholder="textPlaceholder" @mediaDataChange="mediaDataChange"
				 @mediaDelete="mediaDelete"></mediaData>
			</view>
			<view class="taskOpr">
				<view class="taskBtn" @tap="submit">
					提交作业
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import taskItem from '@/components/taskItem.vue'
	import taskCourse from '@/components/taskCourse.vue'
	import mediaShow from '@/components/mediaShow.vue'
	import mediaData from '@/components/mediaData.vue'
	import utils from '../../utils/method.js'
	export default {
		components: {
			taskItem,
			taskCourse,
			mediaShow,
			mediaData
		},
		data() {
			return {
				showDetail: false,
				srlJobId: "",
				task: null,
				textPlaceholder:"请输入作业内容"
			}
		},
		async onLoad(opt) {
			this.srlJobId = opt.srlJobId;
			uni.showLoading({
				title: "数据加载中...",
				mask: true
			})
			await this.getData();
			uni.hideLoading()
		},
		methods: {
			async getData() {
				try {
					let res = await this.$http({
						apiName: "stdentTaskDetail",
						method: "POST",
						data: {
							srlJobId: this.srlJobId
						}
					})
					this.task = res.data;
					// if(this.task.lessonJob.checkStatus != 0){
					// 	this.task.studenJob.postTime = utils.unixToDatetime(this.task.studenJob.postTime)
					// }
				} catch (e) {
					//TODO handle the exception
				}
			},
			async submit() {
				let _jdata = [
					{
						data:(!this.task.studenJob.content.trim() &&
						!this.task.studenJob.picList.length &&
						!this.task.studenJob.voiceList.length &&
						!this.task.studenJob.videoList.length) ? "" : 1,
						info:"请输入作业内容",
					},
					
				];
				let jre = await utils.judgeData(_jdata);
				if (jre) {
					uni.showLoading({
						title: "提交中...",
						mask: true
					})
					let _type = 0;
					if(this.task.lessonJob.checkStatus == -1 || this.task.lessonJob.checkStatus == 1){
						_type = 1
					}
					try {
						let res = await this.$http({
							apiName: "submitTask",
							method: "POST",
							data: {
								type:_type,
								studentLessonJobId: this.srlJobId,
								content: this.task.studenJob.content,
								picList: this.task.studenJob.picList,
								videoList: this.task.studenJob.videoList,
								voiceList: JSON.stringify(this.task.studenJob.voiceList),
							}
						})
						if (res) {
							uni.showToast({
								title: "提交成功"
							})
							setTimeout(_ => {
								uni.navigateBack({
									delta: 2
								})
							}, 1500)
						}
					} catch (e) {
						//TODO handle the exception
					} finally {
						uni.hideLoading()
					}
				}
			},
			mediaDataChange(type, data) {
				if (type == 0) {
					this.task.studenJob.content = data;
				} else if (type == 1) {
					this.task.studenJob.picList.push(data)
				} else if (type == 2) {
					this.task.studenJob.voiceList.push(data)
				} else if (type == 3) {
					this.task.studenJob.videoList.push(data)
				}
			},
			mediaDelete(type, index) {
				if (type == 1) {
					this.task.studenJob.picList.splice(index, 1)
				} else if (type == 2) {
					this.task.studenJob.voiceList.splice(index, 1)
				} else if (type == 3) {
					this.task.studenJob.videoList.splice(index, 1)
				}
			},
		},
	}
</script>

<style lang="scss" scoped>
	.StaskMake {
		min-height: 100vh;
		background-color: #F6F6F6;
		box-sizing: border-box;
		padding: 32rpx;
		padding-bottom: 150rpx;

		.taskBox {
			box-shadow: 0px 4px 24px 0px rgba(0, 0, 0, 0.08);
			border-radius: 12px;
			padding: 30rpx;
			background-color: #fff;
			overflow: hidden;

			.detailMore {
				padding: 30rpx;
				padding-top: 0;

				.detailDesc {
					color: #909399;
					font-size: 28rpx;
					line-height: 44rpx;
				}

				.detailImgBox {
					display: flex;
					flex-flow: row wrap;
					justify-content: space-between;

					.detailImg {
						width: 194rpx;
						height: 194rpx;
						border-radius: 8rpx;
						margin-top: 20rpx;

					}
				}
			}
		}

		.taskInfo {
			margin-top: 40rpx;
			padding: 0;

			.taskInfo1 {
				padding: 30rpx;

				.detailBtn {
					display: flex;
					justify-content: center;
					align-items: center;
					margin-top: 20rpx;

					.dbText {
						color: #909399;
						font-size: 28rpx;
					}

					.dbImg {
						width: 50rpx;
						height: 30rpx;
						height: auto;
					}
				}
			}

			.taskInfo2 {
				background-color: #fff;
				height: 0;

				.md {
					padding: 30rpx;
					padding-top: 0;
				}
			}

			.taskInfo2.active {
				height: fit-content;
				transition: height 2s;
			}
		}

		.taskData {
			margin-top: 40rpx;
		}

		.taskOpr {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 140rpx;
			background-color: #fff;
			z-index: 999;
			.taskBtn {
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

		.boxTop {
			font-size: 0;
			border-radius: 10rpx;
			overflow: hidden;

			.imgPic {
				width: 100%;
				height: auto;
			}

			.videoBox {
				width: 100%;
				height: 500rpx;

				.videoData {
					width: 100%;
					height: 100%;
				}
			}
		}

		.boxBoo {
			margin-top: 60rpx;
			text-align: center;

			.close {
				width: 84rpx;
				height: 84rpx;
			}
		}
	}
</style>
