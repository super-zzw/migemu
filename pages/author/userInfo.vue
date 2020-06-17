<template>
	<view class="content">

		<view class="avator">
			<Avatar
				selWidth="200px" selHeight="400upx" @upload="myUpload" :avatarSrc="url" inner="true"
				avatarStyle="width: 120rpx; height: 120rpx; border-radius: 100%;">
			</Avatar>
			<view class="raidus flex align-center justify-center">
				+
			</view>
		</view>
		<view class="inputs flex flex-direction align-center">
			<text>昵称</text>
			<input type="text" placeholder-class="placeholder" maxlength="20" v-model="name" placeholder="2-20个字母或1-10个汉字" />
		</view>
		<view class="inputs flex flex-direction align-center">
			<text>生日</text>
			<picker mode="date" :value="date"  :end="endData" @change="DateChange">
				<view class="picker">
					{{date}}
				</view>
			</picker>
		</view>
		<view class="inputs flex flex-direction align-center">
			<text>当前账号</text>
			<input type="text" placeholder-class="placeholder" :disabled="true"  v-model="phone" placeholder="请输入当前账号" />
		</view>
		<view class="selects ">
			<radio-group class="flex" @change="radioChange">
				<view @tap="radio='A'" class="selectBlock flex flex-column align-center">
					<view class="icon">
						<image class="iconSx" src="../../static/boy.png" mode=""></image>
					</view>
					<view class="select flex align-center">
						<!-- <radio :checked="radio == 'A' ? true : false"></radio> -->
						<view class="radio" :class="radio==='A'?'active':''"></view>
						<text>男生</text>
					</view>
				</view>
				<view @tap="radio='B'" class="selectBlock flex flex-column align-center">
					<view class="icon">
						<image class="iconSx" src="../../static/girl.png" mode=""></image>
					</view>
					<view class="select flex align-center ">
						<!-- <radio :checked="radio == 'B' ? true : false"></radio> -->
						<view class="radio" :class="radio==='B'?'active':''"></view>
						<text>女生</text>
					</view>
				</view>
			</radio-group>
		</view>
		<button class="btn greenBtn" :loading="btnDisable" :disabled="btnDisable" @tap="saveInfo">保存</button>
		<button class="btn cancelBtn" @tap="back" v-if="showBtn">取消</button>   <!-- 如果是个人资料编辑才显示 -->
	</view>
</template> 

<script>
import utils from 'utils/method.js'
import { mapState } from "vuex"
import Avatar from "../../components/yq-avatar.vue";
	export default{
		computed:{
			...mapState(['userInfo'])
		},
		components:{
			Avatar
		},
		data(){
			return{
				avatorSrc: '',
				name: "", // 用户姓名
				date: '2012-10-01',
				endData: "",
				radio: 'A',
				url: "",
				showBtn:false,
				phone: '' , //用户手机 但是要加*号
				btnDisable: false,
				bizType: 1 //业务类型 1 注册 2 学员添加学员 3 老师注册学生 4 修改资料
			}
		},
		onLoad({edit,add}) {
			edit && (this.showBtn = true,this.bizType = 4,this.date = this.userInfo.birthday,this.userInfo.gender=="男"?this.radio='A':this.radio='B'); // 如果是修改个人信息
			add && (this.showBtn = true,this.bizType = 2);
			this.name = this.userInfo.nickName;
			this.url = this.userInfo.avatarUrl;
			this.getYearMonDay();
			this.changeUserPhoneOrGender(); // 得到加密后的手机号码 和 根据性别改变radio
		},
		methods:{
			DateChange(e) {
				this.date = e.detail.value
			},
			getYearMonDay(){
				const date = new Date();
				const year = date.getFullYear();
				const month = (date.getMonth() + 1).toString().padStart(2,0);
				const day = date.getDate().toString().padStart(2,0);
				this.endData = `${year}-${month}-${day}`;
			},
			radioChange(e){
				this.radio = e.detail.value;
			},
			changeUserPhoneOrGender(){
				let {phone:userPhone,gender} = this.userInfo;
				this.phone = userPhone.substring(0,3) + '****' + userPhone.substring(7);
				gender === 1 ? this.radio === 'A' : this.radio === 'B'; // 男是A 
			},
			// 保存
			async saveInfo(){
				const jres = await this.judge();
				if(!jres){return}; // 如果校验失败 返回
				this.btnDisable = true;
				uni.showLoading({
					title: "正在保存中"
				})
				const requestData = {
					avatarUrl:this.url,
					name: this.name,
					birthdays: this.date,
					gender: this.radio === 'A' ? '男' : '女',
					bizType: this.bizType
				};
				try{
					const res = await this.$http({
						apiName: "perfectInfo",
						method: "POST",
						data:requestData
					});
					this.btnDisable = false;
					uni.hideLoading();
					this.getUserInfo(); // 只有注册账号的时候才需要重新更新一下userinfo 
					if(this.bizType === 1){
						utils.dealResolvePage()
					}else if(this.bizType === 4){
						uni.navigateBack({})
					}else if(this.bizType === 2){
						uni.navigateBack({})
					}
					
				}catch(e){
					this.btnDisable = false;
					uni.hideLoading();
				}
				
			},
			// 获取用户信息
			async getUserInfo(){
				const {data} = await this.$http({apiName: "getUserInfo"});
				this.$store.commit('userInfoSet',data);
			},
			// 校验数据
			async judge(){ 
				let _data = [
					{
						data: this.name.trim(),
						info:'昵称不能为空'
					}
				]
				return utils.judgeData(_data);
			},
			back(){
				uni.navigateBack({});
			},
			myUpload(rsp) {
				var that = this;
				that.$upLoadImg({
					apiName: "upLoadFile",
					name: "file",
					filePath: rsp.path
				}).then(src=>{
					that.url = src.data;
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.content{
		min-height: 100vh;
		background-color: #FFFFFF;
	}
	.avator{
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		background-color: #C0C4CC;
		position: relative;
		margin: 40rpx 0 50rpx ;
		image{
			width: 100%;
			height: 100%;
			position: absolute;
			border-radius: 50%;
		}
		.raidus{
			width: 32rpx;
			height: 32rpx;
			border-radius: 50%;
			background-color: #2ACC8C;
			color: #FFFFFF;
			font-size: 36rpx;
			position: absolute;
			right: 0;
			bottom: 0;
		}
	}
	.inputs{
		margin-bottom: 40rpx;
		text{font-size: 32rpx;font-weight: bold;}
		input,picker{
			margin-top: 16rpx;
			width: 540rpx;
			height: 80rpx;
			line-height: 80rpx;
			border:2rpx solid rgba(192,196,204,1);
			border-radius: 44rpx;
			text-align: center;
		}
	}
	.selects{
		.selectBlock{
			
			margin-right: 108rpx;
			&:last-of-type{
				margin-right: 0;
			}
			.icon{
				width: 88rpx;
				height: 88rpx;
				background-color: #E9F2FF;
				border-radius: 50%;
				margin-bottom: 12rpx;
				position: relative;
				.iconSx{
					position: absolute;
					left: 0;
					right: 0;
					width: 100%;
					height: 100%;
				}
			}
			.select{
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
					}
				}
				radio{
					transform: scale(.7);
					margin-right: 10rpx;
					&.checked{
						background-color: #FFFFFF !important;
					}
				}
			}
		}
	}
	.greenBtn{
		background-color: #2ACC8C;
		border-radius: 44rpx;
		color: #FFFFFF;
		margin-top: 80rpx;
	}
	.cancelBtn{
		border-radius:44px;
		border:2rpx solid #2ACC8C;
		margin: 36rpx 0;
		background-color: #FFFFFF;
		color: #2ACC8C;
	}
</style>
