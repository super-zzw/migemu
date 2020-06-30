<template>
	<view class="content">
		<view class="apply-row flex flex-column justify-center align-center">
			<view class="apply-title"><text>提现金额(元)</text></view>
			<input type="number" v-model="formData.withdrawAmount" maxlength="12" placeholder="请输入提现金额" placeholder-class="placeholder"/>
		</view>
		<view class="apply-row flex flex-column justify-center align-center">
			<view class="apply-title"><text>支付宝账号</text></view>
			<input type="text" v-model="formData.alpay" placeholder="请输入支付宝账号" placeholder-class="placeholder"/>
		</view>
		<view class="apply-row flex flex-column justify-center align-center">
			<view class="apply-title"><text>支付宝姓名</text></view>
			<input type="text" v-model="formData.alpayName" placeholder="请输入对应支付宝账号实名" placeholder-class="placeholder"/>
		</view>
		<view class="apply-row flex flex-column justify-center align-center">
			<view class="apply-title"><text>手机号码</text></view>
			<input type="number" v-model="formData.mobile" maxlength="11" placeholder="请输入您的手机号码" placeholder-class="placeholder"/>
		</view>
		<button class="subBtn" @tap="submit" :disabled="btnDisable" :loading="btnDisable">提交申请</button>
	</view>
</template>

<script>
	import Utils from "../../utils/method.js"
	export default{
		data(){
			return{
				formData:{
					withdrawAmount : "",
					alpay: "",
					alpayName: "",
					mobile: "",
					btnDisable: false
				}
			}
		},
		methods:{
			async submit(){
				if(this.btnDisable){return};
				const _data = [
					{
						data: this.formData.withdrawAmount,
						info: "提现金额不能为空"
					},
					{
						data: this.formData.alpay,
						info: "支付宝账号不能为空"
					},
					{
						data: this.formData.alpayName,
						info: "支付宝姓名不能为空"
					},
					{
						data: this.formData.mobile,
						info: "手机号码不能为空"
					},
				];
				const jres = Utils.judgeData(_data);
				if(jres){
					try{
						this.btnDisable = true;
						const res = await this.$http({
							apiName: "withdraw",
							method: "POST",
							data:{...this.formData}
						})
						
						uni.showToast({
							title: "提交成功",
							icon: "success"
						})
						setTimeout(() => {
							this.btnDisable = false;
							uni.redirectTo({
								url:"./successToast"
							})
						},1500)
						
					}catch(e){
						setTimeout(()=>{
							this.btnDisable = false;
							uni.navigateTo({
								url: "./failToast"
							})
						},1500)
					}
				}
			}
		
		}
		
	}
</script>

<style lang="scss" scoped>
	.content{
		min-height: 100vh;
		background-color: #FFFFFF;
	}
	.subBtn{
		width: 686rpx;
		height: 88rpx;
		background-color: #FDC623;
		border-radius: 44rpx;
		line-height: 88rpx;
		color: #ffffff;
		font-size: 30rpx;
		font-weight: bold;
		margin: 100rpx auto ;
	}
	.apply-row{
		width: 100%;
		height: 160rpx;
		padding: 0 32rpx;
		position: relative;
		&:first-child{
			margin-top: 40rpx;
		}
		input{
			font-size: 30rpx;
			margin-top: 16rpx;
			width: 686rpx;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			border-radius:44rpx;
			border:2rpx solid rgba(192,196,204,1);
		}
		.place{
			font-size: 30rpx;
			color: #909399;
		}
		.apply-title{
			color: #303133;
			font-size: 32rpx;
			font-weight: bold;
			
		}
	}
</style>
