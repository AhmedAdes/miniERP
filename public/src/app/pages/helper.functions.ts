export function handleDate(day: Date) {
  // var day = new Date(date);
  var yyy = day.getFullYear();
  var mm = day.getMonth() + 1; // January is 0
  var dd = day.getDate();
  return yyy + '-' + pad('00', mm, true) + '-' + pad('00', dd, true);
}
export function handleTime(time) {
  var tt = new Date(time);
  var hh = tt.getHours();
  var mm = tt.getMinutes();
  return pad('00', hh, true) + ':' + pad('00', mm, true);
}

export function pad(padding, str, padLeft) {
  if (typeof str === 'undefined') {
    return padding;
  }
  if (padLeft) {
    return (padding + str).slice(-padding.length);
  } else {
    return (str + padding).substring(0, padding.length);
  }
}
