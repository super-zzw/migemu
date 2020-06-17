<template>
	<view class="listItem" @tap="toDetail(dataItem.id)">
		<view class="picBox">
			<image class="pic" :src="dataItem.coverUrl" mode=""></image>
		</view>
		<view class="itemInfo">
			<view class="title">
				{{dataItem.name}}
			</view>
			<view class="tags">
				<colorTag :tagData="dataItem"></colorTag>
			</view>
			<view class="otherInfo">
				<view class="price">
					<text class="pV1">¥{{dataItem.sellingPrice}}</text>
					<text class="pV2">¥{{dataItem.originalPrice}}</text>
				</view>
				<view class="teacher">
					授课老师：{{dataItem.teacherName}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import colorTag from '@/components/colorTag.vue'
	export default {
		components:{
			colorTag
		},
		props:{
			dataItem: {
				type: Object,
				default: ()=>{{}},
			},
		},
		data() {
			return {
				
			}
		},
		methods: {
			toDetail(id){
				uni.navigateTo({
					url:'/pages/index/good?id=' + id
				})
			}
		}
	}
</script>

<style lang="scss">
.listItem{
	width: 100%;
	display: flex;
	margin-top: 40rpx;
	.picBox{
		width: 148rpx;
		height: 180rpx;
		border-radius: 12rpx;
		background-color: #999999;
		overflow: hidden;
		.pic{
			width: 148rpx;
			height: 180rpx;
		}
	}
	.itemInfo{
		flex: 1;
		margin-left: 20rpx;
		.title{
			color: #303133;
			font-size: 32rpx;
			font-weight: bold;
		}
		.otherInfo{
			display: flex;
			justify-content: space-between;
			margin-top: 28rpx;
			align-items: center;
			.price{
				.pV1{
					color: #F72C2C;
					font-weight: bold;
					font-size: 32rpx;
				}
				.pV2{
					text-decoration: line-through;
					margin-left: 16rpx;
					font-size: 24rpx;
					color: #C0C4CC;
				}
			}
			.teacher{
				color: #909399;
				font-size: 24rpx;
				color: #909399;
			}
		}
	}
}
</style>
