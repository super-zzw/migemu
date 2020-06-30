<template>
	<view class="types">
		<text 
			@tap="changeTag(item)" class="typeItem" 
			:class="(item.paramType == 'courseModel' && currentType.courseModel == item.key) || 
			(item.paramType == 'courseSubject' && currentType.courseSubject == item.key) || 
			(item.paramType == 'courseType' && currentType.courseType == item.key) || 
			(item.paramType == '' && currentType.courseModel == '' && currentType.courseSubject == '' && currentType.courseType == '') ? 
			'active' : ''" 
			v-for="(item,index) in types" 
			:key="index">
			{{item.value}}
		</text>
	</view>
</template>

<script>
	export default{
		props:{
			types:{
				type:Array,
				default:() => {[]}
			},
			currentType:{
				type:Object,
				default:()=>{{}}
			}
		},
		methods:{
			changeTag(item){
				this.$emit("change",item)
			}
		}
	}
</script>

<style lang="scss" scoped>
.types{
	width: 100%;
	overflow-y: hidden;
	overflow-x: auto;
	height: 60rpx;
	white-space: nowrap;
	.typeItem{
		display: inline-block;
		padding: 4rpx 12rpx;
		border-radius: 30rpx;
		box-sizing: border-box;
		border: 2rpx solid #DDE1E8;
		color: #909399;
		font-size: 28rpx;
		margin-right: 28rpx;
	}
	.typeItem.active{
		background-color: #FDC623;
		color: #fff;
		border-color: #FDC623;
	}
}
</style>
