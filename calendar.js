const CLIENT_ID = '1020823824456-95ekhth22kl5et5umnmi7fu3jojp8um0.apps.googleusercontent.com';
const API_KEY = 'AIzaSyClleijqv1AMwVF6PBDX2tKn9v36LEpxt4';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;

function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
    });
    gapiInited = true;
    maybeEnableButtons();
}

function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // Will set later
    });
    gisInited = true;
    maybeEnableButtons();
}

function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        listUpcomingEvents();
    }
}

function listUpcomingEvents() {
    tokenClient.callback = async (resp) => {
        if (resp.error) {
            throw (resp);
        }
        const events = await gapi.client.calendar.events.list({
            'calendarId': 'primary',
            'timeMin': (new Date()).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 10,
            'orderBy': 'startTime'
        });

        const eventsDiv = document.getElementById('calendar-events');
        eventsDiv.innerHTML = '';

        if (!events.result.items || events.result.items.length === 0) {
            eventsDiv.innerHTML = '<p>No upcoming events found.</p>';
            return;
        }

        events.result.items.forEach(event => {
            const when = event.start.dateTime || event.start.date;
            const div = document.createElement('div');
            div.className = 'p-4 bg-gray-800 rounded-xl shadow-md mb-2';
            div.innerHTML = `<strong>${event.summary}</strong><br><small>${when}</small>`;
            eventsDiv.appendChild(div);
        });
    };

    tokenClient.requestAccessToken({ prompt: '' });
}

// Correct way to start
window.addEventListener('load', () => {
    gapiLoaded();
    gisLoaded();
});

// Logout
const logoutButton = document.getElementById('logout-btn');
if (logoutButton) {
  logoutButton.addEventListener('click', () => {
    window.location.href = "index.html";
  });
}
