<template>
	<view class="content">
		<view class="block ">
			<view class="block-top flex flex-column">
				<view class="block-name flex flex-column">
					<view class="flex ">
						<view class="block-title z">{{teacherCommentItem.courseTitle}}</view>
					</view>
					<view class="m-border">
						<text class="myborder">
							{{ teacherCommentItem.courseType == 0 ? '线下课':'线上课' }}
						</text>
						<text class="myborder">
							{{ teacherCommentItem.courseClassType == 1 ? '1对1':teacherCommentItem.courseClassType == 2?'1对2':'多人小班' }}
						</text>
					</view>
					<view class="block-title ass">{{teacherCommentItem.lessonTitle}}</view>
				</view>
				<view class="text xy" >学员：{{teacherCommentItem.studentNameStr}}</view>
				<view class="text time " >上课时间：{{teacherCommentItem.startTime}} {{teacherCommentItem.startTimeStr}} {{teacherCommentItem.endTimeStr}}</view>  

			</view>
			
		</view>
		
		<view class="view-context">
			<text class="logo">课后评价</text>
			<view class="number flex align-center">
				<grade :start="star" :isClick="false"></grade>
			</view>
			<!-- <view class="eval-content">
				{{detail.comment.content}}
			</view>
			<view class="imgs flex " v-if="detail.picList.length!==0">
				<image :src="src.fileUrl" v-for="src in detail.picList" :key="src.id" mode=""></image>
			</view> -->
			<mediaShow :taskData="detail"></mediaShow>
		</view>
		<view class="upBtn-outer flex align-center justify-center">
			<button class="updateBtn" @tap="navTo">修改评价</button>
		</view>
		
	</view>
</template>

<script>
	import { mapState } from "vuex";
	import Grade from "../../components/Grade.vue"
	import mediaShow from "../../components/mediaShow.vue"
	export default{
		data(){
			return{
				textData:[
					{
						text: '线下课',
						color: "#008c8c"
					}
				],
				star:null,
				studentReservedLessonId: null , //id
				detail: {}
			}
		},
		components:{
			Grade,
			mediaShow
		},
		async onLoad({id}) {
			this.studentReservedLessonId = id;
			await this.getEval();
		},
		computed:{
			...mapState(['teacherCommentItem'])
		},
		methods:{
			async getEval(){
				const { data } = await this.$http({
					apiName: "teacherLookStudetn",
					data: {
						studentReservedLessonId:this.studentReservedLessonId
					}
				});
				this.star = data.comment.star;
				this.detail = data;
				this.detail.content = data.comment.content;
			},
		
			navTo(){
				this.$store.commit("assessmentSet",this.detail);
				uni.navigateTo({
					url: "./fillClass?edit=1"
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.block{
		width: 686rpx;
		height: auto;
		position: relative;
		margin-top: 32rpx;
		background-color: #FFFFFF;
		box-shadow:0px 4rpx 20rpx 0px rgba(0,0,0,0.12);
		border-radius:12rpx;
		.block-top{
			padding: 32rpx 32rpx 0;
			.on-line{
				margin-bottom: 30rpx;
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
		.block-name{
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
			.block-title{
				font-size: 36rpx;
				font-weight: bold;
				margin-right: 20rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				&.z{
					max-width: 490rpx;
				}
				&.ass{
					max-width: 620rpx;
					margin-top: 4rpx;
					margin-right: 0;
				}
			}
			
		}
		.text{
			font-size: 28rpx;
			color: #606266;
		}

		.xy{
			margin: 20rpx 0 10rpx ;
		}

		.time{
			margin: 0 0 30rpx 0;
		}
		
	}
	
	.view-context{
		width: 686rpx;
		height: auto;
		padding: 30rpx 30rpx 10rpx ;
		margin-top: 30rpx;
		background: #FFFFFF;
		box-shadow:0px 4rpx 24rpx 0px rgba(0,0,0,0.08);
		border-radius:12rpx;
		.logo{
			padding: 2rpx 4rpx;
			background-color: #FFEEE8;
			color: #F95C25;
			font-size: 24rpx;
			border-radius:4rpx;
			border:2rpx solid rgba(249,92,37,1);
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
	}
	.eval-content{
		font-size: 30rpx;
		line-height: 40rpx;
	}
	.number{
		font-size: 30rpx;
		font-weight: bold;
		margin: 20rpx 0 16rpx;
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
	.upBtn-outer{
		width: 100%;
		height: 140rpx;
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
		background-color: #FFFFFF;
		bottom: 0;
		.updateBtn{
			width: 686rpx;
			height:88rpx;
			background-color: #2ACC8C;
			border-radius: 44rpx;
			line-height: 88rpx;
			color: #FFFFFF;
			font-size: 32rpx;
		}
	}
	
</style>
