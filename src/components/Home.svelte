<script>
    import TripPlanner from "./TripPlanner.svelte";
    import TimeTable from "./TimeTable.svelte";
    import Map from "./Map.svelte";
    import Marquee from "./Marquee.svelte";

    let latitude, longitude;

    // Function to get the current position
    function getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    function (position) {
                        resolve(position);
                    },
                    function (error) {
                        reject(error);
                    },
                );
            } else {
                reject(
                    new Error(
                        "Geolocation API is not available in this browser.",
                    ),
                );
            }
        });
    }
</script>

<main class="grid-container">
    <!-- Marquee for Warnings -->
    <Marquee />

    <!-- Form -->
    <TripPlanner />

    <!-- Map -->
    <div class="map-container">
        <Map {latitude} {longitude} />
    </div>

    <!-- Schedule Form -->
    <div class="scheduleFetchBackground">
        <TimeTable />
    </div>
</main>

<style>
    @keyframes scroll {
        from {
            transform: translateX(0%);
        }
        to {
            transform: translateX(-100%);
        }
    }

    /* Main Grid Layout */
    .grid-container {
        display: grid;
        grid-template-columns: 1fr 2fr;
        grid-template-rows: auto auto;
        gap: 20px;
        padding: 1em;
        max-width: 1000px;
        margin: 40px auto; /* Add space for the marquee */
    }

    .map-container {
        grid-column: 2;
        grid-row: 1;
        height: 500px;
    }

    .scheduleFetchBackground {
        background-color: #d9d9d9;
        padding: 1em;
        grid-column: 1 / span 2;
        grid-row: 2;
        width: 50%;
    }

    @media (min-width: 640px) {
        .grid-container {
            max-width: none;
        }
    }
</style>
