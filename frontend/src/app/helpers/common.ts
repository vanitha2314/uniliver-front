export const merge = (args: any[]) => {
  const target: any = {};

  const merger = (obj: any) => {
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        if (Object.prototype.toString.call(obj[prop]) === '[object Object]') {
          target[prop] = merge([target[prop], obj[prop]]);
        }
        // else if (Object.prototype.toString.call(obj[prop]) === '[object Array]') {
        //   if (target[prop]) {
        //     if () {

        //     }
        //     target[prop].push(obj[prop]);
        //   } else {
        //     target[prop] = obj[prop];
        //   }
        // }
        else {
          target[prop] = obj[prop];
        }
      }
    }
  };

  for (let i = 0; i < args.length; i++) {
    merger(args[i]);
  }

  return target;
};
