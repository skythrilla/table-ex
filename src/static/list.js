const mainTable = document.querySelector('.mainTable');
const examBtn = document.querySelector('.examBtn');
const studentBtn = document.querySelector('.studentBtn');
const trheader = document.querySelector('.trheader');
const domain = 'http://localhost:4000/api/v1/';

getStudents();
studentBtn.focus();

studentBtn.addEventListener('click', (event) => {
  event.preventDefault();
  getStudents();
});

async function getStudents() {
  let studentResult;
  let studentArray = [];
  mainTable.innerHTML = 'Loading...';
  const students = await axios.get(`${domain}students`);
  mainTable.innerHTML = `<tr><td class='pgHeader'>All Students</td></tr><tr><th>Student Name</th><th>Grade</th><th>Rank</th></tr>`;

  for (let i = 0; i < students.data.length; i++) {
    studentResult = await getStudentResult(students.data[i]);
    let a = students.data[i];
    let b = studentResult.average;
    studentArray.push({ a, b });

    if (i === students.data.length - 1) {
      studentArray = sortRank(studentArray);
      for (let k = 0; k < students.data.length; k++) {
        studentResult = await getStudentResult(students.data[k]);

        for (let j = 0; j < studentArray.length; j++) {
          if (students.data[k] === studentArray[j].a) {
            mainTable.innerHTML += `<tr><td><a id='${students.data[k]}'>${
              students.data[k]
            }</a></td><td>${roundGrade(studentResult.average)}%</td><td>${
              studentArray[j].c
            }</td></tr>`;
          }
        }
      }
    }
  }

  document.querySelectorAll('a').forEach((elem) => {
    elem.addEventListener('click', async (event) => {
      studentBtn.focus();
      mainTable.innerHTML = 'Loading...';
      studentResult = await getStudentResult(event.target.innerHTML);
      mainTable.innerHTML = `<tr><td class='pgHeader'>${
        event.target.innerHTML
      }</td></tr><tr><td class='pgHeader2'>Average: ${roundGrade(
        studentResult.average
      )}%</td></tr><tr><th>Student Name</th><th>Grade</th></tr>`;

      let count = 1;
      for (let key in studentResult.examResults) {
        mainTable.innerHTML += `<tr><td>Exam ${count++}</td><td>${roundGrade(
          studentResult.examResults[key].score
        )}%</td></tr>`;
      }
    });
  });
}

examBtn.addEventListener('click', (event) => {
  event.preventDefault();
  getExams();
});

async function getExams() {
  let examResult;
  let examArray = [];
  mainTable.innerHTML = 'Loading...';
  const exams = await axios.get(`${domain}exams/`);
  mainTable.innerHTML = `<tr><td class='pgHeader'>All Exams</td></tr><tr><th>Exam ID</th><th>Avg Exam Grade</th><th>Students</th></tr>`;

  for (let i = 0; i < exams.data.exams.length; i++) {
    mainTable.innerHTML += `<tr><td><a id='${exams.data.exams[i].id}'>Exam ${
      i + 1
    }</a></td><td>${roundGrade(exams.data.exams[i].average)}%</td><td>${
      exams.data.exams[i].studentCount
    }</td></tr>`;
  }

  document.querySelectorAll('a').forEach((elem) => {
    elem.addEventListener('click', async (event) => {
      examBtn.focus();
      mainTable.innerHTML = 'Loading...';
      examResult = await getExamResult(event.target.id);

      mainTable.innerHTML = `<tr><td class='pgHeader'>${
        event.target.innerHTML
      }</td></tr><tr><td class='pgHeader2'>Average: ${roundGrade(
        examResult.average
      )}%</td></tr><tr><th>Student Name</th><th>Grade</th><th>Rank</th></tr>`;

      for (let i = 0; i < examResult.results.length; i++) {
        let a = examResult.results[i].studentId;
        let b = examResult.results[i].score;
        examArray.push({ a, b });

        if (i === examResult.results.length - 1) {
          examArray = sortRank(examArray);
          for (let k = 0; k < examResult.results.length; k++) {
            for (let j = 0; j < examArray.length; j++) {
              if (examResult.results[k].studentId === examArray[j].a) {
                mainTable.innerHTML += `<tr><td>${
                  examResult.results[k].studentId
                }</td><td>${roundGrade(examResult.results[k].score)}%</td><td>${
                  examArray[j].c
                }</td></tr>`;
              }
            }
          }
        }
      }
    });
  });
}

function roundGrade(grade) {
  return (grade * 100).toFixed(2);
}

function sortRank(array) {
  array.sort(function (a, b) {
    return a.b - b.b;
  });
  array.reverse();
  array.forEach((elem, idx) => (elem.c = idx + 1));
  return array;
}

async function getStudentResult(id) {
  const studentIdRes = await axios.get(`${domain}students/${id}`);
  return studentIdRes.data;
}

async function getExamResult(examId) {
  const examIdRes = await axios.get(`${domain}exams/${examId}`);
  return examIdRes.data;
}
