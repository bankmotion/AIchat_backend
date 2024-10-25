const { createClient } = require('@supabase/supabase-js');
const exiftool = require("exiftool-vendored").exiftool;
const fs = require('fs-extra');
const path = require('path');

// Log function to standardize logging format
const log = (message) => {
    console.log(`[LOG] ${new Date().toISOString()}: ${message}`);
};

// Function to decode base64 Chara field
const decodeBase64 = (encodedData) => {
    const buffer = Buffer.from(encodedData, 'base64');
    return buffer.toString('utf-8');
};

const extractSpecificFields = (charaData) => {
    const fields = ['name', 'description', 'first_mes', 'creator', 'scenario', 'personality', 'mes_example', 'creator_notes', 'tags'];

    const extractedData = {};
    if (charaData.data) {
        fields.forEach(field => {
            if (charaData.data[field]) {
                extractedData[field] = charaData.data[field];
            }
        });
    }

    return extractedData;
};

const createNewJson = (extractedData, fileName) => {
    const currentTime = new Date().toISOString();
    const isNsfw = extractedData.tags && extractedData.tags.some(tag => tag.toLowerCase() === "nsfw");

    const newJsonData = {
        id: extractedData.name,
        avatar: `images/bot-avatars/${fileName}`,
        created_at: currentTime,
        creator_id: "anonymous user",
        description: extractedData.creator_notes,
        example_dialogs: extractedData.mes_example,
        first_message: extractedData.first_mes,
        fts: null,
        is_force_remove: false,
        is_nsfw: isNsfw,
        is_public: true,
        name: extractedData.name,
        personality: `${extractedData.description} ${extractedData.personality}`,
        scenario: extractedData.scenario,
        updated_at: currentTime,
        creator_name: "anonymous user",
        tags: extractedData.tags,
    };

    return newJsonData;
};

const extractMetadata = async (folderPath) => {
    log(`Starting metadata extraction from folder: ${folderPath}`);
    console.log("Entered extractMetadata function.");

    // Ensure the folder exists
    console.log("Checking if folder exists...");
    if (!fs.existsSync(folderPath)) {
        console.error('Folder does not exist!');
        console.log("Folder check failed, exiting extractMetadata function.");
        return;
    }

    // Get all files in the folder
    console.log(`Reading files from folder: ${folderPath}`);
    const files = await fs.readdir(folderPath);
    console.log("Files in folder:", files);

    const imageFiles = files.filter(file => ['.jpg', '.jpeg', '.png', '.tiff'].includes(path.extname(file).toLowerCase()));
    console.log("Filtered image files:", imageFiles);

    log(`Found ${imageFiles.length} image(s) in folder: ${folderPath}`);

    for (const file of imageFiles) {
        const filePath = path.join(folderPath, file);
        console.log(`Processing file: ${filePath}`);

        try {
            // Extract metadata using ExifTool
            console.log(`Extracting metadata for file: ${file}`);
            const metadata = await exiftool.read(filePath);
            // log(`Metadata for ${file}:\n${JSON.stringify(metadata, null, 2)}`);

            // Check if metadata contains a 'Chara' field and decode it
            if (metadata.Chara) {
                console.log(`Chara field found in ${file}. Decoding...`);
                const decodedChara = decodeBase64(metadata.Chara);
                // log(`Decoded Chara for ${file}:\n${decodedChara}`);

                // Parse decoded Chara as JSON
                const decodedCharaJson = JSON.parse(decodedChara);

                // Extract only the specific fields from the 'data' field
                const specificFields = extractSpecificFields(decodedCharaJson);
                // log(`Extracted specific fields for ${file}:\n${JSON.stringify(specificFields, null, 2)}`);

                // Create the new JSON structure
                const newJsonData = createNewJson(specificFields, file);
                log(`New JSON data created for ${file}:\n${JSON.stringify(newJsonData, null, 2)}`);

                // Save the new JSON structure to a file
                const outputDir = path.join(__dirname, 'data', 'output-json');
                await fs.ensureDir(outputDir);
                const outputFilePath = path.join(outputDir, `${path.basename(file, path.extname(file))}-new.json`);

                // Write the new JSON data to a file
                await fs.writeJson(outputFilePath, newJsonData, { spaces: 2 });
                log(`Written new JSON to: ${outputFilePath}`);
            }

        } catch (error) {
            console.error(`Error processing ${file}:`, error);
            console.log(`Caught error while processing file ${file}: ${error}`);
        }
    }

    log('Metadata extraction complete.');
    console.log("Exiting extractMetadata function.");
};

// Example usage:
console.log("Setting folder path...");
const folderPath = path.join(__dirname, 'data', 'images');  // Specify your folder path here
console.log(`Folder path set: ${folderPath}`);

console.log("Starting metadata extraction...");
extractMetadata(folderPath).catch((error) => {
    console.error("Error during metadata extraction:", error);
    console.log(`Caught error in main flow: ${error}`);
});