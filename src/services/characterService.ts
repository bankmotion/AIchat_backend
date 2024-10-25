import { supabase } from "../config/superbaseConfig"

interface QueryParams {
    page?: string;
    search?: string;
    mode?: string;
    sort?: string;
    tag_id?: string;
    tag_name?: string;
}


// Get specific chararcters data
export const getCharactersData = async (queryParams: QueryParams) => {
    const { page, search, mode, sort, tag_id, tag_name } = queryParams;
    console.log(tag_name, "tag_name", typeof (tag_name), mode, "mode")

    let realPage = page;

    if (tag_name) {
        let query = supabase.from("characters")
            .select(`*, character_tags!inner(tags!inner(id, name, join_name))`, { count: 'exact' })
            .ilike('character_tags.tags.join_name', tag_name.toUpperCase());

        // If search is provided, apply filtering
        if (search) {
            query = query.ilike('name', `%${search}%`);
        }

        if (mode == "sfw") {
            query = query.eq('is_nsfw', false);

        }

        if (mode == "nsfw") {
            query = query.eq('is_nsfw', true);
            realPage = "1";
        }

        const rowsPerPage = 20;
        let start = 0;
        let end = rowsPerPage - 1;

        // Apply pagination if page is provided
        if (realPage) {
            const pageNumber = parseInt(realPage || '1');
            start = (pageNumber - 1) * rowsPerPage;
            end = start + rowsPerPage - 1;
            query = query.range(start, end);
        }

        const { data, error, count } = await query;
        if (error) {
            throw new Error(`Error fetching character data: ${error.message}`);
        }

        const total = count;
        const filterData = await Promise.all(
            data?.map(async (item) => {
                let query = supabase
                    .from("characters")
                    .select(`*, character_tags(tags (id, name, join_name))`, { count: "exact" });

                // Apply filter based on item.id
                query = query.ilike("join_name", `%${item.join_name}%`);

                // Execute the query
                const { data: filteredData, error, count } = await query;

                // Handle any potential error
                if (error) {
                    throw new Error(`Error fetching filtered character data: ${error.message}`);
                }

                // Return the filtered data for this item
                return filteredData; // This is an array
            })
        );

        // Flatten the nested arrays into a single-level array
        const flatFilterData = filterData.flat();
        const characterData = flatFilterData;

        return {
            characterData,
            size: rowsPerPage,  // The number of rows per page
            total,                  // The total number of pages based on count
        };
    }
    else {
        let query = supabase.from("characters")
            .select(`*, character_tags(tags (id, name))`, { count: 'exact' })

        // If search is provided, apply filtering
        if (search) {
            query = query.ilike('name', `%${search}%`);
        }

        if (mode == "sfw") {
            query = query.eq('is_nsfw', false);
        }

        if (mode == "nsfw") {
            query = query.eq('is_nsfw', true);
            realPage = "1";
        }


        const rowsPerPage = 20;
        let start = 0;
        let end = rowsPerPage - 1;

        // Apply pagination if page is provided
        if (realPage) {
            const pageNumber = parseInt(realPage || '1');
            start = (pageNumber - 1) * rowsPerPage;
            end = start + rowsPerPage - 1;
            query = query.range(start, end);
        }

        const { data, error, count } = await query;
        if (error) {
            throw new Error(`Error fetching character data: ${error.message}`);
        }
        const total = count;
        const characterData = data;

        return {
            characterData,
            size: rowsPerPage,  // The number of rows per page
            total,                  // The total number of pages based on count
        };
    }

};

module.exports = { getCharactersData }