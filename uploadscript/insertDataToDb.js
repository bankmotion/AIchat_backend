const fs = require('fs-extra');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Supabase client initialization
const supabaseUrl = 'https://mvshrdholymztwznzgcv.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12c2hyZGhvbHltenR3em56Z2N2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkyMTI4MzcsImV4cCI6MjA0NDc4ODgzN30.nGR9a9kCE7uxmLCZEtLM-GE9UZW3FrCzQc3c4vWK0zk'; // Replace with your Supabase anon key
const supabase = createClient(supabaseUrl, supabaseKey);

// Log function to standardize logging format
const log = (message) => {
    console.log(`[LOG] ${new Date().toISOString()}: ${message}`);
};


// Function to insert character data into the characters table
const insertCharacterIntoDb = async (characterData) => {
    try {
        const { data, error } = await supabase
            .from('characters')
            .insert([{
                avatar: characterData.avatar,
                created_at: characterData.created_at,
                creator_id: characterData.creator_id,
                description: characterData.description,
                example_dialogs: characterData.example_dialogs,
                first_message: characterData.first_message,
                fts: characterData.fts,
                is_force_remove: characterData.is_force_remove,
                is_nsfw: characterData.is_nsfw,
                is_public: characterData.is_public,
                name: characterData.name,
                personality: characterData.personality,
                scenario: characterData.scenario,
                updated_at: characterData.updated_at,
                creator_name: characterData.creator_name,
                join_name: characterData.id,
            }]);

        if (error) {
            console.error('Error inserting character into database:', error);
        } else {
            log(`Inserted character into database: ${JSON.stringify(data)}`);
        }

        const tags = characterData.tags || [];
        const characterIdResponse = await supabase
            .from('characters')
            .select('id')
            .eq('name', characterData.name);

        // Check if characterIdResponse returned any results
        if (characterIdResponse.error) {
            console.error(`Error fetching character ID: ${characterIdResponse.error.message}`);
            return; // Exit the function on error
        }

        if (characterIdResponse.data.length === 0) {
            console.error(`Character not found: ${characterData.name}`);
            return; // Exit the function if the character doesn't exist
        }

        const characterId = characterIdResponse.data[0].id;
        console.log(tags, characterId, "tags, characterId");

        // Iterate over the tags
        for (const tag of tags) {
            console.log(tag, "tagName");

            const tagIdResponse = await supabase
                .from('tags')
                .select('id')
                .eq('join_name', tag);

            // Check for errors when fetching tag ID
            if (tagIdResponse.error) {
                console.error(`Error fetching tag ID for "${tag}": ${tagIdResponse.error.message}`);
                continue; // Skip to the next tag if an error occurs
            }

            // Check if the tag was found
            if (tagIdResponse.data.length === 0) {
                console.warn(`Tag not found: ${tag}`);
                continue; // Skip to the next tag if not found
            }

            const tagId = tagIdResponse.data[0].id;
            console.log(`tagId: ${tagId}`);

            // Insert the character-tag relationship
            const { data: characterTags, error: characterTagsError } = await supabase
                .from('character_tags')
                .insert([{
                    character_id: characterId,
                    tag_id: tagId,
                    created_at: new Date().toISOString(),
                }]);

            // Check for errors during insertion
            if (characterTagsError) {
                console.error(`Error inserting character-tag relationship: ${characterTagsError.message}`);
            } else {
                console.log(`Inserted character-tag relationship for character ID: ${characterId} and tag ID: ${tagId}`);
            }
        }

    } catch (error) {
        console.error('Error during database insertion:', error);
    }
};

// Function to insert characters from JSON files in the output-json folder
const insertCharactersFromJsonFiles = async (folderPath) => {
    log(`Starting to insert characters from JSON files in folder: ${folderPath}`);

    // Ensure the folder exists
    if (!fs.existsSync(folderPath)) {
        console.error('Folder does not exist!');
        return;
    }

    // Get all JSON files in the folder
    const files = await fs.readdir(folderPath);
    const jsonFiles = files.filter(file => path.extname(file).toLowerCase() === '.json');

    log(`Found ${jsonFiles.length} JSON file(s) in folder: ${folderPath}`);

    for (const file of jsonFiles) {
        const filePath = path.join(folderPath, file);
        try {
            // Read and parse JSON data
            const characterData = await fs.readJson(filePath);
            log(`Processing file: ${file}`);

            // Insert character data into the database
            await insertCharacterIntoDb(characterData);
        } catch (error) {
            console.error(`Error processing ${file}:`, error);
        }
    }

    log('Finished inserting characters from JSON files.');
};

// Example usage
const outputJsonPath = path.join(__dirname, 'data', 'output-json'); // Specify your folder path here
insertCharactersFromJsonFiles(outputJsonPath).catch((error) => {
    console.error("Error during JSON insertion:", error);
});
