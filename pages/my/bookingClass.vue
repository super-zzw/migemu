<template>
	<view class="content">
		<view class="header flex align-center justify-between">
			<view class="data-time flex align-center">
				<picker mode="date" :value="startData"  @change="startTimeChange">
					<view class="oBg flex align-center">{{startData}} <image src="../../static/bottom.png" mode=""></image> </view>
				</picker>
				<text>至</text>
				<picker mode="date" :value="endData" @change="endTimeChange">
					<view class="oBg flex align-center">{{endData}}<image src="../../static/bottom.png" mode=""></image></view>
				</picker>
			</view>
			<view class="text-btn" @tap="navTo(`./myCovenant?aid=${arrangeCourseId}`)">我的约课</view>
		</view>
		<view class="null" v-if="data_list.length === 0">
			<DefaultPage imgWidth="220" imgHeight="206" ></DefaultPage>
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
						<text class="make bg" v-if="!item.status" :data-val="item"  @tap="showModal($event,'confirm',index)" data-target="Modal">
							立即预约
						</text>
						<text v-else class="make"  :data-val="item" @tap="showModal($event,'cancel',index)" data-target="Modal">
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
					<button class="sign" :loading="btnDisable" :disabled="btnDisable" v-if="type==='confirm'" @tap="confirmClass">确认约课</button> 
					<text class="tips-t" v-if="type==='confirm'">预约成功将消耗{{chunk.consumeTime}}课时，该课程剩余{{chunk.surplusTime}}课时</text>
					<view class="btns flex align-center justify-center" v-if="type === 'cancel'">
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
import utils from "../../utils/method.js";
import DefaultPage from "../../components/defaultPage.vue"
	export default{
		components:{
			DefaultPage
		},
		data(){
			return{
				startData: '',
				endData: '',
				btnDisable: false,
				modalName:null,
				type: "",
				arrangeCourseId: null , //排课课程标识
				data_list:[] , // 渲染数据列表
				chunk:{}, //点击的那一块的数据
			}
		},
		methods:{
			navTo(path){
				uni.navigateTo({
					url: path 
				})
			},
			startTimeChange(e){
				if(this.startData !== e.detail.value){ // 避免重复日期请求
					this.startData = e.detail.value;
					this.getReservationLesson();
				}
			},
			endTimeChange(e){
				if(this.endData !== e.detail.value){// 避免重复日期请求
					const startTime = new Date(this.startData).getTime();
					const endTime = new Date(e.detail.value).getTime();
					if(endTime <= startTime){
						uni.showToast({
							title: "选择的时间有误",
							icon: "none"
						})
						return;
					}
					this.endData = e.detail.value;
					this.getReservationLesson();
				}
			},
			showModal(e,type,index) {
				this.modalName = e.currentTarget.dataset.target;
				this.type = type;
				this.chunk = e.currentTarget.dataset.val;
				this.chunk['index'] = index;
			},
			hideModal(e) {
				this.modalName = null;
			},
			// 立即预约
			async confirmClass(){
				try{
					this.btnDisable = true;
					const arrangeCourseLessonId = this.chunk.arrangeCourseLessonId; // 对应的ID
					const courseId = this.chunk.courseId; // 对应的ID
					const orderId = this.chunk.orderId;
					const index = this.chunk.index; // 下标
					const { data } = await this.$http({
						apiName: "getReservationLesson",
						method: "POST",
						data: {arrangeCourseLessonId,courseId,orderId}
					});
					uni.showToast({title: "预约成功"});
					this.btnDisable = false;
					this.getReservationLesson(); // 刷新列表
					this.hideModal(); // 隐藏模态框
				}catch(e){
					this.btnDisable = false;
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
					this.data_list[index].status = false;
					this.data_list[index].alreadyNum -= 1;
					this.hideModal(); // 隐藏模态框
				}catch(e){
					
				}
			},
			getDate(time) {
				let date = null;
				time && (time = time.replace(/-/g,"/"));
				time && time != undefined && time != 'undefined'  ?  date = new Date(time) :  date = new Date();  // 如果time 有传则使用传的日期，否则就是今天
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				let endDay = new Date(year,month,0).getDate();
				this.startData = `${year}-${month}-${day}`;
				this.endData = `${year}-${month}-${endDay}`;
			},
			// 获取预约上课列表
			async getReservationLesson(){
				uni.showLoading({
					title: "正在加载中...",
					mask:true
				})
				const arr = ['星期天','星期一','星期二','星期三','星期四','星期五','星期六'];
				const { data } = await this.$http({
					apiName: "getReservationLessonList",
					method: "POST",
					data:{
						arrangeCourseId: this.arrangeCourseId,
						startDateTime: this.startData,
						endDateTime: this.endData
					}
				})
				data.forEach(item => {
					item['startTime'] = utils.unixToDatetime(item['startTime']);
					item['startWeek'] = arr[item['startWeek']]
				})
				this.data_list = data;
				uni.hideLoading();
			}
		},
		onLoad({aid,startTime}) {
			this.getDate(startTime);
			aid && (this.arrangeCourseId = aid);
		},
		onShow() {
			this.getReservationLesson();
		}
	}  
</script>

<style scoped lang="scss">
	.null{
		margin-top: 180rpx;
	}
	.header{
		width: 100%;
		height: 120rpx;
		background-color: #FFFFFF;
		padding: 0 32rpx;
		.data-time{
			.oBg{
				width: 216rpx;
				height: 60rpx;
				border-radius: 8rpx;
				font-size: 28rpx;
				color: #F95C25;
				background-color: #FFF2ED;
				padding-left: 10rpx;
				image{
					width: 32rpx;
					height: 32rpx;
					margin-left: 4rpx;
				}
			}
			text{
				margin: 0 16rpx;
			}
		}
		.text-btn{
			padding: 8rpx 24rpx;
			background-color: #2ACC8C;
			color: #FFFFFF;
			font-size: 28rpx;
			border-radius:28rpx;
			white-space: nowrap;
		}
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
			font-weight: bold;
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
					border:2rpx solid #2ACC8C;
					color: #2ACC8C;
					padding: 14rpx 40rpx;
					&.bg{
						background-color: #2ACC8C;
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
				font-weight: bold;
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
				background-color: #2ACC8C;
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
						background-color: #2ACC8C;
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
