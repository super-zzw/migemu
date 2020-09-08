<template>
	<view class="wrap">
		<view class="" v-if="course">
		<view class="banner">
			<swiper class="swiperBox"  :current="bannerTab" :autoplay="false" @change="changeBannerSwiper">
				<swiper-item v-for="(item,index) in course.picUrlList" :key="item">
					<view class="" v-if="index == 0">
						<view v-if="playVideo">
							<video id="bannerVideo" class="bannerVideo" :autoplay="true" :src="course.videoUrl" controls></video>
						</view>
						<view class="" v-else>
							<image :src="item" mode="" class="bannerImg"></image>
							<view class="nmBox">
								{{index + 1}}/{{course.picUrlList.length}}
							</view>
						</view>
					</view>
					<view class="" v-else>
						<image :src="item" mode="" class="bannerImg"></image>
						<view class="nmBox">
							{{index + 1}}/{{course.picUrlList.length}}
						</view>
					</view>
					
				</swiper-item>
			</swiper>
			<view class="videoBox" v-if="course.videoUrl && ((playVideo && bannerTab > 0) || !playVideo)">
				<view class="videoBox2" @tap="startVideo">
					<image class="videoImg" src="../../static/play.png" mode=""></image>
					<!-- <text class="videoLong">{{course.videoLong}}</text> -->
				</view>
			</view>
		</view>
		<view class="info">
			<view class="i0" v-if="type==2">
				<uni-countdown color="#FFFFFF" background-color="#F23D3D" border-color="#F23D3D" splitorColor="#F23D3D"  :day="trDate.d" :hour="trDate.h" :minute="trDate.m" :second="trDate.s"  @timeup="timeUp"> </uni-countdown>
				<text class="t1">后结束</text>
				<text class="t2">{{course.groupMinMember}}人起成团</text>
			</view>
			<view class="i1">
				<text class="it1" v-for="(sItem,sIndex) in course.subjectLis" :key="sIndex">{{sItem.title}}</text>
				<text class="it2">{{course.name}}</text>
			</view>
			<view class="i2">
				<view class="it1">
					<image class="it1p1" src="../../static/xsth.png" mode=""></image>
					<text class="it1p2" v-if="type==1">¥{{course.sellingPrice}}</text>
					<text class="it1p2" v-if="type==2">¥{{course.grouponPrice}}</text>
					<text class="it1p3">¥{{course.originalPrice}}</text>
				</view>
				<view class="it2">
					<colorTag :tagData="course" :showSubjectLis="false" ></colorTag>
				</view>
			</view>
			<view class="i4" v-if="type==2">
				<view class="imgList">
					<!-- <view class="fpNumstImg" v-for="(imgItem,imgIndex) in order.group" :key="imgIndex">
						<image v-if="imgItem.icon && imgIndex < 10" class="img" :src="imgItem.icon" mode=""></image>
					</view> -->
					<view class="fpNumstImg" v-for="(imgItem,imgIndex) in course.imgList" :key="imgIndex">
						<image  class="img" :src="imgItem" ></image>
					</view>
					<image   src="../../static/+.png" class="fpNumstImg"></image>
					<text class="t1">已有{{course.groupMember}}人参团，</text>
					<text class="t2">还差{{course.groupMinMember-course.groupMember}}人成团</text>
				</view>
			</view>
			<!-- <view class="i3" @tap="showModal" data-target="Modal">
				授课老师：{{course.teacherName}}
				<image class="i2Icon" src="../../static/right.png" mode=""></image>
			</view> -->
		</view>
		<view class="cont" v-if="course.type === 0">
			<view class="contTile">
				上课地点
			</view>
			<view class="positionList">
				<view class="plItem" v-for="(pItem,pIndex) in schoolList" :key="pIndex" @tap="toLoaction(pItem)">
					<text class="pText">{{pItem.address}}</text>
					<image class="rightIcon" src="../../static/right.png" mode=""></image>
				</view>
			</view>
		</view>
		<view class="cont" v-if="course.registerEndTime">
			<view class="contTile">
				课程报名截止时间
			</view>
			<view class="deadTime">
				{{course.registerEndTime}}
			</view>
		</view>
		<view class="courseData">
			<view class="tabs">
				<view class="tabItem" :class="descTab == 0 ? 'active' : ''" @tap="changeDescTab(0)">课程介绍</view>
				<view class="tabItem" :class="descTab == 1 ? 'active' : ''" @tap="changeDescTab(1)">课程大纲</view>
				<!-- <view class="tabItem" :class="descTab == 2 ? 'active' : ''" @tap="changeDescTab(2)">学员评价</view> -->
				<!-- <view class="tabItem" :class="descTab == 2 ? 'active' : ''" @tap="changeDescTab(2)">课程须知</view> -->
			</view>
			<swiper class="tabSwiper" :style="{height:swiperHeight + 'px'}" @change=changeTabSwiper :current="descTab" >
				<swiper-item class="tabItem" >
					<rich-text class="tabData0" :nodes="course.introduce"></rich-text>
				</swiper-item>
				<swiper-item class="tabItem" >
					<rich-text class="tabData1" :nodes="course.outline"></rich-text>
				</swiper-item>
				<swiper-item class="tabItem">
					<view class="tabData2" v-if="commentList.length > 0">
						<view class="commentItem " v-for="(cItem,cIndex) in commentList" :key="cIndex">
							<view class="commentItemPic">
								<image class="commentItemPicImg" :src="cItem.studentPic" mode=""></image>
							</view>
							<view class="comInfo">
								<view class="comTitle">
									{{cItem.studentName}}
								</view>
								<view class="comDesc">
									{{cItem.content}}
								</view>
							</view>
						</view>
						<moreList @change="getMoreComment" v-if="commentHasMore" ></moreList>
					</view>
					<view class="tabData2" v-else>
						<defaultPage></defaultPage>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="opration" v-if="userInfo.userType != 1">
			<!-- 正常进来 -->
			<view class="buy" v-if="!isDrop">
				<button open-type="contact" class="wxBtn server">
					<image src="../../static/server.png" class="serverImg" mode=""></image>
					<view class="serverText">客服</view>
				</button>
				<button open-type="share" class="wxBtn rebeat" v-if="isLogin">
					<image src="../../static/share.png" class="rebeatImg" mode=""></image>
					<view class="rebeatText">邀请返利</view>
				</button>
				<view class="rebeat" @tap="toLogin"  v-else>
					<image src="../../static/share.png" class="rebeatImg" mode=""></image>
					<view class="rebeatText">邀请返利</view>
				</view>
				<view class="oprBtn" v-if="type==1" @tap="createOrder">立即购买</view>
				<view class="btns" v-if="type==2">
					<view class="dandubuy optbtn" @tap="createOrder">
						<text class="desc">单独购买</text>
						<text class="price">¥{{course.sellingPrice}}</text>	
					</view>
					<view class="fight optbtn" @tap="fightOrder">
						<text class="desc">我要参团</text>
						<text class="price">¥{{course.grouponPrice}}</text>		
					</view>
				</view>
			</view>
			<!-- 学生课程进入 -->
			<view class="buy" v-else-if="isDrop && course.type === 0 ">
				<button open-type="contact" class="wxBtn server drop">
					<image src="../../static/server.png" class="serverImg" mode=""></image>
					<view class="serverText">客服</view>
				</button>
				<button open-type="share" class="wxBtn rebeat drop"  v-if="isLogin">
					<image src="../../static/share.png" class="rebeatImg" mode=""></image>
					<view class="rebeatText">邀请返利</view>
				</button>
				<view class="rebeat" @tap="toLogin"  v-else>
					<image src="../../static/share.png" class="rebeatImg" mode=""></image>
					<view class="rebeatText">邀请返利</view>
				</view>
			</view>
			<view class="buy" v-else>
				<button open-type="contact" class="wxBtn server">
					<image src="../../static/server.png" class="serverImg" mode=""></image>
					<view class="serverText">客服</view>
				</button>
				<button open-type="share" class="wxBtn rebeat" v-if="isLogin">
					<image src="../../static/share.png" class="rebeatImg" mode=""></image>
					<view class="rebeatText">邀请返利</view>
				</button>
				<view class="rebeat" @tap="toLogin"  v-else>
					<image src="../../static/share.png" class="rebeatImg" mode=""></image>
					<view class="rebeatText">邀请返利</view>
				</view>
				<view class="oprBtn" @tap="navTo(`../my/bookingClass?aid=${arrangeCourseId}`)">
					预约上课
				</view>
			</view>
		</view>
		<view class="cu-modal" :class="modalName=='Modal'?'show':''">
			<view class="cu-dialog myDialog">
				<view class="boxTop">
					<image class="tePic" :src="teacherInfo.avatarUrl" mode=""></image>
					<view class="teName">
						{{teacherInfo.name}}
					</view>
					<view class="teComment">
						好评教师
					</view>
					<view class="scoreBox">
						
						<image class="star" src="../../static/star1.png" v-for="index1 of teacherInfo.star1" :key="index1" mode=""></image>
						<image class="star" v-if="teacherInfo.star2 > 0" src="../../static/star2.png" mode=""></image>
						<image class="star" src="../../static/star3.png" v-for="index3 of teacherInfo.star3" :key="index3" mode=""></image>
						<text class="scoreText">{{teacherInfo.start}}</text>
					</view>
					<view class="teDesc">
						{{teacherInfo.introduce}}
					</view>
				</view>
				<view class="boxBoo">
					<image @tap="hideModal" class="close" src="../../static/closeModal.png" mode=""></image>
				</view>
			</view>
		</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import moreList from "@/components/moreList.vue"
	import colorTag from '@/components/colorTag.vue'
	import utils from '../../utils/method.js'
	import defaultPage from "@/components/defaultPage.vue"
	import uniCountdown from "@/components/linnian-CountDown/uni-countdown.vue"
	export default{
		components:{
			moreList,
			colorTag,
			defaultPage,
			uniCountdown
		},
		data(){
			return{
				courseId:"",
				descTab:0,  //课程介绍tab
				swiperHeight:0,
				modalName:null,
				playVideo:false,  //播放视频,一旦播放之后值固定为true
				videoContext:null,  //视频播放上下文
				bannerTab:'',  //轮播图tab
				course:null,
				teacherInfo:null,
				schoolList:[],
				commentList:[],
				commentPage:1,
				commentHasMore:true,
				isDrop: false, // 是否从课表里面进来的
				arrangeCourseId: null, // 课程标识id
				userInfo:"",
				type:'',
				trDate:null
			}
		},
		onShareTimeline(opt){
		   return {
		     title: this.course.name,
		     query: "id=" + this.courseId + "&inviteCode=" + this.userInfo.inviteCode,
		     imageUrl:this.course.coverUrl,
		   }
		  },
		methods:{
			onShareAppMessage (){
				return {
				  title: this.course.name,
				  path: "/pages/index/good?id=" + this.courseId + "&inviteCode=" + this.userInfo.inviteCode,
				  imageUrl:this.course.coverUrl,
				}
			},
			toLogin(){
				let _path = "/pages/index/good?id=" + this.courseId + "&drop" + this.isDrop + "&aid=" + this.arrangeCourseId;
				this.$store.commit('jumpPageSet',{
					rejectPath:_path,
					path:_path,
					isTab:false,
				})
				uni.redirectTo({
					url:'/pages/author/author'
				})
			},
			async showModal(e) {
				if(!this.teacherInfo){
					uni.showLoading({
						mask:true
					})
					await this.getTeacherInfo();
					uni.hideLoading()
				}
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
			},
			async getMoreComment(){
				this.commentPage ++;
				await this.getCommentList()
				this.dealDescHeight()
			},
			changeBannerSwiper(e){
				this.bannerTab = e.detail.current;
				if(this.bannerTab > 0){
					this.videoContext && this.videoContext.pause();
				}
			},
			startVideo(){
				if(!this.videoContext){
					this.videoContext = uni.createVideoContext("bannerVideo");
				}
				if(this.bannerTab > 0){
					this.bannerTab = 0;
				}
				this.playVideo = true;
				this.videoContext.play();
			},
			changeDescTab(tab){
				this.descTab = tab;
			},
			changeTabSwiper(e){
				this.descTab = e.detail.current;
				this.dealDescHeight()
			},
			dealDescHeight(){
				setTimeout(()=>{
					let query = uni.createSelectorQuery().in(this);
					query.select('.tabData' + this.descTab).boundingClientRect();
					query.exec((res) => {
						if (!res[0]) {//如果没获取到，再调一次
							this.dealDescHeight();
						}else {
							this.swiperHeight = res[0].height;
						}
					})
				},20)
			},
			toLoaction(item){
				this.$store.commit('locationSet',{
					latitude:item.lat,
					longitude:item.lng,
					title:item.address
				})
				uni.navigateTo({
					url:`/pages/index/location`
				})
			},
			createOrder(){
				this.$store.commit('orderInfoSet',this.course);
				this.$store.commit('orderSchoolListSet',this.schoolList)
				// uni.navigateTo({
				// 	url:"/pages/order/confirm"
				// })
				if(this.isLogin){
					uni.navigateTo({
						url:"/pages/order/confirm?type=1"
					})
				}else{
					this.$store.commit('jumpPageSet',{ path:"/pages/order/confirm?type=1" });
					uni.navigateTo({
						url:"/pages/author/author"
					})
				}
			},
			async fightOrder(){
				if(this.course.buyFlag){
					uni.showToast({
						icon:'none',
						title:'您已参加过该团购，无须再次参团'
					})
				}else{
					this.$store.commit('orderInfoSet',this.course);
					this.$store.commit('orderSchoolListSet',this.schoolList)
					// uni.navigateTo({
					// 	url:"/pages/order/confirm"
					// })
					if(this.isLogin){
						uni.navigateTo({
							url:"/pages/order/confirm?type=2"
						})
					}else{
						this.$store.commit('jumpPageSet',{ path:"/pages/order/confirm?type=2" });
						uni.navigateTo({
							url:"/pages/author/author"
						})
					}
				}
				
			},
			async getData(){
				uni.showLoading({
					title:"加载中...",
					mask:true
				})
				try{
					let res = await this.$http({
						apiName:"courseInfo",
						data:{
							courseId:this.courseId
						}
					})
					this.course = res.data;
					
					if(res.data.groupRuleId!=null && res.data.grouponPrice>0){
						this.type=2
						this.trDate=utils.transToDate(res.data.groupEndTime-res.timestamp)
						
					}else{
						this.type=1
						
					}
					this.course.registerEndTime = utils.unixToDatetime(this.course.registerEndTime);
					if(this.course.introduce){
						this.course.introduce = this.course.introduce.replace(/\<img/gi, "<img class='html_img' ");
					}
					if(this.course.outline){
						this.course.outline = this.course.outline.replace(/\<img/gi, "<img class='html_img' ");
					}
					//线下课获取上课地址,0线下课，1线上课
					if(this.course.type === 0){
						this.getAddrList()
					}
					this.getCommentList()
				}catch(e){
					//TODO handle the exception
				}
				uni.hideLoading()
			},
			async getAddrList(){
				try{
					let res = await this.$http({
						apiName:"schoolList",
						data:{
							courseId:this.courseId
						}
					})
					this.schoolList = res.data
				}catch(e){
					//TODO handle the exception
				}
			},
			async getTeacherInfo(){
				try{
					let res = await this.$http({
						apiName:"teacherInfo",
						data:{teacherId:this.course.teacherId}
					})
					this.teacherInfo = res.data;
					this.teacherInfo.start = this.teacherInfo.start.toFixed(1);
					Object.assign(this.teacherInfo,utils.setTeacherStar(this.teacherInfo.start));
				}catch(e){
					//TODO handle the exception
				}
			},
			async getCommentList(){
				uni.showLoading({
					mask:true
				})
				try{
					let res = await this.$http({
						apiName:"commentList",
						data:{
							courseId:this.courseId,
							page:this.commentPage
						}
					})
					this.commentList = this.commentList.concat(res.data.list);
					this.commentHasMore = res.data.hasNextPage;
				}catch(e){
					//TODO handle the exception
				}
				uni.hideLoading()
			},
			navTo(path){
				uni.navigateTo({
					url: path
				})
			}
		},
		async onLoad(opt) {
			this.courseId = opt.id;
			opt.drop && (this.isDrop = true);
			opt.aid && (this.arrangeCourseId = opt.aid);
			await this.getData();
			//保存别人分享的邀请码
			if(opt.inviteCode){
				this.$store.commit('inviteCodeSet',opt.inviteCode)
			}
			//获取我的邀请码
			if(this.isLogin){
				const {data} = await this.$http({apiName: "getUserInfo"});
				this.userInfo = data;
				this.$store.commit('userInfoSet',data)
			}
		
		},
		mounted() {
			this.dealDescHeight()
		},
		computed:{
			...mapState(['isLogin'])
		}
	}
</script>

<style lang="scss" scoped>
.wrap{
	min-height: 100vh;
	background-color: #fff;
	padding-bottom: 100rpx;
	box-sizing: border-box;
	.banner{
		position: relative;
		.swiperBox{
			height: 500rpx;
			.bannerVideo{
				width: 100%;
				height: 500rpx;
			}
			.bannerImg{
				width: 100%;
				height: 500rpx;
			}
			.nmBox{
				position: absolute;
				right: 32rpx;
				bottom: 32rpx;
				padding: 2rpx 18rpx;
				background-color: #73757A;
				border-radius: 22rpx;
				color: #fff;
				font-size: 28rpx;
			}
		}
		.videoBox{
			position: absolute;
			left: 0;
			width: 100%;
			bottom: 32rpx;
			.videoBox2{
				display: flex;
				border-radius: 30rpx;
				background-color: rgba($color: #ffffff, $alpha: 0.8);
				padding: 10rpx;
				justify-content: center;
				width: fit-content;
				margin: auto;
				align-items: center;
				.videoImg{
					width: 40rpx;
					height: 40rpx;
				}
				.videoLong{
					margin-left: 4rpx;
					color: #606266;
					font-size: 24rpx;
				}
			}
			
		}
	}
	.info{
		padding: 32rpx;
		.i0{
			display: flex;
			margin-bottom: 10rpx;
			.t1{
				font-size: 29rpx;
				font-weight: 500;
				color: #909399;
				margin-left: 10rpx;
			}
			.t2{
				margin-left: 20rpx;
				font-size: 29rpx;
				font-weight: 500;
				color: #F72C2C;
			}
		}
		.i1{
			// display: flex;
			align-items: center;
			.it1{
				border-radius:24rpx 0 24rpx 24rpx;
				background-color: #3C92EF;
				color: #fff;
				font-size: 24rpx;
				padding: 4rpx 12rpx;
				margin-right: 10rpx;
			}
			.it2{
				// margin-left: 16rpx;
				color: #303133;
				font-weight: bold;
				font-size: 36rpx;
			}
		}
		.i2{
			margin-top: 16rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.it1{
				display: flex;
				align-items: center;
				.it1p1{
					width: 88rpx;
					height: 34rpx;
				}
				.it1p2{
					margin-left: 8rpx;
					color: #F72C2C;
					font-size: 36rpx;
					font-weight: bold;
				}
				.it1p3{
					margin-left: 8rpx;
					color: #C0C4CC;
					font-size: 24rpx;
					text-decoration: line-through;
				}
			}
			.it2{
				
			}
		}
		.i3{
			margin-top: 16rpx;
			color: #606266;
			font-size: 28rpx;
			display: flex;
			align-items: center;
			.i2Icon{
				margin-left: 4rpx;
				width: 36rpx;
				height: 36rpx;
			}
		}
		.i4{
			margin-top: 30rpx;
			.imgList{
				display: flex;
				align-items: center;
				.fpNumstImg{
					width: 50rpx;
					height: 50rpx;
					margin-left: -15rpx;
					.img{
						width: 100%;
						height: 100%;
						border-radius: 50%;
					}
					
				}
				.t1{
					font-size: 29rpx;
					font-weight: 500;
					color: #909399;
					margin-left: 10rpx;
				}
				.t2{
					font-size: 29rpx;
					font-weight: 500;
					color: #F72C2C;
				}
				
			}
		}
	}
	.cont{
		margin-top: 18rpx;
		.contTile{
			height: 40rpx;
			line-height: 28rpx;
			color: #303133;
			font-size: 32rpx;
			font-weight: bold;
			position: relative;
			padding-left: 32rpx;
		}
		.contTile::before{
			content: "";
			width: 8rpx;
			height: 40rpx;
			border-radius:0px 200rpx 200rpx 0px;
			background-color: #FDC623;
			position: absolute;
			left: 0;
			top: -6rpx;
		}
		.positionList{
			padding: 20rpx 32rpx;
			.plItem{
				.pText{
					color: #606266;
					font-size: 28rpx;
				}
				.rightIcon{
					width: 36rpx;
					height: 36rpx;
					vertical-align: bottom;
				}
			}
		}
		.deadTime{
			padding: 26rpx 32rpx;
			color: #F72C2C;
			font-size: 32rpx;
		}
	}
	.courseData{
		margin-top: 10rpx;
		.tabs{
			border-bottom: 2rpx solid #F3F3F3;
			padding-left: 32rpx;
			padding-right: 32rpx;
			display: flex;
			.tabItem{
				margin-right: 50rpx;
				color: #909399;
				font-size: 32rpx;
				padding-bottom: 16rpx;
			}
			.tabItem.active{
				color: #FDC623;
				border-bottom: 4rpx solid #FDC623;
			}
		}
		.tabSwiper{
			padding: 32rpx;
			box-sizing: content-box;
			.tabData2{
				.commentItem{
					display: flex;
					margin-bottom: 18rpx;
					.commentItemPic{
						font-size: 0;
						.commentItemPicImg{
							width: 40rpx;
							height: 40rpx;
							border-radius: 50%;
						}
					}
					.comInfo{
						flex: 1;
						margin-left: 10rpx;
						.comTitle{
							color: #303133;
							font-size: 28rpx;
							font-weight: bold;
						}
						.comDesc{
							margin-top: 10rpx;
							color: #909399;
							font-size: 26rpx;
						}
					}
				}
			}
		}
	}
	.opration{
		position: fixed;
		bottom: 0;
		height: 96rpx;
		border-top: 2rpx solid #F3F3F3;
		left: 0;
		width: 100%;
		.buy{
			padding-left: 32rpx;
			display: flex;
			align-items: center;
			background-color: #fff;
			
			.server{
				text-align: center;
				.serverImg{
					width: 36rpx;
					height: 32rpx;
				}
				.serverText{
					color: #626468;
					font-size: 24rpx;
				}
			}
			.rebeat{
				text-align: center;
				margin-left: 30rpx;
				.rebeatImg{
					width: 34rpx;
					height: 32rpx;
				}
				.rebeatText{
					color: #626468;
					font-size: 24rpx;
					margin-top: 4rpx;
				}
			}
			.oprBtn{
				height: 100%;
				flex: 1;
				margin-left: 30rpx;
				background-color: #FDC623;
				text-align: center;
				font-weight: 600;
				line-height: 96rpx;
				color: #303133;
				font-size: 36rpx;
			}
			
			.btns{
				background-color: #fff;
				display: flex;
				justify-content: space-around;
				height: 100%;
				flex: 1;
				margin-left: 40rpx;
				.optbtn{
					width: 220rpx;
					height: 76rpx;
					border-radius: 40rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					.desc{
						font-size: 22rpx;
						font-weight: 500;
						color: #FFFEFA;
					}
					.price{
						font-size: 32rpx;
						font-weight: 500;
						color: #FFFFFF;
					}
				}
				.dandubuy{
					background: #FDC623;
				}
				.fight{
					background: #F72C2C;
				}
				
			}
		}
	}
	.myDialog{
		width: 580rpx;
		text-align: center;
		background: transparent;
		.boxTop{
			padding: 86rpx 46rpx;
			background-color: #fff;
			border-radius: 12rpx;
			.tePic{
				width: 120rpx;
				height: 120rpx;
				border-radius: 50%;
			}
			.teName{
				color: #303133;
				font-size: 36rpx;
				font-weight: bold;
				margin-top: 20rpx;
			}
			.teComment{
				color: #FDC623;
				font-size: 28rpx;
				margin-top: 16rpx;
			}
			.scoreBox{
				margin-top: 16rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				.scoreText{
					color: #FDC623;
					font-size: 28rpx;
				}
				.star{
					margin-right: 16rpx;
					width: 32rpx;
					height: 32rpx;
				}
			}
			.teDesc{
				margin-top: 40rpx;
				color: #606266;
				font-size: 28rpx;
				line-height: 44rpx;
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
}
</style>
