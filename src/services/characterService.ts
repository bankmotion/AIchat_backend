import { supabase } from "../config/superbaseConfig";

interface QueryParams {
    page?: string;
    search?: string;
    mode?: string;
    sort?: string;
    tag_id?: string;
    tag_name?: string;
}

interface CharacterDataResponse {
    characterData: any[];
    size: number;
    total: number | null;
}

const rowsPerPage = 20;

// Get specific character data
export const getCharactersData = async (queryParams: QueryParams): Promise<CharacterDataResponse> => {
    const { page, search, mode, tag_name } = queryParams;
    const currentPage = parseInt(page || '1');
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage - 1;

    // Function to create a base query with optional filters
    const createBaseQuery = async (): Promise<CharacterDataResponse> => {
        let query = supabase
            .from("characters")
            .select(`*, character_tags(tags (id, name, join_name))`, { count: 'exact' });

        if (search) {
            query = query.ilike('name', `%${search}%`);
        }
        
        if (mode === "sfw") {
            query = query.eq('is_nsfw', false);
        } else if (mode === "nsfw") {
            query = query.eq('is_nsfw', true);
        }

        query = query.range(start, end);

        const { data, error, count } = await query;
        if (error) throw new Error(`Error fetching character data: ${error.message}`);

        return {
            characterData: data || [],
            size: rowsPerPage,
            total: count,
        };
    };

    // Fetch characters filtered by tag name if provided
    const fetchByTagName = async (): Promise<CharacterDataResponse> => {
        let query = supabase
            .from("characters")
            .select(`*, character_tags!inner(tags!inner(id, name, join_name))`, { count: 'exact' })
            .ilike('character_tags.tags.join_name', tag_name!.toUpperCase());

        if (search) {
            query = query.ilike('name', `%${search}%`);
        }
        
        if (mode === "sfw") {
            query = query.eq('is_nsfw', false);
        } else if (mode === "nsfw") {
            query = query.eq('is_nsfw', true);
        }

        query = query.range(start, end);

        const { data, error, count } = await query;
        if (error) throw new Error(`Error fetching character data: ${error.message}`);

        const filteredData = await Promise.all(
            data?.map(async (item) => {
                const { data: innerData, error } = await supabase
                    .from("characters")
                    .select(`*, character_tags(tags (id, name, join_name))`, { count: "exact" })
                    .ilike("join_name", `%${item.join_name}%`);

                if (error) throw new Error(`Error fetching filtered character data: ${error.message}`);
                return innerData || [];
            }) || []
        );

        return {
            characterData: filteredData.flat(),
            size: rowsPerPage,
            total: count,
        };
    };

    // Fetch characters with or without tag name filtering
    return tag_name ? await fetchByTagName() : await createBaseQuery();
};

export default getCharactersData;
