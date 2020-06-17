<template>
	<view class="taskList">
		<view class="tlTab">
			<view class="tlTabItem" :class="currentTab == 0 ? 'active' : ''" @tap="changeTab(0)">课评管理</view>
			<view class="tlTabItem" :class="currentTab == 1 ? 'active' : ''" @tap="changeTab(1)">资料上传</view>
		</view>
		<view class="tabCont" v-show="currentTab === 0">
			<uni-collapse accordion="true" class="detail">
			    <uni-collapse-item :title="dataListLen" :showAnimation="true" :open="true">
					<DefaultPage v-if="data_list.length === 0"></DefaultPage>
					<template v-else>
						<view class="tedItem" v-for="(dataItem, dataIndex) in data_list" :key="dataIndex" @tap="toDetail(dataItem)">
							<view class="ted1">
								<view class="tshgd">{{ dataItem.courseTitle }}</view>
								<view class="tags">
									<text v-if="dataItem.courseType == 0" class="tag" :style="{ borderColor: '#FDC623', color: '#FDC623' }">线下课</text>
									<text v-if="dataItem.courseType == 1" class="tag" :style="{ borderColor: '#FDC623', color: '#FDC623' }">线上课</text>
									<text v-if="dataItem.courseClassType == 1" class="tag" :style="{ borderColor: '#FDC623', color: '#FDC623' }">1对1</text>
									<text v-if="dataItem.courseClassType == 2" class="tag" :style="{ borderColor: '#FDC623', color: '#FDC623' }">1对2</text>
									<text v-if="dataItem.courseClassType == 3" class="tag" :style="{ borderColor: '#FDC623', color: '#FDC623' }">多人小班</text>
								</view>
								<view class="tshgd">{{ dataItem.title }}</view>
								
							</view>
							<view class="ted2 xy">学员：{{ dataItem.studentName }}</view>
							<view class="ted2">
								<text>上课时间：{{dataItem.startTime | dealDateTime(dataItem.endTime)}} </text>
								<text class="grayBg">未课评</text>
							</view> 
						</view>
					</template>
			    </uni-collapse-item>
				
			</uni-collapse>
		</view>
		<view class="tabCont" v-show="currentTab === 1">
			<uni-collapse accordion="true" class="detail">
			    <uni-collapse-item :title="`我的课程`" :showAnimation="true" :open="true">
					<DefaultPage v-if="upload_data.length === 0"></DefaultPage>
					<template v-else>
						<view class="uploadItem flex flex-column align-center" v-for="(data,index) in upload_data" :key="index" @tap="toMatarial(data.courseId)">
							<view class="uploadTitle">{{data.courseTitle}}</view>
							<view class="flex align-center icons">
								<text class="typeIcon" v-for="(tItem,tIndex) in data.subjectList" :key="index">{{tItem}}</text>
								<text v-if="data.courseType == 0" class="borderIcon" :style="{ borderColor: '#FDC623', color: '#FDC623' }">线下课</text>
								<text v-if="data.courseType == 1" class="borderIcon" :style="{ borderColor: '#FDC623', color: '#FDC623' }">线下课</text>
								<text v-if="data.courseClassType == 1" class="borderIcon" :style="{ borderColor: '#FDC623', color: '#FDC623' }">1对1</text>
								<text v-if="data.courseClassType == 2" class="borderIcon" :style="{ borderColor: '#FDC623', color: '#FDC623' }">1对2</text>
								<text v-if="data.courseClassType == 3" class="borderIcon" :style="{ borderColor: '#FDC623', color: '#FDC623' }">多人小班</text>
							</view>
							<view class="texts flex align-center">
								<text>{{data.wordNum}}个文档</text>
								<text class="border"></text>
								<text>{{data.picNum}}张图片</text>
								<text class="border"></text>
								<text>{{data.voiceNum}}个音频</text>
								<text class="border"></text>
								<text>{{data.videoNum}}个音频</text>
							</view>
							<button class="uploadBtn" @tap.stop="showModel(data.courseId)">上传资料</button>
						</view>
					</template>
			    </uni-collapse-item>
				
			</uni-collapse>
		</view>
		
		<view class="cu-modal" :class="modalName=='Modal'?'show':''">
			<view class="cu-dialog myDialog">
				<view class="boxTop flex flex-column align-center">
					<view class="radios flex align-center">
						<view class="radio-item flex align-center" @tap="changeRadio(0)">
							<image src="../../static/dui.png" mode="" v-if="fileType === 0"></image>
							<view class="radio" v-else></view>
							<text>文档</text>
						</view>
						<view class="radio-item flex align-center" @tap="changeRadio(1)">
							<image src="../../static/dui.png" mode="" v-if="fileType === 1"></image>
							<view class="radio" v-else></view>
							<text>图片</text>
						</view>
						<view class="radio-item flex align-center"  @tap="changeRadio(2)">
							<image src="../../static/dui.png" mode="" v-if="fileType === 2"></image>
							<view class="radio" v-else></view>
							<text>音频</text>
						</view>
						<view class="radio-item flex align-center"  @tap="changeRadio(3)">
							<image src="../../static/dui.png" mode="" v-if="fileType === 3"></image>
							<view class="radio" v-else></view>
							<text>视频</text>
						</view>
					</view>
					<input type="text" v-model="materialName" placeholder-class="placeholder" placeholder="请填写文件名称" />
					<input type="text" v-model="materialAddr"  placeholder-class="placeholder"  placeholder="请填写网址/网盘地址/文件地址"/>
					<view class="btns flex">
						<button class="bottom green" @tap="submit">确定</button>
						<button class="bottom gray" @tap="hideModal">取消</button>
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
import utils from '../../utils/method.js'
import DefaultPage from "../../components/defaultPage.vue"
export default {
	data() { 
		return {
			currentTab: -1,
			modalName: null,
			data_list: [],
			dataListLen:'未课评学员(0)',
			upload_data:[],
			fileType: 0,
			materialName:"",
			materialAddr:"",
			courseId:"",
		};
	},
	methods: {
		getMore() {
			this.data_list = this.data_list.concat(this.data_list);
		},
		/**
		 * @param {Object} tab
		 * @param {Object} onshow 是否是从页面显示进来，是则刷新数据
		 */
		changeTab(tab,onshow) {
			if(onshow){
				this.currentTab = tab;
				if(tab == 0){
					this.getData1()
				}else if(tab == 1){
					this.getData2()
				}
			}else{
				if (tab == this.currentTab) {
					return;
				} else {
					this.currentTab = tab;
					if(this.currentTab == 0 && this.data_list.length < 1){
						this.getData1()
					}
					if(this.currentTab == 1 && this.upload_data.length < 1){
						this.getData2()
					}
				}
			}
			
		},
		toDetail(dataItem) {
			this.$store.commit('teacherCommentItemSet',dataItem)
			uni.navigateTo({
				url: '/pagesA/teacher/fillClass?id=' + dataItem.studentCourseLessonId
			});
		},
		toMatarial(id){
			uni.navigateTo({
				url: '/pages/my/courseMaterial?cid=' + id
			});
		},
		changeRadio(type){
			this.fileType = type;
		},
		showModel(courseId){
			this.courseId = courseId;
			this.modalName = 'Modal';
		},
		hideModal(){
			this.courseId = "";
			this.modalName = null;
		},
		async getData1(){
			uni.showLoading({
				mask:true
			})
			try{
				let res = await this.$http({
					apiName:"unKpStudents"
				})
				this.data_list = res.data;
				this.dataListLen = '未课评学员(' + this.data_list.length + ')';
			}catch(e){
				//TODO handle the exception
			}finally{uni.hideLoading()}
		},
		async getData2(){
			uni.showLoading({
				mask:true
			})
			try{
				let res = await this.$http({
					apiName:"uploadDataList"
				})
				this.upload_data = res.data;
			}catch(e){
				//TODO handle the exception
			}finally{uni.hideLoading()}
		},
		async submit(){
			let _data = [
				{
					data:this.materialName.trim(),
					info:"文件名称不能为空"
				},
				{
					data:this.materialAddr.trim(),
					info:"文件路径不能为空"
				}
			];
			let _jres = await utils.judgeData(_data);
			if(_jres){
				uni.showLoading({
					title:"提交中...",
					mask:true
				})
				try{
					let res = await this.$http({
						apiName:"materialUpload",
						method:"POST",
						data:{
							courseId:this.courseId,
							fileType:this.fileType,
							name:this.materialName,
							fileUrl:this.materialAddr,
						}
					})
					if(res){
						uni.showToast({
							title:"提交成功"
						})
						setTimeout(_=>{
							this.hideModal();
							this.getData2()
						},1500)
					}
				}catch(e){
					//TODO handle the exception
				}
			}
		}
	},
	async onLoad() {
		await this.changeTab(0,true)
	},
	filters:{
		dealDateTime(val,endTime){
			if(val && endTime){
				return utils.unixToDatetime(val) + '-' + utils.unixToDatetime(endTime,8)
			}else{
				return ""
			}
		}
	},
	async onPullDownRefresh() {
		if(this.currentTab == 0){
			await this.getData1()
		}
		if(this.currentTab == 1){
			await this.getData2()
		}
		uni.stopPullDownRefresh();
	}
};
</script>

<style lang="scss" scoped>
.taskList {
	min-height: 100vh;
	background-color: #FFFFFF;
	padding-top: 86rpx;
	box-sizing: border-box;
	.tlTab {
		position: fixed;
		width: 100%;
		top: 0;
		left: 0;
		height: 86rpx;
		display: flex;
		justify-content: space-around;
		background-color: #fff;
		z-index: 99;
		.tlTabItem {
			color: #909399;
			font-size: 32rpx;
			padding-bottom: 20rpx;
			box-sizing: border-box;
			line-height: 82rpx;
			font-weight: bold;
		}
		.tlTabItem.active {
			color: #2acc8c;
			border-bottom: 4rpx solid #2acc8c;
		}
	}
	.tabCont {
		.tcItem {
			box-shadow: 0px 4px 24px 0px rgba(0, 0, 0, 0.08);
			border-radius: 12px;
			overflow: hidden;
			margin-bottom: 30rpx;
			background-color: #fff;
			.tcItem1 {
				padding: 30rpx;
				.subData {
					display: flex;
					margin-top: 20rpx;
					.sdText {
						margin-right: 40rpx;
						.sdT1 {
							color: #2acc8c;
							font-weight: bold;
							font-size: 40rpx;
						}
						.sdT2 {
							margin-left: 10rpx;
							color: #606266;
							font-size: 26rpx;
						}
					}
				}
			}
		}
		.uploadItem{
			width:686rpx;
			height:362rpx;
			background:#FFFFFF;
			box-shadow:0px 4px 24px 0px rgba(0,0,0,0.08);
			border-radius:12rpx;
			margin: 0 auto 40rpx;
			.uploadTitle{
				font-size: 36rpx;
				margin: 30rpx 0 20rpx;
				font-weight: bold;
			}
			.icons{
				.typeIcon{
					padding: 4rpx 12rpx;
					color: #FFFFFF;
					font-size: 24rpx;
					background: #3C92EF;
					border-radius:24rpx 0px 24rpx 24rpx;
					margin-right: 6rpx;
				}
				.borderIcon{
					padding: 2rpx 12rpx;
					border: 2rpx solid;
					font-size: 26rpx;
					margin: 0 10rpx;
					border-radius: 22rpx;
				}
			}
			.texts{
				font-size: 28rpx;
				color: #909399;
				margin: 20rpx 0 40rpx;
				.border{
					width: 2rpx;
					height: 32rpx;
					background-color: #C0C4CC;
					margin: 0 20rpx;
				}
			}
			.uploadBtn{
				width: 540rpx;
				height: 80rpx;
				background-color: #2ACC8C;
				border-radius: 44rpx;
				line-height: 80rpx;
				color: #FFFFFF;
				font-size: 32rpx;
				margin-bottom: 40rpx;
			}
		}
	}
}
.tedItem {
	background-color: #F0FCF8;
	border-radius: 12rpx;
	padding: 28rpx;
	margin: 0 32rpx 30rpx ;
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
		display: flex;
		align-items: center;
		justify-content: space-between;
		&.xy{
			margin-top: 16rpx;
			margin-bottom: 10rpx;
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

.myDialog{
		width: 686rpx;
		background: #FFFFFF;
		overflow: initial;
		position: relative;
		.boxTop{
			font-size: 0;
			border-radius: 10rpx;
			overflow: hidden;
			padding: 126rpx 0;
			input{
				width: 504rpx;
				height: 80rpx;
				line-height: 80rpx;
				text-align: center;
				font-size: 28rpx;
				margin-bottom: 58rpx;
				border-radius:44rpx;
				border:2rpx solid rgba(192,196,204,1);
			}
			.radios{
				margin-bottom: 80rpx;
				.radio-item{
					margin-right: 60rpx;
					&:last-of-type{
						margin-right: 0;
					}
					image{
						width: 32rpx;
						height: 32rpx;
						margin-right: 10rpx;
					}
					.radio{
						width: 32rpx;
						height: 32rpx;
						margin-right: 10rpx;
						border: 2rpx solid #C0C4CC;
						border-radius: 50%;
					}
					text{
						color: #303133;
						font-size: 28rpx;
					}
				}
			}
			.bottom{
				width: 228rpx;
				height: 64rpx;
				line-height: 64rpx;
				color: #FFFFFF;
				font-size: 28rpx;
				border-radius: 32rpx;
				&.green{
					margin-right: 50rpx;
					background-color: #2ACC8C;
				}
				&.gray{
					background-color: #C0C4CC;
				}
			}
		}
		.boxBoo{
			margin-top: 60rpx;
			text-align: center;
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			.close{
				width: 84rpx;
				height: 84rpx;
			}
		}
	}
</style>
