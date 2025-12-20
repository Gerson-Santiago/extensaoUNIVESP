/**
 * @jest-environment jsdom
 * @testEnvironmentOptions {"url": "https://ava.univesp.br/ultra/course"}
 */

import { DOM_scanTermsAndCourses_Injected } from '@features/import/services/BatchScraper.js';

describe('BatchScraper DOM Logic', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';

    // Mock scroll
    window.scrollTo = jest.fn();
    // Default scroll height
    Object.defineProperty(document.body, 'scrollHeight', { value: 1000, writable: true });

    // Navigate to expected URL (relative works in JSDOM)
    window.history.pushState({}, 'Test', '/ultra/course');
  });

  test('Deve retornar erro se não estiver logado ou na página errada', async () => {
    // Navigate away to invalid URL
    window.history.pushState({}, 'Test', '/other');
    const result = await DOM_scanTermsAndCourses_Injected();
    expect(result.success).toBe(false);
    expect(result.message).toContain('acesse a página de Cursos');
  });

  test('Deve tentar realizar auto-scroll', async () => {
    // Mock elements to pass the first check
    const info = document.createElement('div');
    info.id = 'courses-overview-content';
    document.body.appendChild(info);

    // Mock setTimeout to be instant
    jest.useFakeTimers();

    const promise = DOM_scanTermsAndCourses_Injected();

    // Advance time repeatedly to handle the async loop
    for (let i = 0; i < 15; i++) {
      await Promise.resolve();
      jest.advanceTimersByTime(2000);
    }

    // We expect it to eventually fail finding courses (since we didn't add h4s)
    // but we want to check if it tried to scroll
    const result = await promise;

    expect(window.scrollTo).toHaveBeenCalled();
    expect(result.success).toBe(false); // No courses found

    jest.useRealTimers();
  });

  test('Deve extrair cursos corretamente do DOM', async () => {
    // Setup DOM structure simulating Blackboard
    document.body.innerHTML = `
      <ul>
        <li>
            <div class="element-card">
                 <a href="https://ava.univesp.br/ultra/course_id=_123_1">Link</a>
                 <h4 class="js-course-title-element">Engenharia de Software</h4>
                 <span id="course-id-1">COM100-2025S1B1-T01</span>
                 <div id="main-content-inner" style="overflow:auto; height: 500px"></div>
                 <div style="overflow:auto; height: 500px"></div> 
            </div>
        </li>
      </ul>
    `;
    // Add mock scroll element to avoid window scroll issues in JSDOM
    const mainContent = document.getElementById('main-content-inner');
    if (mainContent) {
      Object.defineProperty(mainContent, 'scrollHeight', { value: 2000, writable: true });
      Object.defineProperty(mainContent, 'clientHeight', { value: 1000, writable: true });
    }

    // Skip scroll wait
    jest.useFakeTimers();
    const promise = DOM_scanTermsAndCourses_Injected();

    for (let i = 0; i < 15; i++) {
      await Promise.resolve();
      jest.advanceTimersByTime(2000);
    }

    const result = await promise;
    jest.useRealTimers();

    expect(result.success).toBe(true);
    expect(result.terms.length).toBeGreaterThan(0);
    expect(result.terms[0].courses[0].name).toBe('Engenharia de Software');
    expect(result.terms[0].courses[0].courseId).toBe('_123_1');
    expect(result.terms[0].name).toContain('2025/1 - 1º Bimestre');
  });
});
