import { CourseWeekTasksView } from '../views/CourseWeekTasksView/index.js';

describe('ProgressCalculation', () => {
    let view;

    beforeEach(() => {
        view = new CourseWeekTasksView({});
    });

    it('should return 0% progress when no items exist', () => {
        const week = { items: [] };
        view.setWeek(week);
        const progress = view.calculateProgress();
        expect(progress.percentage).toBe(0);
        expect(progress.completed).toBe(0);
        expect(progress.total).toBe(0);
    });

    it('should return 0% progress when items exist but none are DONE', () => {
        const week = {
            items: [
                { name: 'Task 1', status: 'TODO' },
                { name: 'Task 2', status: 'DOING' }
            ]
        };
        view.setWeek(week);
        const progress = view.calculateProgress();
        expect(progress.percentage).toBe(0);
        expect(progress.completed).toBe(0);
        expect(progress.total).toBe(2);
    });

    it('should return 100% progress when all items are DONE', () => {
        const week = {
            items: [
                { name: 'Task 1', status: 'DONE' },
                { name: 'Task 2', status: 'DONE' }
            ]
        };
        view.setWeek(week);
        const progress = view.calculateProgress();
        expect(progress.percentage).toBe(100);
        expect(progress.completed).toBe(2);
        expect(progress.total).toBe(2);
    });

    it('should correct calculate partial progress', () => {
        const week = {
            items: [
                { name: 'Task 1', status: 'DONE' },
                { name: 'Task 2', status: 'TODO' },
                { name: 'Task 3', status: 'DONE' },
                { name: 'Task 4', status: 'TODO' }
            ]
        };
        view.setWeek(week);
        const progress = view.calculateProgress();
        expect(progress.percentage).toBe(50);
        expect(progress.completed).toBe(2);
        expect(progress.total).toBe(4);
    });
    
    it('should handle missing status property as TODO', () => {
         const week = {
            items: [
                { name: 'Task 1' }, // Missing status -> TODO
                { name: 'Task 2', status: 'DONE' }
            ]
        };
        view.setWeek(week);
        const progress = view.calculateProgress();
        expect(progress.percentage).toBe(50);
        expect(progress.completed).toBe(1);
        expect(progress.total).toBe(2);
    });
});
