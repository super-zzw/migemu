<template>
	<view class="content">
		<view class="inp flex align-center">
			<input type="text" class="tel"  placeholder="请输入当前手机号码" :disabled="true" v-model="phone" placeholder-class="placeholder" maxlength="11"></input>
			<text class="num">+86</text>
			<!-- <view class="after flex align-center justify-center">
				获取
			</view> -->
		</view>
		<!-- <view class="inp flex align-center">
			<input type="text" class="code" placeholder="请输入验证码" placeholder-class="placeholder" />
			<view class="after flex align-center justify-center">
				发送验证码
			</view>
		</view> -->
		<view class="inp flex align-center">
			<input type="text" class="tel" placeholder="请输入新手机号码" v-model="newPhone" @input="equal" placeholder-class="placeholder" maxlength="11"></input>
			<text class="num">+86</text>
			<!-- <view class="after flex align-center justify-center">
				获取
			</view> -->
		</view>
		<view class="inp flex align-center">
			<input type="text" class="code" v-model="authCode" placeholder="请输入新手机号验证码" placeholder-class="placeholder" />
			<view class="after flex align-center justify-center" @tap="getPhoneCode">
				{{sendText}}
			</view>
		</view>
		<button class="btn greenBtn" hover-class="none" :loading="btnDisable" :disabled="btnDisable" @tap="change">确定修改</button>
	</view>
</template>

<script>
import { mapState } from "vuex";
import utils from "../../utils/method.js"
export default{
	data(){
		return{
			phone: '', // 手机号
			newPhone: "", // 新手机号
			btnDisable: false,
			authCode: "", //验证码
			sendText: "发送验证码",
			timer: null, // 定时器
			lock: false, // 该手机是否被使用过了 
		}
	},
	computed:{
		...mapState(['userInfo'])
	},
	onLoad() {
		this.phone = this.userInfo.phone;
	},
	methods:{
		async change(){
			let _data = [
				{
					data:this.phone.trim(),
					info:'手机号不能为空'
				},
				{
					data:/^[1][3,4,5,7,8][0-9]{9}$/.test(this.phone.trim()) ? "1" : "",
					info:'手机号格式不正确'
				},
				{
					data:this.newPhone.trim(),
					info:'新手机号不能为空'
				},
				{
					data:/^[1][3,4,5,7,8][0-9]{9}$/.test(this.newPhone.trim()) ? "1" : "",
					info:'新手机号格式不正确'
				},
			]
			if(this.lock){
				uni.showToast({
					title: "该手机号已被使用",
					icon: "none"
				})
				return;
			}
			let jres = await utils.judgeData(_data);
			if(!jres){return}
			this.btnDisable = true;
			try{
				const { data } = await this.$http({
					apiName: "changePhone",
					method: "POST",
					data: {
						phone: this.newPhone,
						authCode: this.authCode
					}
				});
				uni.showToast({
					title: "修改成功",
					icon: "success"
				})
				setTimeout(() => {
					this.btnDisable = false;
					uni.navigateBack();
					this.userInfo.phone = this.newPhone;
				},1000);
			}catch(e){
				this.btnDisable = false;
				uni.showToast({
					title: "修改失败",
					icon: "none"
				})
			}
		},
		// 获取验证码
		async getPhoneCode(){
			if(this.lock){
				uni.showToast({
					title: "该手机号已被使用",
					icon: "none"
				})
				return;
			}
			if(this.sendText !== "发送验证码"){return};
			let _data = [
				{
					data:this.newPhone.trim(),
					info:'手机号不能为空'
				},
				{
					data:/^[1][3,4,5,7,8][0-9]{9}$/.test(this.newPhone.trim()) ? "1" : "",
					info:'手机号格式不正确'
				}
			]
			if(this.newPhone === this.phone){
				uni.showToast({
					title: "手机号不能相同",
					icon: "none"
				})
				return
			}
			let jres = await utils.judgeData(_data);
			if(jres){
				this.sendText = "发送中";
				try{
					const res = await this.$http({
						apiName: "sendCode",
						method: "POST",
						data:{
							phone: this.newPhone
						}
					});
					uni.showToast({
						title: "验证码已发送...",
						icon: "success"
					})
					this.downTime();
				}catch(e){
					console.log(e);
					this.sendText = "发送验证码";
				}
			}
		},
		async equal(e){
			let value = e.detail.value;
			if(value.length === 11){
				try{
					const { data } = await this.checkPhone(this.newPhone);
					if(data == 1){
						uni.showToast({
							title: "该手机号已被使用",
							icon: "none"
						})
						this.lock = true;
					}else{
						this.lock = false;
					}
				}catch(e){
					
				}
				
			}
		},
		async checkPhone(phone){
			return this.$http({
				apiName: "checkPhone",
				method: "POST",
				data: {phone}
			})
		},
		downTime(){
			let i = 60;
			this.timer = setInterval(() => {
				this.sendText = i-- + 's';
				if(i < -1){
					clearInterval(this.timer);
					this.timer = null;
					this.sendText = "发送验证码";
				}
			},1000)
		},
		
	}
}
</script>

<style scoped lang="scss">
	.content{
		min-height: 100vh;
		background-color: #FFFFFF;
	}
	.inp{
		width: 540rpx;
		height: 80rpx;
		line-height: 80rpx;
		position: relative;
		border-radius:44rpx;
		border:2rpx solid #C0C4CC;
		margin-top: 40rpx;
		.num{
			margin-left: 30rpx;
			height: 40rpx;
			line-height: 40rpx;
		}
		input{
			position: absolute;
			height: 100%;
			line-height: 40rpx;
			border-radius:44rpx;
			font-size: 28rpx;
		}
		.tel{
			margin-left: 102rpx;
		}
		.code{
			margin-left: 30rpx;
		}
		.after{
			padding-left: 20rpx;
			padding-right: 20rpx;
			height: 80rpx;
			border-radius:0px 200rpx 200rpx 0px;
			font-size: 28rpx;
			position: absolute;
			right: 0;
			color: #2ACC8C;
		}
	}
	.greenBtn{
		background-color: #2ACC8C;
		color: #FFFFFF;
		margin:82rpx 0 30rpx 0;
	}
</style>
