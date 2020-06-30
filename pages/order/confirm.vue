<template>
	<view class="confirm">
		<view class="info">
			<courseItem :dataItem="orderInfo"></courseItem>
		</view>
		<view class="checkData">
			<view class="position position1" @tap="showModal" data-target="bottomModal" v-if="orderInfo.type === 0">
				<text class="cpText" v-if="addr">{{addr}}</text>
				<text class="cpText2" v-else>选择上课地点</text>
				<image src="../../static/select.png" class="cpImg" mode=""></image>
			</view>
			<view class="position">
				<input placeholder="请输入推荐码" type="text" v-model="reCode" class="cpInput" placeholder-style />
				<view class="checkCode" @tap="checkCode">
					验证
				</view>
			</view>
			<view class="mention">
				如果没有推荐码请忽略此项
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
				<view class="price">
					¥{{orderInfo.sellingPrice}}
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
		}
	},
	computed:{
		...mapState(['orderInfo','orderSchoolList','inviteCode'])
	},
	onLoad() {
		if(this.orderSchoolList.length == 1){
			this.addrIndex = 0;
			this.checkAddr()
		}
	},
	methods:{
		showModal(e) {
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
		checkChange(e){
			if(e.detail.value[0] == 1){
				this.agreePact = true;
			}else{
				this.agreePact = false;
			}
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
				this.payMoney()
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
			await this.$http({
				apiName:"orderCourse",
				method:"POST",
				data:{
					courseId:this.orderInfo.id,
					code:this.reCode,
					schoolId:this.addrId,
					invitationCode:this.inviteCode
				}
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
						setTimeout(()=>{
							uni.redirectTo({
								url:"/pages/order/paySuccess?id=" + that.orderInfo.teacherId
							})
						},1500)
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
				color: #fff;
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
</style>
