import { supabase } from "../config/superbaseConfig"

// Get specific chararcters data
export const getProfileData = async () => {

    let query = supabase.from("user_profiles")
        .select(`*`)
        .order('created_at', { ascending: true });
    ;
    const { data, error, count } = await query;
    if (error) {
        throw new Error(`Error fetching character data: ${error.message}`);
    }
    return data
};

export const updateProfileData = async (params: {
    about_me?: string;
    avatar?: string;
    name?: string;
    profile?: string;
    user_name?: string;
    block_list?: object;
    config?: object;
    id: string;
    is_nsfw?: boolean,
    is_blur?: boolean,
}) => {
    const { data, error } = await supabase
        .from("user_profiles")
        .update({
            about_me: params.about_me,
            avatar: params.avatar,
            name: params.name,
            profile: params.profile,
            user_name: params.user_name,
            block_list: params.block_list,
            config: params.config,
            is_nsfw: params.is_nsfw,
            is_blur: params.is_blur
        })
        .eq("id", params.id)
        .select();

    if (error) {
        throw new Error(`Error updating profile data: ${error.message}`);
    }

    return data;
};

export const getProfileDataByProfileId = async (profileId: string) => {

    let query = supabase.from("user_profiles")
        .select(`*`)
        .eq('id', profileId)
        .order('created_at', { ascending: true });
    ;
    const { data, error, count } = await query;
    if (error) {
        throw new Error(`Error fetching character data: ${error.message}`);
    }
    return data[0]
};

export const getMyBlockListById = async (profileId: string) => {
    // Fetch blocked content based on profile ID from the database
    const { data, error } = await supabase
        .from('user_profiles')
        .select('block_list')
        .eq('id', profileId)
        .single();

    if (error) {
        throw new Error(`Error fetching character data: ${error.message}`);
    }
    return data
}

export const reactivateProfileData = async (
    user_email: any
) => {
    const { data, error } = await supabase
        .from("user_profiles")
        .update({
          is_able:true
        })
        .eq("user_email", user_email)
        .select();

    if (error) {
        throw new Error(`Error updating profile data: ${error.message}`);
    }

    return data;
};


module.exports = { getProfileData, updateProfileData, getProfileDataByProfileId, getMyBlockListById, reactivateProfileData }