import Ember from 'ember';

export function formatDecimal(params) {
  let num = params[0];
  let val = Math.round(num*100)/100 + "";
  let arr = val.split(".");
  if(arr.length==2){
    if(arr[1].length==1){
      return val+="0";
    }
    else{
      return val;
    }
  }
  else{
    return val+".00";
  }
}

export default Ember.Helper.helper(formatDecimal);
