<template>
	<view class="student">
		<radio-group  class="identity">
			<label class="idBox" @tap="radioChange(item)" v-for="(item,index) in data_list" :key="index">
				<view class="idb1">
					<image :src="item.avatarUrl" class="pic" mode=""></image>
					<text class="idb1Text">{{item.name}}</text>
					<text class="idb1Text">（{{item.birthday}})</text>
				</view>
				<view class="radio" :class="role==item.id ? 'active' : ''" ></view>
			</label>
		</radio-group>
		<view class="stuBtn" @tap="addStudent">
			添加学员
		</view>
	</view>
</template>

<script>
import Utils from "../../utils/method.js"
import { mapState } from "vuex";
export default {
	data(){
		return {
			role:'1',
			data_list:[]
		}
	},
	computed:{
		...mapState(['userInfo'])
	},
	onShow() {
		this.getStudentList();
	},
	methods:{
		radioChange(item){
			let _self = this;
			console.log(this.role);
			uni.showModal({
			    title: '提示',
			    content: '确定切换为该学员吗',
			    success: function (res) {
			        if (res.confirm) {
						_self.role = item.id;
						_self.changeStudent(item); // 切换学员
			            uni.navigateBack()
			        }
			    }
			});
			
		},
		addStudent(){
			uni.navigateTo({
				url:'/pages/author/userInfo?add=1'
			})
		},
		async changeStudent(item){
			try{
				await this.$http({apiName: "switchStudent",method:"POST",data:{studentId:item.id}});
				uni.showToast({
					title:'切换成功',
					icon: "success"
				})
				
				this.setUserInfo();
				
			}catch(e){
				
			}
			
		},
		async getStudentList(){
			const {data} = await this.$http({apiName: "getStudentList"});
			data.forEach(item=>{
				let t = Utils.unixToDatetime(item.birthday);
				item['birthday'] = Utils.getOld(t);
			})
			this.role = this.userInfo.roleId;
			this.data_list = data;
		},
		// 获取用户个人资料
		async setUserInfo(){
			const {data} = await this.$http({apiName: "getUserInfo"});
			this.userInfo.nickName = data.name;
			this.$store.commit('userInfoSet',data);
		},
	}
}
</script>

<style lang="scss" scoped>
.student{
	min-height: 100vh;
	background-color: #fff;
	padding-left: 32rpx;
	padding-right: 32rpx;
	.identity{
		width: 100%;
		.idBox{
			display: block;
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 112rpx;
			.radio{
				width: 52rpx;
				height: 52rpx;
				border:2px solid rgba(192,196,204,1);
				border-radius: 50%;
				position: relative;
				&.active{
					border-color: #2ACC8C;
				}
				&.active::after{
					position: absolute;
					top: 48%;
					left: 50%;
					transform: translate(-50%,-50%);
					font-family: "cuIcon";
					content: "\e645";
					font-size: 36rpx;
					color: #2ACC8C;
					font-weight: bold;
				}
			}
			.idb1{
				display: flex;
				align-items: center;
				.pic{
					width: 64rpx;
					height: 64rpx;
					border-radius: 50%;
				}
				.idb1Text{
					color: #303133;
					font-size: 32rpx;
					margin-left: 10rpx;
				}
			}
			// /deep/ radio .wx-radio-input{
			// 	transform: scale(0.7,0.7);
			// }
			/deep/ radio .wx-radio-input.wx-radio-input-checked{
				background-color: #2ACC8C!important;
			}
		}
	}
	
	.stuBtn{
		margin-top: 60rpx;
		background-color: #2ACC8C;
		line-height: 88rpx;
		color: #fff;
		text-align: center;
		font-size: 32rpx;
		border-radius: 44rpx;
		font-weight: bold;
	}
}
</style>
