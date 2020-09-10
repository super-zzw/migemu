<template>
	<view class="confirm">
		<view class="info">
			<courseItem :dataItem="orderInfo" v-if="type==1"></courseItem>
			<courseItem :dataItem="orderInfo" :isFight="true" v-else></courseItem>
			<view class="descBox" v-if="type==2">
				<view class="imgList">
					<view class="fpNumstImg" v-for="(imgItem,imgIndex) in orderInfo.imgList" :key="imgIndex">
						<image  class="img" :src="imgItem" ></image>
					</view>
					<view class="fpNumstImg">
						<image  class="img" :src="userInfo.avatarUrl" ></image>
					</view>
					<text class="status">待支付</text>
				</view>
				<text class="text2">为您加入仅差{{orderInfo.groupMinMember-orderInfo.groupMember>0?orderInfo.groupMinMember-orderInfo.groupMember:0}}人的拼团，支付后即可拼购成功</text>
			</view>
		</view>
		<view class="checkData">
			<view class="position position1" @tap="showModal" data-target="bottomModal" v-if="orderInfo.type === 0">
				<text class="cpText" v-if="addr">{{addr}}</text>
				<text class="cpText2" v-else>选择上课地点</text>
				<image src="../../static/select.png" class="cpImg" mode=""></image>
			</view>
			<view class="position">
				<input placeholder="请输入推荐码 (选填)" type="text" v-model="reCode" class="cpInput" placeholder-style />
				<view class="checkCode" @tap="checkCode">
					验证
				</view>
			</view>
			<!-- <view class="mention">
				如果没有推荐码请忽略此项
			</view> -->
			<view class="position position1" v-if="type==1">
				<text v-model="reCode" class="txt1" >优惠券</text>
				<view class="right" @tap="showModal" data-target="bottomModal1">
					<text class="hasYhq" v-if="yhq>0">优惠￥{{yhq}}</text>
					<image src="../../static/select.png" class="cpImg" mode=""></image>
				</view>
				
			</view>
		</view>
		<view class="cfBoo">
			<view class="protocol">
				<checkbox-group @change="checkChange">
					<checkbox class='round' :class="agreePact ?'checked':''" :checked="agreePact ? true:false" value="1" ></checkbox>
				</checkbox-group>
				<view class="plText">
					我已阅读并接受
					<text class="plTextLink" @tap.stop="toPath('/pages/index/article?id=3')">《课程协议》</text>
				</view>
			</view>
			<view class="opration">
				<view class="price" v-if="type==1">
					
					¥{{orderInfo.sellingPrice-yhq>=0?(orderInfo.sellingPrice-yhq).toFixed(2):0}}
				</view>
				<view class="price" v-else>
					¥{{orderInfo.grouponPrice}}
				</view>
				<view class="oprBtn" @tap="submit">
					支付订单
				</view>
			</view>
		</view>
		<view class="cu-modal bottom-modal" :class="modalName=='bottomModal'?'show':''">
			<view class="cu-dialog myDialog">
				<view class="cu-bar bg-white">
					<view class="action cancel" @tap="hideModal(false)">取消</view>
					<view class="action sure" @tap="checkAddr">确定</view>
				</view>
				<view class="padding-xl">
					<radio-group class="block" @change="RadioChange">
						<view class="cu-list menu text-left">
							<view class="cu-item" v-for="(item,index) in orderSchoolList" :key="index">
								<label class="flex justify-between align-center flex-sub">
									<view class="flex-sub">{{item.address}}</view>
									<radio class="round" :class="addrIndex == index ?'checked':''" :checked="addrIndex == index ? true:false" :value="index"></radio>
								</label>
							</view>
						</view>
					</radio-group>
				</view>
			</view>
		</view>
		<view class="cu-modal bottom-modal" :class="modalName=='bottomModal1'?'show':''">
			<view class="cu-dialog myDialog">
				<view class="dialog"> 
					<text class="titles">选择优惠券</text>
					<text class="cancel1" @tap="hideModal">取消</text>
					<view class="card-list">
						<view class="card-item" v-for="(item,index) in couponsList" :key="index" v-if="couponsList">
							<view class="fengmian couponBG1" v-if="item.useFlag">
								<view class="con">
									￥<text>{{item.amount}}</text>
								</view>
							</view>
		<view class="fengmian couponBG2"  v-else>
			<view class="con">
				￥<text>{{item.amount}}</text>
			</view>
		</view>
							<view class="main">
								<text class="title">{{item.title}}</text>
							
								<text class="date">{{item.startTime|date}} 至 {{item.endTime|date}} 有效</text>
							</view>
							<view class="circle" v-if="item.useFlag">
							
								<text v-if="index!=selYHQ" @tap="selCoupon(item,index)"></text>
								<image src="../../static/select1.png" mode="" v-if="index==selYHQ" @tap="selCoupon(item,index)"></image>
							</view>
							<image src="../../static/nouse.png" mode="" class="nouse" v-if="!item.useFlag"></image>
						</view>
						<view v-if="!couponsList.length" class="none">
							<image src="../../static/null.png" mode=""></image>
							<text>暂无优惠券</text>
							<!-- <view class="confirmBtn" @tap="sMask=false,sModal1=false">确定</view> -->
						</view>
						
					</view>
					<view class="confirmBtn" @tap="modalName=null,yhq=couponsList[selYHQ].amount,wuserCouponId=
					couponsList[selYHQ].wuserCouponId">确定</view>
					
				</view>
			
		</view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex'
import courseItem from "@/components/courseItem.vue"
import utils from "../../utils/method.js"

export default{
	components:{
		courseItem
	},
	data(){
		return {
			agreePact:false,
			modalName:null,
			addr:"",
			addrId:"",
			addrIndex:-1,
			oldAddrIndex:"",
			reCode:"",
			checkoutCodeRes:true,
			yhq:0,
			couponsList:[],
			type:'',
			selYHQ:0,
			wuserCouponId:''
		}
	},
	computed:{
		...mapState(['orderInfo','orderSchoolList','inviteCode','userInfo'])
	},
	filters:{
		
		date(data){
			return utils.unixToDatetime(data,9)
		}
	},
	async onLoad(opt) {
		if(opt.type){
			this.type=opt.type
		}
		if(this.orderSchoolList.length == 1){
			this.addrIndex = 0;
			await this.checkAddr()
		}
		await this.getCouponsList()
	},
	methods:{
		showModal(e) {
			console.log(e)
			this.modalName = e.currentTarget.dataset.target;
			this.oldAddrIndex = this.addrIndex;
		},
		hideModal(type) {
			if(!type){
				if(!this.addrId){
					this.addrIndex = -1
				}else{
					this.addrIndex = this.oldAddrIndex;
				}
			}
			this.modalName = null;
			
		},
		RadioChange(e) {
			this.addrIndex = e.detail.value;
		},
		checkAddr(){
			this.addr = this.orderSchoolList[this.addrIndex].address;
			this.addrId = this.orderSchoolList[this.addrIndex].id;
			this.hideModal(true)
		},
		selCoupon(item,index){
			this.selYHQ=index
			// this.yhq=item.amount
		},
		checkChange(e){
			if(e.detail.value[0] == 1){
				this.agreePact = true;
			}else{
				this.agreePact = false;
			}
		},
		async getCouponsList(){
			await this.$http({
				apiName:'getUseCoupon',
				data:{
					courseId:this.orderInfo.id
				}
			}).then(res=>{
				this.couponsList=res.data
			})
		},
		async submit(){
			uni.showLoading({
				mask:true
			})
			let _jData = [
				{
					data:((this.orderInfo.type == 0 && this.addrId) || this.orderInfo.type != 0) ? "1" : "",
					info:"请选择上课地点"
				},
				{
					data:(this.checkoutCodeRes || !this.reCode) ? "1" : "",
					info:"请输入正确的校验码或清除校验码"
				},
				{
					data:this.agreePact ? "1" : "",
					info:"请阅读并同意课程协议"
				}
			]
			let jres = await utils.judgeData(_jData);
			if(jres){
				// if(this.type==1){
					this.payMoney()
				// }else{
				// 	this.fightOrder()
				// }
			}
		},
		async checkCode(){
			if(!this.reCode){
				uni.showToast({
					title:"请输入推荐码",
					icon:"none"
				})
				return
			}
			try{
				let res = await this.$http({
					apiName:"checkRecommendCode",
					data:{recommendCode:this.reCode}
				})
				if(!res.data){
					this.checkoutCodeRes = false;
					uni.showToast({
						title:"推荐码不正确",
						icon:"none"
					})
				}else{
					this.checkoutCodeRes = true;
					uni.showToast({
						title:"验证成功"
					})
				}
			}catch(e){
				//TODO handle the exception
			}
		},
		
		async payMoney(){
			var that = this
			let dataInfo,apiName
			if(this.type==1){
				apiName="orderCourse"
				dataInfo={
					courseId:this.orderInfo.id,
					code:this.reCode,
					schoolId:this.addrId,
					invitationCode:this.inviteCode,
					wuserCouponId:this.wuserCouponId
				}
			}else{
				apiName="payFightOrder"
				dataInfo={
					groupRuleId:this.orderInfo.groupRuleId,
					
					code:this.reCode,
					schoolId:this.addrId,
					invitationCode:this.inviteCode
				}
			}
			await this.$http({
				apiName:apiName,
				method:"POST",
				data:dataInfo
			}).then(res => {
				let obj = {
					nonceStr: res.data.nonceStr,
					timeStamp: res.data.timeStamp,
					package:res.data.packageValue,
					signType:res.data.signType,
					paySign:res.data.paySign,
					appId: res.data.appId,
				}
				uni.requestPayment({
				    provider: 'wxpay',
				    ...obj,
				    success: function (res) {
						uni.hideLoading()
						uni.showToast({
							title: "支付成功",
							duration: 1500,
						})
						if(that.type==1){
							uni.redirectTo({
								url:"/pages/order/paySuccess?id=" + that.orderInfo.teacherId
							})
						}else{
							uni.redirectTo({
								url:"/pages/index/fightOk?id="+that.orderInfo.id
							})
						}
						
				    },
				    fail: function (err) {
					    uni.hideLoading()
				       uni.navigateTo({
				       	url:"/pages/order/payFail"
				       })
				    }
				});
			}).catch(_ => {})
		},
		toPath(path){
			uni.navigateTo({
				url:path
			})
		}
	},
	watch: {
		reCode(newValue, oldValue) {
			if(newValue !== oldValue){
				this.checkoutCodeRes = true;
			}
		}
	},
}
</script>

<style lang="scss" scoped>
.confirm{
	min-height: 100vh;
	background-color: #fff;
	padding-bottom: 170rpx;
	box-sizing: border-box;
	.info{
		padding: 32rpx;
		padding-bottom: 2rpx;
		background-color: #F6F6F6;
	}
	.descBox{
		   margin-top: 40rpx;
		   display: flex;
		   flex-direction: column;
		   margin-left: 20rpx;
		   width: 100%;
		   .imgList{
			   display: flex;
			   margin-top: 30rpx;
			   .fpNumstImg{
			   	width: 60rpx;
			   	height: 60rpx;
			   	margin-left: -10rpx;
			   	.img{
			   		width: 100%;
			   		height: 100%;
					border-radius: 50%;
			   	}
			   	
		   }
		   .status{
			   width: 80rpx;
			   height: 35rpx;
			   background: #FDC623;
			   border-radius: 19rpx;
			   	margin-left: -15rpx;
				font-size: 20rpx;
				font-weight: 600;
				color: #303133;
				line-height: 35rpx;
				z-index: 100;
				text-align: center;
		   }
		  }
		  .text2{
			  margin-top: 10rpx;
			  margin-bottom: 30rpx;
			  font-size: 32rpx;
			  font-weight: 500;
			  color: #606266;
		  }
		}
	.checkData{
		padding: 40rpx 106rpx 0 106rpx;
		box-sizing: border-box;
		.position{
			border-radius: 44rpx;
			border: 2rpx solid #C0C4CC;
			height: 80rpx;
			box-sizing: border-box;
			position: relative;
			padding: 20rpx 30rpx;
			overflow: hidden;
			margin: auto;
			margin-top: 40rpx;
			.cpText,.cpInput{
				color: #303133;
				font-size: 28rpx;
			}
			.cpText{
				width: calc(100% - 80rpx);
				overflow: auto;
				white-space: nowrap;
			}
			.cpInput{
				width: calc(100% - 120rpx);
			}
			.cpText2,.placeholderStyle{
				color: #909399;
				font-size: 28rpx;
			}
			.cpImg{
				width: 40rpx;
				height: 40rpx;
			}
			.hasYhq{
				font-size: 29rpx;
				font-weight: 600;
				color: #F23D3D;
				margin-right: 18rpx;
				display: inline-block;
			}
			.txt1{
				font-size: 28rpx;
				font-weight: 500;
				color: #909399;
			}
			.right{
					display: flex;
			}
			.checkCode{
				position: absolute;
				right: 0;
				top: 0;
				line-height: 80rpx;
				color: #303133;
				width: 116rpx;
				text-align: center;
				font-size: 26rpx;
			}
		}
		.position1{
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		.mention{
			margin-top: 16rpx;
			text-align: center;
			color: #C0C4CC;
			font-size: 24rpx;
		}
	}
	.cfBoo{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		.protocol{
			display: flex;
			align-items: center;
			padding-left: 32rpx;
			height: 52rpx;
			checkbox-group{
				width: 52rpx;
			}
			.round{
				transform: scale(0.7,0.7);
			}
			/deep/ checkbox .wx-checkbox-input.wx-checkbox-input-checked{
				background-color: #FDC623!important;
				
			}
			.plText{
				
				margin-left: 4rpx;
				font-size: 28rpx;
				color: #C0C4CC;
				// .plTextLink{
				// 	color: #C0C4CC;
				// }
			}
		}
		.opration{
			display: flex;
			height: 96rpx;
			margin-top: 30rpx;
			.price{
				width: 310rpx;
				padding-left: 32rpx;
				box-sizing: border-box;
				line-height: 96rpx;
				color: #F72C2C;
				font-size: 32rpx;
				font-weight: bold;
				border-top: 2rpx solid #F3F3F3;
				height: 100%;
				box-sizing: border-box;
			}
			.oprBtn{
				flex: 1;
				background-color: #FDC623;
				color: #303133;
				text-align: center;
				line-height: 96rpx;
				font-size: 36rpx;
				font-weight: bold;
			}
		}
	}
	.myDialog{
		.cu-bar{
			border-bottom: 2rpx solid #dee3ec;
		}
		.action{
			font-size: 32rpx;
		}
		.cancel{
			color: #8799A3;
		}
		.sure{
			color: #FDC623;
		}
		.padding-xl{
			padding: 32rpx;
			background-color: #fff;
			/deep/ radio .wx-radio-input.wx-radio-input-checked{
				background-color: #FDC623!important;
			}
		}
	}
}
.dialog{
	display: flex;
	flex-direction: column;
	align-items: center;
}
.titles {
			margin: 38rpx 0 58rpx;
			font-size: 32rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 600;
			color: rgba(48, 49, 51, 1);
			
		}

		.cancel1 {
			position: absolute;
			right: 30rpx;
			top: 40rpx;
			font-size: 26rpx;
			font-weight: 400;
			color: #F78726 !important;
		}

		.card-list {
			height: 700rpx;
			overflow: scroll;
		}

		.card-item {
			// margin:0 32rpx;
			background: #fff;
			width: 700rpx;
			height: 200rpx;
			display: flex;
			margin-bottom: 40rpx;
			// align-items: center;
             .couponBG1{
				 background: url(../../static/yhq.png) no-repeat;
				 background-size:contain;
			 }
			 .couponBG2{
			 				 background: url(../../static/yhq2.png) no-repeat;
			 				 background-size:contain;
			 }
			.fengmian {
				width: 200rpx;
				height: 200rpx;
				
				
				display: flex;
				align-items: center;
				justify-content: center;
			}

.con{
					font-size: 28rpx;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: rgba(255, 255, 255, 1);
					display: flex;
					align-items: flex-end;

					text {
						font-size: 52rpx;
						line-height: 58rpx;
					}
				}
			.main {
				flex: 1;
				margin: 0 10rpx 0 50rpx;
				overflow: hidden;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				height: 100%;
                text-align: left;
				.title {
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					font-size: 32rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 500;
					color: rgba(48, 49, 51, 1);
					
					width: 100%;
				}

				.info {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.txt {
						font-size: 28rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: rgba(168, 171, 179, 1);
					}

					.btn {
						border-radius: 22rpx;

						padding: 0 18rpx;
						line-height: 44rpx;
						font-size: 28rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;

					}

					.btn1 {
						border: 2rpx solid rgba(242, 61, 61, 1);
						color: rgba(242, 61, 61, 1);
					}

					.btn2 {
						border: 2rpx solid rgba(144, 147, 153, 1);
						color: rgba(144, 147, 153, 1);
					}
				}

				.date {
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: rgba(168, 171, 179, 1);
				}
			}
		}

		.card-item:last-child {
			margin-bottom: 60rpx;
		}

		.circle {
			text {
				width: 40rpx;
				height: 40rpx;
				border: 2rpx solid rgba(217, 217, 217, 1);
				border-radius: 50%;
			}

			image {
				width: 40rpx;
				height: 40rpx;
			}

			height: 100%;
			margin-right: 30rpx;
			display: flex;
			align-items: center;
		}

		.nouse {
			width: 104rpx;
			height: 104rpx;

		}
		.none {
			image {
				width: 200rpx;
				height: 150rpx;
				margin-bottom: 20rpx;
			}
			margin: 50rpx 0;
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size:28rpx;
			font-family:PingFangSC-Regular,
			PingFang SC;
			font-weight:400;
			color:rgba(144, 147, 153, 1);
		}
		
		.confirmBtn {
			width: 686rpx;
			height: 88rpx;
            border-radius: 44rpx;
			background: #FDC623;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #fff;
			margin-bottom:40rpx ;
		}
</style>
