<template>
	<view>
		<view class="calendar">
			<view class="uni-calendar__header">
				<view class="uni-calendar__header-btn-box" @tap="changeDate('MU')">
					<view class="uni-calendar__header-btn uni-calendar--left"></view>
				</view>
				<text class="uni-calendar__header-text">{{oMonth}}</text>
				<view class="uni-calendar__header-btn-box" @tap="changeDate('MD')">
					<view class="uni-calendar__header-btn uni-calendar--right"></view>
				</view>
				<image src="../../static/my/rili.png" class="backToday" mode="" @tap="changeDate('')"></image>
			</view>
			<view class="calendarhead">
				<view class="tr">
					<text>日</text>
					<text>一</text>
					<text>二</text>
					<text>三</text>
					<text>四</text>
					<text>五</text>
					<text>六</text>
				</view>
			</view>
			<swiper class="swiper" :current="current" @change="change" circular="true" :style="'height:' + sheight + 'px'">
				<swiper-item v-for="(sitem, sindex) in swiper" :key="sindex">
					<view class="week" v-for="(index,i) in normalDateList" :key="i">
						<view class="tr height">
							<block v-for="(noritem, idx) in normalDateList[i]" :key="idx">
								<text :class="{ aorange: idx == 0 || idx == 6, agreen: noritem.isToday }" @tap="choose(noritem.text, i,idx)">{{ noritem.text }}</text>
							</block>
						</view>
						<!-- //农历 -->
						<!-- <view class="tr tr2">
							<block v-for="(noritem, idx) in normalDateList[i]" :key="idx">
								<text :class="{ aorange: idx == 0 || idx == 6, agreen: noritem.isToday }" @tap="choose(noritem.text, i)">{{ noritem.text}}</text>
							</block>
						</view> -->
						<view class="tr tr2">
							<block v-for="(lunitem, idx) in lunarDateList[i]" :key="idx">
								<text  @tap="choose(lunitem.days, i)" v-if="lunitem.text != 0 && lunitem.text != undefined">{{ lunitem.text + '节课' }}</text>
								<text v-else></text>
							</block>
						</view>
					</view>
				</swiper-item>
			</swiper>
			<view class="show" v-if="show" @tap="toggle">
				<view class="uni-calendar__header-btn uni-calendar--top"></view>
			</view>
			<view class="show" v-else @tap="toggle">
				<view class="uni-calendar__header-btn uni-calendar--bootom"></view>
			</view>
		</view>

		<view class="panel">
			<view class="">
				<text>{{oDate}}</text>
				<text>{{oWeek}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import Calendar from './calendar.js';
	export default {
		props:{
			lessonsArrs:{
				type:Array,
				default: () => []
			}
		},
		data() {
			return {
				sheight: 400,
				Calendar: {},
				normalDateList: [],
				lunarDateList: [],
				flag: true,
				init: false,
				oDate: '',
				oMonth: '',
				oWeek: '',
				festival: '',
				swiper: [1, 2, 2],
				current: 1,
				show: true,
				allDateLong: [0, 1, 2, 3, 4, 5],
				showItemIndex: 0,
				calendarList:[],
				arrs:[]
			};
		},
		created() {
			Calendar.initial();
			this.changeDateStatus();
		},
		watch: {
			init(val) {
				this.normalDateList = Calendar.normalDateList;
				this.calendarList = Calendar.lunarDateList;
				this.oDate = Calendar.oDate;
				this.oMonth = Calendar.oMonth;
				this.oWeek = Calendar.oWeek;
				let myDay = this.oDate.split('-');
				this.$emit('getDay',myDay);
				this.festival = Calendar.festival;
				this.showItemIndex = Calendar.showItemIndex;
				this.doToggle();
				this.getSwiperHeight();
				this.changeObj();
			},
			lessonsArrs(newVal){
				let i = 0;
				this.arrs = newVal;
				this.calendarList.forEach(outer => {
					outer.forEach(inside => {
						inside['text'] = newVal[i++];
					})
				})
				this.lunarDateList = this.calendarList;
			}
		},
		methods: {
			getSwiperHeight() {
				this.sheight = 54 * this.normalDateList.length;
			},
			toggle() {
				if (this.show) {
					this.show = false;
					this.normalDateList = [this.normalDateList[this.showItemIndex]];
					this.lunarDateList = [this.lunarDateList[this.showItemIndex]];
					this.sheight = 60;
				} else {
					this.show = true;
					this.getSwiperHeight();
					this.changeDateStatus();
				}
			},
			doToggle() {
				if (!this.show) {
					this.normalDateList = [this.normalDateList[this.showItemIndex]];
					this.lunarDateList = [this.lunarDateList[this.showItemIndex]];
					this.sheight = 60;
				}
			},
			changeObj(){
				let i = 0;
				this.calendarList.forEach(outer => {
					outer.forEach(inside => {
						inside['text'] = this.arrs[i++];
					})
				})
				this.lunarDateList = this.calendarList;
			},
			change(e) {
				let Bt = this.current;
				let Nt = e.detail.current;
				if (Bt == 0) {
					if (Nt == 2) {
						this.resMonth();
						this.current = Nt;
						return;
					}
				}
				if (Bt == 2) {
					if (Nt == 0) {
						this.addMonth();
						this.current = Nt;
						return;
					}
				}
				if (Nt > Bt) {
					this.addMonth();
				} else {
					this.resMonth();
				}
				this.current = Nt;
			},
			addMonth() {
				if (!this.show) {
					this.changeDate('WD');
				} else {
					this.changeDate('MD'); 
				}
			},
			resMonth() {
				if (!this.show) {
					this.changeDate('WU');
				} else {
					this.changeDate('MU');
				}
			},
			choose(item, index,idx) {
				if (item !== undefined && item !== " ") {
					this.normalDateList.forEach(item => {
						item.forEach(thunk => thunk['isToday'] = false)
					})
					this.normalDateList[index][idx].isToday = true;
					const myDay = this.oDate.split("-");
					myDay[2] = item;
					
					this.$emit('getDay',myDay);
					Calendar.setToday(item);
					this.oDate = Calendar.oDate;
					this.oWeek = Calendar.oWeek;
					this.showItemNum = index;
				}

			},
			changeDateStatus() {
				if (this.init) {
					this.init = false;
					
				} else {
					this.init = true;
					
				}
			},

			changeDate(type) {
				this.changeDateStatus();

				Calendar.pushBtm(type);
			}
		}
	};
</script>

<style lang="less" scoped>
	.aorange {
		
	}
	.swiper{
		transition: height .2s linear; 
	}
	.agreen {
		font-size: 28rpx;
		color: #FFFFFF !important;
		font-weight: bold;
		position: relative;
		z-index: 5;
		&::after{
			content: "";
			position: absolute;
			z-index: -3;
			width: 50rpx;
			height: 50rpx;
			background-color: #FDC623;
			border-radius: 50%;
		}
	}

	.one {
		font-size: 16px;
		color: #000;
		font-weight: normal;
	}

	.spc {
		color: #ff5f07;
	}

	.festival {
		color: #000;
		width: 100%;
		padding: 2px;
		margin: 0 auto;
		height: 25px;
	}

	.datedetail {
		width: 100%;
		border: 0;
		padding: 2px;
		margin: 0;
		background-color: #e8f5f9;
		text-align: center;
	}

	.datedetail span {
		color: #23460f;
	}

	.detail {
		width: 100%;
		margin: 0;
		border: 1px solid #a6a8ab;
	}

	.date {
		clear: both;
		padding-top: 0 !important;
		padding-top: 12px;
		width: 490px;
		height: 40px !important;
		height: 28px;
		font-size: 16px;
		border: 1px solid #a6a8ab;
		background-color: #e6f0fa;
	}

	.calendar {
		float: left;
		text-align: center;
		width: 100%;
		border-top: 0;
		height: auto;
	}

	.calendarhead {
		border: 0;
		padding: 0;
		margin: 0;
		color: #909399;
		width: 100%;
		flex-direction: column;
	}

	.calendarhead .tr {
		width: 100%;
		display: flex;
		flex-direction: row;
	}

	.calendarhead text {
		flex: 1;
		font-size: 28rpx;
		padding: 1px;
		text-align: center;
	}

	.panel {
		margin: 0;
		padding: 10px;
		width: 100%;
		display: flex;
		flex-direction: row;
	}

	.panel view {
		padding: 2px;
		font-size: 12px;
		cursor: pointer;
		font-size: 32rpx;
		color: #FDC623;
		font-weight: 500;
		text{
			&:first-of-type{
				margin-right: 28rpx;
			}
		}
	}

	.week {
		width: 100%;
		display: flex;
		background-color: #ffffff;
		border: 0;
		padding: 0;
		margin: 0;
		flex-direction: column;
	}

	.week .tr {
		width: 100%;
		display: flex;
		flex-direction: row;
		&.height{
			text{
				height: 60rpx;
			}
		}
	}

	.week text {
		flex: 1;
		padding: 1px;
		margin: 0;
		font-size: 28rpx;
		height: 20px;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tr2 text {
		font-size: 24rpx;
		color: #F72C2C;
	}

	.uni-calendar__header {
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height: 50px;
	}

	.uni-calendar__header-text {
		text-align: center;
		width: 100px;
		font-size: 32rpx;
		color: #303133;
		font-weight: 550;
	}

	.uni-calendar__header-btn-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 50px;
		height: 50px;
	}

	.uni-calendar__header-btn {
		width: 10px;
		height: 10px;
		border-left-color: #909399;
		border-left-style: solid;
		border-left-width: 2px;
		border-top-color: #909399;
		border-top-style: solid;
		border-top-width: 2px;
	}

	.uni-calendar--left {
		transform: rotate(-45deg);
	}

	.uni-calendar--right {
		transform: rotate(135deg);
	}
	.show{
		text-align: center;
		padding-bottom: 20rpx;
		padding-top: 10rpx;
	}
	.uni-calendar--top {
		transform: rotate(45deg);
		margin: auto;
	}

	.uni-calendar--bootom {
		transform: rotate(-135deg);
		margin: auto;
	}
	.backToday{
		width: 38rpx;
		height: 38rpx;
		position: absolute;
		right: 36rpx;
	}
	
</style>
