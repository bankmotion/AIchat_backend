import { supabase } from "../config/superbaseConfig";

export const creatingChatData = async (characterId: string, profileId: string) => {
    const { data: characterData, error: characterError } = await supabase
        .from("characters")
        .select('creator_id')
        .eq('id', characterId)
        .single();
    console.log(characterData, "characterData")

    if (characterError) {
        throw new Error(`Error fetching character's creator_id data: ${characterError.message}`);
    }

    const { data, error } = await supabase
        .from("chats")
        .insert({
            character_id: characterId,
            user_id: profileId,
            is_public: false
        })
        .select()
        .single();
    console.log(data, error)

    if (error) {
        throw new Error(`Error creating chat data: ${error.message}`);
    }

    return data
}

export const gettingChatData = async (chatId: string) => {
    console.log(chatId, "chatId")

    const { data: chatData, error: chatError } = await supabase
        .from("chats")
        .select("*, characters(id, name, avatar, description)")
        .eq('id', chatId)
        .single()
    console.log(chatData, chatError)

    if (chatError) {
        throw new Error(`Error creating chat data: ${chatError.message}`);
    }

    const {data:chatMessagesData,error:chatMessagesError} = await supabase
        .from ("chat_messages")
        .select ('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });
    console.log(chatMessagesData, chatMessagesError)

    if (chatMessagesError) {
        throw new Error(`Error creating chat data: ${chatMessagesError.message}`);
    }

    const data = {
        chat: chatData,
        chatMessages: chatMessagesData,
    };

    return data
}

export const creatingChatMessagebyChatId = async (params: {
    message?: string;
    is_bot?: boolean;
    is_main?: boolean;
}, chatId: string) => {
    const { data, error } = await supabase
        .from("chat_messages")
        .insert({
            chat_id: chatId,
            is_bot: params.is_bot,
            is_main: params.is_main,
            message: params.message
        })
        .select()
        .single();
    console.log(data, error)

    if (error) {
        throw new Error(`Error creating chat data: ${error.message}`);
    }

    return data
}

export const updatingChatMessagebyMessageId = async (is_main:boolean, chatId: string, messageId:string) => {
    const { data, error } = await supabase
        .from("chat_messages")
        .update({
            is_main:is_main,
        })
        .eq('chat_id', chatId)
        .eq('id',messageId)
        .select()
        .single();
    console.log(data, error)

    if (error) {
        throw new Error(`Error updating chat message data: ${error.message}`);
    }

    return data
}

export const deletingNoMainChatMessagebyChatId = async (chatId: string, messageIds: object[]) => {
    const results = [];

    for (const messageId of messageIds) {
        const { data, error } = await supabase
            .from("chat_messages")
            .delete()
            .eq('chat_id', chatId)
            .eq('id', messageId)
            .select();
        
        console.log(data, error);

        if (error) {
            throw new Error(`Error deleting chat message data: ${error.message}`);
        }

        results.push(data);
    }

    return results;
};


module.exports = { creatingChatData, gettingChatData, creatingChatMessagebyChatId, updatingChatMessagebyMessageId, deletingNoMainChatMessagebyChatId }


