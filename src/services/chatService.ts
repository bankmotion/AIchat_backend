import { supabase } from "../config/superbaseConfig";
import dotenv from 'dotenv';

interface config {
    jailbreak_prompt: string;
    use_pygmalion_format: boolean;
    generation_settings: GenerationSetting;
    immersive_mode: boolean;
    text_streaming: boolean;
    openrouter_model?: "gryphe/mythomax-l2-13b" | "mistralai/mistral-nemo" | "microsoft/wizardlm-2-7b";
}

interface GenerationSetting {
    temperature: number;
    max_new_token: number; // undefined or 0 mean unlimited
    context_length?: number;

    // Only use for other models
    repetition_penalty?: number;
}

interface messages {
    role: "system" | "assistant" | "user";
    content: string;
}

interface OpenAIResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
    choices: Array<{
        message: {
            role: string;
            content: string;
        };
        finish_reason: string;
        index: number;
    }>;
}

interface OpenAIError {
    code: string;
    message: string;
    param: object | null;
    type: string;
    error?: string;
}

interface OpenAIProxyError {
    message: string;
    proxy_note: string;
    stack: string;
    type: string;
}

export const creatingChatData = async (characterId: string, profileId: string) => {
    const { data: characterData, error: characterError } = await supabase
        .from("characters")
        .select('*')
        .eq('id', characterId)
        .single();
    // console.log(characterData, "characterData")

    if (characterError) {
        throw new Error(`Error fetching character's creator_id data: ${characterError.message}`);
    }

    const { data: userData, error: userError } = await supabase
        .from("user_profiles")
        .select('*')
        .eq('id', profileId)
        .single();

    if (userError) {
        throw new Error(`Error fetching user data: ${userError.message}`);
    }

    const { data, error } = await supabase
        .from("chats")
        .insert({
            character_id: characterId,
            user_id: profileId,
            is_public: false,
            updated_at: new Date()
        })
        .select()
        .single();
    // console.log(data, error)

    if (error) {
        throw new Error(`Error creating chat data: ${error.message}`);
    }

    console.log(characterData, "characterData")
    const { data: messageData, error: messageError } = await supabase
        .from('chat_messages')
        .insert({
            chat_id: data.id,
            is_bot: true,
            is_main: true,
            message: characterData.first_message,
            is_mock: false
        })

    if (messageError) {
        throw new Error(`Error creating chat message data: ${messageError.message}`);
    }

    return data
}

export const gettingChatData = async (chatId: string, userId: any) => {
    // console.log(chatId, "chatId")

    const { data: chatData, error: chatError } = await supabase
        .from("chats")
        .select("*, characters(id, name, avatar, description, is_nsfw)")
        .eq('id', chatId)
        .eq('user_id', userId)
        .single()
    console.log(chatData, chatError)

    if (chatError) {
        throw new Error(`Error getting chat data: ${chatError.message}`);
    }

    const { data: chatMessagesData, error: chatMessagesError } = await supabase
        .from("chat_messages")
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });
    // console.log(chatMessagesData, chatMessagesError)

    if (chatMessagesError) {
        throw new Error(`Error creating chat data: ${chatMessagesError.message}`);
    }

    const data = {
        chat: chatData,
        chatMessages: chatMessagesData,
    };

    return data
}

export const updatingChatData = async (chatId: string, summary: any, summary_chat_id: any) => {
    // console.log(chatId, "chatId")

    const { data: chatData, error: chatError } = await supabase
        .from("chats")
        .update({
            summary: summary,
            summary_chat_id: summary_chat_id
        })
        .eq('id', chatId)
        .select()
        .single()
    console.log(chatData, chatError)

    if (chatError) {
        throw new Error(`Error updating chat data: ${chatError.message}`);
    }
}

export const creatingChatMessagebyChatId = async (params: {
    message?: string;
    is_bot?: boolean;
    is_main?: boolean;
    is_mock?: boolean
}, chatId: string) => {
    const { data, error } = await supabase
        .from("chat_messages")
        .insert({
            chat_id: chatId,
            is_bot: params.is_bot,
            is_main: params.is_main,
            message: params.message,
            is_mock: params.is_mock,
        })
        .select()
        .single();
    // console.log(data, error)

    if (error) {
        throw new Error(`Error creating chat data: ${error.message}`);
    }

    const { data: chatData, error: chatDataError } = await supabase
        .from("chats")
        .update({
            updated_at: new Date()
        })
        .eq('id', chatId)
        .select()
        .single();
    if (chatDataError) {
        throw new Error(`Error updating chat data: ${chatDataError.message}`);
    }
    return data
}

export const updatingChatMessagebyMessageId = async (is_main: boolean, chatId: string, messageId: string) => {
    const { data, error } = await supabase
        .from("chat_messages")
        .update({
            is_main: is_main,
        })
        .eq('chat_id', chatId)
        .eq('id', messageId)
        .select()
        .single();
    // console.log(data, error)

    if (error) {
        throw new Error(`Error updating chat message data: ${error.message}`);
    }

    const { data: chatData, error: chatDataError } = await supabase
        .from("chats")
        .update({
            updated_at: new Date()
        })
        .eq('id', chatId)
        .select()
        .single();
    if (chatDataError) {
        throw new Error(`Error updating chat data: ${chatDataError.message}`);
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
        if (error) {
            throw new Error(`Error deleting chat message data: ${error.message}`);
        }

        const { data: chatData, error: chatDataError } = await supabase
            .from("chats")
            .update({
                updated_at: new Date()
            })
            .eq('id', chatId)
            .select()
            .single();
        if (chatDataError) {
            throw new Error(`Error updating chat data: ${chatDataError.message}`);
        }

        results.push(data);
    }



    return results;
};

export const generatingMessagesByAdmin = async (messages: messages[], config: config, user_id: string) => {

    console.log(user_id, "user_id")

    const { data: user, error: user_error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq('id', user_id.toString())
        .single();

    if (user_error) {
        console.log(user_error, "user_error")
        throw new Error(`Error chat message Count: ${user_error.message}`);
    }

    console.log(user, "user_profile", user_error, typeof (user.admin_api_usage_count), "admin_api_usage_count")

    if ((user.user_type === 1 && user.admin_api_usage_count > 2) || (user.user_type === 2 && user.admin_api_usage_count > 5) || (user.user_type === 3 && user.admin_api_usage_count > 7)) {
        return "";
    }

    else {

        const baseUrl = "https://openrouter.ai/api/v1/chat/completions";
        console.log("process.env.openAIKey", process.env.OPENROUTER_API_KEY, "process.env.openAIKey", process.env.DEFAULT_TEMPERATURE, process.env.DEFAULT_MAX_NEW_TOKEN)
        const authorizationHeader = (() => {
            if (process.env.OPENROUTER_API_KEY) {
                return `Bearer ${process.env.OPENROUTER_API_KEY}`;
            }

            return "";
        })();

        const result = await fetch(`${baseUrl}`, {
            referrer: "",
            body: JSON.stringify({
                model: config.openrouter_model,
                temperature: parseInt(process.env.DEFAULT_TEMPERATURE || '1'),
                max_tokens: parseInt(process.env.DEFAULT_MAX_NEW_TOKEN || '300'),
                stream: false,
                messages,
            }),
            method: "POST",
            headers: {
                "Content-type": "application/json",
                ...(authorizationHeader.length > 0 && { Authorization: authorizationHeader }),
            },
        });

        console.log(result, "result")

        if (result.status !== 200) {
            const response = await result.json();
            if ("error" in response) {
                const error = response as { error: OpenAIError | OpenAIProxyError | string };
                if (typeof error.error === "string") {
                    const errorString = error.error;
                    if (errorString === "Unauthorized") {
                        throw new Error("This proxy requires a proxy key. Contact proxy owner to get the key!");
                    } else {
                        throw new Error(errorString);
                    }
                } else {
                    throw new Error(error.error.message);
                }
            }
        }
        else {
            let generatedMessage;
            const response = await result.json();
            console.log(response, "openAIresponse")
            if ("choices" in response) {
                const openAIResponse = response as OpenAIResponse;
                console.log(openAIResponse.choices[0].message.content, "openAIResponse.choices[0].message.content");
                generatedMessage = openAIResponse.choices[0].message.content;
            }

            const updatedCount = user.admin_api_usage_count + 1;
            console.log(updatedCount, "updatedCount")
            const { data, error } = await supabase
                .from("user_profiles")
                .update({ admin_api_usage_count: updatedCount })
                .eq('id', user_id)
                .select()
                .single();

            if (error) {
                throw new Error(`Error chat message Count: ${error.message}`);
            }

            return generatedMessage;
        }
    }
}

module.exports = { creatingChatData, gettingChatData, updatingChatData, creatingChatMessagebyChatId, updatingChatMessagebyMessageId, deletingNoMainChatMessagebyChatId, generatingMessagesByAdmin }


