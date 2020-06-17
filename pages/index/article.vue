<template>
	<view class="article">
		<rich-text class="textNode" :nodes="text"></rich-text>
	</view>
</template>

<script>
export default{
	data(){
		return {
			title:"",
			text:"",
		}
	},
	async onLoad({id}) {
		try{
			let {data} = await this.$http({
				apiName:"article",
				data:{ articleId:id }
			})
			uni.setNavigationBarTitle({
				title: data.title
			})
			this.text = data.content.replace(/\<img/gi, "<img class='html_img' ");
		}catch(e){
			//TODO handle the exception
		}
	}
}
</script>

<style lang="scss" scoped>
.article{
	padding: 32rpx;
	.title{
		text-align: center;
		font-weight: bold;
		color: #303133;
		font-size: 30rpx;
	}
	.textNode{
		padding-top: 28rpx;
	}
}
</style>
