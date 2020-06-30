<template>
	<view class="content">
		<view class="null" v-if="data_list.length === 0">
			<DefaultPage></DefaultPage>
		</view>
		<template v-else>
			<view class="block flex flex-column" v-for="(item,index) in data_list" :key="item.id">
				<view class="b-title">上课时间：{{item.startTime}} {{item.startWeek}}</view>
				<view class="who-class">{{item.courseName}}</view>
				<view class="who-less">{{item.lessonName}}</view>
				<view class="who-teacher flex justify-between">
					<view class="w-left flex flex-column">
						<text class="t-name">授课老师：{{item.teacherName}}</text>
						<text class="t-num">上课人数：{{item.alreadyNum}}/{{item.maxNum}}</text>
					</view>
					<view class="w-right">
						<text class="make" :data-val="item" @tap="showModal($event,index)" data-target="Modal">
							取消预约
						</text>
					</view>
				</view>
			</view>
		</template>
		
		
		<view class="cu-modal" :class="modalName=='Modal'?'show':''">
			<view class="cu-dialog myDialog">
				<view class="boxTop flex align-center flex-column justify-center">
					<view class="boxTop-name">{{chunk.courseName}}</view>
					<view class="boxTop-lesson">{{chunk.lessonName}}</view>
					<view class="boxTop-time" >上课时间：{{chunk.startTime}} {{chunk.startWeek}}</view> 
					<view class="btns flex align-center justify-center" >
						<button class="cancel green" @tap="hideModal">再想想</button> 
						<button class="cancel gray"  @tap="cancelClass">确认取消</button> 
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
import DefaultPage from "../../components/defaultPage.vue";
import utils from "../../utils/method.js";
	export default{
		components:{
			DefaultPage
		},
		data(){
			return{
				modalName:null,
				arrangeCourseId: null, // 排课课程标识
				data_list:[],
				chunk: {}, // 点击的列表
			}
		},
		onLoad({aid}) {
			aid && (this.arrangeCourseId = aid);
			this.getMyReservationLesson();
		},
		methods:{
			showModal(e,index) {
				console.log(e);
				this.modalName = e.currentTarget.dataset.target;
				this.chunk = e.currentTarget.dataset.val;
				this.chunk['index'] = index;
			},
			hideModal(e) {
				this.modalName = null;
			},
			// 立即预约
			async confirmClass(){
				try{
					const arrangeCourseLessonId = this.chunk.arrangeCourseLessonId; // 对应的ID
					const courseId = this.chunk.courseId;
					const index = this.chunk.index; // 下标
					const { data } = await this.$http({
						apiName: "getReservationLesson",
						method: "POST",
						data:{arrangeCourseLessonId,courseId}
					});
					uni.showToast({title: "预约成功"});
					this.data_list[index].status = true;
					this.hideModal(); // 隐藏模态框
				}catch(e){
					
				}
				
			},
			// 取消预约
			async cancelClass(){
				try{
					const arrangeCourseLessonId = this.chunk.arrangeCourseLessonId; // 对应的ID
					const index = this.chunk.index; // 下标
					const { data } = await this.$http({
						apiName: "getCancelReservationLesson",
						method: "POST",
						data:{arrangeCourseLessonId}
					});
					uni.showToast({title: "取消预约成功"});
					this.data_list.splice(index,1);
					this.hideModal(); // 隐藏模态框
				}catch(e){
					
				}
			},
			// 获取我的预约课列表
			async getMyReservationLesson(){
				uni.showLoading({
					title: "正在加载中...",
					mask:true
				})
				const arr = ['星期天','星期一','星期二','星期三','星期四','星期五','星期六'];
				const { data } = await this.$http({
					apiName: "getMyReservationLesson",
					method: "POST",
					data:{
						arrangeCourseId: this.arrangeCourseId
					}
				});
				data.forEach(item => {
					item['startTime'] = utils.unixToDatetime(item['startTime']);
					item['startWeek'] = arr[item['startWeek']]
				})
				this.data_list = data;
				uni.hideLoading();
				console.log(data);
			}
		}
	}
</script>

<style scoped lang="scss">
	.null{
		margin-top: 200rpx;
	}
	.block{
		width:686rpx;
		height:auto;
		background:rgba(255,255,255,1);
		border-radius:12rpx;
		padding: 30rpx 30rpx 40rpx ;
		margin-top: 30rpx;
		.b-title{
			font-size: 32rpx;
			font-weight: 550;
		}
		.who-class,.who-less{
			font-size: 28rpx;
			color: #606266;
		}
		.who-class{
			margin: 20rpx 0 16rpx;
		}
		.who-less{
			margin-bottom: 16rpx;
		}
		.who-teacher{
			.w-left{
				font-size: 28rpx;
				color: #606266;
				text{
					line-height:40rpx;
				}
				.t-name{
					margin-bottom: 16rpx;
				}
				.t-num{
					color: #F72C2C;
				}
			}
			.w-right{
				margin-top: 37rpx;
				.make{
					font-size: 32rpx;
					border-radius:200px;
					border:2rpx solid #FDC623;
					color: #FDC623;
					padding: 14rpx 40rpx;
					&.bg{
						background-color: #FDC623;
						color: #FFFFFF;
					}
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
				font-weight: 550;
			}
			.boxTop-lesson{
				margin: 8rpx 0 40rpx;
			}
			.boxTop-time{
				color: #F72C2C;
				margin-bottom: 60rpx;
			}
			.sign{
				width: 378rpx;
				height: 64rpx;
				line-height: 64rpx;
				background-color: #FDC623;
				border-radius: 32rpx;
				color: #FFFFFF;
			}
			.tips-t{
				color: #909399;
				font-size: 24rpx;
				margin-top: 30rpx;
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
						background-color:#FDC623;
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
