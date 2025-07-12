import { z } from "zod";

export type TypePayloadcharacter = {
    character_name : string;
    character_description : string;
    crated_by? : string;
    updated_by? : string;
    created_at? : Date;
    updated_at? : Date;
}

export const CharacterSchema = z.object({
    body: z.object({
        character_name: z.string().min(1).max(50),
        character_description: z.string(),
    })
})

export const UpdateCharacterSchema = z.object({
    params: z.object({ character_id: z.string().min(1).max(50) }),
    body: z.object({
        character_name: z.string().min(1).max(50).optional(),
        character_description: z.string().optional(),
    })
})

export const DeleteCharacterSchema = z.object({
    params: z.object({
        character_id: z.string().min(1).max(50),
    })
})

export const GetCharacterByIdSchema = z.object({
    params: z.object({
        character_id: z.string().min(1).max(50),
    })
});

export const GetAllSchema = z.object({
    query: z.object({
        page: z.string().min(1).max(100).optional(),
        limit: z.string().min(1).max(50).optional(),
        search: z.string().optional(),
    })
});

export const SelectSchema = z.object({
    query: z.object({
        search: z.string().optional(),
    })
});

