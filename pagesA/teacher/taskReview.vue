<template>
	<view class="taskMake">
		<view class="" v-if="taskReviewData">
			<view class="taskBox taskRes">
				<view class="taskComp">
					<view class="taskCompTop">
						<view class="tcpLeft">
							<image class="tcpL1Img" src="../../static/stuTask.png" mode=""></image>
							<view class="tcpL3">
								<view class="tcpL3T1">
									学员{{taskReviewData.studentModel.name}}的作业
								</view>
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
			<view class="taskBox taskStart">
				<Grade @gradeChange="gradeChange" :start="taskReviewData.star"></Grade>
			</view>
			<view class="taskBox taskBoxMedia">
				<mediaData :taskData="taskReviewData.teacherModel" :textPlaceholder="textPlaceholder" @mediaDataChange="mediaDataChange" @mediaDelete="mediaDelete"></mediaData>
			</view>
			<view class="taskOpr">
				<view class="taskBtn" @tap="submit(1)">
					完成批阅
				</view>
				<view class="taskBtn taskBtn2" @tap="submit(2)" v-if="taskReviewData.status != 2">
					打回重做
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// `status` int(2) NOT NULL COMMENT '审核状态 -1=被打回,0=未完成,1=已提交,2=已批阅,',
import Grade from '@/components/Grade.vue';
import mediaData from '@/components/mediaData.vue'
import mediaShow from '@/components/mediaShow.vue'
import utils from '../../utils/method.js'
export default{
	components:{
		Grade,
		mediaData,
		mediaShow
	},
	data(){
		return {
			textPlaceholder:"请输入批阅文字",
			taskReviewData: null,
			arrangeLessonJobId:"",
			studentId:""
		}
	},
	async onLoad(opt) {
		this.arrangeLessonJobId = opt.arrangeLessonJobId;
		this.studentId = opt.studentId;
		await this.getRevewInfo()
	},
	methods:{
		//获取该学生的作业和教师批阅
		async getRevewInfo(){
			uni.showLoading({
				title:"数据加载中...",
				mask:true,
			})
			try{
				let res = await this.$http({
					apiName:"studentTaskDetail",
					data:{
						arrangeLessonJobId:this.arrangeLessonJobId,
						studentId:this.studentId
					}
				})
				this.taskReviewData = res.data;
				this.taskReviewData.createTime = utils.unixToDatetime(this.taskReviewData.createTime,3);
			}catch(e){
				//TODO handle the exception
			}finally{
				uni.hideLoading()
			}
		},
		async submit(type){
			let _msg = "确定提交批阅？";
			if(type == 2){
				_msg = "确定打回重做?"
			}
			let that = this;
			uni.showModal({
			    title: '提示',
			    content: _msg,
			    success: function (res) {
			        if (res.confirm) {
			           if(type == 1){
						   that.submit1()
					   }else if(type == 2){
						   that.submit2()
					   }
			        }
			    }
			});
		},
		// 批阅
		async submit1(){
			let _data = [
				{
					data:(!this.taskReviewData.teacherModel.content.trim() && 
					!this.taskReviewData.teacherModel.picList.length &&
					!this.taskReviewData.teacherModel.voiceList.length &&
					!this.taskReviewData.teacherModel.videoList.length) ? "" : 1,
					info:"请输入批阅内容"
				}
			]
			let jres = await utils.judgeData(_data);
			if(jres){
				uni.showLoading({
					title:"提交中...",
					mask:true
				})
				try{
					let res = await this.$http({
						apiName:"reviewTask",
						method:"POST",
						data:{
							star:this.taskReviewData.star,
							studentLessonJobId:this.taskReviewData.id,
							content:this.taskReviewData.teacherModel.content,
							picList:this.taskReviewData.teacherModel.picList,
							videoList:this.taskReviewData.teacherModel.videoList,
							voiceList:JSON.stringify(this.taskReviewData.teacherModel.voiceList),
						}
					})
					if(res){
						uni.showToast({
							title:"提交成功"
						})
						setTimeout(_=>{
							uni.navigateBack({
								delta:2
							})
						},1500)
					}
				}catch(e){
					//TODO handle the exception
				}finally{
					uni.hideLoading()
				}
			}
		},
		//打回
		async submit2(){
			uni.showLoading({
				title:"提交中...",
				mask:true
			})
			try{
				let res = await this.$http({
					apiName:"repluseTask",
					method:"POST",
					data:{
						studentLessonJobId:this.taskReviewData.id,
					}
				})
				if(res){
					uni.showToast({
						title:"提交成功"
					})
					setTimeout(_=>{
						uni.navigateBack({
							delta:2
						})
					},1500)
				}
			}catch(e){
				//TODO handle the exception
			}finally{
				uni.hideLoading()
			}
		},
		gradeChange(e) {
			this.taskReviewData.star = e;
		},
		mediaDataChange(type,data){
			if(type == 0){
				this.taskReviewData.teacherModel.content = data;
			}else if(type == 1){
				this.taskReviewData.teacherModel.picList.push(data)
			}else if(type == 2){
				this.taskReviewData.teacherModel.voiceList.push(data)
			}else if(type == 3){
				this.taskReviewData.teacherModel.videoList.push(data)
			}
		},
		mediaDelete(type,index){
			if(type == 1){
				this.taskReviewData.teacherModel.picList.splice(index,1)
			}else if(type == 2){
				this.taskReviewData.teacherModel.voiceList.splice(index,1)
			}else if(type == 3){
				this.taskReviewData.teacherModel.videoList.splice(index,1)
			}
		}
	},
}
</script>

<style lang="scss" scoped>
.taskMake{
	min-height: 100vh;
	background-color: #F6F6F6;
	box-sizing: border-box;
	padding: 32rpx;
	padding-bottom: 160rpx;
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
	.taskStart{
		display: flex;
		margin-top: 40rpx;
	}
	.taskInfo{
		margin-top: 40rpx;
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
		}
		.taskInfo2.active{
			height: fit-content;
			transition: height 2s;
		}
	}
	.taskBoxMedia{
		margin-top: 40rpx;
	}
	.taskOpr{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 140rpx;
		background-color: #fff;
		display: flex;
		justify-content: space-around;
		.taskBtn{
			width: 320rpx;
			height: 88rpx;
			border-radius: 44rpx;
			background-color: #FDC623;
			margin-top: 26rpx;
			text-align: center;
			line-height: 88rpx;
			color: #fff;
			font-size: 32rpx;
			font-weight: bold;
		}
		.taskBtn2{
			background-color: #fff;
			border: 2rpx solid #FDC623;
			box-sizing: border-box;
			color: #FDC623;
		}
	}
}
</style>
