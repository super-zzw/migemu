<template>
	<view class="setting">
		<view class="items">
			<view 
			class="item" 
			v-for="(item,index) in item_list" 
			:key="index" 
			@tap="itemTap(index)" 
			v-if="userRole == 2 || (userRole == 1 && roleDif.indexOf(index) < 0)"
			>
				<view class="itemLeft">
					<image class="itemImg" :src="item.img" mode=""></image>
					<view class="itemText">
						<text>{{item.text}}</text>
						<view class="itemText2" v-if="index == 1">
							<text v-if="userRole == 2">老师</text>
							<text v-if="userRole == 1">学员</text>
						</view>
					</view>
				</view>
				<view class="itemRight">
					<text class="itemRightText">{{item.info}}</text>
					<image class="rightImg" src="../../static/set.png" mode=""></image>
				</view>
			</view>
		</view>
		<view class="setBtn" @tap="exitLogin">
			退出登录
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import utils from '../../utils/method.js'
export default{
	data(){
		return {
			roleDif:[0,2,3],  //教师与学生的设置不同的列表
			type:null,
			item_list:[
				{ text:"切换学员", info:"账号绑定多位学员时，在此切换", img:require('../../static/set1.png') },
				{ text:"切换为",info:"", img:require('../../static/set2.png') },
				{ text:"用户协议", info:"", img:require('../../static/set3.png') },
				{ text:"隐私政策", info:"", img:require('../../static/set4.png')},
				{ text:"修改手机号", info:"", img:require('../../static/set5.png')}
			]
		}
	},
	computed:{
		...mapState(['userRole','userInfo'])
	},
	onLoad() {
		this.type = this.userInfo.userType == 1 ? 2 : 1;
	},
	methods:{
		itemTap(index){
			if(index == 0){
				uni.navigateTo({
					url:'/pages/my/students'
				})
			}else if(index == 1){
				let _role = this.userRole == 1 ? '学员' : '老师'
				let _self = this;
				uni.showModal({
				    title: '提示',
				    content: '确定将角色切换为' + _role + '?',
				    success: function (res) {
				        if (res.confirm) {
							_self.switchRole();
				        }
				    }
				});
			}else if(index == 2){
				uni.navigateTo({
					url:'/pages/index/article?id=1'
				})
			}else if(index == 3){
				uni.navigateTo({
					url:'/pages/index/article?id=2'
				})
			}else if(index == 4){
				uni.navigateTo({
					url:'/pages/author/changePhone'
				})
			}
		},
		// 退出登录
		exitLogin(){
			uni.showModal({
				title: "确定要退出登录吗?",
				confirmColor: '#2ACC8C',
				success({confirm}) {
					if(confirm){
						utils.rmData();
						uni.reLaunch({
							url: '../author/author'
						})
					}
				}
			})
		},
		// 切换角色
		async switchRole(){
			try{
				const {data} = await this.$http({apiName: "switchRole",method:"POST",data:{type: this.type}});
				this.type == 1 ? this.type = 2 : this.type = 1;
				uni.showToast({
					title: "切换成功",
					duration: 1500
				})
				setTimeout(() => {
					this.getUserInfo();
				},0)
			}catch(e){
				
			}
			
		},
		async getUserInfo(){
			uni.showLoading({
				title: "正在加载中...",
				mask: true
			})
			const {data} = await this.$http({apiName: "getUserInfo"});
			this.$store.commit('userInfoSet',data);
			this.$store.commit('userRoleChange',data.userType);
			uni.hideLoading();
		},
	},
}
</script>

<style lang="scss" scoped>
.setting{
	min-height: 100vh;
	background-color: #fff;
	padding-left: 32rpx;
	padding-right: 32rpx;
	.items{
		.item{
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 112rpx;
			.itemLeft{
				display: flex;
				align-items: center;
				.itemImg{
					width: 64rpx;
					height: 64rpx;
				}
				.itemText{
					color: #303133;
					font-size: 32rpx;
					margin-left: 20rpx;
					display: flex;
				}
			}
			.itemRight{
				display: flex;
				align-items: center;
				.itemRightText{
					color: #C0C4CC;
					font-size: 24rpx;
				}
				.rightImg{
					width: 40rpx;
					height: 40rpx;
					margin-left: 6rpx;
				}
			}
		}
	}
	.setBtn{
		margin-top: 88rpx;
		border: 2rpx solid #2ACC8C;
		border-radius: 44rpx;
		line-height: 84rpx;
		text-align: center;
		color: #2ACC8C;
		font-size: 32rpx;
		font-weight: bold;
	}
}
	
</style>
