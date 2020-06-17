<template>
	<view class="colorTag">
		<text class="tag" v-if="tagData.courseModel" :style="{borderColor:tagData.courseModel.color,color:tagData.courseModel.color}" >{{tagData.courseModel.value}}</text>
		<text v-if="showSubjectLis" class="tag" v-for="(tag,tIndex) in tagData.subjectLis" :key="tIndex" :style="{borderColor:tag.color,color:tag.color}" >{{tag.title}}</text>
		<text class="tag"  v-if="tagData.classTypeModel" :style="{borderColor:tagData.classTypeModel.color,color:tagData.classTypeModel.color}" >{{tagData.classTypeModel.value}}</text>
	</view>
</template>

<script>
export default{
	props:{
		tagData:{
			type:Object,
			default:()=>{{}}
		},
		showSubjectLis:{
			type:Boolean,
			default:true
		}
	}
}
</script>

<style lang="scss" scoped>
.colorTag{
	margin-top: 20rpx;
	height: 50rpx;
	white-space: nowrap;
	width: 100%;
	overflow-x: auto;
	overflow-y: hidden;
	.tag{
		display: inline-block;
		margin-right: 20rpx;
		font-size: 24rpx;
		border: 1rpx solid;
		padding-left: 10rpx;
		padding-right: 10rpx;
		border-radius: 20rpx;
		font-weight: 200;
	}
}
</style>
