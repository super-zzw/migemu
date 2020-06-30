<template>
	<view class="teaTask">
		<view class="dataList" v-if="data_list.length > 0">
			<view class="tedItem" v-for="(dataItem,dataIndex) in data_list" :key="dataIndex" @tap="toList(dataItem.arrangeCourseId)">
				<view class="ted1">
					<view class="tshgd">
						{{dataItem.courseTitle}}
					</view>
					<view class="tags">
						<text v-if="dataItem.courseType == 0" class="tag" :style="{ borderColor: '#FDC623', color: '#FDC623' }">线下课</text>
						<text v-if="dataItem.courseType == 1" class="tag" :style="{ borderColor: '#FDC623', color: '#FDC623' }">线上课</text>
						<text v-if="dataItem.courseClassType == 1" class="tag" :style="{ borderColor: '#FDC623', color: '#FDC623' }">1对1</text>
						<text v-if="dataItem.courseClassType == 2" class="tag" :style="{ borderColor: '#FDC623', color: '#FDC623' }">1对2</text>
						<text v-if="dataItem.courseClassType == 3" class="tag" :style="{ borderColor: '#FDC623', color: '#FDC623' }">多人小班</text>
					</view>
				</view>
				<view class="ted2">
					学员：{{dataItem.nameStr}}
				</view>
				<view class="ted2">
					今天已有<text class="ted2C">{{dataItem.todayNum}}</text>人交作业
				</view>
				<view class="ted2">
					已布置作业：{{dataItem.totalWorkNum}}个，进行中的作业：{{dataItem.workNumIng}}个
				</view>
			</view>
		</view>
		<view class="empty" v-else>
			<defaultPage></defaultPage>
		</view>
		<view class="opration">
			<view class="oprBtn" @tap="makeTask">
				布置作业
			</view>
		</view>
		<view class="cu-modal bottom-modal" :class="modalName=='bottomModal'?'show':''">
			<view class="cu-dialog myDialog">
				<view class="cu-bar bg-white">
					<view class="action cancel" @tap="hideModal(false)">取消</view>
					<view class="action sure" @tap="checkAddr">确定</view>
				</view>
				<view class="padding-xl">
					<radio-group class="block" @change="RadioChange">
						<view class="cu-list menu text-left">
							<view class="cu-item" v-for="(item,index) in taskCourseList" :key="index">
								<label class="flex justify-between align-center flex-sub">
									<view class="flex-sub">{{item.courseName}}</view>
									<radio class="round" :class="taskCourseIndex == index ?'checked':''" :checked="taskCourseIndex == index ? true:false" :value="index"></radio>
								</label>
							</view>
						</view>
					</radio-group>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default{
	data(){
		return {
			data_list:[],
			modalName:null,
			taskCourseList:[],
			taskCourseIndex:-1,
			tempIndex:""
		}
	},
	async onShow() {
		this.data_list = [];
		await this.getData()
	},
	methods:{
		showModal() {
			this.modalName = 'bottomModal';
			this.tempIndex = this.taskCourseIndex;
		},
		hideModal(type) {
			if(!type){
				if(!this.addrId){
					this.taskCourseIndex = -1
				}else{
					this.taskCourseIndex = this.tempIndex;
					
				}
			}else{
				uni.navigateTo({
					url:"/pagesA/teacher/taskQear?cid=" + this.taskCourseList[this.taskCourseIndex].id
				})
			}
			this.modalName = null;
			
		},
		RadioChange(e) {
			this.taskCourseIndex = e.detail.value;
		},
		checkAddr(){
			this.addr = this.taskCourseList[this.taskCourseIndex].address;
			this.addrId = this.taskCourseList[this.taskCourseIndex].id;
			this.hideModal(true)
		},
		checkChange(e){
			if(e.detail.value[0] == 1){
				this.agreePact = true;
			}else{
				this.agreePact = false;
			}
		},
		async getData(){
			uni.showLoading({
				title:"数据加载中...",
				mask:true
			})
			try{
				let res = await this.$http({
					apiName:"teacherTaskCourseList",
					data:{page:1}
				})
				this.data_list = res.data.list;
				
			}catch(e){
				//TODO handle the exception
			}finally{
				uni.hideLoading()
			}
		},
		toList(id){
			uni.navigateTo({
				url:'/pagesA/teacher/taskList?id=' + id
			})
		},
		async makeTask(){
			uni.showLoading({
				title:"获取课程...",
				mask:true
			})
			try{
				let res = await this.$http({
					apiName:"taskClass",
				})
				this.taskCourseList = res.data;
				if(this.taskCourseList.length == 1){
					this.taskCourseIndex = 0;
					this.checkAddr()
				}else{
					this.showModal()
				}
			}catch(e){
				//TODO handle the exception
			}finally{uni.hideLoading()}
			
		}
	},
	async onPullDownRefresh() {
		this.data_list = [];
		await this.getData()
		uni.stopPullDownRefresh();
	},
}
</script>

<style lang="scss" scoped>
.teaTask{
	min-height: 100vh;
	padding-bottom: 140rpx;
	box-sizing: border-box;
	.dataList{
		padding: 32rpx 32rpx 0 32rpx;
		.tedItem{
			background-color: #fff;
			border-radius: 12rpx;
			padding: 30rpx;
			margin-bottom: 30rpx;
			.ted1{
				.tshgd{
					color: #303133;
					font-size: 32rpx;
					font-weight: bold;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
			.tags{
				margin-top: 10rpx;
				margin-bottom: 10rpx;
				.tag{
					font-size: 24rpx;
					border: 1rpx solid;
					padding: 2rpx 12rpx;
					border-radius: 20rpx;
					display: inline-block;
					margin-right: 10rpx;
					font-weight: 200;
				}
			}
			.ted2{
				color: #606266;
				font-size: 28rpx;
				line-height: 44rpx;
				.ted2C{
					color: #F95C25;
					font-size: 40rpx;
					font-weight: bold;
					margin-left: 6rpx;
					margin-right: 6rpx;
				}
			}
		}
	}
	.empty{
		height: calc(100vh - 140rpx);
	}
	.opration{
		position: fixed;
		height: 140rpx;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		.oprBtn{
			width: 686rpx;
			height: 88rpx;
			background-color:#FDC623;
			border-radius: 44rpx;
			color: #fff;
			font-size: 32rpx;
			font-weight: bold;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
	.myDialog{
		.cu-bar{
			border-bottom: 2rpx solid #dee3ec;
		}
		.action{
			font-size: 32rpx;
		}
		.cancel{
			color: #8799A3;
		}
		.sure{
			color: #FDC623;
		}
		.padding-xl{
			padding: 32rpx;
			background-color: #fff;
			/deep/ radio .wx-radio-input.wx-radio-input-checked{
				background-color: #FDC623!important;
			}
		}
	}
}
</style>
