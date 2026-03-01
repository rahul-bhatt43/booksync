import { apiClient, authApiClient } from "@/lib/api-client";

// Types
export interface DashboardStats {
    totals: {
        users: number;
        audiobooks: number;
        categories: number;
        reviews: number;
        playlists: number;
        listens: number;
    };
    newUsersLastWeek: number;
    popularAudiobooks: {
        _id: string;
        title: string;
        authorId: {
            _id: string;
            name: string;
        };
        averageRating: number;
        reviewsCount: number;
        likesCount: number;
    }[];
}

export interface Category {
    _id: string;
    name: string;
    description: string;
}

export interface Author {
    _id: string;
    name: string;
    biography?: string;
}

export interface Narrator {
    _id: string;
    name: string;
    biography?: string;
}

export interface Audiobook {
    _id: string;
    title: string;
    description: string;
    authorId: Author | string | any;
    categoryId: Category | string | any;
    narratorId: Narrator | string | any;
    coverImageUrl?: string;
    audioUrl?: string;
    durationInSeconds?: number;
    averageRating?: number;
    reviewsCount?: number;
    likesCount?: number;
    commentsCount?: number;
    createdAt?: string;
}

export interface AppLink {
    _id: string;
    platform: string;
    url: string;
    isActive: boolean;
}

// App Links Service
export const getActiveAppLinks = async (): Promise<AppLink[]> => {
    // Uses public apiClient, no auth needed
    const { data } = await apiClient.get("/app-links/active");
    return data;
};

export const getAppLinks = async (): Promise<AppLink[]> => {
    const { data } = await authApiClient.get("/app-links");
    return data;
};

export const createAppLink = async (payload: Partial<AppLink>): Promise<AppLink> => {
    const { data } = await authApiClient.post("/app-links", payload);
    return data;
};

export const updateAppLink = async (id: string, payload: Partial<AppLink>): Promise<AppLink> => {
    const { data } = await authApiClient.put(`/app-links/${id}`, payload);
    return data;
};

export const deleteAppLink = async (id: string): Promise<void> => {
    await authApiClient.delete(`/app-links/${id}`);
};

// Stats Service
export const getDashboardStats = async (): Promise<DashboardStats> => {
    const { data } = await authApiClient.get("/admin/stats");
    return data;
};

// Categories Service
export const getCategories = async (): Promise<Category[]> => {
    const { data } = await authApiClient.get("/categories");
    return data;
};

export const createCategory = async (payload: Partial<Category>): Promise<Category> => {
    const { data } = await authApiClient.post("/categories", payload);
    return data;
};

export const updateCategory = async (id: string, payload: Partial<Category>): Promise<Category> => {
    const { data } = await authApiClient.put(`/categories/${id}`, payload);
    return data;
};

export const deleteCategory = async (id: string): Promise<void> => {
    await authApiClient.delete(`/categories/${id}`);
};

// Authors Service
export const getAuthors = async (): Promise<Author[]> => {
    const { data } = await authApiClient.get("/authors");
    return data;
};

export const getAuthor = async (id: string): Promise<Author> => {
    const { data } = await authApiClient.get(`/authors/${id}`);
    return data;
};

export const createAuthor = async (payload: Partial<Author>): Promise<Author> => {
    const { data } = await authApiClient.post("/authors", payload);
    return data;
};

export const updateAuthor = async (id: string, payload: Partial<Author>): Promise<Author> => {
    const { data } = await authApiClient.put(`/authors/${id}`, payload);
    return data;
};

export const deleteAuthor = async (id: string): Promise<void> => {
    await authApiClient.delete(`/authors/${id}`);
};

// Narrators Service
export const getNarrators = async (): Promise<Narrator[]> => {
    const { data } = await authApiClient.get("/narrators");
    return data;
};

export const getNarrator = async (id: string): Promise<Narrator> => {
    const { data } = await authApiClient.get(`/narrators/${id}`);
    return data;
};

export const createNarrator = async (payload: Partial<Narrator>): Promise<Narrator> => {
    const { data } = await authApiClient.post("/narrators", payload);
    return data;
};

export const updateNarrator = async (id: string, payload: Partial<Narrator>): Promise<Narrator> => {
    const { data } = await authApiClient.put(`/narrators/${id}`, payload);
    return data;
};

export const deleteNarrator = async (id: string): Promise<void> => {
    await authApiClient.delete(`/narrators/${id}`);
};

// Audiobooks Service
export const getAudiobooks = async (params?: Record<string, any>): Promise<Audiobook[]> => {
    const { data } = await authApiClient.get("/audiobooks", { params });
    return data;
};

export const getAudiobook = async (id: string): Promise<Audiobook> => {
    const { data } = await authApiClient.get(`/audiobooks/${id}`);
    return data;
};

// The audiobook creation uses FormData for file uploads
export const createAudiobook = async (formData: FormData): Promise<Audiobook> => {
    const { data } = await authApiClient.post("/audiobooks", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return data;
};

export const updateAudiobook = async (id: string, formData: FormData): Promise<Audiobook> => {
    const { data } = await authApiClient.put(`/audiobooks/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return data;
};

export const deleteAudiobook = async (id: string): Promise<void> => {
    await authApiClient.delete(`/audiobooks/${id}`);
};
