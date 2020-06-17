<template>
	<view class="moreCop" @tap="getData">
		<view class="rcm1">
			加载更多
		</view>
		<image class="rcm1img" src="../static/getMore.png" mode="widthFix"></image>
	</view>
</template>

<script>
export default{
	methods:{
		getData(){
			this.$emit('change')
		}
	}
}
</script>

<style lang="scss" scoped>
.moreCop{
	display: flex;
	justify-content: center;
	align-items: center;
	padding-top: 20rpx;
	padding-bottom: 20rpx;
	.rcm1{
		color: #8799A3;
		font-size: 26rpx;
	}
	.rcm1img{
		width: 56rpx;
	}
}
</style>
