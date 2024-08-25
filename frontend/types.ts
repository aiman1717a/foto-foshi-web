import type {FormContext} from "vee-validate";

export interface User {
    id: number
    name: string
    email: string
    email_unique: string
    email_verified_at: null
    two_factor_secret: null
    two_factor_recovery_codes: null
    two_factor_confirmed_at: null
    abilities: Ability[]
    roles: Role[]
    media: Media[]
    created_at?: Date
    updated_at?: Date
    deleted_at?: Date
}

export interface Ability {
    id: number
    name: string
    title: string
    entity_id: string
    entity_type: string
    only_owned: string
    options: string
    scope: string
    created_at?: Date
    updated_at?: Date
}

export interface Role {
    id: number
    name: string
    title: string
    scope: string
    created_at?: Date
    updated_at?: Date
}

export interface Media {
    id: number
    name: string
    file_name: string
    uuid: string
    preview_url: string
    original_url: string
    order: number
    collection_name: string
    custom_properties: any[]
    extension: string
    size: number
    created_at?: Date
    updated_at?: Date
}
export interface Post {
    id: string
    name: string
    media: Media
    createdBy?: User
    created_by?: number
    created_at?: Date
    updated_at?: Date
}