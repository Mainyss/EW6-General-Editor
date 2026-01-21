document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const fileInput = document.getElementById('fileInput');
    const exportBtn = document.getElementById('exportBtn');
    const createGeneralBtn = document.getElementById('createGeneralBtn');
    const searchInput = document.getElementById('searchInput');
    const countryFilter = document.getElementById('countryFilter');
    const generalList = document.getElementById('generalList');
    const editorHeader = document.getElementById('editorHeader');
    const currentGeneralName = document.getElementById('currentGeneralName');
    const currentGeneralId = document.getElementById('currentGeneralId');
    const editorForm = document.getElementById('editorForm');
    const newFileBtn = document.getElementById('newFileBtn');
    const langToggle = document.getElementById('langToggle');

    const apkInput = document.getElementById('apkInput');
    const exportApkBtn = document.getElementById('exportApkBtn');
    const statsContainer = document.getElementById('statsContainer');
    const totalCountEl = document.getElementById('totalCount');
    const inShopCountEl = document.getElementById('inShopCount');

    // Mobile Specific Elements
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.querySelector('.sidebar');

    // Create Overlay for Mobile
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    // State
    let generalsData = [];
    let selectedGeneralIndex = null;
    let originalFilename = 'GeneralSettings.json';
    let currentZip = null;
    let jsonPathInApk = null;

    // Language State
    let currentLang = 'en';

    // Translations Dictionary
    const TRANSLATIONS = {
        en: {
            header_generals: "Generals",
            stats_total: "Total",
            stats_in_shop: "In Shop",
            btn_create_new: "Create New",
            btn_load_json: "Load JSON",
            btn_load_apk: "Load APK",
            btn_export_json: "Export JSON",
            btn_export_apk: "Export APK",
            placeholder_search: "Search by ID or Name...",
            filter_country_all: "Filter: All Countries",
            filter_country_id: "Country ID",
            btn_create_general: "+ Create General",
            msg_no_file: "No file loaded.",
            msg_new_file_created: "New file created. Add a general to start.",
            msg_no_generals_apk: "No generals found in APK.",
            msg_no_generals_json: "No generals found. Create one!",
            msg_no_matches: "No matches found.",
            msg_select_general: "Select a General",
            footer_developed_by: "Developed by",
            btn_menu: "☰ Menu",

            // Logic / Alerts
            alert_unsaved_new: "Unsaved changes will be lost. Are you sure you want to create a new file?",
            alert_unsaved_apk: "Unsaved changes will be lost. Load new APK?",
            alert_unsaved_load: "Unsaved changes will be lost. Are you sure you want to load a new file?",
            alert_apk_no_file: "Error: GeneralSettings.json not found in this APK!",
            alert_apk_invalid_json: "Invalid JSON structure in APK.",
            alert_apk_success: "Loaded successfully from:",
            alert_apk_error: "Error processing APK file.",
            alert_no_apk_export: "No APK loaded to export!",
            alert_apk_exported: "APK Exported! Don't forget to RESIGN it with MT Manager.",
            alert_apk_export_error: "Error generating APK.",
            alert_json_invalid_array: "Invalid JSON structure. Expected an array.",
            alert_json_invalid_obj: "Invalid JSON structure. Objects do not look like Generals.",
            alert_json_error: "Error parsing JSON file. Please check the file format.",
            alert_delete_confirm: "Are you sure you want to delete general",
            alert_array_invalid: "Invalid array format.",

            // Dropdowns
            opt_infantry: "Infantry",
            opt_cavalry: "Cavalry",
            opt_artillery: "Artillery",
            opt_navy: "Navy",
            opt_hidden: "Hidden",
            opt_in_shop: "In Shop",
            opt_yellow: "Yellow",
            opt_purple: "Purple",
            opt_blue: "Blue",
            opt_green: "Green",

            // Placeholders
            ph_array: "e.g. 101, 102 (Comma separated)",
            ph_country: "Country ID (See stringtable_en.ini)"
        },
        tr: {
            header_generals: "Generaller",
            stats_total: "Toplam",
            stats_in_shop: "Markette",
            btn_create_new: "Yeni Oluştur",
            btn_load_json: "JSON Yükle",
            btn_load_apk: "APK Yükle",
            btn_export_json: "JSON Dışa Aktar",
            btn_export_apk: "APK Dışa Aktar",
            placeholder_search: "ID veya İsim ile ara...",
            filter_country_all: "Filtre: Ülke (Tümü)",
            filter_country_id: "Ülke ID",
            btn_create_general: "+ General Ekle",
            msg_no_file: "Dosya yüklenmedi.",
            msg_new_file_created: "Yeni dosya oluşturuldu. Başlamak için general ekleyin.",
            msg_no_generals_apk: "APK içinde general bulunamadı.",
            msg_no_generals_json: "General bulunamadı. Bir tane oluşturun!",
            msg_no_matches: "Eşleşme bulunamadı.",
            msg_select_general: "Bir General Seçin",
            footer_developed_by: "Geliştirici:",
            btn_menu: "☰ Menü",

            // Logic / Alerts
            alert_unsaved_new: "Kaydedilmemiş değişiklikler kaybolacak. Yeni bir dosya oluşturmak istediğinize emin misiniz?",
            alert_unsaved_apk: "Değişiklikler kaybolacak. Yeni APK yüklensin mi?",
            alert_unsaved_load: "Kaydedilmemiş değişiklikler kaybolacak. Yeni bir dosya yüklemek istediğinize emin misiniz?",
            alert_apk_no_file: "Hata: Bu APK içinde GeneralSettings.json bulunamadı!",
            alert_apk_invalid_json: "APK içindeki JSON yapısı geçersiz.",
            alert_apk_success: "Başarıyla yüklendi:",
            alert_apk_error: "APK dosyası işlenirken hata oluştu.",
            alert_no_apk_export: "Dışa aktarılacak APK yüklü değil!",
            alert_apk_exported: "APK Dışa Aktarıldı! MT Manager ile İMZALAMAYI unutmayın.",
            alert_apk_export_error: "APK oluşturulurken hata.",
            alert_json_invalid_array: "Geçersiz JSON yapısı. Bir dizi (array) bekleniyor.",
            alert_json_invalid_obj: "Geçersiz JSON yapısı. Nesneler General formatına uymuyor.",
            alert_json_error: "JSON dosyası işlenirken hata. Lütfen dosya formatını kontrol edin.",
            alert_delete_confirm: "Şu generali silmek istediğinize emin misiniz:",
            alert_array_invalid: "Geçersiz dizi formatı.",

            // Dropdown Values (TR)
            opt_infantry: "Piyade",
            opt_cavalry: "Süvari",
            opt_artillery: "Topçu",
            opt_navy: "Donanma",
            opt_hidden: "Markette Yok",
            opt_in_shop: "Markette Var",
            opt_yellow: "Sarı",
            opt_purple: "Mor",
            opt_blue: "Mavi",
            opt_green: "Yeşil",

            // Placeholders
            ph_array: "ör. 101, 102 (Virgülle ayır)",
            ph_country: "Ülke ID (Bkz: stringtable_ko.ini)"
        }
    };

    // Initialize Language
    updateLanguage(currentLang);

    // Event Listeners
    newFileBtn.addEventListener('click', handleNewFile);
    fileInput.addEventListener('change', handleFileUpload);
    apkInput.addEventListener('change', handleApkUpload);
    exportBtn.addEventListener('click', handleExport);
    exportApkBtn.addEventListener('click', handleApkExport);
    createGeneralBtn.addEventListener('click', handleCreateGeneral);
    searchInput.addEventListener('input', handleSearch);
    countryFilter.addEventListener('change', () => renderList(searchInput.value));
    langToggle.addEventListener('click', toggleLanguage);

    // Mobile Sidebar Listeners
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleSidebar);
    }
    overlay.addEventListener('click', toggleSidebar);

    // Initial state
    updateLanguageToggleBtn();

    function t(key) {
        return TRANSLATIONS[currentLang][key] || key;
    }

    // Toggle Sidebar Function
    function toggleSidebar() {
        sidebar.classList.toggle('open');
        if (sidebar.classList.contains('open')) {
            overlay.classList.add('visible');
        } else {
            overlay.classList.remove('visible');
        }
    }

    function toggleLanguage() {
        currentLang = currentLang === 'en' ? 'tr' : 'en';
        updateLanguage(currentLang);
        updateLanguageToggleBtn();
        // Re-render UI to update dynamic content
        renderList(searchInput.value);
        populateCountryFilter();
        if (selectedGeneralIndex !== null) {
            renderForm(generalsData[selectedGeneralIndex]);
            currentGeneralName.textContent = generalsData[selectedGeneralIndex].EName || generalsData[selectedGeneralIndex].Name;
        }
    }

    function updateLanguageToggleBtn() {
        // Show CURRENT language
        langToggle.textContent = currentLang.toUpperCase();
    }

    function updateLanguage(lang) {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (TRANSLATIONS[lang][key]) {
                el.textContent = TRANSLATIONS[lang][key];
            }
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (TRANSLATIONS[lang][key]) {
                el.placeholder = TRANSLATIONS[lang][key];
            }
        });
    }

    // Custom Logger
    function log(message) {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[${timestamp}] ${message}`);
    }

    // Handle New File
    function handleNewFile() {
        if (generalsData.length > 0) {
            const confirmNew = confirm(t('alert_unsaved_new'));
            if (!confirmNew) return;
        }

        // Reset Data
        generalsData = [];
        selectedGeneralIndex = null;
        originalFilename = 'GeneralSettings.json';
        fileInput.value = ''; // Clear input

        // Reset UI
        enableControls();
        renderList();

        // Show empty state
        editorForm.innerHTML = `<div class="empty-message">${t('msg_new_file_created')}</div>`;
        editorHeader.classList.remove('visible');
        editorHeader.classList.add('video-hidden');

        populateCountryFilter(); // Reset filter

        if (window.innerWidth <= 768) {
            toggleSidebar(); // Close sidebar on mobile
        }
    }

    // APK Upload Handler
    function handleApkUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Warning if data exists
        if (generalsData.length > 0) {
            if (!confirm(t('alert_unsaved_apk'))) {
                event.target.value = '';
                return;
            }
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const arrayBuffer = e.target.result;
                const zip = await JSZip.loadAsync(arrayBuffer);

                // Find GeneralSettings.json
                let foundPath = null;
                zip.forEach((relativePath, zipEntry) => {
                    if (relativePath.endsWith('GeneralSettings.json')) {
                        foundPath = relativePath;
                    }
                });

                if (!foundPath) {
                    alert(t('alert_apk_no_file'));
                    return;
                }

                jsonPathInApk = foundPath;
                currentZip = zip;

                const content = await zip.file(foundPath).async("string");
                generalsData = JSON.parse(content);

                // Validate
                if (!Array.isArray(generalsData)) {
                    alert(t('alert_apk_invalid_json'));
                    return;
                }

                enableControls();
                populateCountryFilter();
                renderList();
                if (generalsData.length > 0) selectGeneral(0);
                else {
                    editorForm.innerHTML = `<div class="empty-message">${t('msg_no_generals_apk')}</div>`;
                    editorHeader.classList.remove('visible');
                }

                alert(`${t('alert_apk_success')} ${foundPath}`);
                log(`${t('alert_apk_success')} ${file.name}`); // Localized log

                if (window.innerWidth <= 768) {
                    toggleSidebar();
                }

            } catch (error) {
                console.error(error);
                alert(t('alert_apk_error'));
            }
        };
        reader.readAsArrayBuffer(file);
    }

    // Export APK Handler (Mobile Fix Applied)
    async function handleApkExport() {
        if (!currentZip || !jsonPathInApk) {
            alert(t('alert_no_apk_export'));
            return;
        }

        try {
            // Update JSON in ZIP
            const jsonContent = JSON.stringify(generalsData, null, 2); // formatting for safety
            currentZip.file(jsonPathInApk, jsonContent);

            // Generate Blob with explicit APK MIME type
            const content = await currentZip.generateAsync({ type: "uint8array" });
            const blob = new Blob([content], { type: "application/vnd.android.package-archive" });

            // Download
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "Modified_Gen_Editor.apk"; // New name to differentiate
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            alert(t('alert_apk_exported'));
            log(t('alert_apk_exported'));
        } catch (err) {
            console.error(err);
            alert(t('alert_apk_export_error'));
        }
    }

    // File Upload Handler
    function handleFileUpload(event) {
        // Warning if data exists
        if (generalsData.length > 0) {
            const confirmLoad = confirm(t('alert_unsaved_load'));
            if (!confirmLoad) {
                event.target.value = ''; // Reset file input
                return;
            }
        }

        const file = event.target.files[0];
        if (!file) return;

        originalFilename = file.name;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                generalsData = JSON.parse(e.target.result);

                // Validate if it looks like an array of generals
                if (!Array.isArray(generalsData)) {
                    alert(t('alert_json_invalid_array'));
                    return;
                }

                // If not empty, check if it looks like generals
                if (generalsData.length > 0 && !generalsData[0].hasOwnProperty('Id')) {
                    alert(t('alert_json_invalid_obj'));
                    return;
                }

                enableControls();
                populateCountryFilter();
                renderList();
                // Select the first one by default if not empty
                if (generalsData.length > 0) {
                    selectGeneral(0);
                } else {
                    // If empty, clear editor
                    editorForm.innerHTML = `<div class="empty-message">${t('msg_no_generals_json')}</div>`;
                    editorHeader.classList.remove('visible');
                    editorHeader.classList.add('video-hidden');
                }
                log(`${t('alert_apk_success')} ${file.name}`);

                if (window.innerWidth <= 768) {
                    toggleSidebar();
                }
            } catch (error) {
                console.error(error);
                alert(t('alert_json_error'));
            }
        };
        reader.readAsText(file);
    }

    function enableControls() {
        exportBtn.disabled = false;
        createGeneralBtn.disabled = false;
        searchInput.disabled = false;
        countryFilter.disabled = false;

        // Enable APK export only if we have a zip loaded
        if (currentZip) {
            exportApkBtn.disabled = false;
        } else {
            exportApkBtn.disabled = true;
        }
    }

    // Render List
    function renderList(searchTerm = '') {
        generalList.innerHTML = '';
        const term = searchTerm.toLowerCase();
        const selectedCountry = countryFilter.value;

        // Update Stats
        updateStats();

        generalsData.forEach((gen, originalIndex) => {
            // Filter logic
            if (term && !gen.Name.toLowerCase().includes(term) && !gen.Id.toString().includes(term) && !(gen.EName && gen.EName.toLowerCase().includes(term))) {
                return;
            }

            // Country Filter
            if (selectedCountry !== 'all') {
                const cVal = Number(selectedCountry);
                // Support both Array (1914) and Number (1804)
                let match = false;
                if (gen.Country) {
                    if (Array.isArray(gen.Country) && gen.Country.includes(cVal)) {
                        match = true;
                    } else if (typeof gen.Country === 'number' && gen.Country === cVal) {
                        match = true;
                    }
                }

                if (!match) return;
            }

            const li = document.createElement('li');
            li.setAttribute('data-index', originalIndex);

            const idSpan = document.createElement('span');
            idSpan.className = 'gen-id';
            idSpan.textContent = `#${gen.Id}`;

            const nameSpan = document.createElement('span');
            nameSpan.textContent = gen.EName || gen.Name || 'Unknown';

            li.appendChild(idSpan);
            li.appendChild(nameSpan);

            // Delete Button
            const deleteBtn = document.createElement('img');
            deleteBtn.src = 'delete_icon.png';
            deleteBtn.className = 'delete-btn';
            deleteBtn.title = 'Delete General';

            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent selecting the item
                deleteGeneral(originalIndex);
            });

            li.appendChild(deleteBtn);

            li.addEventListener('click', () => {
                selectGeneral(originalIndex);
                if (window.innerWidth <= 768) {
                    toggleSidebar(); // Auto-close sidebar on select mobile
                }
            });

            if (originalIndex === selectedGeneralIndex) {
                li.classList.add('active');
            }

            generalList.appendChild(li);
        });

        if (generalList.children.length === 0) {
            generalList.innerHTML = `<li class="empty-state">${t('msg_no_matches')}</li>`;
        }
    }

    function handleSearch(e) {
        renderList(e.target.value);
    }

    // Select General
    function selectGeneral(index) {
        selectedGeneralIndex = index;
        const general = generalsData[index];

        // Update list active state
        Array.from(generalList.children).forEach(li => {
            li.classList.remove('active');
            if (parseInt(li.getAttribute('data-index')) === index) {
                li.classList.add('active');
                li.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });

        // Update Header
        editorHeader.classList.remove('video-hidden');
        editorHeader.classList.add('visible');
        currentGeneralName.textContent = general.EName || general.Name;
        currentGeneralId.textContent = `ID: ${general.Id}`;

        // Render Form
        renderForm(general);
    }

    // Render Form
    function renderForm(general) {
        editorForm.innerHTML = '';

        for (const [key, value] of Object.entries(general)) {
            const formGroup = document.createElement('div');
            formGroup.className = 'form-group';

            const label = document.createElement('label');
            label.textContent = key;
            formGroup.appendChild(label);

            let input;

            if (Array.isArray(value)) {
                // Determine if it's an array of numbers or strings
                input = document.createElement('input');
                input.type = 'text';
                input.value = JSON.stringify(value).replace(/^\[|\]$/g, ''); // Remove brackets for cleaner CSV look

                if (key === 'Country') {
                    input.placeholder = t('ph_country');
                } else {
                    input.placeholder = t('ph_array');
                }

                input.addEventListener('change', (e) => {
                    try {
                        let strVal = e.target.value;
                        if (!strVal.trim()) {
                            general[key] = [];
                            return;
                        }

                        // Split by comma
                        const rawArr = strVal.split(',').map(s => s.trim());

                        let isNumeric = false;
                        if (value.length > 0 && typeof value[0] === 'number') {
                            isNumeric = true;
                        } else if (rawArr.every(x => !isNaN(x) && x !== '')) {
                            isNumeric = true;
                        }

                        if (isNumeric) {
                            general[key] = rawArr.map(x => Number(x));
                        } else {
                            general[key] = rawArr;
                        }

                        // Use strict equality for cleaner check
                        if (key === 'Country') {
                            populateCountryFilter();
                        }

                    } catch (err) {
                        console.error('Error updating array', err);
                        alert(t('alert_array_invalid'));
                    }
                });

            } else if (key === 'ArmyType') {
                // Dropdown for ArmyType
                input = document.createElement('select');

                const options = [
                    { val: 1, text: t('opt_infantry') },
                    { val: 2, text: t('opt_cavalry') },
                    { val: 3, text: t('opt_artillery') },
                    { val: 4, text: t('opt_navy') }
                ];

                options.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt.val;
                    option.textContent = opt.text;
                    if (value === opt.val) option.selected = true;
                    input.appendChild(option);
                });

                input.addEventListener('change', (e) => {
                    general[key] = Number(e.target.value);
                    updateStats();
                });

            } else if (key === 'InShop') {
                // Dropdown for InShop
                input = document.createElement('select');

                const options = [
                    { val: 0, text: t('opt_hidden') },
                    { val: 1, text: t('opt_in_shop') }
                ];

                options.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt.val;
                    option.textContent = opt.text;
                    if (value === opt.val) option.selected = true;
                    input.appendChild(option);
                });

                input.addEventListener('change', (e) => {
                    general[key] = Number(e.target.value);
                    updateStats();
                });

            } else if (key === 'Quality') {
                // Dropdown for Quality
                input = document.createElement('select');

                const options = [
                    { val: 1, text: t('opt_yellow') },
                    { val: 2, text: t('opt_purple') },
                    { val: 3, text: t('opt_blue') },
                    { val: 4, text: t('opt_green') }
                ];

                options.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt.val;
                    option.textContent = opt.text;
                    if (value === opt.val) option.selected = true;
                    input.appendChild(option);
                });

                input.addEventListener('change', (e) => {
                    general[key] = Number(e.target.value);
                    updateStats();
                });

            } else if (typeof value === 'number') {
                input = document.createElement('input');
                input.type = 'number';
                input.setAttribute('inputmode', 'numeric'); // Mobile numeric keyboard
                input.value = value;
                input.addEventListener('change', (e) => {
                    general[key] = Number(e.target.value);
                    updateStats();
                });
            } else {
                // String or other
                input = document.createElement('input');
                input.type = 'text';
                input.value = value || '';

                input.addEventListener('change', (e) => {
                    general[key] = e.target.value;
                    if (key === 'Name' || key === 'EName') {
                        currentGeneralName.textContent = general.EName || general.Name;
                        // Refresh list item text
                        renderList(searchInput.value);
                        // Re-select to keep focus logic if needed, but renderList wipes DOM.
                        const activeItem = document.querySelector(`.general-list li[data-index="${selectedGeneralIndex}"]`);
                        if (activeItem) activeItem.classList.add('active');
                    }
                });
            }

            formGroup.appendChild(input);
            editorForm.appendChild(formGroup);
        }
    }

    // Create General Logic
    function handleCreateGeneral() {
        // 1. Hidden Template
        const newGeneral = {
            "Id": 0,
            "Name": "New General",
            "EName": "New General",
            "Country": [], // Empty by default per user request
            "ArmyType": 1,
            "Quality": 1,
            "InitTitleLv": 1,
            "MaxTitleLv": 1,
            "InitMilitary": 1,
            "Leader": 1,
            "BattleAbility": 30,
            "ExtendBattleAbility": 30,
            "SkillId": [],
            "UnlockCampaignId": 0,
            "InShop": 1,
            "CostMedals": 100,
            "CostGold": 1000,
            "Photo": "New General",
            "EquipmentId1": 0,
            "EquipmentId2": 0,
            "ArmyId": 0,
            "ArmyLv": 0,
            "CostMaterial": 0
        };

        // 2. Find Max ID and Assign New ID
        let maxId = 0;
        generalsData.forEach(gen => {
            if (gen.Id && typeof gen.Id === 'number' && gen.Id > maxId) {
                maxId = gen.Id;
            }
        });
        newGeneral.Id = maxId + 1;
        newGeneral.Name = newGeneral.Id.toString();

        // 3. Append
        generalsData.push(newGeneral);

        // 4. Update UI
        const newIndex = generalsData.length - 1;
        populateCountryFilter(); // Update filter
        renderList(searchInput.value); // Re-render list
        selectGeneral(newIndex); // select the new one

        // Scroll list to bottom
        generalList.scrollTop = generalList.scrollHeight;
        log(`Created new general ID: ${newGeneral.Id}`);

        if (window.innerWidth <= 768) {
            toggleSidebar(); // Close sidebar on mobile
        }
    }

    // Export Logic
    function handleExport() {
        if (generalsData.length === 0) return;

        const dataStr = JSON.stringify(generalsData, null, 4);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = "GeneralSettings.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        log("JSON exported successfully.");
    }

    function updateStats() {
        if (generalsData.length === 0) {
            statsContainer.style.display = 'none';
            return;
        }
        statsContainer.style.display = 'flex';
        totalCountEl.textContent = generalsData.length;

        const inShop = generalsData.filter(g => g.InShop === 1).length;
        inShopCountEl.textContent = inShop;
    }

    function populateCountryFilter() {
        if (generalsData.length === 0) {
            countryFilter.innerHTML = `<option value="all">${t('filter_country_all')}</option>`;
            countryFilter.disabled = true;
            return;
        }

        countryFilter.disabled = false;

        const countries = new Set();
        generalsData.forEach(gen => {
            if (gen.Country) {
                if (Array.isArray(gen.Country)) {
                    gen.Country.forEach(c => countries.add(c));
                } else if (typeof gen.Country === 'number') {
                    countries.add(gen.Country);
                }
            }
        });

        const sorted = Array.from(countries).sort((a, b) => a - b);

        // Save current selection if possible, else reset
        const currentVal = countryFilter.value;

        countryFilter.innerHTML = `<option value="all">${t('filter_country_all')}</option>`;
        sorted.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c;
            opt.textContent = `${t('filter_country_id')}: ${c}`;
            countryFilter.appendChild(opt);
        });

        // Restore selection if valid
        if (currentVal !== 'all' && sorted.includes(Number(currentVal))) {
            countryFilter.value = currentVal;
        }
    }

    // Delete General
    function deleteGeneral(index) {
        const gen = generalsData[index];
        const msg = `${t('alert_delete_confirm')} #${gen.Id} (${gen.EName || gen.Name})?`;

        const confirmDelete = confirm(msg);

        if (confirmDelete) {
            generalsData.splice(index, 1);

            // Adjust selection if needed
            if (index === selectedGeneralIndex) {
                selectedGeneralIndex = null;
                editorForm.innerHTML = `<h2 id="currentGeneralName" data-i18n="msg_select_general">${t('msg_select_general')}</h2>`; // Safe default or simple clear
                editorHeader.classList.remove('visible');
                editorHeader.classList.add('video-hidden');
            } else if (index < selectedGeneralIndex) {
                selectedGeneralIndex--; // Shift index
            }

            populateCountryFilter();
            renderList(searchInput.value);
            updateStats();
            log(`Deleted general ID: ${gen.Id}`);
        }
    }

    // Prevent accidental reload/close
    window.addEventListener('beforeunload', (e) => {
        if (generalsData.length > 0) {
            e.preventDefault();
            e.returnValue = '';
        }
    });

});
