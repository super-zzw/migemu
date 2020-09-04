<template>
	<view class="listItem" @tap="toDetail(dataItem.id)">
		<view class="picBox">
			<image class="pic" :src="dataItem.coverUrl" ></image>
		</view>
		<view class="itemInfo">
			<view class="title">
				{{dataItem.name}}
			</view>
			<view class="tags">
				<colorTag :tagData="dataItem"></colorTag>
			</view>
			<text class="txt"></text>
			<view class="otherInfo">
				<view class="price">
					<text class="pV1">¥{{dataItem.sellingPrice}}</text>
					<text class="pV2">¥{{dataItem.originalPrice}}</text>
				</view>
				<!-- <view class="teacher">
					授课老师：{{dataItem.teacherName}}
				</view> -->
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
	margin-bottom: 36rpx;
	.picBox{
		width: 198rpx;
		height: 238rpx;
		border-radius: 16rpx;
		background-color:#fff;
		overflow: hidden;
		.pic{
			width: 100%;
			height: 100%;
		}
	}
	.itemInfo{
		flex: 1;
		margin-left: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		.title{
			color: #303133;
			font-size: 32rpx;
			font-weight: bold;
			margin-bottom: 10rpx;
			 overflow:hidden; 
			 text-overflow:ellipsis;
			 display:-webkit-box; 
			 -webkit-box-orient:vertical;
			 -webkit-line-clamp:2;
		}
		.txt{
			font-size:24rpx;
			color:rgba(144,147,153,1);
			line-height:34rpx;
		}
		.otherInfo{
			display: flex;
			justify-content: space-between;
			align-items: center;
			// flex: 1;
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
