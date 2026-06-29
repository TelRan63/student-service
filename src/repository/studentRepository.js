import Student from '../model/student.js'

export const createStudent = student => Student.create(student);

export const findStudentById = id => Student.findById(id).exec();

export const deleteStudent = id => Student.findByIdAndDelete(id).exec();

export const updateStudent = (id, data) => Student.findByIdAndUpdate(id, data, {returnDocument: 'after'}).select({scores: 0}).exec();

export const findStudentsByName = name => Student.find({name: new RegExp(`^${name}$`, 'i')}).exec();

export const countStudentsByNames = names => {
    const regexConditions = names.map(name => ({name: {$regex: `^${name}$`, $options: 'i'}}));
    return Student.countDocuments({$or: regexConditions});
}

export const findStudentsByMinScore = (exam, minScore) => Student.find({[`scores.${exam}`]: {$gte: minScore}}).exec();