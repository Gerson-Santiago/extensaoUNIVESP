import { Modal } from '../Modal.js';

describe('Modal Component', () => {
    let modal;
    const modalId = 'test-modal';
    const modalTitle = 'Test Modal';
    const modalContent = '<p>Test Content</p>';

    beforeEach(() => {
        // Clear DOM
        document.body.innerHTML = '';
    });

    afterEach(() => {
        if (modal) {
            modal.close();
        }
        jest.clearAllMocks();
    });

    test('should render modal correctly', () => {
        modal = new Modal(modalId, modalTitle);
        modal.render(modalContent);

        const overlay = document.getElementById(modalId);
        expect(overlay).not.toBeNull();
        expect(overlay.querySelector('.modal-card')).not.toBeNull();
        expect(overlay.querySelector('h3').textContent).toBe(modalTitle);
        expect(overlay.querySelector('.modal-body').innerHTML).toBe(modalContent);
    });

    test('should remove existing modal with same id before rendering', () => {
        // First modal
        const firstModal = new Modal(modalId, 'First');
        firstModal.render('First Content');

        // Second modal with same ID
        modal = new Modal(modalId, 'Second');
        modal.render('Second Content');

        // Should only have one element with that ID
        const elements = document.querySelectorAll(`#${modalId}`);
        expect(elements.length).toBe(1);
        expect(elements[0].querySelector('h3').textContent).toBe('Second');
    });

    test('should close modal when close() is called', () => {
        modal = new Modal(modalId, modalTitle);
        modal.render(modalContent);

        modal.close();

        const overlay = document.getElementById(modalId);
        expect(overlay).toBeNull();
    });

    test('should close modal when clicking on close button', () => {
        modal = new Modal(modalId, modalTitle);
        modal.render(modalContent);

        const closeBtn = /** @type {HTMLElement} */ (document.querySelector('.btn-close-modal'));
        closeBtn.click();

        const overlay = document.getElementById(modalId);
        expect(overlay).toBeNull();
    });

    test('should close modal when clicking on overlay', () => {
        modal = new Modal(modalId, modalTitle);
        modal.render(modalContent);

        const overlay = /** @type {HTMLElement} */ (document.getElementById(modalId));
        overlay.click();

        const checkOverlay = document.getElementById(modalId);
        expect(checkOverlay).toBeNull();
    });

    test('should NOT close modal when clicking inside the card', () => {
        modal = new Modal(modalId, modalTitle);
        modal.render(modalContent);

        const card = /** @type {HTMLElement} */ (document.querySelector('.modal-card'));
        card.click(); // Click inside card

        const overlay = document.getElementById(modalId);
        expect(overlay).not.toBeNull(); // Should still exist
    });

    test('should execute onCloseCallback when closed', () => {
        const callback = jest.fn();
        modal = new Modal(modalId, modalTitle);
        modal.setOnClose(callback);
        modal.render(modalContent);

        modal.close();

        expect(callback).toHaveBeenCalledTimes(1);
    });
});
