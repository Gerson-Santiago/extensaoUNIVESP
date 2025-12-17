// Conta cards de curso visíveis
var cards = document.querySelectorAll('.course-element-card, .element-card.course-element-card');
console.log('📦 Total de Cards no DOM:', cards.length);

// Lista os IDs para ver se são únicos ou repetições
var ids = Array.from(cards).map((c) => c.getAttribute('data-course-id') || c.id);
console.log('🆔 IDs encontrados:', ids);
