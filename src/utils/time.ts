export function getTime(){
    const time = new Date().getHours()
    if(time <= 11){
        return '早上'
    }else if(time >11 && time<=14){
        return '中午'
    }else if(time>14 && time<=18){
        return '下午'
    }else return '晚上'
}