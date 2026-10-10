/**
 * Turtle Bay International School - Student Experience Newsletter Studio
 * JS Controller ("Our First Seven Weeks" Issue • Version v2.4 Clean Themes & SLC Gallery)
 */

document.addEventListener('DOMContentLoaded', () => {
  const APP_VERSION = 'v2.5_image_crop_fix';

  // Core UI Elements
  const themeSelect = document.getElementById('theme-select');
  const btnPrint = document.getElementById('btn-print');
  const btnToggleEdit = document.getElementById('btn-toggle-edit');
  const btnSave = document.getElementById('btn-save');
  const btnLoadTrigger = document.getElementById('btn-load-trigger');
  const fileInput = document.getElementById('file-input');
  const btnReset = document.getElementById('btn-reset');
  const newsletterPaper = document.getElementById('newsletter-paper');
  const formatButtons = document.querySelectorAll('.fmt-btn');
  const btnAddWeek = document.getElementById('btn-add-week');
  const btnAddLeader = document.getElementById('btn-add-leader');

  let isPreviewMode = false;
  const initialContentHTML = newsletterPaper.innerHTML;

  // --- 1. Theme Selection ---
  themeSelect.addEventListener('change', (e) => {
    const selectedTheme = e.target.value;
    document.body.className = `${selectedTheme} ${isPreviewMode ? 'preview-mode' : ''}`.trim();
    saveToLocalStorage();
  });

  // --- 2. Rich Formatting Commands ---
  formatButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const command = btn.getAttribute('data-cmd');
      if (command) {
        document.execCommand(command, false, null);
      }
    });
  });

  // --- 3. Dynamic Adding Features ---
  if (btnAddWeek) {
    btnAddWeek.addEventListener('click', () => {
      const grid = document.getElementById('weekly-themes-grid');
      if (grid) {
        const count = grid.querySelectorAll('.week-item').length + 1;
        const newWeek = document.createElement('div');
        newWeek.className = 'week-item';
        newWeek.innerHTML = `
          <div class="week-tag">Week ${count}</div>
          <div class="week-content" contenteditable="true">
            <strong>New Theme Title</strong> <span class="badge-mini">Weekly Focus</span>
            <div class="week-sub">Add a short description of the week's theme focus here.</div>
          </div>
        `;
        grid.appendChild(newWeek);
        newWeek.querySelector('[contenteditable]').focus();
        saveToLocalStorage();
      }
    });
  }

  if (btnAddLeader) {
    btnAddLeader.addEventListener('click', () => {
      const slcList = document.getElementById('slc-list');
      if (slcList) {
        const newLeader = document.createElement('li');
        newLeader.setAttribute('contenteditable', 'true');
        newLeader.innerHTML = `<span class="slc-badge slc-grade">Class Representative</span> <strong>Student Name</strong>`;
        slcList.appendChild(newLeader);
        newLeader.focus();
        saveToLocalStorage();
      }
    });
  }

  // --- 4. Toggle Preview / Edit Mode ---
  btnToggleEdit.addEventListener('click', () => {
    isPreviewMode = !isPreviewMode;
    const editableElements = newsletterPaper.querySelectorAll('[contenteditable]');

    if (isPreviewMode) {
      document.body.classList.add('preview-mode');
      editableElements.forEach(el => el.setAttribute('contenteditable', 'false'));
      btnToggleEdit.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Edit Mode';
      btnToggleEdit.classList.replace('btn-secondary', 'btn-primary');
    } else {
      document.body.classList.remove('preview-mode');
      editableElements.forEach(el => el.setAttribute('contenteditable', 'true'));
      btnToggleEdit.innerHTML = '<i class="fa-solid fa-eye"></i> Preview Mode';
      btnToggleEdit.classList.replace('btn-primary', 'btn-secondary');
    }
  });

  // --- 5. Print / Export A4 PDF ---
  btnPrint.addEventListener('click', () => {
    window.print();
  });

  // --- 6. Universal Robust Image Uploader Setup ---
  function setupImageUploader(btnId, inputId, imgId, syncImgId = null) {
    const btn = document.getElementById(btnId);
    const input = document.getElementById(inputId);
    const img = document.getElementById(imgId);
    const syncImg = syncImgId ? document.getElementById(syncImgId) : null;

    if (btn && input && img) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        input.click();
      });

      input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(evt) {
            img.src = evt.target.result;
            if (syncImg) syncImg.src = evt.target.result;
            saveToLocalStorage();
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  function initializeAllImageUploaders() {
    setupImageUploader('btn-change-logo', 'logo-upload-input', 'school-logo', 'footer-logo');
    
    // Community Gallery 4 Photos
    setupImageUploader('btn-change-community-1', 'community-upload-1', 'community-photo-1');
    setupImageUploader('btn-change-community-2', 'community-upload-2', 'community-photo-2');
    setupImageUploader('btn-change-community-3', 'community-upload-3', 'community-photo-3');
    setupImageUploader('btn-change-community-4', 'community-upload-4', 'community-photo-4');

    // Mental Health
    setupImageUploader('btn-change-mh-photo', 'mh-upload-input', 'mh-photo');
    
    // Student Leadership Council 2 Photos
    setupImageUploader('btn-change-slc-1', 'slc-upload-1', 'slc-photo-1');
    setupImageUploader('btn-change-slc-2', 'slc-upload-2', 'slc-photo-2');

    setupImageUploader('btn-change-footer-logo', 'footer-logo-upload-input', 'footer-logo');
    setupImageUploader('btn-change-qr', 'qr-upload-input', 'qr-code-img');

    // Double click or Drag-and-Drop on any image directly on canvas
    const allWrappers = newsletterPaper.querySelectorAll('.photo-wrapper');
    allWrappers.forEach(wrapper => {
      const img = wrapper.querySelector('img');
      if (!img) return;

      img.style.cursor = 'pointer';
      img.title = 'Double-click or drag & drop an image file to replace picture';

      img.addEventListener('dblclick', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const tempInput = document.createElement('input');
        tempInput.type = 'file';
        tempInput.accept = 'image/*';
        tempInput.onchange = (evt) => {
          const file = evt.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (re) => {
              img.src = re.target.result;
              saveToLocalStorage();
            };
            reader.readAsDataURL(file);
          }
        };
        tempInput.click();
      });

      // Drag and Drop support
      wrapper.addEventListener('dragover', (e) => {
        e.preventDefault();
        wrapper.style.outline = '2px dashed #0284c7';
      });

      wrapper.addEventListener('dragleave', (e) => {
        e.preventDefault();
        wrapper.style.outline = 'none';
      });

      wrapper.addEventListener('drop', (e) => {
        e.preventDefault();
        wrapper.style.outline = 'none';
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          const file = e.dataTransfer.files[0];
          if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (re) => {
              img.src = re.target.result;
              saveToLocalStorage();
            };
            reader.readAsDataURL(file);
          }
        }
      });
    });
  }

  // --- 7. Save Configuration (JSON) ---
  btnSave.addEventListener('click', () => {
    const data = {
      version: APP_VERSION,
      theme: themeSelect.value,
      htmlContent: newsletterPaper.innerHTML,
      timestamp: new Date().toISOString()
    };

    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const issueNum = document.getElementById('meta-issue')?.textContent.replace(/[^a-zA-Z0-9]/g, '_') || 'issue';
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `Turtle_Bay_First_7_Weeks_Newsletter_${issueNum}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // --- 8. Load Configuration (JSON) ---
  btnLoadTrigger.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(evt) {
        try {
          const data = JSON.parse(evt.target.result);
          if (data.htmlContent) {
            newsletterPaper.innerHTML = data.htmlContent;
            if (data.theme) {
              themeSelect.value = data.theme;
              document.body.className = `${data.theme} ${isPreviewMode ? 'preview-mode' : ''}`.trim();
            }
            initializeAllImageUploaders();
            saveToLocalStorage();
            alert('Newsletter configuration loaded successfully!');
          }
        } catch (err) {
          alert('Error loading file: Invalid JSON structure.');
        }
      };
      reader.readAsText(file);
    }
  });

  // --- 9. Reset to Default ---
  btnReset.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset the newsletter to default text? All unsaved edits will be cleared.')) {
      newsletterPaper.innerHTML = initialContentHTML;
      localStorage.removeItem('tb_newsletter_7weeks_autosave');
      initializeAllImageUploaders();
      themeSelect.value = 'theme-navy';
      document.body.className = 'theme-navy';
    }
  });

  // --- 10. LocalStorage Auto-Save ---
  newsletterPaper.addEventListener('input', () => {
    saveToLocalStorage();
  });

  function saveToLocalStorage() {
    const state = {
      version: APP_VERSION,
      html: newsletterPaper.innerHTML,
      theme: themeSelect.value
    };
    try {
      localStorage.setItem('tb_newsletter_7weeks_autosave', JSON.stringify(state));
    } catch (e) {
      console.warn('Autosave skipped (storage full) - use Save to download your work.');
    }
  }

  function loadFromLocalStorage() {
    const saved = localStorage.getItem('tb_newsletter_7weeks_autosave');
    if (saved) {
      try {
        const state = JSON.parse(saved);
        if (state.version === APP_VERSION && state.html) {
          newsletterPaper.innerHTML = state.html;
          if (state.theme) {
            themeSelect.value = state.theme;
            document.body.className = state.theme;
          }
        } else {
          localStorage.removeItem('tb_newsletter_7weeks_autosave');
        }
      } catch (e) {
        console.warn('Failed to parse autosave data', e);
      }
    }
    initializeAllImageUploaders();
  }

  // Initial load check
  loadFromLocalStorage();
});
