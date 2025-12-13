
import { parseTerm } from './termParser.js';

/**
 * Agrupa uma lista de cursos por termo (Bimestre).
 * 
 * @param {Array} courses - Lista de objetos de curso { name, url, ... }
 * @returns {Array} - Lista ordenada de grupos: [{ title, courses: [], sortKey }]
 */
export function groupCoursesByTerm(courses) {
    if (!courses || courses.length === 0) return [];

    const groupsMap = new Map();

    courses.forEach(course => {
        // Usa o parser para identificar o bimestre do curso
        const parsed = parseTerm(course);

        // Define o título do grupo
        let groupTitle = '';
        if (parsed.year > 0) {
            groupTitle = `${parsed.year}/${parsed.semester} - ${parsed.term}º Bimestre`;
        } else {
            groupTitle = 'Outros';
        }

        const uniqueKey = parsed.sortKey > 0 ? groupTitle : 'outros';

        if (!groupsMap.has(uniqueKey)) {
            groupsMap.set(uniqueKey, {
                title: groupTitle,
                sortKey: parsed.sortKey,
                courses: []
            });
        }

        groupsMap.get(uniqueKey).courses.push(course);
    });

    // Converte para Array
    const result = Array.from(groupsMap.values());

    // Ordena Grupos
    result.sort((a, b) => {
        // "Outros" sempre no final (sortKey 0)
        if (a.sortKey === 0) return 1;
        if (b.sortKey === 0) return -1;

        // Decrescente (Mais recente primeiro)
        return b.sortKey - a.sortKey;
    });

    return result;
}
