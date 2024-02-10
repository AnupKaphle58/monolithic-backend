import { supabase } from "@src/config";
import { UserConfirmationEnum } from "@src/enums";
import { InputUserInterface } from "@src/interfaces";
import {
    AuthResponse,
    AuthTokenResponsePassword,
    EmailOtpType,
    createClient
} from "@supabase/supabase-js";


class SupabaseAuth {
    private static instance: SupabaseAuth;
    private supabaseClient;
    private supabaseClientAdmin;

    private constructor() {
        this.supabaseClient = createClient(supabase.url, supabase.publicAnonKey);
        this.supabaseClientAdmin = createClient(supabase.url, supabase.serviceRole, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });
    }

    static get(): SupabaseAuth {
        if (!SupabaseAuth.instance) {
            SupabaseAuth.instance = new SupabaseAuth();
        }
        return SupabaseAuth.instance;
    };

    signUp = (input: { email: string, password: string, displayName: string }) => {
        const params = {
            email: input.email,
            password: input.password,
            options: {
                data: {
                    userName: input.displayName,
                    userStatus: UserConfirmationEnum.UNCONFIRMED,
                }
            }
        }

        return this.supabaseClient.auth.signUp(params)
    }

    logIn = (input: { email: string, password: string }): Promise<AuthTokenResponsePassword> => {
        return this.supabaseClient.auth.signInWithPassword(input)
    }

    signOut = () => {
        return this.supabaseClient.auth.signOut();
    }

    getUser = (jwt: string) => {
        return this.supabaseClient.auth.getUser(jwt)
    }

    resetPassword = (email: string) => {
        return this.supabaseClient.auth.resetPasswordForEmail(email);
    }

    resendSignupOtp = (email: string) => {
        return this.supabaseClient.auth.resend({
            type: 'signup',
            email: email,
        })
    }

    updateUserEmail = (email: string,) => {
        return this.supabaseClient.auth.updateUser({ email: email })
    }

    updateUserPassword = (password: string) => {
        return this.supabaseClient.auth.updateUser({ password: password })
    }
    
    verifyOTP = (input: { token: string, email: string, type: EmailOtpType }) => {
        return this.supabaseClient.auth.verifyOtp({
            type: input.type,
            email: input.email,
            token: input.token
        })
    }

    adminGetUsers = () => {
        return this.supabaseClientAdmin.auth.admin.listUsers();
    }

    adminGetUser = (id: string) => {
        return this.supabaseClientAdmin.auth.admin.getUserById(id);
    }
}

const supabaseAuth = SupabaseAuth.get();

export { supabaseAuth as SupabaseAuth };