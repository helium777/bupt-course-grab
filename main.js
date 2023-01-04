// ----- 需要配置的参数 -----
/* 需要抢的课程名称, 需要和教务系统上的课程名称完全一致 */
let COURSES = [
  "物联网技术",
  "移动互联网技术及应用",
  "并行计算与GPU编程",
  "无线传感器网络（高新标杆课）",
  "下一代Internet技术与协议",
  "信息与知识获取",
  "操作系统课程设计",
  "编译原理与技术课程设计",
  "机器学习",
  "大数据技术基础",
  "Linux开发环境及应用",
];
/* 需要抢的课程分组名称, 可以用于体育专项的抢课, 需要完全一致 */
let COURSE_GROUPS = [
  "男84游泳",
];
/* 抢课间隔, 单位毫秒. 推荐数值: 抢课 100ms, 捡漏 500ms */
let INTERVAL_MS = 100;
// ------------------------

// 以下不需要修改

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
        if (COURSES.includes(course.kcmc)) {
          targetCourses.push(course);
        } else if (COURSE_GROUPS.includes(course.fzmc)) {
          targetCourses.push(course);
        }
      }
    });
  }
};

start();
