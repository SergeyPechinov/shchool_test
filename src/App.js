import React, {useEffect, useState} from 'react';
import './App.css';

const getApiData = url => {
  return fetch(url).then(response => response.json());
}

const sort = array => {
  array.sort((a, b) => {
    if (a.order > b.order) return 1;
    if (a.order < b.order) return -1;

    if (a.name > b.name) return 1;
    if (a.name < b.name) return -1;
  });
}

const App = () => {
  const [studentsActive, setStudentsActive] = useState([]);
  const [studentsNoActive, setStudentsNoActive] = useState([]);

  useEffect(() => {
    const queries = [
      getApiData('https://my-json-server.typicode.com/paraplancrm/api/students'),
      getApiData('https://my-json-server.typicode.com/paraplancrm/api/statuses')
    ];

    Promise.all(queries).then(response => {
      const [students, statuses] = response;

      const studentsActive = [];
      const studentsNoActive = [];

      const statusesMap = new Map();

      statuses.forEach(status => {
        statusesMap.set(status.id, status);
      });

      students.forEach(student => {
        const status = statusesMap.get(student.status);
        const responseStudent = {
          name: student.name,
          status: status.name,
          order: status.order
        }

        status.active ?
          studentsActive.push(responseStudent) :
          studentsNoActive.push(responseStudent);
      });

      sort(studentsActive);
      sort(studentsNoActive);

      setStudentsActive(studentsActive);
      setStudentsNoActive(studentsNoActive);
    })
  }, []);

  const renderStudentsList = students => {
    if (students.length) {
      return (
        <ul>
          {students.map((student, index) => {
            return (
              <li key={index}>{student.name} {student.order}</li>
            )
          })}
        </ul>
      )
    }
  }

  return (studentsActive.length && studentsNoActive.length ?
    <div className="App">
      <p>Список активных студентов</p>
      {renderStudentsList(studentsActive)}
      <p>Список не активных студентов</p>
      {renderStudentsList(studentsNoActive)}
    </div>
    : null);
}

export default App;
