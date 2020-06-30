<template>
	<view class="swiper-top flex align-center justify-between">
		<view class="s-left flex align-center" @tap.stop="changeCurrent('sub')"> 
			<image :src="leftImg" ></image>
			前一天
		</view>
		<view class="s-mid flex align-center" @tap.stop="navTo">
			<image :src="midImg" mode=""></image>
			{{dateArr[1].time}}({{dateArr[1].week}})
		</view>
		<view class="s-right flex align-center" @tap.stop="changeCurrent('add')">
			后一天
			<image :src="leftImg" class="rotate" ></image>  
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				leftImg: require('../static/my/swleft.png'),
				midImg: require('../static/my/swrl.png'),
				dateArr:[],
				today:[],
				diff: 0,
			}
		},
		created() {
			this.getYearMonDay();
		},
		methods:{
			changeCurrent(type){
				if(type === 'sub'){  // 前一天
					this.today[2] -= 1;
					this.diff -= 1;
					if(this.diff > 0){
						this.$emit('type',2);
					}else if(this.diff === 0){
						this.$emit('type',0);
					}else{
						this.$emit('type',1);
					}
					this.$emit('day',Math.abs(this.diff));
				}else{ // 下一天
					this.today[2] += 1;
					this.diff += 1;
					if(this.diff < 0){ // 如果天数小于今天 
						this.$emit('type',1);
					}else if(this.diff === 0){
						this.$emit('type',0);
					}else{
						this.$emit('type',2);
					}
					this.$emit('day',Math.abs(this.diff));
				}
				let {y,m,d} = this.judeeYMD(...this.today);
				this.today[0] = y;
				this.today[1] = m;
				this.today[2] = d;
				this.$emit('change'); // 改变完成之后回调
				this.getDateArr(y,m,d);
			},
			getDateArr(year,month,day){ 
				const beforeDay = day - 1;
				const afterDay = day + 1;
				const dateArr = [];
				dateArr.push(this.getDateObj(year,month,beforeDay)) // 2020, 3, 8
				dateArr.push(this.getDateObj(year,month,day)); // 2020, 3, 9
				dateArr.push(this.getDateObj(year,month,afterDay)) // 2020, 3, 10
				this.dateArr = dateArr;
			},
			judeeYMD(year,month,day){ // 校验年月日 返回年月日
				const date = new Date(year,month,day);
				let y = '',m = '',d = '';
				if(date.getFullYear() !== year){ // 如果年份不相同
					if(date.getFullYear() > year){ // 如果是 12 月 31 号 的下一天 ，年份要加一
						y = year + 1;
						m = 0; // 1月
						d = 1; // 第一天
					}else{  // 可能是 1月1号的前一天，则年份减一
						y = year - 1;
						m = 11; // 12月
						d = 31; // 最后一天
					}
				}else if(date.getMonth() !== month){ // 如果年份相同，还有月份不同的情况
					if(date.getMonth() > month){
						y = year;
						m = month + 1;
						d = 1;
					}else{
						y = year;
						m = month - 1;
						if(m === 0 || m === 2 || m === 4 || m === 6 || m === 7 || m === 9 || m === 11){ 
							d = 31;
						}else if( m === 1){ // 二月
							if(this.isleapYear(year)){ // 如果是闰年
								d = 29;
							}else{
								d = 28;
							}
						}else{
							d = 30
						}
					}
				}else{
					y = year;
					m = month;
					d = day;
				}
				return {y,m,d}
			},
			// 2020-03-26(周四) 最终拿到这两个数据
			getDateObj(year,month,day){
				let {y,m,d} = this.judeeYMD(year,month,day);
				const week = new Date(y,m,d).getDay();
				const arr = ['周日','周一','周二','周三','周四','周五','周六'];
				m = (m + 1).toString().padStart(2,0);
				d = d.toString().padStart(2,0);
				return {
					time: `${y}-${m}-${d}`,
					week: arr[week]
				}
			},
			getYearMonDay(){  // 得到今天的年月日
				const date = new Date();
				const year = date.getFullYear();
				const month = date.getMonth();
				const day = date.getDate();
				this.$emit('getToady',day);
				this.today = [year,month,day];
				this.getDateArr(year,month,day)
			},
			isleapYear(year){ // 判断是不是闰年
				return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
			},
			navTo(){
				this.$emit('navTo');
			}
		}
	}
</script>

<style lang="scss" scoped>
	.swiper-top{
		width: 100%;
		height: 40rpx;
		margin-bottom: 19rpx;
		margin-top: 28rpx;
		.s-left,.s-right{
			image{width: 14rpx;height: 22rpx;margin-top: 2rpx;}
			font-size: 26rpx;
			color: #C0C4CC;
		}
		.s-left{
			image{
				margin-right: 12rpx;
			}
		}
		.s-mid{
			image{width: 40rpx;height: 40rpx;margin-right: 10rpx;}
			font-size: 28rpx;
			color: #F72C2C;
		}
		.s-right{
			image{
				margin-left: 12rpx;
				transform: rotateY(180deg);
			}
		}
	}
</style>
