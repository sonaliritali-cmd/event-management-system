// Sample events for our website
const events = [
    {
        id: 1,
        title: "Neon Nights Music Festival",
        category: "Music",
        date: "2026-11-15",
        location: "Bhubaneswar, Odisha",
        price: 499,
        description: "Experience live music, amazing artists and unforgettable energy.",
        image: "photo-1459749411175-04bf5292ceea"
    },
    {
        id: 2,
        title: "Future Tech Summit",
        category: "Technology",
        date: "2026-11-20",
        location: "Bengaluru, India",
        price: 799,
        description: "Discover new ideas in AI, web development and technology.",
        image: "photo-1485827404703-89b55fcc595e"
    },
    {
        id: 3,
        title: "Creative Art Exhibition",
        category: "Art",
        date: "2026-11-25",
        location: "New Delhi, India",
        price: 299,
        description: "Explore inspiring artwork, creativity and modern design.",
        image: "photo-1577083552431-6e5fd01aa342"
    },
    {
        id: 4,
        title: "Web Development Workshop",
        category: "Workshop",
        date: "2026-12-05",
        location: "Online",
        price: 199,
        description: "Learn practical frontend development with hands-on projects.",
        image: "photo-1516321318423-f06f85e504b3"
    },
    {
        id: 5,
        title: "Sunset Live Sessions",
        category: "Music",
        date: "2026-12-12",
        location: "Puri, Odisha",
        price: 599,
        description: "Enjoy an evening of music, beautiful views and good vibes.",
        image: "photo-1506157786151-b8491531f063"
    },
    {
        id: 6,
        title: "Design & Innovation Lab",
        category: "Workshop",
        date: "2026-12-18",
        location: "Online",
        price: 249,
        description: "Explore UI/UX design, creative thinking and digital products.",
        image: "photo-1497366754035-f200968a6e72"
    }
];

// Get HTML elements
const eventGrid = document.getElementById("eventGrid");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const eventCount = document.getElementById("eventCount");
const emptyMessage = document.getElementById("emptyMessage");
const toast = document.getElementById("toast");

let selectedCategory = "All";

// Display the date in a readable format
function formatDate(dateString) {
    const date = new Date(dateString + "T12:00:00");

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

// Display the price in Indian rupees
function formatPrice(price) {
    if (price === 0) {
        return "Free";
    }

    return "₹" + price.toLocaleString("en-IN");
}

// Display event cards
function displayEvents(eventList) {
    eventGrid.innerHTML = "";

    eventCount.textContent =
        eventList.length +
        (eventList.length === 1 ? " experience" : " experiences");

    emptyMessage.hidden = eventList.length !== 0;

    eventList.forEach(function (event) {
        const card = document.createElement("article");
        card.className = "event-card";

        // Build the card using the event data
        card.innerHTML = `
            <div class="event-image">
                <img
                    src="https://images.unsplash.com/${event.image}?auto=format&fit=crop&w=700&q=80"
                    alt="${event.title}"
                    loading="lazy"
                >
                <span class="event-category">${event.category}</span>
            </div>

            <div class="event-content">
                <p class="event-date">${formatDate(event.date)}</p>

                <h3>${event.title}</h3>

                <p class="event-description">${event.description}</p>

                <div class="event-meta">
                    <span class="event-location">📍 ${event.location}</span>
                    <span class="event-price">${formatPrice(event.price)}</span>
                </div>

                <button class="book-button" data-id="${event.id}">
                    View Booking Details ↗
                </button>
            </div>
        `;

        eventGrid.appendChild(card);
    });
}

// Search and category filter
function filterEvents() {
    const searchText = searchInput.value.toLowerCase().trim();

    const filteredEvents = events.filter(function (event) {
        const matchesSearch =
            event.title.toLowerCase().includes(searchText) ||
            event.location.toLowerCase().includes(searchText) ||
            event.category.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "All" ||
            event.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    displayEvents(filteredEvents);
}

// Category button clicks
document.querySelectorAll(".category").forEach(function (button) {
    button.addEventListener("click", function () {
        document.querySelectorAll(".category").forEach(function (item) {
            item.classList.remove("active");
        });

        button.classList.add("active");

        selectedCategory = button.dataset.category;

        filterEvents();
    });
});

// Search as the user types
searchInput.addEventListener("input", filterEvents);

// Search button
searchButton.addEventListener("click", filterEvents);

// Show a notification
function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    // Hide notification after a short delay
    window.setTimeout(function () {
        toast.classList.remove("show");
    }, 3000);
}

// Handle booking button clicks
eventGrid.addEventListener("click", function (event) {
    const button = event.target.closest(".book-button");

    if (!button) {
        return;
    }

    const eventId = Number(button.dataset.id);

    const selectedEvent = events.find(function (item) {
        return item.id === eventId;
    });

    if (selectedEvent) {
        showToast(
            selectedEvent.title +
            " — " +
            formatPrice(selectedEvent.price) +
            ". Booking will be connected to the database in the next step."
        );
    }
});

// Load all events when the page opens
displayEvents(events);