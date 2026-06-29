/*
The Arrange, Act, Assert (AAA) pattern in TDD unit testing involves three steps:
Arrange (setting up the test environment),
Act (executing the code under test),
and Assert (verifying the expected outcome).
This pattern helps in writing clear, maintainable, and effective unit tests.
 */

import {jest, beforeEach, describe, it, expect} from '@jest/globals';

const mockRepo = {
    createStudent: jest.fn(),
    findStudentById: jest.fn(),
    deleteStudent: jest.fn(),
    updateStudent: jest.fn(),
    findStudentsByName: jest.fn(),
    countStudentsByNames: jest.fn(),
    findStudentsByMinScore: jest.fn()
}

jest.unstable_mockModule('../repository/studentRepository', () => mockRepo);

const studentService = await import('../service/studentService.js');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Student Service', () => {
    it('addStudent returns false when student already exists', async () => {
        // Arrange
        mockRepo.findStudentById.mockResolvedValue({id: 1});
        // Act
        const result = await studentService.addStudent({
            id: 1,
            name: 'John Doe',
            password: 'secret'
        })
        // Assert
        expect(result).toBeFalsy();
        expect(mockRepo.createStudent).not.toHaveBeenCalled();
        expect(mockRepo.findStudentById).toHaveBeenCalledWith(1);
    })
    it('addStudent returns true when student does not exists', async () => {
        // Arrange
        mockRepo.findStudentById.mockResolvedValue(null);
        // Act
        const result = await studentService.addStudent({
            id: 2,
            name: 'John Doe',
            password: 'secret'
        })
        // Assert
        expect(result).toBeTruthy();
        expect(mockRepo.createStudent).toHaveBeenCalledWith({
            _id: 2,
            name: 'John Doe',
            password: 'secret'
        });
        expect(mockRepo.findStudentById).toHaveBeenCalledWith(2);
    })
})