<template>
	<view class="content">
		<view class="banner flex flex-column align-center justify-center">
			<image src="../../static/fanlibg.png" mode=""></image>
		</view>
		<view class="block flex flex-column ">
			<view class="block-title flex align-center justify-center">
				 <text class="t">邀请流程</text>
				 <text class="mpweixin one" @tap="navTo('./rule')">详细规则？</text>
			</view>
			<view class="flow flex justify-center align-center flex-column">
				<view class="flow-row flex  align-center justify-between">
					<view class="flow-block flex flex-column align-center justify-center">
						<view class="icon flex align-center justify-center flex">
							<image  src="../../static/icon1.png" mode=""></image>
						</view>
					</view>
					<view class="flow-row-line flex align-center">
						<view class="line" v-for="line in 9" :key="line.id"></view>
						<view class="triangle"></view>
					</view>
					<view class="flow-block flex flex-column align-center justify-center">
						<view class="icon flex align-center justify-center flex">
							<image  src="../../static/icon2.png" mode=""></image>
						</view>
					</view>
				</view>
				<view class="flow-row flex justify-between w">
					<text>邀请好友</text>
					<text>好友注册/登录</text>
				</view>
				<view class="flow-line flow-row flex justify-between  ">
					<view class="flow-row-line mid flex align-center flex-column">
						<view class="triangle t"></view>
						<view class="line t" v-for="line in 3" :key="line.id"></view>
					</view>
					<view class="flow-row-line mid flex align-center flex-column">
						<view class="line t d" v-for="line in 3" :key="line.id"></view>
						<view class="triangle b"></view>
						
					</view>
				</view>
				<view class="flow-row two flex  align-center justify-between">
					<view class="flow-block flex flex-column align-center justify-center">
						<view class="icon flex align-center justify-center flex">
							<image  src="../../static/icon3.png" mode=""></image>
						</view>
					</view>
					<view class="flow-row-line flex align-center">
						<view class="line" v-for="line in 9" :key="line.id"></view>
						<view class="triangle"></view>
					</view>
					<view class="flow-block flex flex-column align-center justify-center">
						<view class="icon flex align-center justify-center flex">
							<image  src="../../static/icon4.png" mode=""></image>
						</view>
					</view>
				</view>
				<view class="flow-row flex justify-between w h">
					<text>获得返利</text>
					<view class="twoRow flex flex-column align-center ">
						<text>好友下单</text>
						<text>购买对应课程</text>
					</view>
					
				</view>
				
			</view>
		</view>
		<view class="block">
			<view class="block-title flex align-center justify-center">
				<text class="t">我的返利</text>
				<text class="mpweixin" @tap="navTo('./record')">邀请记录</text>
			</view>
			<view class="bottom-table flex ">
				<view class="flex align-center flex-column justify-center">
					<text class="tips">累计</text>
					<text class="money">¥{{sumAmount || 0}}</text>
				</view>
				<view class="flex align-center flex-column justify-center">
					<text class="tips">已提现</text>
					<text class="money">¥{{withdrawAmount || 0}}</text>
				</view>
				<view class="flex align-center flex-column justify-center">
					<text class="tips">冻结中</text>
					<text class="money">¥{{freezeAmount || 0}}</text>
				</view>
			</view>
			<view class="bottom-description flex align-center justify-between">
				<view class="left flex align-items">
					<text>可提现/元</text>
					<text class="money">{{amount || 0}}</text>
				</view>
				<view class="right" @tap="navTo('./applyFor')">立即提现</view>
			</view>
		</view>
		<view class="invite-outer flex align-center justify-center">
			<button class="invite" @tap="showModal" data-target="Modal">立即邀请</button>
		</view>
		<view class="cu-modal" :class="modalName=='Modal'?'show':''">
			<view class="cu-dialog myDialog">
				<view class="boxTop">
					<image class="imgPic" src="../../static/invite.png" mode="widthFix"></image>
					<view class="boxCont">
						打开课程详情页，点击下方的邀请返利，即可将课程链接发送给好友，完成邀请。
						好友通过你的链接购买课程时，你将获得相应的返利。
					</view>
					<view class="mBtn" @tap="hideModal">
						我知道了
					</view>
				</view>
				<view class="boxBoo">
					<image @tap="hideModal" class="close" src="../../static/closeModal.png" mode=""></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				modalName: null,
				dataInfo:{},
				sumAmount:"",  //总额
				amount:"",  //可提现
				withdrawAmount:"",  //已提现
				freezeAmount:"",  //冻结中
			}
		},
		onLoad() {
			this.getData()
		},
		methods:{
			navTo(path){
				uni.navigateTo({
					url: path
				})
			},
			hideModal() {
				this.modalName = null;
			},
			showModal(e){
				this.modalName = e.currentTarget.dataset.target
			},
			async getData(){
				uni.showLoading({
					title:"数据加载中..."
				})
				try{
					let res = await this.$http({
						apiName:"rebateData",
						method:"POST"
					})
					console.log(res);
					this.sumAmount = res.data.sumAmount;
					this.amount = res.data.amount;
					this.withdrawAmount = res.data.withdrawAmount;
					this.freezeAmount = res.data.freezeAmount;
				}catch(e){
					//TODO handle the exception
				}
				uni.hideLoading()
			},
		}
	}
</script>

<style lang="scss" scoped>
	page{
		background-color: #F9FAFB;
	}
	.invite-outer{
		width: 100%;
		height: 140rpx;
		background-color: #FFFFFF;
		position: fixed;
		bottom: 0;
		left: 0;
	}
	.invite{
		width: 686rpx;
		height: 88rpx;
		line-height: 88rpx;
		color: #FFFFFF;
		font-size: 30rpx;
		background-color: #2ACC8C;
		border-radius: 44rpx;
	}
	.content{
		padding-bottom: 150rpx;
		.banner{
			width: 750rpx;
			height: 280rpx;
			font-weight: 400;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.block{
			.rule{
				color: #909399;
				font-size: 24rpx;
				margin-top: 50rpx;
			}
			&:nth-of-type(2){margin-top: 0rpx;}
			margin-top: 32rpx;
			padding: 24rpx 40rpx;
			width: 100%;
			background-color: #ffffff;
			box-shadow:0px 4px 20px 0px rgba(42,204,140,0.07);
			border-radius:8rpx;
			.flow{
				margin-top: 38rpx;
				.flow-row{
					.twoRow{
						text{margin-right: 0 !important;}
					}
					&.flow-line{
						width: 390rpx;
					}
					&.two{
						margin-top: 8rpx;
					}
					&.w{
						width: 470rpx;
						margin-top: 6rpx;
						justify-content: flex-start;
						text{
							white-space: nowrap;
							&:first-child{
								margin-right:220rpx;
							}
						}
					}
					&.h{
						text{
							&:first-child{
								margin-right:230rpx;
								margin-bottom: 8rpx;
							}
						}
					}
					width: 436rpx;
					font-size: 28rpx;
					.text{
						font-size: 28rpx;
						height: 40rpx;
						line-height: 40rpx;
						color: #303133;
						white-space: nowrap;
						font-weight: 400;
					}
				}
				.flow-row-line{
					position: absolute;
					left: 50%;
					transform: translateX(-50%);
					&.mid{position: relative;left: 0;transform: none;&:nth-child(2){margin-top: 8rpx;}}
					.line{width: 12rpx;height: 3rpx;background-color: #2ACC8C;&:not(:nth-child(9)){margin-right: 6rpx;}}
					.line.t{margin-right: 0;margin-bottom: 6rpx;width: 3rpx; height: 12rpx;}
					.line.t.d{&:nth-child(3){margin-bottom: 0;}}
					.triangle.t{border-left: 12rpx solid transparent; border-bottom: 16rpx solid #2ACC8C;border-top: 0;border-right: 12rpx solid transparent;}
					.triangle.b{border-left: 12rpx solid transparent; border-bottom: 0;border-top: 16rpx solid #2ACC8C;border-right: 12rpx solid transparent;}
					.triangle{border-top: 12rpx solid transparent; border-bottom: 12rpx solid transparent; border-left: 16rpx solid #2ACC8C;}
				}
				.flow-block{
					
					.icon{
						width: 72rpx;
						height: 72rpx;
						background: #FFE5E5;
						border-radius: 50%;
						image{
							width: 100%;
							height: 100%;
						}
					}
				}
				
			}
			.block-title{
				height: 42rpx;
				position: relative;
				.mpweixin{
					position: absolute;
					right: 0;
					color: #2ACC8C;
					font-size: 26rpx;
					font-weight: normal;
					&.one{
						font-size: 24rpx;
						color: #909399;
					}
				}
				.t{
					font-size: 30rpx;
					color: #303133;
					margin: 0 14rpx;
					font-weight: bold;
					position: relative;
					z-index: 5;
					&::after{
						position: absolute;
						z-index: -1;
						content: "";
						bottom: 0;
						width: 100%;
						height: 10rpx;
						left: 0;
						background-color: #B7F7DE;
					}
				}
			}
			.bottom-block{
				font-size: 30rpx;
				color: #303133;
				margin-top: 46rpx;
			}
			.bottom-table{
				height: 174rpx;
				background-color: #EEFFF8;
				border-radius: 4rpx;
				margin-top: 40rpx;
				view{
					flex: 1 0 33.33%;
					font-size: 30rpx;
					.money{font-size: 36rpx;margin-top: 24rpx;line-height: 50rpx;}
				}
			}
			.bottom-description{
				width: 100%;
				height: 62rpx;
				margin: 38rpx 0 ;
				.left{
					align-items: center;
					text{
						font-size: 30rpx;
						font-size: 30rpx;
					}
					.money{
						margin-left: 20rpx;
						font-size: 36rpx;
						color: #2ACC8C;
						font-weight: bold;
					}
				}
				.right{
					width: 166rpx;
					height: 62rpx;
					line-height: 62rpx;
					text-align: center;
					border-radius:34rpx;
					border:2rpx solid #2ACC8C;
					color: #2ACC8C;
					font-size: 30rpx;
					font-weight: bold;
				}
			}
		}
	}
	.myDialog{
		width: 686rpx;
		background: transparent;
		.boxTop{
			font-size: 0;
			border-radius: 10rpx;
			overflow: hidden;
			padding: 50rpx;
			background-color: #fff;
			.imgPic{
				width: 330rpx;
				height: auto;
			}
			.boxCont{
				color: #606266;
				font-size: 28rpx;
				line-height: 40rpx;
			}
			.mBtn{
				width: 378rpx;
				height: 64rpx;
				color: #fff;
				border-radius: 32rpx;
				font-size: 28rpx;
				background-color: #2ACC8C;
				line-height: 64rpx;
				text-align: center;
				margin: auto;
				margin-top: 40rpx;
			}
		}
		.boxBoo{
			margin-top: 60rpx;
			text-align: center;
			.close{
				width: 84rpx;
				height: 84rpx;
			}
		}
	}
</style>
