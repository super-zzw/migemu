<template>
	<view class="content">
		<view class="tedItem">
			<view class="ted1">
				<view class="tshgd">{{ teacherCommentItem.courseTitle }}</view>
				<view class="tags">
					<text v-if="teacherCommentItem.courseType == 0" class="tag" :style="{ borderColor: '#FDC623', color: '#FDC623' }">线下课</text>
					<text v-if="teacherCommentItem.courseType == 1" class="tag" :style="{ borderColor: '#FDC623', color: '#FDC623' }">线上课</text>
					<text v-if="teacherCommentItem.courseClassType == 1" class="tag" :style="{ borderColor: '#FDC623', color: '#FDC623' }">1对1</text>
					<text v-if="teacherCommentItem.courseClassType == 2" class="tag" :style="{ borderColor: '#FDC623', color: '#FDC623' }">1对2</text>
					<text v-if="teacherCommentItem.courseClassType == 3" class="tag" :style="{ borderColor: '#FDC623', color: '#FDC623' }">多人小班</text>
				</view>
				<view class="tshgd">{{ teacherCommentItem.title }}</view>
			</view>
			<view class="ted2 xy">学员：{{ teacherCommentItem.studentName || teacherCommentItem.studentNameStr }}</view>
			<view class="ted2">上课时间：{{ rangTime }}</view>
		</view>
		<view class="taskBox scope flex align-center"><Grade @gradeChange="gradeChange" :start="star"></Grade></view>
		<view class="taskBox taskBoxMedia">
			<mediaData :taskData="taskData" :textPlaceholder="textPlaceholder" @mediaDataChange="mediaDataChange" @mediaDelete="mediaDelete"></mediaData>
		</view>
		<view class="taskOpr">
			<view class="taskBtn" @tap="submit">
				完成课评
			</view>
		</view>
	</view>
</template>

<script>

import Grade from '../../components/Grade.vue';
import mediaData from '@/components/mediaData.vue'
import { mapState } from 'vuex';
import utils from '../../utils/method.js'
export default {
	components: {
		Grade,
		mediaData
	},
	data() {
		return {
			textPlaceholder:"请输入课评文字",
			star: 5,  //评分值
			taskData: {
				content: '',
				picList: [],
				voiceList: [],
				videoList: [],
			},
			backPageNum:1, // 返回的页面
			rangTime:""
		};
	},
	computed:{
		...mapState(['teacherCommentItem','assessment'])  
	},
	onLoad({edit}) {
		if(this.assessment){
			this.taskData = this.assessment;
			console.log(this.taskData);
			this.star = this.assessment.comment.star;
			this.$store.commit("assessmentSet",'');
		}
		edit && (this.backPageNum = 2);
		this.rangTime =  utils.unixToDatetime(this.teacherCommentItem.startTime) + '-' + utils.unixToDatetime(this.teacherCommentItem.endTime,8)
	},
	methods: {
		async submit(){
			let _data = [
				{
					data:(!this.taskData.content.trim() && 
					!this.taskData.picList.length &&
					!this.taskData.voiceList.length &&
					!this.taskData.videoList.length) ? "" : 1,
					info:"请输入课评文字"
				}
			]
			let jres = await utils.judgeData(_data);
			if(jres){
				uni.showLoading({
					title:"提交中..."
				})
				try{
					let res = await this.$http({
						apiName:"kpStudent",
						method:"POST",
						data:{
							studentReservedLessonId:this.teacherCommentItem.studentCourseLessonId || this.teacherCommentItem.studentReservedLessonId,
							star:this.star,
							content:this.taskData.content,
							videoList:this.taskData.videoList,
							picList:this.taskData.picList,
							voiceList:JSON.stringify(this.taskData.voiceList),
						}
					})
					uni.showToast({
						title:"课评成功"
					}),
					setTimeout(()=>{
						uni.navigateBack({
							delta: this.backPageNum
						})
					},1500)
				}catch(e){
					//TODO handle the exception
				}finally{
					uni.hideLoading()
				}
			}
		},
		gradeChange(e) {
			this.star = e;
		},
		mediaDataChange(type,data){
			if(type == 0){
				this.taskData.content = data;
			}else if(type == 1){
				this.taskData.picList.push(data)
			}else if(type == 2){
				this.taskData.voiceList.push(data)
			}else if(type == 3){
				this.taskData.videoList.push(data)
			}
		},
		mediaDelete(type,index){
			if(type == 1){
				this.taskData.picList.splice(index,1)
			}else if(type == 2){
				this.taskData.voiceList.splice(index,1)
			}else if(type == 3){
				this.taskData.videoList.splice(index,1)
			}
		}
	}
};
</script>

<style scoped lang="scss">
.content{
	padding: 0 32rpx;
	min-height: 100vh;
	padding-bottom: 160rpx;
	box-sizing: border-box;
}
.tedItem {
	background-color: #ffffff;
	border-radius: 12rpx;
	padding: 30rpx;
	margin: 30rpx 0 30rpx;
	width: 686rpx;
	.ted1 {
		.tshgd {
			color: #303133;
			font-size: 32rpx;
			font-weight: bold;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
	.tags {
		margin-top: 10rpx;
		margin-bottom: 10rpx;
		.tag {
			font-size: 24rpx;
			border: 1rpx solid;
			padding: 2rpx 12rpx;
			border-radius: 20rpx;
			display: inline-block;
			margin-right: 10rpx;
			font-weight: 200;
		}
	}
	.ted2 {
		color: #909399;
		font-size: 28rpx;
		line-height: 44rpx;
		&.xy {
			margin-top: 28rpx;
			margin-bottom: 10rpx;
		}
		text {
			margin-left: 52rpx;
		}
		.ted2C {
			color: #f95c25;
			font-size: 40rpx;
			font-weight: bold;
			margin-left: 6rpx;
			margin-right: 6rpx;
		}
	}
}
.scope {
	width: 686rpx;
	height: 108rpx;
	padding-left: 32rpx;
	background-color: #ffffff;
	padding-bottom: 20rpx;
}
.taskBox {
	box-shadow: 0px 4px 24px 0px rgba(0, 0, 0, 0.08);
	border-radius: 12px;
	padding: 30rpx;
	background-color: #fff;
	overflow: hidden;
	width: 100%;
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
			width: 686rpx;
			height: 88rpx;
			border-radius: 44rpx;
			background-color: #2ACC8C;
			margin-top: 26rpx;
			text-align: center;
			line-height: 88rpx;
			color: #fff;
			font-size: 32rpx;
			font-weight: bold;
		}
	}
	

</style>
