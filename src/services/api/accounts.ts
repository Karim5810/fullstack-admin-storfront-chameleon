import { NewsletterSchema } from '../../schema';
import { supabase } from '../../supabaseClient';
import type { Address, User } from '../../types';
import {
  AddressSchema,
  UserSchema,
} from '../../schema';
import {
  ADDRESSES_STORAGE_KEY,
  asString,
  DatabaseRow,
  DEMO_USER_STORAGE_KEY,
  fromSupabaseOrFallback,
  getStoredAddresses,
  getStoredProfiles,
  loadProfileFromFallback,
  mergeUniqueById,
  mergeUserProfile,
  parseDemoUser,
  saveFallbackProfile,
  setStoredAddresses,
  toAddress,
  toUser,
  writeStorage,
} from './shared';

export const accountsApi = {
  users: {
    getCurrent: async (): Promise<User | null> =>
      fromSupabaseOrFallback(
        async () => {
          const { data, error } = await supabase.auth.getUser();

          if (error) {
            throw error;
          }

          if (!data.user) {
            return null;
          }

          const baseUser = toUser({
            id: data.user.id,
            email: data.user.email,
            full_name: data.user.user_metadata.full_name,
            name: data.user.user_metadata.name,
            role: data.user.user_metadata.role,
            created_at: data.user.created_at,
          });
          const profile = await accountsApi.profiles.getByUserId(data.user.id);

          return profile ? mergeUserProfile(baseUser, profile) : baseUser;
        },
        () => parseDemoUser(),
      ),
    updateProfile: async (id: string, data: Partial<User>): Promise<User> =>
      fromSupabaseOrFallback(
        async () => {
          const { error } = await supabase.auth.updateUser({
            data: {
              full_name: data.name,
              role: data.role,
            },
          });

          if (error) {
            throw error;
          }

          const current = await accountsApi.users.getCurrent();
          const nextProfile = await accountsApi.profiles.upsert(id, { ...(current ?? {}), ...data });

          return UserSchema.parse({
            ...(current ?? {
              id,
              email: data.email ?? '',
              name: data.name ?? 'مستخدم الريان',
              role: data.role ?? 'customer',
              createdAt: new Date().toISOString(),
            }),
            ...nextProfile,
          });
        },
        async () => {
          const current = loadProfileFromFallback(id) ?? {
            id,
            email: data.email ?? '',
            name: data.name ?? 'مستخدم الريان',
            role: data.role ?? 'customer',
            createdAt: new Date().toISOString(),
          };
          const updated = UserSchema.parse({
            ...current,
            ...data,
            updatedAt: new Date().toISOString(),
          });
          saveFallbackProfile(updated);
          if (parseDemoUser()?.id === id) {
            writeStorage(DEMO_USER_STORAGE_KEY, updated);
          }
          return updated;
        },
      ),
  },
  profiles: {
    getAll: async (): Promise<User[]> =>
      fromSupabaseOrFallback(
        async () => {
          const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });

          if (error) {
            throw error;
          }

          return (data ?? []).map((row) => toUser(row as DatabaseRow));
        },
        () => {
          const demoUser = parseDemoUser();
          return mergeUniqueById([...(demoUser ? [demoUser] : []), ...getStoredProfiles()]);
        },
      ),
    getByUserId: async (userId: string): Promise<User | null> =>
      fromSupabaseOrFallback(
        async () => {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .limit(1)
            .maybeSingle();

          if (error) {
            throw error;
          }

          return data ? toUser(data as DatabaseRow) : null;
        },
        () => loadProfileFromFallback(userId),
      ),
    upsert: async (userId: string, profile: Partial<User>): Promise<User> =>
      fromSupabaseOrFallback(
        async () => {
          const current = await accountsApi.users.getCurrent();
          const payload = {
            id: userId,
            email: profile.email ?? current?.email ?? '',
            name: profile.name ?? current?.name ?? 'مستخدم الريان',
            role: profile.role ?? current?.role ?? 'customer',
            phone: profile.phone ?? current?.phone ?? null,
            company: profile.company ?? current?.company ?? null,
          };
          const { data, error } = await supabase.from('profiles').upsert(payload).select('*').single();

          if (error) {
            throw error;
          }

          return toUser(data as DatabaseRow);
        },
        async () => {
          const existing = loadProfileFromFallback(userId) ?? {
            id: userId,
            email: profile.email ?? '',
            name: profile.name ?? 'مستخدم الريان',
            role: profile.role ?? 'customer',
            createdAt: new Date().toISOString(),
          };
          const nextProfile = UserSchema.parse({
            ...existing,
            ...profile,
            updatedAt: new Date().toISOString(),
          });
          saveFallbackProfile(nextProfile);
          return nextProfile;
        },
      ),
  },
  addresses: {
    getDefault: async (userId: string): Promise<Address | null> =>
      fromSupabaseOrFallback(
        async () => {
          const { data, error } = await supabase
            .from('addresses')
            .select('*')
            .eq('user_id', userId)
            .eq('is_default', true)
            .limit(1)
            .maybeSingle();

          if (error) {
            throw error;
          }

          return data ? toAddress(data as DatabaseRow) : null;
        },
        () => getStoredAddresses().find((address) => address.userId === userId && address.isDefault) ?? null,
      ),
    upsertDefault: async (userId: string, address: Address): Promise<Address> =>
      fromSupabaseOrFallback(
        async () => {
          await supabase.from('addresses').update({ is_default: false }).eq('user_id', userId);

          const payload = {
            user_id: userId,
            full_name: address.fullName,
            phone: address.phone,
            street: address.street,
            city: address.city,
            state: address.state,
            zip_code: address.zipCode,
            country: address.country,
            is_default: true,
          };

          const { data, error } = await supabase
            .from('addresses')
            .upsert(payload, { onConflict: 'user_id,is_default' })
            .select('*')
            .single();

          if (error) {
            throw error;
          }

          return toAddress(data as DatabaseRow);
        },
        async () => {
          const nextAddress = AddressSchema.parse({
            ...address,
            id: address.id ?? `${userId}-default`,
            userId,
            isDefault: true,
            updatedAt: new Date().toISOString(),
            createdAt: address.createdAt ?? new Date().toISOString(),
          });

          const nextAddresses = [
            nextAddress,
            ...getStoredAddresses()
              .filter((entry) => entry.userId !== userId)
              .map((entry) => ({ ...entry, isDefault: false })),
          ];
          writeStorage(ADDRESSES_STORAGE_KEY, nextAddresses);
          setStoredAddresses(nextAddresses);
          return nextAddress;
        },
      ),
  },
  auth: {
    requestPasswordReset: async (email: string) => {
      const validatedEmail = NewsletterSchema.parse({ email }).email;

      return fromSupabaseOrFallback(
        async () => {
          const redirectTo = `${window.location.origin}/reset-password`;
          const { error } = await supabase.auth.resetPasswordForEmail(validatedEmail, { redirectTo });

          if (error) {
            throw error;
          }
        },
        async () => {
          await Promise.resolve();
        },
      );
    },
    updatePassword: async (newPassword: string) =>
      fromSupabaseOrFallback(
        async () => {
          const { error } = await supabase.auth.updateUser({ password: newPassword });

          if (error) {
            throw error;
          }
        },
        async () => {
          await Promise.resolve();
        },
      ),
  },
};
