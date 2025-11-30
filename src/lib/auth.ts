/**
 * Authentication API functions
 * Connects to CodeMentor .NET backend API
 */

interface LoginCredentials {
    email: string;
    password: string;
}

interface SignupData {
    name: string;
    email: string;
    password: string;
}

interface UserDto {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    level: number;
    xp: number;
    bugsFixed: number;
    gamesWon: number;
    streak: number;
    createdAt: string;
    isAdmin: boolean;
}

interface AuthResponse {
    user: UserDto;
    token: string;
}

export const authAPI = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }

        // Store token if provided
        if (data.token) {
            localStorage.setItem('auth_token', data.token);
        }

        return data;
    },

    signup: async (userData: SignupData): Promise<AuthResponse> => {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Signup failed');
        }

        // Store token if provided
        if (data.token) {
            localStorage.setItem('auth_token', data.token);
        }

        return data;
    },

    logout: () => {
        localStorage.removeItem('auth_token');
    },

    getToken: () => {
        return localStorage.getItem('auth_token');
    },
};

// Helper function for authenticated API calls
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = authAPI.getToken();

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    return fetch(url, {
        ...options,
        headers,
    });
};
