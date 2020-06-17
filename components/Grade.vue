<template>
	<view class="score flex align-center justify-center">
		<text>评分：</text>
		<view class="scoreBox"><image class="star" :src="src" @tap="changeStar(index)" v-for="(src, index) in stars" :key="src.id"></image></view>
	</view>
</template>

<script>
	export default{
		props:{
			start:{
				type: Number,
				default: 5
			},
			isClick:{
				type:Boolean,
				default: true
			}
		},
		watch:{
			'start':function(oldval,newval){
				this.addStart();
			}
		},
		data(){
			return{
				stars:[],
				grade:5
			}
		},
		mounted() {
			this.addStart();
			this.$emit('gradeChange',this.grade);
		},
		methods:{
			changeStar(index){
				if(!this.isClick){return};
				for(let i = 0 ; i <= index; i++){
					this.$set(this.stars,i,'../static/star1.png');
				}
				for(let i = index + 1 ; i < this.stars.length; i++){
					this.$set(this.stars,i,'../static/star3.png');
				}
				this.grade = index + 1;
				this.$emit('gradeChange',this.grade);
			},
			resetStars(){
				this.stars = [
					'../static/star3.png',
					'../static/star3.png',
					'../static/star3.png',
					'../static/star3.png',
					'../static/star3.png',
				]
			},
			addStart(){
				console.log(this.start)
				for(let i = 0 ; i < this.start; i++){
					this.$set(this.stars,i,'../static/star1.png');
				}
				for(let i = this.start ; i < 5; i++){
					this.$set(this.stars,i,'../static/star3.png');
				}
				console.log(this.stars);
			}
		}
	}
</script>

<style scoped lang="scss">
.score {
	text {
		font-size: 30rpx;
		color: #303133;
		margin-bottom: 0;
	}
}
.scoreBox {
	display: flex;
	align-items: center;
	justify-content: center;
	.scoreText {
		color: #fdc623;
		font-size: 28rpx;
	}
	.star {
		margin-right: 16rpx;
		width: 32rpx;
		height: 32rpx;
	}
}
</style>
