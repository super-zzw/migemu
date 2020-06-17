<template>
	<view class="content">
		<image src="../../static/logo.png" mode="" class="icon"></image>
		<text class="title">鹦鹉学唱</text>
		<view class="inp flex align-center">
			<input type="text" class="tel" v-model="userData.tel" placeholder="请输入手机号码" placeholder-class="placeholder" maxlength="11"></input>
			<text class="num">+86</text>
			<button class="after flex align-center justify-center" :plain="true" open-type="getPhoneNumber" @getphonenumber="getPhone" >
				获取
			</button>
		</view>
		<view class="inp flex align-center">
			<input type="text" class="code" v-model="userData.code" placeholder="请输入验证码" placeholder-class="placeholder" />
			<view class="after flex align-center justify-center" @tap="getPhoneCode">
				{{sendText}}
			</view>
		</view>
		<view  class="identity">
			<label @tap="role='A'" class="idBox i1">
				<image v-if="role == 'A'" class="idPic" src="../../static/student2.png" mode=""></image>
				<image v-else class="idPic" src="../../static/student1.png" mode=""></image>
				<view class="idCheck">
					<!-- <radio :checked="role == 'A'?true:false"></radio> -->
					<view class="radio" :class="role==='A'?'active':''"></view>
					<text class="idCheckText">我是学员</text>
				</view>
			</label>
			<label @tap="role='B'" class="idBox i2">
				<image v-if="role == 'B'" class="idPic" src="../../static/teacher2.png" mode=""></image>
				<image v-else class="idPic" src="../../static/teacher1.png" mode=""></image>
				<view class="idCheck">
					<!-- <radio :checked="role == 'B'?true:false"></radio> -->
					<view class="radio" :class="role==='B'?'active':''"> </view>
					<text class="idCheckText">我是教师</text>
				</view>
			</label>
		</view> 
		<button class="btn greenBtn" :loading="btnDisable" :disabled="btnDisable" hover-class="none" @tap="bindUser">立即绑定</button>
		<view class="tips">绑定手机号即代表您已同意<text class="tipsText" @tap="toArticle(1)">《用户协议》</text>和<text @tap="toArticle(2)" class="tipsText">《隐私政策》</text></view>
	</view>
</template>

<script>
import utils from 'utils/method.js'
import { mapState, mapMutations } from "vuex"
export default{
	data(){
		return{
			role:"A", // A是学生   B是老师
			userData:{
				tel: '',
				code: '' // 临时先用8888
			},
			sendText: "发送",
			btnDisable: false,
			timer: null, // 定时器
			loseCode: 0 ,  //有无获取手机号码 1是获取 0是没获取
		}
	},
	computed:{
		...mapState(['userInfo','inviteCode'])
	},
	onLoad() {
		console.log(this.userInfo)
	},
	methods:{
		radioChange(e){
			this.role = e.detail.value
		},
		async bindUser(){
			const jres = await this.judge();
			if(jres){
				try{
					this.btnDisable = true;
					if(this.role === 'B'){
						const result = await this.checkTeacher(this.userData.tel);
						console.log(result)
						if(!result.data){
							uni.showToast({
								title: "该手机号不可注册为老师",
								icon: "none"
							})
							this.btnDisable = false;
							return;
						}
					}
					uni.showLoading({ title: "正在绑定中..." }); 
					
					let {avatarUrl,nickName,jsCode} = this.userInfo; // 拿到头像，微信code 和 名称
					const res = await this.$http({
						apiName: "userRegister",
						method: "POST",
						data:{
							jsCode,
							avatarUrl,
							nickName,
							phone: this.userData.tel, // 手机号
							authCode: this.userData.code, // 验证码
							type: this.role === 'A' ? 2 : 1 ,// 2是学生 1是老师
							inviteCode: this.inviteCode ,// 被邀请码 ，从store里面拿
							loseCode: this.loseCode,
							
						}
					});
					console.log('登陆接口返回数据',res);
					// uni.setStorage({ // 拿到session之后 保存到缓存里面
					// 	data: res.data,
					// 	key: 'session'
					// })
					uni.setStorageSync('session',res.data)
					
					this.$store.commit('isLoginSet',true); // 把登录状态变成true
					const uData = await this.getUserInfo();
					console.log('获取个人信息数据',uData);
					if(uData.data.perfects){ // 该用户还没注册过
						setTimeout(() => {
							this.userInfo.phone = this.userData.tel; // 把电话给存到userInfo里面去
							uni.hideLoading();
							this.btnDisable = false;
							uni.navigateTo({url: './userInfo'})
						},1000)
					}else{
						setTimeout(() => {
							uni.hideLoading();
							this.btnDisable = false;
							utils.dealResolvePage()
						},1000)
					}
					
				}catch(e){
					if(e.data.code == 900000){
						uni.showToast({
							title: "授权已过期,请重新授权",
							icon: "none"
						});
						uni.navigateBack();
					}
					uni.hideLoading();
					this.btnDisable = false;
				}
				
			}
		},
		// 校验数据
		async judge(){ 
			let _data = [
				{
					data:this.userData.tel.trim(),
					info:'手机号不能为空'
				},
				{
					data:/^[1][3,4,5,7,8][0-9]{9}$/.test(this.userData.tel.trim()) ? "1" : "",
					info:'手机号格式不正确'
				},
				{
					data:this.userData.code.trim(),
					info:'验证码不能为空'
				}
			]
			return utils.judgeData(_data);
		},
			
		toArticle(id){
			uni.navigateTo({
				url:`/pages/index/article?id=${id}`
			})
		},
		// 获取手机号码
		async getPhone(back){
			if(!back.detail.iv){return}
			uni.showLoading({
				title: "正在获取手机号"
			})
			console.log(this.userInfo);
			const {jsCode} = this.$store.state.userInfo;
			const {encryptedData,iv:ivStr} = back.detail;
			try{
				const userPhone = await this.$http({apiName: "getUserPhone",data:{encryptedData,ivStr,jsCode}});
				this.userData.tel = userPhone.data;
				this.loseCode = 1;
			}catch(e){
				uni.showToast({
					title: "获取手机号码失败",
					icon: "none"
				})
			}finally{
				uni.hideLoading();
			}
		},
		// 获取验证码
		async getPhoneCode(){
			if(this.sendText !== "发送"){return};
			let _data = [
				{
					data:this.userData.tel.trim(),
					info:'手机号不能为空'
				},
				{
					data:/^[1][3,4,5,7,8][0-9]{9}$/.test(this.userData.tel.trim()) ? "1" : "",
					info:'手机号格式不正确'
				},
			]
			let jres = await utils.judgeData(_data);
			if(jres){
				this.sendText = "发送中";
				try{
					const res = await this.$http({
						apiName: "sendCode",
						method: "POST",
						data:{
							phone: this.userData.tel
						}
					});
					uni.showToast({
						title: "验证码已发送...",
						icon: "success"
					})
					this.downTime();
				}catch(e){
					this.sendText = "发送";
				}
			}
		},
		downTime(){
			let i = 60;
			this.timer = setInterval(() => {
				this.sendText = i-- + 's';
				if(i < -1){
					clearInterval(this.timer);
					this.timer = null;
					this.sendText = "发送";
				}
			},1000)
		},
		// 检验是否可为老师注册
		async checkTeacher(phone){
			return this.$http({
				apiName: "checkTeacher",
				method: "POST",
				data: {
					phone
				}
			})
		},
		// 获取用户信息
		async getUserInfo(){
			const data = await this.$http({apiName: "getUserInfo"});
			console.log(data);
			if(data.code === 300000){
				uni.showToast({
					title: "授权已过期,请重新授权",
					icon: "none"
				});
				uni.navigateBack();
			}else{
				let _data = data.data
				this.$store.commit('userInfoSet',_data);
				this.$store.commit('userRoleChange',_data.userType);
				return data;
			}
			
		},
	}
}
</script>

<style scoped lang="scss">
	.content{
		min-height: 100vh;
		background-color: #FFFFFF;
	}
	.icon{
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		margin: 50rpx 0 20rpx;
	}
	.title{
		font-size: 32rpx;
		font-weight: bold;
	}
	.inp{
		width: 540rpx;
		height: 80rpx;
		line-height: 80rpx;
		position: relative;
		border-radius:44rpx;
		border:2rpx solid #C0C4CC;
		&:first-of-type{
			margin: 104rpx 0 40rpx 0;
		}
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
			width: 116rpx;
			height: 80rpx;
			border-radius:0px 200rpx 200rpx 0px;
			color: #2ACC8C;
			font-size: 28rpx;
			position: absolute;
			right: 0;
			white-space: nowrap;
			z-index: 10;
			top: 50%;
			border: none;
			outline: none;
			transform: translateY(-50%);
			&::after{
				content: "";
				border-radius: 0;
				border: 0;
				outline: 0;
			}
		}
	}
	.identity{
		display: flex;
		justify-content: center;
		margin-top: 60rpx;
		.idBox{
			text-align: center;
			.idPic{
				width: 88rpx;
				height: 88rpx;
			}
		}
		.i1{
			margin-right: 30rpx;
		}
		.i2{
			margin-left: 30rpx;
		}
		.idCheck{
			display: flex;
			justify-content: center;
			align-items: center;
			radio{
				transform: scale(.7);
			}
			.radio{
				width: 32rpx;
				height: 32rpx;
				border:2rpx solid rgba(192,196,204,1);
				border-radius: 50%;
				position: relative;
				&.active{
					border-color: #2ACC8C;
				}
				&.active::after{
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%,-50%);
					font-family: "cuIcon";
					content: "\e645";
					font-size: 22rpx;
					color: #2ACC8C;
					font-weight: bold;
				}
			}
			.idCheckText{
				margin-left: 6rpx;
				color: #303133;
				font-size: 28rpx;
			}
		}
	}
	.greenBtn{
		background-color: #2ACC8C;
		color: #FFFFFF;
		margin:82rpx 0 30rpx 0;
		border: none;
		outline: none;
		&::after{
			content: "";
			border: none;
			outline: none;
		}
	}
	.tips{
		color: #909399;
		font-size: 26rpx;
		line-height: 36rpx;
		.tipsText{
			color: #2ACC8C;
		}
	}
</style>
