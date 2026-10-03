(() => {
  const months = [
    { number: 1, page: 'welcome.html' },
    { number: 2, page: 'month-2.html' }
  ];

  const ordinal = (number) => {
    const remainder = number % 100;
    if (remainder >= 11 && remainder <= 13) return `${number}th`;
    switch (number % 10) {
      case 1: return `${number}st`;
      case 2: return `${number}nd`;
      case 3: return `${number}rd`;
      default: return `${number}th`;
    }
  };

  const monthGrid = document.getElementById('month-grid');
  const monthSummary = document.getElementById('month-summary');
  if (!monthGrid || !monthSummary) return;

  monthSummary.textContent = `${months.length} ${months.length === 1 ? 'month' : 'months'} in our timeline`;

  months.forEach((month) => {
    const card = document.createElement('article');
    card.className = 'month-card card fade-up';

    const marker = document.createElement('span');
    marker.className = 'month-marker';
    marker.textContent = '♡';
    marker.setAttribute('aria-hidden', 'true');

    const eyebrow = document.createElement('span');
    eyebrow.className = 'month-card-label';
    eyebrow.textContent = `CHAPTER ${month.number}`;

    const title = document.createElement('h2');
    title.textContent = ordinal(month.number) + ' Month';

    const link = document.createElement('a');
    link.className = 'btn month-open';
    link.href = month.page;
    link.dataset.noSpa = '';
    link.textContent = 'Visit Website';
    link.setAttribute('aria-label', `Visit ${ordinal(month.number)} Month website`);

    card.append(marker, eyebrow, title, link);
    monthGrid.append(card);
  });
})();
