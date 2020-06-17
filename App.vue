<script>
	export default {
		onLaunch() {
			if(uni.getStorageSync('session')){
				this.$store.commit('isLoginSet',true)
			}
		}
	}
</script>

<style lang="scss">
	@import "colorui/main.css";
	@import "colorui/icon.css";
	.html_img{
		max-width: 100%;
	}
	.myborder{
		border-radius: 200rpx !important;
	}
	rich-text{
		word-break:break-all;
	}
	.wxBtn{
		padding: 0;
		background: none;
		border-radius: 0;
		line-height: unset;
		height: inherit;
		margin: 0;
		&.drop{
			flex: 1;
			margin-top: 12rpx;
			display: flex;
			align-items: center;
			flex-direction: column;
			justify-content: center;
			image{
				margin-bottom: 6rpx;
			}
		}
	}
	.wxBtn::after{
		border: none;
	}
	page{color: #303133;font-family:'PingFangSC-Medium','PingFang SC';-webkit-overflow-scrolling: touch}
	.placeholder{font-size: 28rpx;color: #909399;}
	.content{display: flex; flex-direction: column; align-items: center;}
	.flex { display:flex};
	.align-center{align-items: center;}
	.justify-center{justify-content: center;}
	.space-around{justify-content: space-around;}
	.space-between{justify-content: space-between;}
	.flex-wrap{flex-wrap: wrap;}
	.flex-column{flex-direction: column;}
	.bold{font-weight: bold;}
	.btn{width: 540rpx;height: 80rpx;;line-height: 80rpx;border-radius: 44rpx;font-size: 32rpx;font-weight: bold;}
	.grayIcon{border-radius:8rpx;border:2rpx solid #C0C4CC;padding: 4rpx 8rpx;color: #C0C4CC;font-size: 24rpx;margin-left: 20rpx;}
	.greenIcon{border-radius:8rpx;border:2rpx solid #2ACC8C;padding: 4rpx 8rpx;color: #2ACC8C;font-size: 24rpx;margin-left: 20rpx;}
	.greenBg{padding: 6rpx 14rpx;font-size: 28rpx;color: #FFFFFF;background-color: #2ACC8C;border-radius: 8rpx;}
	.grayBg{padding: 6rpx 14rpx;font-size: 28rpx;color: #FFFFFF;background-color: #C0C4CC;border-radius: 8rpx;}
	view,
	scroll-view,
	swiper,
	swiper-item,
	cover-view,
	cover-image,
	icon,
	text,
	rich-text,
	progress,
	button,
	checkbox,
	form,
	input,
	label,
	radio,
	slider,
	switch,
	textarea,
	navigator,
	audio,
	camera,
	image,
	video {
		box-sizing: border-box;
	}
</style>
