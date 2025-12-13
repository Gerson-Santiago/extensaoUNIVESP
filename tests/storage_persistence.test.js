
import { addItemsBatch, loadItems } from '../sidepanel/logic/storage.js';

// Mock chrome.storage.sync
const storageMock = {};
global.chrome = {
    storage: {
        sync: {
            get: jest.fn((keys, callback) => {
                callback(storageMock);
            }),
            set: jest.fn((items, callback) => {
                Object.assign(storageMock, items);
                if (callback) callback();
            })
        }
    }
};

describe('Storage Logic - Persistence', () => {
    beforeEach(() => {
        // Limpa mock
        for (const key in storageMock) delete storageMock[key];
        jest.clearAllMocks();
    });

    test('addItemsBatch should persist termName', (done) => {
        const items = [
            { name: 'Curso A', url: 'http://a.com', weeks: [], termName: '2025/1' },
            { name: 'Curso B', url: 'http://b.com' } // Sem termName
        ];

        addItemsBatch(items, (added) => {
            expect(added).toBe(2);

            loadItems((courses) => {
                expect(courses).toHaveLength(2);

                const courseA = courses.find(c => c.name === 'Curso A');
                expect(courseA.termName).toBe('2025/1');

                const courseB = courses.find(c => c.name === 'Curso B');
                expect(courseB.termName).toBe(''); // Default

                done();
            });
        });
    });
});
