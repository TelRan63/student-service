import * as repo from '../repository/studentRepository.js';

export const addStudent = async (student) => repo.createStudent(student);

export const findStudent = async (id) => {
    let student = repo.findStudentById(+id);
    if (student) {
        student = {...student};
        student.password = undefined;
    }
    return student;
}

export const deleteStudent = async (id) => {
    let student = repo.deleteStudent(+id);
    if (student) {
        student.password = undefined;
    }
    return student;
}

export const updateStudent = async (id, data) => {
    let student = repo.findStudentById(+id);
    if (student) {
        student = {...student, ...data};
        student = {...repo.updateStudent(student)};
        student.scores = undefined;
    }
    return student;
}

export const addScore = async (id, exam, score) => {
    const student = repo.findStudentById(+id);
    if (student) {
        student.scores[exam] = score;
        repo.updateStudent(student);
    }
    return student;
}

export const findStudentsByName = async (name) => repo.findStudentsByName(name).map(s => ({...s, password: undefined}));

export const countStudentsByNames = async (names) => {
    names = Array.isArray(names) ? names : [names];
    return repo.countStudentsByNames(names);
}

export const findStudentsByMinScore = async (exam, minScore) => repo.findStudentsByMinScore(exam, minScore).map(s => ({
    ...s,
    password: undefined
}));