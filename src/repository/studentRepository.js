import Student from '../model/student.js';

const students = new Map();
let collection;
export const init = db => collection = db.collection('college');

export const createStudent = async ({id, name, password}) => {
    const existingStudent = await collection.findOne({_id: id});
    if (existingStudent) {
        return false;
    }
    await collection.insertOne({_id: id, name, password, scores: {}});
    return true;
}

export const findStudentById = id => students.get(id);

export const deleteStudent = id => {
    const student = students.get(id);
    students.delete(id);
    return student;
}

export const updateStudent = (student) => {
    if (students.has(student.id)) {
        students.set(student.id, student);
        return student;
    }
}

export const findStudentsByName = name => [...students.values()].filter(s => s.name.toLowerCase() === name.toLowerCase());

export const countStudentsByNames = names => {
    names = names.map(n => n.toLowerCase());
    return [...students.values()].filter(s => names.includes(s.name.toLowerCase())).length
}

export const findStudentsByMinScore = (exam, minScore) => [...students.values()].filter(s => s.scores[exam] >= minScore);