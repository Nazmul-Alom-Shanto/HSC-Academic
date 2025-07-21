
function init(data) { 
    const subjects = ['bangla','english','ict', 'physics', 'chemistry', 'higher math', 'botany', 'zoology', 'statistics']
    const studentsNotGotAdmitCard =  [8,30,36,45,46,77,79,78,89,90,101,111,144,151,161,192,193,194,197,251,253,256,266,276,280,291,295,300,337,356,365,395,420,437,440,438,443,450,446,458,461,465,468,473,474,475,479,492,497,501,510,508,549,553,565,575,582,590,601,615,621,626,629,634,641,672,690,697,713,716,720,723,726,755,759,764,762,771,774,781,791,799,801,813,812,817,822,824,832,840,843,846,848,849,851,860,863,864,862,866,868,871,872,873,875,876,879,884,891,894,895,899,898,900]
    const hasStatistics = [324,331,332,47,67,68,172,324,331,332,371,434,441,524,612,614,640,664,692,769,771,833,834,863,875,896]
    renderTable(data);
    function renderTable(data){
      document.getElementById('tbody').innerHTML = '';
        Object.keys(data).forEach((i)=> {
        	const tr = document.createElement('tr');
            const rool = document.createElement('td');
            rool.textContent = i.toString();
            tr.appendChild(rool);
            const name = document.createElement('td');
            name.classList.add('name');
            name.textContent = data[i].name;
            tr.appendChild(name);

        const addSubjectCell = (subject) => {
        const td = document.createElement('td');
        td.textContent = data[i]?.[subject]?.totalMark ?? ' ';
        const grade = data[i]?.[subject]?.grade || 'NF';
        if(grade === 'F'){
            td.classList.add('failed');
        }
        tr.appendChild(td);
        };
        for(let j = 0; j < subjects.length; j++){
            addSubjectCell(subjects[j]);
        }

        const totalMarkEl = document.createElement('td');
        let totalMarks = 0;
        for(let j = 0; j < subjects.length; j++){
            totalMarks += parseInt(data[i][subjects[j]]?.totalMark) || 0;
        }
        totalMarkEl.textContent = totalMarks;
        tr.appendChild(totalMarkEl);

        const gpaEl = document.createElement('td');
        gpaEl.textContent = data[i]?.GPAWithAditional ?? 'NF2';
        tr.appendChild(gpaEl);

        const position = document.createElement('td');
        position.textContent = data[i]?.maritPosition ?? 'NF2';
        tr.appendChild(position);

        const totalFailedEl = document.createElement('td');
        let totalFailed = 0;
        for(let j = 0; j < subjects.length; j++){
            totalFailed += (data[i][subjects[j]]?.grade === "F" ? 1 : 0) || 0;
        }
        totalFailedEl.textContent = totalFailed;
        // tr.appendChild(totalFailedEl);

        const linkTd = document.createElement('td');
        linkTd.classList.add('transcript-link');
        const link = document.createElement('a');
        link.href = data[i].transcriptUrl ?? '#';
        link.textContent = 'View';
        link.target = '_blank';
        linkTd.appendChild(link);
        tr.appendChild(linkTd);
        
        document.getElementById('tbody').appendChild(tr);
         });

        const addEmptyRow = () => {
        const tr = document.createElement('tr');

        for (let i = 0; i < 15; i++) {
          const td = document.createElement('td');
          td.textContent = '-';
          tr.appendChild(td);
        }

        document.getElementById('tbody').appendChild(tr);
      };

      if (Object.keys(data).length < 8) {
        for (let i = 1; i <= 4; i++) {
          addEmptyRow();
        }
      }


    }

	const cleanData = Object.fromEntries(Object.entries(data).filter(([rool])=> !studentsNotGotAdmitCard.includes(Number(rool))));
	renderTable(cleanData);
    function gradeCounter(start = 1, end = 900, subject, grade = 'A+'){
      let count = 0;
      for(let i = start; i <= end; i++){
        if(!cleanData[i]) continue;
        if(cleanData[i][subject]?.grade === grade) count+=1;
      }
      return count;
    }    
    function gradeCounterOverall(start = 1, end = 900, grade = 'A+'){
      let count = 0;
      for(let i = start; i <= end; i++){
        if(!cleanData[i]) continue;
        if(studentsNotGotAdmitCard.includes(i)) continue;
        if(gpaToGrade(parseFloat(cleanData[i].GPAWithAditional)) === grade) count+=1;
      }
      return count;
    }

    function gpaToGrade(gpa) {
      if (gpa >= 5.00) return 'A+';
      else if (gpa >= 4.00) return 'A';
      else if (gpa >= 3.50) return 'A-';
      else if (gpa >= 3.00) return 'B';
      else if (gpa >= 2.00) return 'C';
      else if (gpa >= 1.00) return 'D';
      else return 'F'; 
}

    function studentsAttendedSubjectCounter(start = 1, end = 900, subject){
      let count = 0;
       for(let i = start; i <= end; i++){
        if(!cleanData[i]) continue;
        if(cleanData[i][subject]) count+=1;
      }
      return count;
    }
    
    function studentsAttendedExamCounter(start = 1, end = 900){
      let count = 0;
       for(let i = start; i <= end; i++){
        if(!cleanData[i]) continue;
        else count++;
      }
      return count;
    }

    function totalFailedCounter(rool){
      let count = 0;
      subjects.forEach(sub => {
        if(data[rool][sub]?.grade === 'F') count+=1;
      });
      return count;
    }

    function failedCounter(start,end, howMany){
      let count = 0; 
      for(let i = start; i <= end; i++){
        if(!cleanData[i]) continue;
        if(totalFailedCounter(i) === howMany) count+=1;
      }
      return count;
    }

    const searchInput =	document.getElementById('searchInput');
    searchInput.addEventListener('input', ()=> {
		const filtered = Object.fromEntries(Object.entries(cleanData).filter(([rool, data])=> rool.startsWith(searchInput.value) || data.name.toLowerCase().includes(searchInput.value.trim().toLowerCase())));

    renderTable(filtered);
	});

  const tbody2 = document.getElementById('tbody-2');

  for(let i = 0; i < 6; i++){
    const tr = document.createElement('tr');
    const attended = studentsAttendedExamCounter(150 * i + 1 , 150* (i+1));

    tr.innerHTML = `
        <td class='section'>${String.fromCharCode(65 + i)}</td>
        <td>${attended}</td>
        <td>${attended - gradeCounterOverall(150 * i + 1, 150 * (i+1) , 'F')}</td>
        <td>${gradeCounterOverall(150 * i + 1, 150 * (i+1) , 'A+')}</td>
        <td>${gradeCounterOverall(150 * i + 1, 150 * (i+1) , 'A')}</td>
        <td>${gradeCounterOverall(150 * i + 1, 150 * (i+1) , 'A-')}</td>
        <td>${gradeCounterOverall(150 * i + 1, 150 * (i+1) , 'B')}</td>
        <td>${gradeCounterOverall(150 * i + 1, 150 * (i+1) , 'F')}</td>
        <td>${failedCounter(150 * i + 1, 150 * (i+1), 1)}</td>
        <td>${failedCounter(150 * i + 1, 150 * (i+1), 2)}</td>
        <td>${failedCounter(150 * i + 1, 150 * (i+1), 3)}</td>
        <td>${[4,5,6,7,8].map(j => failedCounter(150 * i + 1, 150 * (i+1), j)).reduce((acc, val) => acc + val, 0)}</td>
    `;
    tbody2.appendChild(tr);
  }
  
    const container = document.getElementById('overview');
    subjects.forEach(subject => {
        const card = document.createElement('div');
        card.className = "subject-card";
        const totalStudent = studentsAttendedSubjectCounter(undefined, undefined, subject);
        const totalFailed = gradeCounter(undefined, undefined, subject, 'F');
        const totalPassed = totalStudent - totalFailed;
        const passRate = ((totalPassed / totalStudent) * 100).toFixed(2);

        card.innerHTML = `
            <div class="card-header">
            <h3>${subject.toUpperCase()}</h3>
            <span class="pass-rate">Pass Rate: ${passRate}%</span>
            </div>
            <div class="card-body">
            <div class="stat-row"><span>Total Students</span><strong>${totalStudent}</strong></div>
            <div class="stat-row"><span>Passed</span><strong>${totalPassed}</strong></div>
            <div class="stat-row"><span>Failed</span><strong class="fail">${totalFailed}</strong></div>
            ${["A+", "A", "A-", "B", "C", "F"].map(grade => {
              const count = gradeCounter(undefined, undefined, subject, grade);
              return ` <div class="stat-row"><span>Got ${grade}</span><strong>${count}</strong></div>`;
            }).join('')}
            </div>
  `;
    container.appendChild(card); 
    });

  const container2 = document.getElementById('overview-2');
  const totalStudent = studentsAttendedExamCounter(1,900);
  const totalFailed = gradeCounterOverall(1,900,'F');
  const totalPassed = totalStudent - totalFailed;
  container2.innerHTML = `
  <div class="subject-card">
    <div class="card-header">
      <div class="card-title">
        <h3>Year-Final Exam Result</h3>
        <p>1st Year HSC – Science (2024–2025) | Dhaka College</p>  
      </div>
      <span class="pass-rate">Pass Rate: ${((totalPassed / totalStudent) * 100).toFixed(2)}%</span>
    </div>
    <div class="card-body">
      <div class="stat-row"><span>Total Students Attended the Exam</span><strong>${totalStudent}</strong></div>
      <div class="stat-row"><span>Total Passed</span><strong>${totalPassed}</strong></div>
      <div class="stat-row"><span>Total Failed</span><strong class="fail">${totalFailed}</strong></div>
      <div class="stat-row"><span>Got A+</span><strong class="grade-a">${gradeCounterOverall(1, 900, 'A+')}</strong></div>
      <div class="stat-row"><span>Got A</span><strong>${gradeCounterOverall(1, 900, 'A')}</strong></div>
      <div class="stat-row"><span>Got A−</span><strong>${gradeCounterOverall(1, 900, 'A-')}</strong></div>
      <div class="stat-row"><span>Got B</span><strong>${gradeCounterOverall(1, 900, 'B')}</strong></div>
      <div class="stat-row"><span>Got C</span><strong>${gradeCounterOverall(1, 900, 'C')}</strong></div>
      <div class="stat-row"><span>Got F</span><strong class="fail">${gradeCounterOverall(1, 900, 'F')}</strong></div>
      <div class="stat-row"><span>Failed in One Subject</span><strong>${failedCounter(1, 900, 1)}</strong></div>
      <div class="stat-row"><span>Failed in Two Subjects</span><strong>${failedCounter(1, 900, 2)}</strong></div>
      <div class="stat-row"><span>Failed in Three Subjects</span><strong>${failedCounter(1, 900, 3)}</strong></div>
      <div class="stat-row"><span>Failed in Four Subjects</span><strong>${failedCounter(1, 900, 4)}</strong></div>
      <div class="stat-row"><span>Failed in Five or More Subjects</span><strong>${
        [5, 6, 7, 8].map(i => failedCounter(1, 900, i)).reduce((acc, val) => acc + val, 0)
      }</strong></div>
    </div>
  </div>
`;
}
  

(async () => {
  const dataUrl = './assets/json/year-final-result.json';
  try {
    const response = await fetch(dataUrl);
    const data = await response.json();
    console.log(data);
    if (!data) throw new Error();
    init(data);
  } catch (err) {
    console.error(`Failed to load data from ${dataUrl} & the error message is`, err);
  }
})();