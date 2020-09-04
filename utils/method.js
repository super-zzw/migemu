import store from '../store'
import { upLoadImg } from './request.js';
export default{
	wxLogin(){
		return new Promise((resolve,reject) => {
			uni.login({
			  provider: 'weixin',
			  success: function (res) {
				if (res.code) {
				    uni.getUserInfo({
				    	provider: 'weixin',
				    	success: function(infoRes) {
							let result = {}
							Object.assign(result,infoRes.userInfo,{jsCode:res.code},{inviteCode:store.state.inviteCode});
							resolve(result);
				    	},
				    	fail(res) {
							resolve(false)
						}
				    });
				}else{
					resolve(false)
				}
			  },
			  fail:function(res){resolve(false)}
			})
		})
	},
	copy(data){
		uni.setClipboardData({
			data: data,
			success() {
				uni.showToast({
					title: "复制成功",
				})
			},
			
		});
	},
	//登录成功设置
	setSesion(session){ 
		uni.setStorageSync('session',session)
	},
	//退出登录
	rmData(){
		uni.removeStorageSync('session');  
		store.commit('isLoginSet',false);
	},
	//数据校验
	judgeData(arr) {
		let res = true;
		for (let item of arr) {
			if (item.data.length == 0) {
				res = false;
				uni.hideLoading();
				setTimeout(_=>{
					uni.showToast({
						icon: 'none',
						title: item.info,
						duration: 2000
					});
				})
				break
			}
		}
		return res
	},
	//将时间戳转化为格式化日期和时间
	unixToDatetime(unix,x=1){
		  var date = null;
		  if(unix){
		    date = new Date(unix);
		  }else {
		    date = new Date;
		  }
		  let Y = date.getFullYear() + '-';
		  let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
		  let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
		  let h = date.getHours() < 10 ? '0' + date.getHours()  + ':' : date.getHours() + ':';
		  let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
		  let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
		  if(x === 1){return (Y+M+'-'+D+h+m);}//2017-09-29 21:30
		  if(x === 4){return (Y+M+'-'+D+h+"00");}//2017-09-29 21:00
		  if(x === 2){return (Y+M+'-'+D+"00"+":"+"00");}//2019-09-29 00:00
		  if(x === 3){return (Y+M+'-'+D);}//2019-09-29
		  if(x === 5){return (Y+M+'-'+"01");}//2019-09-01
		  if(x === 6){return (Y+M);}//2019-09
		  if(x === 7){return (Y+M+'-'+D+h+m+':'+s);}//精确到秒
		  if(x === 8){return (h+m);}//21:30
		  if(x === 0){//取上一个月
		    var Y2 = date.getFullYear(); //获取当前日期的年份
		    var M2 = parseInt(date.getMonth());
		    if (M2 === 1) {//如果是1月份，则取上一年的12月份
		      Y2 = parseInt(Y2) - 1;
		      month2 = 12;
		    }
		    return (Y2+'-'+M2);
		  }
	},
    transToDate(data) {
    	var days = parseInt(data / (1000 * 60 * 60 * 24));
    	var hours = parseInt((data % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    	var minutes = parseInt((data % (1000 * 60 * 60)) / (1000 * 60));
    	var seconds = (data % (1000 * 60)) / 1000;
    	return {
    		d:days,
    		h:hours,
    		m:minutes,
    		s:seconds
    	};
    },
	// 计算出多少岁几个月了
	getOld(str) {
		var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})/);
		if (r == null) return false;
	
		var d = new Date(r[1], r[3] - 1, r[4]);
		var returnStr = '输入的日期格式错误！';
	
		if (d.getFullYear() == r[1] && d.getMonth() + 1 == r[3] && d.getDate() == r[4]) {
			var date = new Date();
			var yearNow = date.getFullYear();
			var monthNow = date.getMonth() + 1;
			var dayNow = date.getDate();
	
			var largeMonths = [1, 3, 5, 7, 8, 10, 12], //大月， 用于计算天，只在年月都为零时，天数有效
				lastMonth = monthNow - 1 > 0 ? monthNow - 1 : 12, // 上一个月的月份
				isLeapYear = false, // 是否是闰年
				daysOFMonth = 0; // 当前日期的上一个月多少天
	
			if ((yearNow % 4 === 0 && yearNow % 100 !== 0) || yearNow % 400 === 0) {
				// 是否闰年， 用于计算天，只在年月都为零时，天数有效
				isLeapYear = true;
			}
	
			if (largeMonths.indexOf(lastMonth) > -1) {
				daysOFMonth = 31;
			} else if (lastMonth === 2) {
				if (isLeapYear) {
					daysOFMonth = 29;
				} else {
					daysOFMonth = 28;
				}
			} else {
				daysOFMonth = 30;
			}
	
			var Y = yearNow - parseInt(r[1]);
			var M = monthNow - parseInt(r[3]);
			var D = dayNow - parseInt(r[4]);
			if (D < 0) {
				D = D + daysOFMonth; //借一个月
				M--;
			}
			if (M < 0) {
				// 借一年 12个月
				Y--;
				M = M + 12; //
			}
	
			if (Y < 0) {
				returnStr = '出生日期有误！';
			} else if (Y === 0) {
				if (M === 0) {
					returnStr = D + '天';
				} else {
					returnStr = M + '个月';
				}
			} else {
				if (M === 0) {
					returnStr = Y + '岁';
				} else {
					returnStr = Y + '岁' + M + '个月';
				}
			}
		}
		return returnStr;
	},

	//根据教师评分设置显示星级
	setTeacherStar(score){
		let _obj = {}
		_obj["star1"] = Math.floor(score);
		_obj["star2"] = (score % 1 > 0) ? 1 : 0;
		_obj["star3"] = 5 - _obj["star1"] - _obj["star2"];
		return _obj;
	},
	//处理拒绝的跳转
	dealRejectPage(){
		console.log(store.state.jumpPage);
		if(!store.state.jumpPage.rejectPath){
			uni.switchTab({
				url:"/pages/index/index"
			})
		}else{
			if(store.state.jumpPage.isTab){
				uni.switchTab({
					url:store.state.jumpPage.rejectPath
				})
			}else{
				uni.redirectTo({
					url:store.state.jumpPage.rejectPath
				})
			}
		}
	},
	//处理登陆成功的跳转
	dealResolvePage(){
		if(!store.state.jumpPage.path){
			uni.reLaunch({
				url:"/pages/index/index"
			})
		}else{
			if(store.state.jumpPage.isTab){
				uni.reLaunch({
					url:store.state.jumpPage.path
				})
			}else{
				uni.reLaunch({
					url:store.state.jumpPage.path
				})
			}
		}
	},
	//图片上传
	uploadFile(){
		return new Promise((resolve, reject)=>{
			uni.chooseImage({
			    count: 1, //默认9
			    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
			    sourceType: ['album','camera'], //从相册选择
			    success: function (res) {
					upLoadImg({
						apiName:"upLoadFile",
						filePath:res.tempFilePaths[0],
						name:"file"
					}).then(ret => {
						resolve(ret.data)
					}).catch(_ => {
						reject(false)
					})
			    },
				fail(err) {
					reject(false);
					console.log(err)
				}
			});
		})
	},
	//视频上传
	uploadVideo(compressed = true){
		return new Promise((resolve, reject)=>{
			uni.chooseVideo({
				count: 1,
				compressed:compressed,  //是否压缩,默认压缩
			    sourceType: ['album','camera'], //从相册选择
			    success: function (res) {
					console.log("文件:",res)
					upLoadImg({
						apiName:"upLoadFile",
						filePath:res.tempFilePath,
						name:"file"
					}).then(ret => {
						resolve(ret.data)
					}).catch(_ => {
						reject(false)
					})
			    },
				fail:function(err){
					reject(false)
					console.log(err)
				}
			});
		})
	},
	//录音时长格式化
	exRecordTime(time){
		//分钟
		let minute = time / 60;
		let minutes = parseInt(minute);
		if (minutes < 10) {
		  minutes = "0" + minutes;
		}
		//秒
		let second = time % 60;
		let seconds = parseInt(second);
		if (seconds < 10) {
		  seconds = "0" + seconds;
		}
		let allTime = `${minutes}:${seconds}`;
		return allTime;
	},
	chooseImg(len){
		return new Promise((resolve,reject) => {
			if(len == 0){
				uni.showToast({
					title: `最多上传${this.maxUploadImg}张图片`,
					icon: "none"
				})
				reject(false);
			}
			uni.chooseImage({
				count: len ,
				success(res) {
					resolve(res.tempFilePaths);
				}
			})
		})
	},
	//homeShare
	homeShare(imageUrl){
		return {
			title:"不只教英文的中外国际双师课堂",
			path:"/pages/index/index",
			imageUrl:imageUrl
		}
	}
}