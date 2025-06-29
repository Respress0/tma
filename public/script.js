document.addEventListener('DOMContentLoaded', () => {
    // Инициализация Supabase
    const supabase = window.supabase.createClient(
        'https://aatlvnreiwitnopwlgci.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhdGx2bnJlaXdpdG5vcHdsZ2NpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NDU4NzcsImV4cCI6MjA2NjUyMTg3N30.y7oREoOvyUvdmWUQEdu5tStVuom1DKvtETbZpwHbq44'
    );

    // Инициализация Telegram WebApp
    const tg = window.Telegram.WebApp;
    tg.expand();
    tg.enableClosingConfirmation();

    // DOM элементы
    const elements = {
        tabs: {
            feed: document.getElementById('feed-tab'),
            create: document.getElementById('create-tab'),
            profile: document.getElementById('profile-tab'),
        },
        tabItems: document.querySelectorAll('.tab-item'),
        partiesList: document.getElementById('parties-list'),
        partyModal: document.getElementById('party-modal'),
        modalTitle: document.getElementById('modal-party-title'),
        modalDescription: document.getElementById('modal-party-description'),
        modalLocation: document.getElementById('modal-party-location'),
        modalDate: document.getElementById('modal-party-date'),
        modalParticipants: document.getElementById('modal-party-participants'),
        userName: document.getElementById('user-name'),
        userUsername: document.getElementById('user-username'),
        userAvatar: document.getElementById('user-avatar'),
        logoutButton: document.getElementById('logout-button'),
        loadingSection: document.getElementById('loading-section'),
        locationPicker: document.getElementById('location-picker'),
        createPartyBtn: document.getElementById('create-party'),
        joinPartyBtn: document.getElementById('join-party'),
        sharePartyBtn: document.getElementById('share-party'),
        closeModalBtn: document.querySelector('.close-btn')
    };

    // Текущий пользователь
    let currentUser = null;

    // Основные функции
    function showLoader(show = true) {
        elements.loadingSection.classList.toggle('hidden', !show);
    }

    function switchTab(tabName) {
        // Скрыть все вкладки
        Object.values(elements.tabs).forEach(tab => {
            tab.classList.add('hidden');
        });
        
        // Показать выбранную вкладку
        elements.tabs[tabName].classList.remove('hidden');
        
        // Обновить активный элемент в таб-баре
        elements.tabItems.forEach(item => {
            item.classList.toggle('active', item.dataset.tab === tabName);
        });
    }

    async function loadParties() {
        showLoader(true);
        try {
            // Загрузка вечеринок из Supabase
            const { data: parties, error } = await supabase
                .from('parties')
                .select('*')
                .eq('is_public', true)
                .order('date', { ascending: true });
            
            if (error) throw error;
            
            renderParties(parties);
        } catch (error) {
            console.error('Ошибка загрузки вечеринок:', error);
            elements.partiesList.innerHTML = '<p>Не удалось загрузить вечеринки</p>';
        } finally {
            showLoader(false);
        }
    }

    function renderParties(parties) {
        elements.partiesList.innerHTML = '';
        
        if (!parties || parties.length === 0) {
            elements.partiesList.innerHTML = '<p>Пока нет активных вечеринок</p>';
            return;
        }
        
        parties.forEach(party => {
            const partyCard = document.createElement('div');
            partyCard.className = 'party-card';
            partyCard.innerHTML = `
                <div class="party-header">
                    <div class="party-title">${party.title}</div>
                    <div class="party-meta">
                        <span><i class="far fa-calendar"></i> ${new Date(party.date).toLocaleDateString()}</span>
                        <span><i class="far fa-user"></i> ${party.current_participants}/${party.max_participants}</span>
                    </div>
                </div>
                <div class="party-body">
                    <p class="party-description">${party.description || 'Описание отсутствует'}</p>
                </div>
                <div class="party-footer">
                    <div class="participants">
                        <img src="https://via.placeholder.com/30" class="avatar">
                        <img src="https://via.placeholder.com/30" class="avatar">
                        <img src="https://via.placeholder.com/30" class="avatar">
                        <span>+${Math.max(0, party.current_participants - 3)}</span>
                    </div>
                    <div>
                        <span class="status-badge ${party.current_participants < party.max_participants ? 'status-open' : 'status-full'}">
                            ${party.current_participants < party.max_participants ? 'Открыта' : 'Мест нет'}
                        </span>
                    </div>
                </div>
            `;
            
            partyCard.addEventListener('click', () => openPartyModal(party));
            elements.partiesList.appendChild(partyCard);
        });
    }

    function openPartyModal(party) {
        elements.modalTitle.textContent = party.title;
        elements.modalDescription.textContent = party.description || 'Описание отсутствует';
        elements.modalLocation.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${party.location || 'Место не указано'}`;
        elements.modalDate.textContent = new Date(party.date).toLocaleString();
        
        // Обновление статуса
        const statusBadge = document.querySelector('.status-badge');
        statusBadge.className = 'status-badge ' + 
            (party.current_participants < party.max_participants ? 'status-open' : 'status-full');
        statusBadge.textContent = party.current_participants < party.max_participants ? 'Открыта' : 'Мест нет';
        
        // Обновление кнопки
        elements.joinPartyBtn.textContent = party.current_participants < party.max_participants ? 
            'Хочу пойти!' : 'Мест нет';
        elements.joinPartyBtn.disabled = party.current_participants >= party.max_participants;
        
        elements.partyModal.classList.remove('hidden');
    }

    function closePartyModal() {
        elements.partyModal.classList.add('hidden');
    }

    async function createParty() {
        showLoader(true);
        
        const partyData = {
            title: document.getElementById('party-title').value,
            is_public: !document.getElementById('party-type').checked,
            description: document.getElementById('party-description').value,
            max_participants: parseInt(document.getElementById('party-max').value) || 10,
            location: 'Выбранное место', // Реальное значение будет из Telegram
            date: document.getElementById('party-date').value,
            organizer_id: currentUser.id,
            current_participants: 1,
            created_at: new Date().toISOString()
        };
        
        try {
            const { data, error } = await supabase
                .from('parties')
                .insert([partyData]);
            
            if (error) throw error;
            
            // Уведомление об успехе
            tg.showAlert('Вечеринка успешно создана!');
            
            // Переключение на вкладку ленты
            switchTab('feed');
            loadParties();
            
            // Очистка формы
            document.getElementById('party-title').value = '';
            document.getElementById('party-description').value = '';
        } catch (error) {
            console.error('Ошибка создания вечеринки:', error);
            tg.showAlert('Не удалось создать вечеринку: ' + error.message);
        } finally {
            showLoader(false);
        }
    }

    function updateUserProfile(user) {
        elements.userName.textContent = `${user.first_name} ${user.last_name || ''}`.trim();
        elements.userUsername.textContent = user.username ? `@${user.username}` : '';
        elements.userAvatar.src = user.photo_url || 'https://via.placeholder.com/100';
    }

    // Обработчики событий
    elements.tabItems.forEach(tab => {
        tab.addEventListener('click', () => {
            switchTab(tab.dataset.tab);
        });
    });

    elements.closeModalBtn.addEventListener('click', closePartyModal);
    elements.joinPartyBtn.addEventListener('click', () => {
        tg.showAlert('Вы успешно записались на вечеринку!');
        closePartyModal();
    });

    elements.sharePartyBtn.addEventListener('click', () => {
        if (tg.isVersionAtLeast('6.1')) {
            tg.shareUrl(
                `https://t.me/share/url?url=${encodeURIComponent('https://example.com/party')}&text=${encodeURIComponent('Присоединяйся к моей вечеринке!')}`
            );
        } else {
            tg.showAlert('Функция доступна в последней версии Telegram');
        }
    });

    elements.locationPicker.addEventListener('click', () => {
        if (tg.isVersionAtLeast('6.4')) {
            tg.showLocationPicker({
                callback: (location) => {
                    if (location) {
                        document.getElementById('location-display').innerHTML = `
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}</span>
                        `;
                    }
                }
            });
        } else {
            tg.showAlert('Функция доступна в Telegram 6.4+');
        }
    });

    elements.createPartyBtn.addEventListener('click', createParty);
    elements.logoutButton.addEventListener('click', () => tg.close());

    // Инициализация приложения
    function initApp() {
        if (tg.initDataUnsafe?.user) {
            currentUser = tg.initDataUnsafe.user;
            updateUserProfile(currentUser);
            loadParties();
        } else {
            tg.showAlert('Ошибка авторизации');
        }
    }

    // Запуск приложения
    tg.ready();
    initApp();
    
    // Установка даты по умолчанию
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('party-date').value = now.toISOString().slice(0, 16);
});