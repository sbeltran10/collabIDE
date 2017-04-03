var highlighter = {};
var devContexts = {};
var developerSpans = [];

// Adapt the default context
DefaultTrait = Trait({
    defineVisibility: developerSpans.forEach(function (element) {
        
    }, this)
});
contexts.Default.adapt(highlighter, DefaultTrait);

// Defining traits for the contexts
function loadContexts(developerName, developerData) {
    developerSpans.push(developerName)
    adaptDefaultContext(developerName, developerData);

}

// Define the default context
function adaptDefaultContext(developerName, developerData) {



}

// Define the specific context
function adaptSpecificContext(developerName, developerData) {

}

