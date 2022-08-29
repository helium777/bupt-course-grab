let COURSES_NAME_KEYWORDS = [];
let COURSES_GROUP_KEYWORDS = [["男", "乒乓球"]];
let INTERVAL_MS = 1000;

let mainInterval;
let targetCourses = [];

const start = () => {
  mainInterval = setInterval(handler, INTERVAL_MS);
  console.log("--- start grabbing courses ---");
};

const stop = () => {
  clearInterval(mainInterval);
  console.log("--- stop grabbing courses ---");
};

const handler = () => {
  if (targetCourses.length === 0) {
    getCourses();
  }

  console.log(
    `--- found ${targetCourses.length} courses ---`
  );

  let paths = [
    "/jsxsd/xsxkkc/xxxkOper", // 选修
    "/jsxsd/xsxkkc/bxxkOper", // 必修
  ];
  for (let course of targetCourses) {
    for (let path of paths) {
      $.get(path, course, (data) => {
        console.log(data);
      });
    }
  }
};

const getCourses = () => {
  let params = {
    sEcho: 1,
    iColumns: 11,
    iDisplayStart: 0,
    iDisplayLength: 999,
  };
  let paths = [
    "/jsxsd/xsxkkc/xsxkBxxk", // 必修
    "/jsxsd/xsxkkc/xsxkXxxk", // 选修
    "/jsxsd/xsxkkc/xsxkGgxxkxk", // 公选
  ];

  for (let path of paths) {
    $.post(path, params, (data) => {
      let aaData = $.parseJSON(data).aaData;
      for (let course of aaData) {
        let flag = false;
        for (let keywords of COURSES_NAME_KEYWORDS) {
          if (keywords.every((keyword) => course.kcmc.includes(keyword))) {
            flag = true;
            break;
          }
        }
        if (!flag) {
          for (let keywords of COURSES_GROUP_KEYWORDS) {
            if (keywords.every((keyword) => course.fzmc.includes(keyword))) {
              flag = true;
              break;
            }
          }
        }
        if (flag) {
          targetCourses.push(course);
        }
      }
    });
  }
};

start();
