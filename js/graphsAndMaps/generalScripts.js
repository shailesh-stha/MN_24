document.addEventListener('DOMContentLoaded', function() {
    // Get references to the location selector and the div
    const locationSelector = document.getElementById('locationSelector');
    const simulationScenarioSelection = document.getElementById('simulationScenarioSelection');

    // Function to check the value of the location selector and show/hide the div
    function toggleSimulationScenarioSelection() {
        if (locationSelector.value === '2') {
            simulationScenarioSelection.style.display = 'block';
        } else {
            simulationScenarioSelection.style.display = 'none';
        }
    }

    // Initial check when the page loads
    toggleSimulationScenarioSelection();

    // Add event listener to the location selector to detect changes
    locationSelector.addEventListener('change', toggleSimulationScenarioSelection);
});
