import {beforeEach, describe, expect, it, jest} from '@jest/globals';
import express from 'express';
import request from 'supertest';

const mockStudentService = {
    addStudent: jest.fn(),
    findStudent: jest.fn(),
    deleteStudent: jest.fn(),
    updateStudent: jest.fn(),
    addScore: jest.fn(),
    findStudentsByName: jest.fn(),
    countStudentsByNames: jest.fn(),
    findStudentsByMinScore: jest.fn(),
};

jest.unstable_mockModule('../service/studentService.js', () => mockStudentService);

const {default: studentRoutes} = await import('../routes/studentRoutes.js');

const app = express();
app.use(express.json());
app.use(studentRoutes);

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Student Controller', () => {
    describe('POST /student', () => {
        it('returns 204 when student is created', async () => {
            // Arrange
            const payload = {id: 1, name: 'John Doe', password: 'secret'};
            mockStudentService.addStudent.mockResolvedValue(true);

            // Act
            const response = await request(app)
                .post('/student')
                .send(payload);

            // Assert
            expect(response.status).toBe(204);
            expect(mockStudentService.addStudent).toHaveBeenCalledWith(payload);
        });

        it('returns 409 when student already exists', async () => {
            // Arrange
            mockStudentService.addStudent.mockResolvedValue(false);

            // Act
            const response = await request(app)
                .post('/student')
                .send({id: 1, name: 'John Doe', password: 'secret'});

            // Assert
            expect(response.status).toBe(409);
            expect(mockStudentService.addStudent).toHaveBeenCalledTimes(1);
        });

        it('returns 400 when add student request fails validation', async () => {
            // Act
            const response = await request(app)
                .post('/student')
                .send({id: -1, name: 'John Doe', password: 'secret'});

            // Assert
            expect(response.status).toBe(400);
            expect(response.text).toContain('"id" must be a positive number');
            expect(mockStudentService.addStudent).not.toHaveBeenCalled();
        });
    });

    describe('GET /student/:id', () => {
        it('returns student when found', async () => {
            // Arrange
            const student = {id: 1, name: 'John Doe', password: 'secret'};
            mockStudentService.findStudent.mockResolvedValue(student);

            // Act
            const response = await request(app).get('/student/1');

            // Assert
            expect(response.status).toBe(200);
            expect(response.body).toEqual(student);
            expect(mockStudentService.findStudent).toHaveBeenCalledWith('1');
        });

        it('returns 404 when student is not found', async () => {
            // Arrange
            mockStudentService.findStudent.mockResolvedValue(null);

            // Act
            const response = await request(app).get('/student/404');

            // Assert
            expect(response.status).toBe(404);
            expect(response.body).toMatchObject({
                status: 404,
                error: 'Not Found',
                message: 'Student with id 404 not found',
                path: '/student/404',
            });
            expect(response.body.timestamp).toBeDefined();
        });
    });

    describe('DELETE /student/:id', () => {
        it('returns deleted student when found', async () => {
            // Arrange
            const student = {id: 2, name: 'Jane Doe', password: 'secret'};
            mockStudentService.deleteStudent.mockResolvedValue(student);

            // Act
            const response = await request(app).delete('/student/2');

            // Assert
            expect(response.status).toBe(200);
            expect(response.body).toEqual(student);
            expect(mockStudentService.deleteStudent).toHaveBeenCalledWith('2');
        });

        it('returns 404 when deleting missing student', async () => {
            // Arrange
            mockStudentService.deleteStudent.mockResolvedValue(null);

            // Act
            const response = await request(app).delete('/student/404');

            // Assert
            expect(response.status).toBe(404);
            expect(response.body).toMatchObject({
                status: 404,
                error: 'Not Found',
                message: 'Student with id 404 not found',
                path: '/student/404',
            });
        });
    });

    describe('PATCH /student/:id', () => {
        it('returns updated student when request is valid', async () => {
            // Arrange
            const payload = {name: 'Updated Name'};
            const updatedStudent = {id: 3, name: 'Updated Name', password: 'secret'};
            mockStudentService.updateStudent.mockResolvedValue(updatedStudent);

            // Act
            const response = await request(app)
                .patch('/student/3')
                .send(payload);

            // Assert
            expect(response.status).toBe(200);
            expect(response.body).toEqual(updatedStudent);
            expect(mockStudentService.updateStudent).toHaveBeenCalledWith('3', payload);
        });

        it('returns 400 when update request fails validation', async () => {
            // Act
            const response = await request(app)
                .patch('/student/3')
                .send({name: 123});

            // Assert
            expect(response.status).toBe(400);
            expect(response.text).toContain('"name" must be a string');
            expect(mockStudentService.updateStudent).not.toHaveBeenCalled();
        });

        it('returns 404 when updating missing student', async () => {
            // Arrange
            mockStudentService.updateStudent.mockResolvedValue(null);

            // Act
            const response = await request(app)
                .patch('/student/404')
                .send({password: 'new-secret'});

            // Assert
            expect(response.status).toBe(404);
            expect(response.body).toMatchObject({
                status: 404,
                error: 'Not Found',
                message: 'Student with id 404 not found',
                path: '/student/404',
            });
        });
    });

    describe('PATCH /score/student/:id', () => {
        it('returns 204 when score is added', async () => {
            // Arrange
            mockStudentService.addScore.mockResolvedValue(true);

            // Act
            const response = await request(app)
                .patch('/score/student/5')
                .send({examName: 'Math', score: 95});

            // Assert
            expect(response.status).toBe(204);
            expect(mockStudentService.addScore).toHaveBeenCalledWith('5', 'Math', 95);
        });

        it('returns 400 when score request fails validation', async () => {
            // Act
            const response = await request(app)
                .patch('/score/student/5')
                .send({examName: 'Math', score: 101});

            // Assert
            expect(response.status).toBe(400);
            expect(response.text).toContain('"score" must be less than or equal to 100');
            expect(mockStudentService.addScore).not.toHaveBeenCalled();
        });

        it('returns 404 when adding score to missing student', async () => {
            // Arrange
            mockStudentService.addScore.mockResolvedValue(null);

            // Act
            const response = await request(app)
                .patch('/score/student/404')
                .send({examName: 'Math', score: 95});

            // Assert
            expect(response.status).toBe(404);
            expect(response.body).toMatchObject({
                status: 404,
                error: 'Not Found',
                message: 'Student with id 404 not found',
                path: '/score/student/404',
            });
        });
    });

    describe('read-only collection routes', () => {
        it('returns students by name', async () => {
            // Arrange
            const students = [{id: 1, name: 'Ann'}];
            mockStudentService.findStudentsByName.mockResolvedValue(students);

            // Act
            const response = await request(app).get('/students/name/Ann');

            // Assert
            expect(response.status).toBe(200);
            expect(response.body).toEqual(students);
            expect(mockStudentService.findStudentsByName).toHaveBeenCalledWith('Ann');
        });

        it('returns student count by query names', async () => {
            // Arrange
            mockStudentService.countStudentsByNames.mockResolvedValue(2);

            // Act
            const response = await request(app)
                .get('/quantity/students')
                .query({names: ['Ann', 'Bob']});

            // Assert
            expect(response.status).toBe(200);
            expect(response.body).toBe(2);
            expect(mockStudentService.countStudentsByNames).toHaveBeenCalledWith(['Ann', 'Bob']);
        });

        it('returns students by minimum exam score', async () => {
            // Arrange
            const students = [{id: 1, scores: {Math: 90}}];
            mockStudentService.findStudentsByMinScore.mockResolvedValue(students);

            // Act
            const response = await request(app).get('/students/exam/Math/minscore/80');

            // Assert
            expect(response.status).toBe(200);
            expect(response.body).toEqual(students);
            expect(mockStudentService.findStudentsByMinScore).toHaveBeenCalledWith('Math', '80');
        });
    });
});
