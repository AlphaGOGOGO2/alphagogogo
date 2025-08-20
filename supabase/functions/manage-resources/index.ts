import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, admin-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type ResourceData = {
  title: string;
  description?: string | null;
  file_url?: string | null;
  file_type: string;
  file_size?: number | null;
  category: string;
  tags?: string[];
  is_featured?: boolean;
  author_name?: string;
};

type RequestBody = {
  action: 'create' | 'update' | 'delete';
  id?: string;
  resource_data?: ResourceData;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Admin token 검증
    const adminToken = req.headers.get('admin-token');
    if (!adminToken) {
      return new Response(JSON.stringify({ success: false, message: '인증 토큰이 필요합니다' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const authResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/secure-admin-auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
      },
      body: JSON.stringify({ action: 'validate', token: adminToken }),
    });

    if (!authResponse.ok) {
      return new Response(JSON.stringify({ success: false, message: '토큰 검증 실패' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const authResult = await authResponse.json();
    if (!authResult.success) {
      return new Response(JSON.stringify({ success: false, message: '인증 실패: 관리자 권한이 필요합니다' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { action, id, resource_data }: RequestBody = await req.json();

    if (!action) {
      return new Response(JSON.stringify({ success: false, message: 'action이 필요합니다' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    let result: any = null;

    if (action === 'create') {
      if (!resource_data || !resource_data.title || !resource_data.category || !resource_data.file_type) {
        return new Response(JSON.stringify({ success: false, message: '필수 필드 누락: title, category, file_type' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const insertData = {
        title: resource_data.title,
        description: resource_data.description ?? null,
        category: resource_data.category,
        file_url: resource_data.file_url ?? null,
        file_type: resource_data.file_type,
        file_size: resource_data.file_size ?? null,
        tags: resource_data.tags || [],
        is_featured: !!resource_data.is_featured,
        author_name: resource_data.author_name || '알파GOGOGO',
      };

      const { data, error } = await supabase
        .from('resources')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else if (action === 'update') {
      if (!id || !resource_data) {
        return new Response(JSON.stringify({ success: false, message: 'id와 resource_data가 필요합니다' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const updateData: any = { ...resource_data };
      if (typeof updateData.tags !== 'undefined') {
        updateData.tags = updateData.tags || [];
      }
      updateData.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('resources')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else if (action === 'delete') {
      if (!id) {
        return new Response(JSON.stringify({ success: false, message: 'id가 필요합니다' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { error } = await supabase.from('resources').delete().eq('id', id);
      if (error) throw error;
      result = { id };
    } else {
      return new Response(JSON.stringify({ success: false, message: `알 수 없는 action: ${action}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('manage-resources 함수 오류:', error);
    return new Response(JSON.stringify({ success: false, message: error.message || '서버 오류' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
