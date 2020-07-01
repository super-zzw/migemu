<template>
	<view class="taskComp">
		<view class="taskCompTop">
			<view class="tcpLeft">
				<image class="tcpL1Img" src="../static/task.png" mode=""></image>
				<view class="tcpL2">
					{{task.jobName}}
				</view>
				<view class="tcpL3">
					<text class="tcpL3Text t1" v-if="task.checkStatus == 0">未开始</text>
					<text class="tcpL3Text t2" v-if="task.checkStatus == 1">已提交</text>
					<text class="tcpL3Text t2" v-if="task.checkStatus == 2">已批阅</text>
					<text class="tcpL3Text t3" v-if="task.checkStatus == -1">被打回</text>
				</view>
			</view>
			<view class="tcpRight" @tap.stop="showModal">
				<image v-if="edit == -1" src="../static/edit.png" class="tcpRightImg" mode=""></image>
			</view>
		</view>
		<view class="taskCompBoo">
			<view class="tcb1">
				截止完成时间：
			</view>
			<view class="tcb2">
				{{task.endTime | dealTime}}
			</view>
			<view class="tcb2">
				{{task.endWeek}}
			</view>
		</view>
		<view class="cu-modal" :class="modalName=='Modal'?'show':''">
			<view class="cu-dialog myDialog">
				<view class="boxTop">
					<view class="mdTitle">
						选择操作
					</view>
					<view class="boxTopBtn1" @tap.stop="toEdit">
						修改
					</view>
					<view class="boxTopBtn2" @tap.stop="toDelete">
						删除
					</view>
				</view>
				<view class="boxBoo">
					<image @tap.stop="hideModal" class="close" src="../static/closeModal.png" mode=""></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import utils from "../utils/method.js"
export default{
	props:{
		task:{
			type:Object,
			default:()=>{{}}
		},
		edit:{
			type:Number || String,
			default:1
		}
	},
	data(){
		return {
			modalName:null
		}
	},
	methods:{
		showModal(){
			this.modalName = 'Modal'
		},
		hideModal(){
			this.modalName = null
		},
		toEdit(){
			uni.navigateTo({
				url:"/pagesA/teacher/taskQear?id=" + this.task.jobId + "&cid=" + this.task.arrangeCourseId
			})
			this.hideModal()
		},
		toDelete(){
			let that = this;
			uni.showModal({
			    title: '提示',
			    content: '删除后不可恢复，确定删除该作业？',
			    success: function (res) {
			        if (res.confirm) {
			            that.$emit('deleteItem',that.task.jobId)
						that.hideModal()
			        }
			    }
			});
		}
	},
	filters:{
		dealTime(val){
			if(val){
				return utils.unixToDatetime(val)
			}else{
				return ""
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.taskComp{
	.taskCompTop{
		display: flex;
		justify-content: space-between;
		align-items: center;
		.tcpLeft{
			display: flex;
			align-items: center;
			flex: 1;
			min-width: 0;
			.tcpL1Img{
				width: 60rpx;
				height: 40rpx;
			}
			.tcpL2{
				margin-left: 10rpx;
				font-size: 36rpx;
				color: #303133;
				font-weight: bold;
				flex: 1;
				min-width: 0;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.tcpL3{
				margin-left: 26rpx;
				.tcpL3Text{
					display: block;
					padding-left: 16rpx;
					padding-right: 16rpx;
					padding-top: 4rpx;
					padding-bottom: 6rpx;
					color: #fff;
					font-size: 28rpx;
					border-radius: 8rpx;
				}
				.tcpL3Text.t1{
					background-color: #E7E6E6;
					color: #606266;
				}
				.tcpL3Text.t2{
					background-color: #F78726;
				}
				.tcpL3Text.t3{
					background-color: #F72C2C;
				}
			}
		}
		.tcpRight{
			width: 64rpx;
			height: 64rpx;
			line-height: 70rpx;
			text-align: center;
			.tcpRightImg{
				width: 32rpx;
				height: 32rpx;
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
	.myDialog{
		width: 686rpx;
		background: transparent;
		.boxTop{
			font-size: 28rpx;
			border-radius: 10rpx;
			overflow: hidden;
			background-color: #fff;
			padding: 30rpx;
			font-weight: bold;
			.mdTitle{
				text-align: center;
				font-size: 32rpx;
			}
			.boxTopBtn1{
				background-color: #FDC623;
				text-align: center;
				height: 80rpx;
				line-height: 80rpx;
				border-radius: 32rpx;
				color: #fff;
				margin-top: 20rpx;
			}
			.boxTopBtn2{
				border: 2rpx solid #FDC623;
				text-align: center;
				height: 80rpx;
				line-height: 80rpx;
				border-radius: 32rpx;
				color: #FDC623;
				box-sizing: border-box;
				margin-top: 40rpx;
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
}
	
</style>
