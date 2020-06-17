<template>
	<view class="taskCoure" @tap="toLession">
		<view class="tceText">
			<view class="tceText1">
				{{courseData.courseName}}
			</view>
			<view class="tceText2">
				{{courseData.lessonName}}
			</view>
		</view>
		<image v-if="toDetail" src="../static/right.png" class="tceRightImg" mode=""></image>
	</view>
</template>

<script>
import {mapState} from 'vuex'
export default{
	props:{
		courseData:{
			type:Object,
			default:()=>{{}}
		},
		toDetail:{
			type:Boolean,
			default:true
		}
	},
	computed:{
		...mapState(['userInfo'])
	},
	methods:{
		toLession(){
			if(this.toDetail){
				if(this.userInfo.userType == 2){
					uni.navigateTo({
						url:`/pages/my/lessonsDetail?acid=${this.courseData.arrangeCourseId}&aclid=${this.courseData.arrangeCourseLessonId}`
					})
				}else if(this.userInfo.userType == 1){
					uni.navigateTo({
						url:`/pagesA/teacher/teacherLessonsDetail?aid=${this.courseData.arrangeCourseLessonId}`
					})
				}
				
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.taskCoure{
	background-color: #F0FCF8;
	padding: 20rpx 30rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	.tceText{
		color: #606266;
		font-size: 28rpx;
		.tceText2{
			margin-top: 6rpx;
		}
	}
	.tceRightImg{
		width: 48rpx;
		height: 32rpx;
	}
}
</style>
