// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: "../dist/scripts/",
    paths: {
        Utils: "./Utils",
        Ball: "./Ball",
        index: "./index",
    }
});

