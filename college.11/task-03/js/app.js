document.addEventListener('DOMContentLoaded', () => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => root.querySelectorAll(selector);

  const isStudentControl = $('#is-student-control');
  const schoolControl = $('#school-control');
  const employmentControl = $('#employment-control');
  const schoolCitySelect = $('#school-city-select');
  const schoolSelects = $$('.school-select');

  function show(el, display = 'block') {
    el.style.display = display;
  }
  function hide(el) {
    el.style.display = 'none';
  }

  isStudentControl.addEventListener('change', function(e) {
    const target = e.target;
    const isStudent = target.value === '1';

    if ( isStudent ) {
      show(schoolControl);
      hide(employmentControl);
      return;
    }
    hide(schoolControl);
    show(employmentControl);
  });

  schoolCitySelect.addEventListener('change', function(e) {
    const city = this.value;

    [].forEach.call(schoolSelects, function(select) {
      if ( select.dataset.city === city ) {
        show(select, 'inline');
        return;
      }

      hide(select);
    });
  });
});
