import os
import requests
import json
import ast
import re

# Specify the folder path containing JSON files
folder_path = 'C:/Users/Administrator/Documents/code/AIchat/image-metadata-extractor/data/output-json'

# Predefined set of tags
predefined_tags = [
    "Male", "Female", "Non-binary", "OC", "Fictional", "Game", "Anime", "Historical", 
    "Royalty", "Detective", "Hero", "Villain", "Magical", "Non-human", "Monster", 
    "Robot", "Vampire", "OpenAI", "Elf", "Multiple", "VTuber", "Scenario", "Non-English", 
    "Fantasy", "Roleplay", "Furry", "Action", "Love", "Movies & TV", "Romance", 
    "Comedy", "Horror", "Adventure", "Discussion", "Helpers", "Manga", "Mystery", 
    "Religion", "Simulator", "Wholesome", "Scalie", "Demon", "Depressed", "Tsundere", 
    "Expressions pack", "Goddess", "Knowledge", "Nature", "Art", "Idol", "Muscular", 
    "Military", "Maid", "Warrior", "Science", "Business", "Girlfriend", "Nerd", 
    "FEH Summoner", "Cat", "Group chat", "Shy", "Werewolf", "Soldier", "Nonchalant", 
    "Wrestler", "Goth", "Generator", "Petite", "Straight", "Bisexual", "RPG", 
    "Bully", "Yandere", "Kuudere", "Assistant", "Gay", "Deredere", "Muslim", "Arab", 
    "Myth", "Giant", "Lesbian", "Alien", "Dandere", "Fandom", "Queer", "Philosophy", 
    "Politics", "Asexual", "Folklore", "Realistic", "Demi Human", "Sci-Fi", "Monster Girl", 
    "Dominant", "Submissive", "Mature", "Cute 18+", "Size difference", "BBW", "School 18+", 
    "Futa", "Breeding", "Femdom", "Milf", "Cheating", "Switch", "Femboy", "hentai", 
    "chastity", "Sissy", "Object", "Feet", "Succubus", "Dilf", "Seinen", "Worship", 
    "Pregnant", "NTR", "CNC", "Shortstack", "Hypno", "Voyeur", "BDSM"
]

# Iterate through all JSON files in the specified folder
for filename in os.listdir(folder_path):
    if filename.endswith('.json'):
        file_path = os.path.join(folder_path, filename)
        
        # Open and read the JSON file with error handling
        try:
            with open(file_path, 'r') as file:
                data = json.load(file)
                
                # Access the "tags" field in the JSON data
                if "tags" in data:
                    tags = data["tags"]
                    print(f"Processing tags from {filename}: {tags}")
                else:
                    print(f"The 'tags' field is not present in the JSON file: {filename}")
                    continue

        except FileNotFoundError:
            print(f"Error: File not found at {file_path}")
            continue
        except json.JSONDecodeError:
            print(f"Error: Failed to decode JSON content in {filename}")
            continue
        except Exception as e:
            print(f"An unexpected error occurred with {filename}: {e}")
            continue

        if tags:
            response = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": "Bearer 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",  # Replace with your API key
                    "Content-Type": "application/json"
                },
                data=json.dumps({
                    "messages": [
                        {
                            "role": "user",
                            "content": f"""
                            I want to replace non-existing or incorrect tags from a given list with the closest possible matching tag from a predefined set.
                            Please ensure the following:
                            1. The output list should contain no duplicate tags.
                            2. All tags in the output list must exist in the predefined set.

                            A given list is {tags}
                            And the predefined set is {predefined_tags}

                            I want only the updated list. I don't need the code or explanations.
                            """
                        }
                    ]
                })
            )

            # Check if the request was successful
            if response.status_code == 200:
                result = response.json()
                assistant_reply = result['choices'][0]['message']['content']
                print(f"Assistant for {filename}: {assistant_reply}")
                # Function to extract the last list from each string
                def extract_last_list(text):
                  # Find all lists in the string using a regex pattern
                  lists = re.findall(r"\[.*?\]", text, re.DOTALL)
                  if lists:
                      try:
                          # Use ast.literal_eval for safer evaluation
                          return ast.literal_eval(lists[-1])  # Convert the string list to an actual list
                      except (ValueError, SyntaxError) as e:
                          print(f"Error parsing list: {e}")
                          return None
                  return None
                updated_tags = extract_last_list(assistant_reply)
                # Extract the updated list from the response
                # updated_tags_str = assistant_reply.strip().split("\n")[1].strip()
                # print(f"updated_tags_str: {updated_tags_str}")
                # # Attempt to convert the updated_tags_str to a list
                # try:
                #     updated_tags = ast.literal_eval(updated_tags_str)
                # except Exception as e:
                #     print(f"Error parsing updated tags for {filename}: {e}")
                #     continue  # Skip to the next file if parsing fails

                # Update the tags field in the JSON data
                data["tags"] = updated_tags

                # Optionally, write the updated data back to the JSON file
                with open(file_path, 'w') as file:
                    json.dump(data, file, indent=4)
                print(f"Updated 'tags' field in JSON file: {filename}")
            else:
                print(f"Request failed for {filename} with status code {response.status_code}: {response.text}")
