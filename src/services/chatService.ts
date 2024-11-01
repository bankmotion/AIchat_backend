import { supabase } from "../config/superbaseConfig";

export const creatingChatData = async (characterId:string)=>{
    const {data:characterData, error:characterError} = await supabase
        .from("characters")
        .select('creator_id')
        .eq('id', characterId)
        .single();
    console.log(characterData,"characterData")

    if (characterError) {
        throw new Error(`Error fetching character's creator_id data: ${characterError.message}`);
    }

    const { data, error } = await supabase
        .from("chats")
        .insert({
            character_id:characterId,
            user_id: characterData?.creator_id,
            is_public:true
        })
        .select()
        .single();
    console.log(data, error)

    if (error) {
        throw new Error(`Error creating chat data: ${error.message}`);
    }

    return data
}

export const gettingChatData = async (chatId:string)=>{
    console.log(chatId,"chatId")

    const {data:chatData, error:chatError} = await supabase
        .from ("chats")
        .select("*, characters(id, name, avatar, description)")
        .eq('id',chatId)
        .single()
    console.log(chatData, chatError)

    if (chatError) {
        throw new Error(`Error creating chat data: ${chatError.message}`);
    }

    const data = {
        chat: chatData,
        chatMessages: [],
      };

    return data
}

module.exports = {creatingChatData, gettingChatData}