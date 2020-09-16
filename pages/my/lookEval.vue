<template>
	<view class="content">
		<view class="view-context">
			<text>{{dataObj.content}}</text>
			<view class="imgs flex " v-if="dataObj.imgList.length!==0">
				<image :src="src" v-for="(src,index) in dataObj.imgList" :key="index" mode=""></image>
			</view>
			<button class="updateBtn" @tap="navTo(`./evaluate?context=${dataObj.content}&imgs=${dataObj.imgList}&cid=${dataObj.courseId}&cmmid=${commentCourseId}`)">修改评价</button>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				dataObj:{},
				commentCourseId: null //评价ID
			}
		},
		onLoad({cid}) {
			cid && (this.commentCourseId = cid);
			this.getEvalDetail();
		},
		methods:{
			async getEvalDetail(){
				const { data } = await this.$http({
					apiName: "lookCommentCourse",
					method: "POST",
					data:{
						commentCourseId: this.commentCourseId
					}
				});
				// data['imgs'] = data.img.split(",");
				// console.log(data);
				this.dataObj = data;
			},
			navTo(path){
				uni.navigateTo({
					url: path
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.content{
		min-height: 100vh;
		background-color: #FFFFFF;
	}
	.view-context{
		width: 686rpx;
		height: auto;
		padding: 30rpx 30rpx 10rpx ;
		margin-top: 30rpx;
		background-color: #F8F8F8;
		text{
			font-size: 28rpx;
			color: #606266;
			line-height:44px;
		}
		.imgs{
			margin-top: 30rpx;
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
		.updateBtn{
			width: 686rpx;
			height:88rpx;
			background-color: #FDC623;
			border-radius: 44rpx;
			line-height: 88rpx;
			color: #FFFFFF;
			font-size: 32rpx;
			position: fixed;
			bottom: 26rpx;
			left: 50%;
			transform: translateX(-50%);
		}
	}
</style>
