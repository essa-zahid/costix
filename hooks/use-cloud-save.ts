'use client';

import { useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export interface CloudCosting {
  id: string;
  name: string;
  type: 'quick' | 'batch';
  data_json: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export function useCloudSave(user: User | null) {
  const supabase = createClient();

  // Save or update a costing to the cloud
  const saveCosting = useCallback(async (
    costing: { id?: string; name: string; type: 'quick' | 'batch'; data_json: Record<string, unknown> }
  ) => {
    if (!user) return { error: new Error('Not authenticated') };

    // Get or create workspace for this user
    let workspaceId = await getWorkspaceId(user.id);
    if (!workspaceId) {
      workspaceId = await createWorkspace(user.id, user.email ?? '');
    }
    if (!workspaceId) return { error: new Error('Could not find or create workspace') };

    if (costing.id) {
      // Update existing
      const { data, error } = await supabase
        .from('costings')
        .update({
          name: costing.name,
          data_json: costing.data_json,
          updated_at: new Date().toISOString(),
        })
        .eq('id', costing.id)
        .eq('user_id', user.id)
        .select()
        .single();
      return { data, error };
    } else {
      // Insert new
      const { data, error } = await supabase
        .from('costings')
        .insert({
          workspace_id: workspaceId,
          user_id: user.id,
          type: costing.type,
          name: costing.name,
          data_json: costing.data_json,
        })
        .select()
        .single();
      return { data, error };
    }
  }, [user, supabase]);

  // Load all costings for this user's workspace
  const loadCostings = useCallback(async (): Promise<{ data: CloudCosting[] | null; error: Error | null }> => {
    if (!user) return { data: null, error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('costings')
      .select('id, name, type, data_json, created_at, updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    return { data: data as CloudCosting[] | null, error: error as Error | null };
  }, [user, supabase]);

  // Delete a costing
  const deleteCosting = useCallback(async (id: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('costings')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    return { error };
  }, [user, supabase]);

  return { saveCosting, loadCostings, deleteCosting };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getWorkspaceId(userId: string): Promise<string | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', userId)
    .limit(1)
    .single();
  return data?.workspace_id ?? null;
}

async function createWorkspace(userId: string, email: string): Promise<string | null> {
  const supabase = createClient();

  // Create workspace
  const { data: ws } = await supabase
    .from('workspaces')
    .insert({ owner_id: userId, company_name: email.split('@')[0] })
    .select('id')
    .single();

  if (!ws?.id) return null;

  // Add owner as member
  await supabase
    .from('workspace_members')
    .insert({ workspace_id: ws.id, user_id: userId, role: 'owner' });

  return ws.id;
}
