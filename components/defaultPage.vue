<template>
	<view class="outer flex align-center justify-center">
		<view class="null-page flex flex-column align-center justify-center">
			<image :src="imgSrc" class="null-img" :style="{width:imgWidth + 'rpx',height:imgHeight + 'rpx'}"></image>
			<text class="text">{{ tipsText }}</text>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		tipsText: {
			type: String,
			default: '- 这里是空的 -'
		},
		imgWidth:{
			type: String,
			default: '194'
		},
		imgHeight:{
			type: String,
			default: '206'
		}
	},
	data(){
		return{
			imgSrc: require("../static/null.png")
		}
	}
};
</script>

<style  lang="scss" scoped>
.outer{
	width: 100%;
	height: 100%;
}
.null-page {
	padding-bottom: 40rpx;
	
}
.text {
		margin-top: 20rpx;
		font-size: 28rpx;
		color: #c0c4cc;
	}
</style>
