<template>
	<view class="rank">
		<view class="top">
			<image class="topBgk" src="../../static/rankbgk.png" mode=""></image>
			<text class="topText">每月更新一次</text>
		</view>
		<view class="list">
			<view class="null" v-if="data_list.length === 0">
				<DefaultPage></DefaultPage>
			</view>
			<template v-else>
				<view class="item" v-for="(item,index) in data_list" :key="index">
					<view class="itemLeft">
						<view class="nm1" v-if="index < 3">
							<image class="nm1Img" v-if="index == 0" src="../../static/r1.png" mode=""></image>
							<image class="nm1Img" v-if="index == 1" src="../../static/r2.png" mode=""></image>
							<image class="nm1Img" v-if="index == 2" src="../../static/r3.png" mode=""></image>
						</view>
						<view class="nm2" v-else>
							{{index + 1}}
						</view>
						<view class="name">
							<image class="tPic" :src="item.teacherAvatar" mode=""></image>
							<text class="nameText">{{item.teacherName}}</text>
						</view>
					</view>
					<view class="scoreBox">
						<text class="scoreText">{{item.star}}</text>
						<image class="star" src="../../static/star1.png" v-for="index1 of item.star1" :key="index1" mode=""></image>
						<image class="star" v-if="item.star2 > 0" src="../../static/star2.png" mode=""></image>
						<image class="star" src="../../static/star3.png" v-for="index3 of item.star3" :key="index3" mode=""></image>
					</view>
				</view>
			</template>
		</view>
	</view>
</template>

<script>
import utils from '../../utils/method.js'
import DefaultPage from "../../components/defaultPage.vue"
	export default {
		onShareAppMessage (){
			return utils.homeShare("../../static/homeshare.png")
		},
		data() {
			return {
				data_list:[]
			}
		},
		methods: {
			async getData(){
				try{
					let res = await this.$http({
						apiName:"rankList"
					})
					
					this.data_list = res.data;
					this.data_list.map(item => {
						Object.assign(item,utils.setTeacherStar(item.star));
						item.star = item.star.toFixed(1);
					})
				}catch(e){
					//TODO handle the exception
				}
			}
		},
		onLoad() {
			this.getData()
		}
	}
</script>

<style lang="scss" scoped>
.rank{
	min-height: 100vh;
	background-color: #fff;
	.top{
		position: relative;
		font-size: 0;
		.topBgk{
			width: 100%;
			height:280rpx;
		}
		.topText{
			position: absolute;
			color: #C0F2DE;
			font-size: 24rpx;
			right: 32rpx;
			bottom: 24rpx;
		}
	}
	.list{
		padding: 32rpx 18rpx;
		.null{
			margin-top: 180rpx;
		}
		.item{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-top: 34rpx;
			padding-bottom: 34rpx;
			height: 128rpx;
			box-sizing: border-box;
			.itemLeft{
				display: flex;
				align-items: flex-start;
				.nm1{
					width: 72rpx;
					text-align: center;
					.nm1Img{
						width: 72rpx;
						height: 70rpx;
					}
				}
				.nm2{
					width: 72rpx;
					text-align: center;
					color: #303133;
					font-size: 32rpx;
				}
				.name{
					margin-left: 34rpx;
					display: flex;
					align-items: center;
					.tPic{
						width: 60rpx;
						height: 60rpx;
						border-radius: 50%;
					}
					.nameText{
						margin-left: 10rpx;
						color: #303133;
						font-size: 32rpx;
					}
				}
			}
			.scoreBox{
				display: flex;
				align-items: center;
				.scoreText{
					color: #FDC623;
					font-size: 28rpx;
				}
				.star{
					margin-left: 16rpx;
					width: 38rpx;
					height: 38rpx;
				}
			}
			
		}
	}
}

</style>
