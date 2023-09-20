module.exports.getTimeDay = (lang) => {
  let dateObj = new Date();
  let hour = dateObj.getHours();

  let momento_dia = "";
  if (hour >= 0 && hour <= 11) {
    if (lang == "es") {
      momento_dia = "buen día";
    }
    if (lang == "en") {
      momento_dia = "good morning";
    }
  } else if (hour >= 12 && hour <= 19) {
    if (lang == "es") {
      momento_dia = "buena tarde";
    }
    if (lang == "en") {
      momento_dia = "good afternoon";
    }
  } else {
    if (lang == "es") {
      momento_dia = "buena noche";
    }
    if (lang == "en") {
      momento_dia = "good night";
    }
  }

  return momento_dia;
};
