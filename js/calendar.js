// Initialize the Google API client
console.log('Page Loaded Successfully!')
function loadCalendarAPI() {
    gapi.load('client:auth2', initClient);
}

// Initialize the client with API key and client ID
function initClient() {
    gapi.client.init({
        apiKey: 'AIzaSyClleijqv1AMwVF6PBDX2tKn9v36LEpxt4',  // Your actual API key
        clientId: '1020823824456-95ekhth22kl5et5umnmi7fu3jojp8um0.apps.googleusercontent.com',  // Your actual client ID
        scope: 'https://www.googleapis.com/auth/calendar.readonly',
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
    }).then(function () {
        console.log('Google API Client Initialized.');
    }).catch(function (error) {
        console.error('Error initializing Google API client:', error);
    });
}

// Authenticate the user and sign them in
function authenticateGoogle() {
    gapi.auth2.getAuthInstance().signIn().then(function () {
        console.log('User signed in');
        // After signing in, load the calendar events
        loadCalendarEvents();
    }).catch(function (error) {
        console.error('Error during authentication:', error);
    });
}

// Sign out the user
function signOutGoogle() {
    gapi.auth2.getAuthInstance().signOut().then(function () {
        console.log('User signed out');
    }).catch(function (error) {
        console.error('Error during sign out:', error);
    });
}

// Load events from the Google Calendar
function loadCalendarEvents() {
    const request = gapi.client.calendar.events.list({
        calendarId: 'primary', // Use the primary calendar
        timeMin: (new Date()).toISOString(),
        maxResults: 10,  // Maximum number of events to fetch
        singleEvents: true,
        orderBy: 'startTime',
    });

    request.execute(function (response) {
        if (response.items) {
            console.log('Upcoming events:', response.items);
            displayEvents(response.items); // Display events on the page
        } else {
            console.log('No upcoming events found.');
        }
    });
}

// Display events on the page
function displayEvents(events) {
    let eventsList = '<ul>';
    events.forEach(function (event) {
        eventsList += `<li>${event.summary} at ${event.start.dateTime || event.start.date}</li>`;
    });
    eventsList += '</ul>';
    document.getElementById('calendar-iframe').innerHTML = eventsList;
}

// Event listeners for login and logout buttons
document.getElementById('login-btn').addEventListener('click', function () {
    authenticateGoogle(); // Trigger Google Authentication
});

document.getElementById('logout-btn').addEventListener('click', function () {
    signOutGoogle(); // Trigger sign-out
});

// Load Google API
loadCalendarAPI();
