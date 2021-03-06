exports.getCurrentFormattedTime = () => {
	var date = new Date();
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var formattedTime = hours + ':' + minutes.substr(minutes.length-2) + ':' + seconds.substr(seconds.length-2);
    return formattedTime;
};

exports.endsWith = (str, suffix) => {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
};